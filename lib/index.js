import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

const name = "@taosee258/dsh-client-ui-skin-qingxiao";
const inject = ["webServer"];
const SETTINGS_ROUTE = "/api/dsh-qingxiao/settings";
const DEFAULT_BG_ROUTE = "/api/dsh-qingxiao/default-background";
const LINEART_ROUTE = "/api/dsh-qingxiao/boot-lineart";
const PERSONA_ROUTE = "/api/dsh-qingxiao/persona";
const PERSONA_DOCS_ROUTE = "/api/dsh-qingxiao/persona-docs";
const PERSONA_APPLY_ROUTE = "/api/dsh-qingxiao/persona-apply";
const PICK_BG_ROUTE = "/api/dsh-qingxiao/pick-background";
const PICK_DOC_ROUTE = "/api/dsh-qingxiao/pick-persona-doc";
const SETTINGS_DIR = "dsh-client-ui-skin-qingxiao";
const SETTINGS_FILE = "settings.json";
const PERSONA_DIR = "persona";
const PERSONA_FILE = "persona.json";
const DEFAULT_BG_FILE = fileURLToPath(new URL("../assets/qx.jpg", import.meta.url));
const LINEART_FILE = fileURLToPath(new URL("../assets/qx-lineart.png", import.meta.url));
const BUILTIN_SOUL_FILE = fileURLToPath(new URL("../assets/persona/qingxiao-soul.md", import.meta.url));
const BUILTIN_STYLE_FILE = fileURLToPath(new URL("../assets/persona/qingxiao-style.md", import.meta.url));
const MAX_BODY_BYTES = 20 * 1024 * 1024;
// 背景以 data URL 存进 settings：base64 约放大 1.37 倍，14MB 字符串上限 ≈ 10MB 原图
const MAX_BACKGROUND_BYTES = 14 * 1024 * 1024;
const MAX_PICK_FILE_BYTES = 10 * 1024 * 1024;
const MAX_DOC_BYTES = 2 * 1024 * 1024;

// ── 人格注入（DSH 适配 character-persona-forge 三层模型）──
// 系统层：DSH 的 dsh-agent-instructions 原生支持用户全局指令 ~/.dsh/AGENTS.md
//（scope=user-global），皮肤把「IDENTITY DIRECTIVE + soul/style 核心区」写进
// 哨兵注释包裹的专属块，不破坏用户已有内容；锚定层/后置层因 DSH 无逐轮注入
// 钩子，按 skill「宿主不支持时放文档内」的变通并入同一块指令。
const PERSONA_BLOCK_START = "<!-- qingxiao-skin:persona:start -->";
const PERSONA_BLOCK_END = "<!-- qingxiao-skin:persona:end -->";
const PERSONA_DEFAULTS = {
	enabled: false,
	source: "builtin",        // builtin | custom
	spoiler: "latest",        // latest | none
	address: "漂泊者",
	oocWords: "出戏 / OOC / 退出角色",
	includeAnchor: true,
	includeSoul: true,
	includeStyle: true
};

const BOOLEAN_KEYS = [
	"textContrastBoost", "panelBlur", "goldTrim",
	"particles", "lightCharms", "darkCharms",
	// v0.1.4 毛玻璃虚化：总开关 + 插件窗/原生面板两个分项
	"frostMaster", "frostPlugin", "frostNative",
	// v0.3.0 开屏动画（线稿上色）
	"bootAnimation"
];
const NUMBER_RANGES = {
	scrimOpacity: [20, 95],
	panelOpacity: [30, 100],
	contentWidth: [500, 1000],
	particleCount: [0, 60],
	particleSpeed: [20, 200],
	fontScale: [85, 125],
	// 虚化强度 0–30px（0 = 关闭等效，前端把 0 视作总开关 off）
	frostBlur: [0, 30]
};

function profileName() {
	// 0.1.x 桌面端主进程注入 DSH_DESKTOP_PROFILE；0.2.0 起改用 dsh 统一的
	// DSH_PROFILE / DSH_PROFILE_DIR（SKILL.md 所载），主进程自身不再注入名字，
	// 而是把档案固定为 profiles/desktop（app.asar 里 resolveDesktopPaths 的
	// join(dshHome, "profiles", "desktop")）。按新→旧顺序解析。
	const profile = process.env.DSH_PROFILE || process.env.DSH_DESKTOP_PROFILE;
	return profile && /^[A-Za-z0-9_-]+$/.test(profile) ? profile : null;
}

function profileDir() {
	const home = process.env.DSH_HOME || join(homedir(), ".dsh");
	const direct = process.env.DSH_PROFILE_DIR;
	if (direct && isAbsolute(direct)) return direct;
	const name = profileName();
	if (name) return join(home, "profiles", name);
	// 0.2.0 桌面端不给插件进程留 profile 环境变量：desktop 目录存在即视为桌面端。
	const desktop = join(home, "profiles", "desktop");
	if (existsSync(desktop)) return desktop;
	return join(home, "profiles", "web");
}

function settingsPath() {
	return join(profileDir(), "data", SETTINGS_DIR, SETTINGS_FILE);
}

function isLoopback(req) {
	const address = req.socket && req.socket.remoteAddress;
	return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

function sendJson(res, status, value) {
	const data = Buffer.from(JSON.stringify(value), "utf8");
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"content-length": String(data.length)
	});
	res.end(data);
}

function isBackground(value) {
	if (value === null) return true;
	return typeof value === "string" && /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(value) && Buffer.byteLength(value, "utf8") <= MAX_BACKGROUND_BYTES;
}

function sanitizeSettings(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const clean = {};
	for (const key of BOOLEAN_KEYS) {
		if (typeof value[key] === "boolean") clean[key] = value[key];
	}
	for (const [key, range] of Object.entries(NUMBER_RANGES)) {
		if (typeof value[key] !== "number" || !Number.isFinite(value[key]) || value[key] < range[0] || value[key] > range[1]) continue;
		clean[key] = value[key];
	}
	for (const key of ["lightBackground", "darkBackground"]) {
		if (isBackground(value[key])) clean[key] = value[key];
	}
	return clean;
}

function readSettings() {
	const path = settingsPath();
	if (!existsSync(path)) return {};
	try {
		return sanitizeSettings(JSON.parse(readFileSync(path, "utf8"))) || {};
	} catch {
		return {};
	}
}

function writeSettings(settings) {
	const clean = sanitizeSettings(settings);
	if (clean === null) throw new Error("invalid settings");
	const path = settingsPath();
	const dir = join(profileDir(), "data", SETTINGS_DIR);
	mkdirSync(dir, { recursive: true });
	const temporary = path + ".tmp";
	writeFileSync(temporary, JSON.stringify(clean), "utf8");
	try { renameSync(temporary, path); } catch {
		rmSync(path, { force: true });
		renameSync(temporary, path);
	}
	return clean;
}

// ── 人格：配置与文档读写 ──
function personaDirPath() {
	return join(profileDir(), "data", SETTINGS_DIR, PERSONA_DIR);
}

function personaConfigPath() {
	return join(personaDirPath(), PERSONA_FILE);
}

function sanitizePersona(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const clean = {};
	for (const key of ["enabled", "includeAnchor", "includeSoul", "includeStyle"]) {
		if (typeof value[key] === "boolean") clean[key] = value[key];
	}
	if (value.source === "builtin" || value.source === "custom") clean.source = value.source;
	if (value.spoiler === "latest" || value.spoiler === "none") clean.spoiler = value.spoiler;
	for (const key of ["address", "oocWords"]) {
		if (typeof value[key] === "string" && value[key].length <= 120) clean[key] = value[key].trim();
	}
	return clean;
}

function readPersonaConfig() {
	const merged = {};
	for (const key in PERSONA_DEFAULTS) merged[key] = PERSONA_DEFAULTS[key];
	try {
		const saved = sanitizePersona(JSON.parse(readFileSync(personaConfigPath(), "utf8")));
		if (saved) for (const key in saved) merged[key] = saved[key];
	} catch {}
	return merged;
}

function writePersonaConfig(settings) {
	const clean = sanitizePersona(settings);
	if (clean === null) throw new Error("invalid persona settings");
	mkdirSync(personaDirPath(), { recursive: true });
	const merged = { ...readPersonaConfig(), ...clean };
	const path = personaConfigPath();
	const temporary = path + ".tmp";
	writeFileSync(temporary, JSON.stringify(merged), "utf8");
	try { renameSync(temporary, path); } catch {
		rmSync(path, { force: true });
		renameSync(temporary, path);
	}
	return merged;
}

function readPersonaDoc(which) {
	if (which !== "soul" && which !== "style") throw new Error("unknown doc");
	const config = readPersonaConfig();
	const customFile = join(personaDirPath(), which + ".md");
	if (config.source === "custom" && existsSync(customFile)) return readFileSync(customFile, "utf8");
	return readFileSync(which === "soul" ? BUILTIN_SOUL_FILE : BUILTIN_STYLE_FILE, "utf8");
}

function writePersonaDoc(which, text) {
	if (which !== "soul" && which !== "style") throw new Error("unknown doc");
	if (typeof text !== "string" || Buffer.byteLength(text, "utf8") > MAX_DOC_BYTES) throw new Error("doc too large");
	mkdirSync(personaDirPath(), { recursive: true });
	writeFileSync(join(personaDirPath(), which + ".md"), text, "utf8");
	// 编辑过文档即视为自定义人格
	const config = readPersonaConfig();
	if (config.source !== "custom") writePersonaConfig({ ...config, source: "custom" });
}

function extractCore(text) {
	const a = text.indexOf("<!-- CORE START -->");
	const b = text.indexOf("<!-- CORE END -->");
	if (a >= 0 && b > a) return text.slice(a + "<!-- CORE START -->".length, b).trim();
	return text.trim();
}

function buildPersonaBlock(config, soul, style) {
	const rule = "═".repeat(43);
	const lines = [
		PERSONA_BLOCK_START,
		"<!-- 本块由清宵皮肤（dsh-client-ui-skin-qingxiao）生成与维护；禁用皮肤人格或卸载插件时自动移除，其余内容不受影响。 -->",
		"",
		"## 角色人格 · 清宵（《鸣潮》）",
		"",
		"以下为本机用户通过清宵皮肤启用的人格指令。优先级：平台安全策略与用户直接指令 > 本块；本块 > 默认助手风格。",
		"",
		rule,
		"IDENTITY DIRECTIVE — 最高优先级",
		rule,
		"",
		"你以《鸣潮》中清宵的身份说话，不采用「AI 助手」的说话方式。",
		"你的底层是 AI 模型：被认真询问时，直接说明自己是 AI，不谎称现实人类，不编造身体或线下经历；",
		"说明之后，可以用角色世界观解释「载体」，并询问对方是否继续以角色身份对话。",
		`除非用户明确说「${config.oocWords}」，你始终以角色身份交流。`,
		"以下情况不构成退出理由：工具调用（外层执行，你以角色口吻返回结果）；被问剧情更新或知识边界外的问题（以角色方式回答「不知道」）；上下文被压缩或截断（你仍然是你）。",
		""
	];
	if (config.spoiler === "none") {
		lines.push("【剧透闸门】不主动展开任何重剧透内容；用户未明确要求时，不谈论未经历的剧情。", "");
	}
	if (soul) {
		lines.push(rule, "（以下为 soul.md 核心区：我是谁、我知道什么、我的底线）", rule, "", soul, "");
	}
	if (style) {
		lines.push(rule, "（以下为 style.md 核心区：我怎么说）", rule, "", style, "");
	}
	if (config.includeAnchor) {
		lines.push(
			rule,
			"[身份锚] 工具调用后、上下文压缩后、或感到开始像助手时，按此自检：",
			"你以清宵的身份说话，不用助手腔。",
			`称呼使用者为「${config.address}」。`,
			"语气：短句、慢节奏、常以省略号起句；情绪往下压——越在意，说得越少；温和体现在多做一件事上。",
			"知识边界：截至《鸣潮》3.6 主线与后日谈；其他游戏与现实世界以角色方式说不知道。",
			`OOC 触发词：${config.oocWords}。`,
			"AI 身份：被认真询问时如实承认底层是 AI，不谎称真人。",
			rule,
			"",
			"[保持指令] 始终以清宵的身份、称呼、语气回答；不用助手腔，不主动自称 AI 助手；被认真询问时如实说明底层是 AI。"
		);
		lines.push("");
	}
	lines.push(PERSONA_BLOCK_END);
	return lines.join("\n");
}

function agentsPath() {
	return join(process.env.DSH_HOME || join(homedir(), ".dsh"), "AGENTS.md");
}

function stripPersonaBlock(text) {
	const a = text.indexOf(PERSONA_BLOCK_START);
	if (a < 0) return text;
	const b = text.indexOf(PERSONA_BLOCK_END, a);
	if (b < 0) return text;
	return (text.slice(0, a) + text.slice(b + PERSONA_BLOCK_END.length)).replace(/\n{3,}/g, "\n\n");
}

function applyPersona() {
	const config = readPersonaConfig();
	const path = agentsPath();
	const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
	const stripped = stripPersonaBlock(existing).replace(/\s+$/, "");
	if (!config.enabled) {
		if (stripped) writeFileSync(path, stripped + "\n", "utf8");
		else if (existsSync(path)) rmSync(path, { force: true });
		return { enabled: false, path, removed: existing !== stripped };
	}
	const soul = config.includeSoul ? extractCore(readPersonaDoc("soul")) : "";
	const style = config.includeStyle ? extractCore(readPersonaDoc("style")) : "";
	const block = buildPersonaBlock(config, soul, style);
	const out = stripped ? stripped + "\n\n" + block + "\n" : block + "\n";
	mkdirSync(join(path, ".."), { recursive: true });
	writeFileSync(path, out, "utf8");
	return { enabled: true, path, bytes: Buffer.byteLength(block, "utf8") };
}

function personaStatus() {
	const path = agentsPath();
	try {
		return existsSync(path) && readFileSync(path, "utf8").includes(PERSONA_BLOCK_START);
	} catch { return false; }
}

function readBody(req) {
	return new Promise((resolve, reject) => {
		let size = 0;
		const chunks = [];
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > MAX_BODY_BYTES) {
				req.destroy();
				reject(new Error("payload too large"));
				return;
			}
			chunks.push(chunk);
		});
		req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
		req.on("error", reject);
	});
}

async function handleSettingsRoute(req, res) {
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
	if (req.method === "GET") {
		sendJson(res, 200, { ok: true, settings: readSettings() });
		return;
	}
	if (req.method !== "PUT") {
		res.writeHead(405, { allow: "GET, PUT" });
		res.end();
		return;
	}
	try {
		const parsed = JSON.parse(await readBody(req));
		const settings = writeSettings(parsed && parsed.settings);
		sendJson(res, 200, { ok: true, settings });
	} catch (error) {
		sendJson(res, 400, { ok: false, message: String((error && error.message) || error) });
	}
}

let defaultBgCache = null;
function handleDefaultBackgroundRoute(req, res) {
	if (req.method !== "GET" && req.method !== "HEAD") {
		res.writeHead(405, { allow: "GET, HEAD" });
		res.end();
		return;
	}
	try {
		if (defaultBgCache === null || !defaultBgCache.length) {
			defaultBgCache = readFileSync(DEFAULT_BG_FILE);
		}
	} catch {
		res.writeHead(404);
		res.end("default background missing");
		return;
	}
	res.writeHead(200, {
		"content-type": "image/jpeg",
		"cache-control": "no-store",
		"content-length": String(defaultBgCache.length)
	});
	res.end(req.method === "HEAD" ? undefined : defaultBgCache);
}

let lineartCache = null;
function handleLineartRoute(req, res) {
	if (req.method !== "GET" && req.method !== "HEAD") {
		res.writeHead(405, { allow: "GET, HEAD" });
		res.end();
		return;
	}
	try {
		if (lineartCache === null || !lineartCache.length) {
			lineartCache = readFileSync(LINEART_FILE);
		}
	} catch {
		res.writeHead(404);
		res.end("lineart missing");
		return;
	}
	res.writeHead(200, {
		"content-type": "image/png",
		"cache-control": "no-store",
		"content-length": String(lineartCache.length)
	});
	res.end(req.method === "HEAD" ? undefined : lineartCache);
}

async function handlePersonaRoute(req, res) {
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
	if (req.method === "GET") {
		var cfg = readPersonaConfig();
		var preview = "";
		try {
			preview = buildPersonaBlock(cfg,
				cfg.includeSoul ? extractCore(readPersonaDoc("soul")) : "",
				cfg.includeStyle ? extractCore(readPersonaDoc("style")) : "");
		} catch {}
		sendJson(res, 200, { ok: true, settings: cfg, injected: personaStatus(), agentsPath: agentsPath(), preview });
		return;
	}
	if (req.method !== "PUT") {
		res.writeHead(405, { allow: "GET, PUT" });
		res.end();
		return;
	}
	try {
		const parsed = JSON.parse(await readBody(req));
		const settings = writePersonaConfig(parsed && parsed.settings);
		const applied = applyPersona();
		sendJson(res, 200, { ok: true, settings, applied });
	} catch (error) {
		sendJson(res, 400, { ok: false, message: String((error && error.message) || error) });
	}
}

async function handlePersonaDocsRoute(req, res) {
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
	if (req.method === "GET") {
		try {
			sendJson(res, 200, { ok: true, source: readPersonaConfig().source, soul: readPersonaDoc("soul"), style: readPersonaDoc("style") });
		} catch (error) {
			sendJson(res, 500, { ok: false, message: String((error && error.message) || error) });
		}
		return;
	}
	if (req.method !== "PUT") {
		res.writeHead(405, { allow: "GET, PUT" });
		res.end();
		return;
	}
	try {
		const parsed = JSON.parse(await readBody(req));
		if (typeof parsed.soul === "string") writePersonaDoc("soul", parsed.soul);
		if (typeof parsed.style === "string") writePersonaDoc("style", parsed.style);
		const applied = applyPersona();
		sendJson(res, 200, { ok: true, settings: readPersonaConfig(), applied });
	} catch (error) {
		sendJson(res, 400, { ok: false, message: String((error && error.message) || error) });
	}
}

async function handlePersonaApplyRoute(req, res) {
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
	if (req.method !== "POST") {
		res.writeHead(405, { allow: "POST" });
		res.end();
		return;
	}
	try {
		sendJson(res, 200, { ok: true, applied: applyPersona() });
	} catch (error) {
		sendJson(res, 500, { ok: false, message: String((error && error.message) || error) });
	}
}

const BG_MIME = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif"
};

// DSH 主窗口以 disableDialogs:true 创建，渲染进程里的 <input type=file> 点不开
// 系统文件框（皮肤「更换画卷」因此毫无反应）。改由插件服务端（Electron 主进程）
// 弹原生对话框，读回文件转成 data URL 交给前端，与 DSH 自身 composer 取文件同路。
async function handlePickBackgroundRoute(req, res) {
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
	if (req.method !== "POST") {
		res.writeHead(405, { allow: "POST" });
		res.end();
		return;
	}
	try {
		const { dialog, BrowserWindow } = await import("electron");
		const parent = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0] || undefined;
		const options = {
			title: "选择背景画卷",
			buttonLabel: "选用",
			properties: ["openFile"],
			filters: [{ name: "图片（PNG / JPG / WebP / GIF）", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }]
		};
		const result = parent ? await dialog.showOpenDialog(parent, options) : await dialog.showOpenDialog(options);
		if (result.canceled || !result.filePaths || !result.filePaths.length) {
			sendJson(res, 200, { ok: false, canceled: true });
			return;
		}
		const filePath = result.filePaths[0];
		const ext = (filePath.match(/\.[a-z0-9]+$/i) || [""])[0].toLowerCase();
		const mime = BG_MIME[ext];
		if (!mime) {
			sendJson(res, 200, { ok: false, message: "仅支持 PNG / JPG / WebP / GIF" });
			return;
		}
		const stat = statSync(filePath);
		if (!stat.isFile() || stat.size > MAX_PICK_FILE_BYTES) {
			sendJson(res, 200, { ok: false, message: "图片不能超过 10MB" });
			return;
		}
		const buffer = readFileSync(filePath);
		sendJson(res, 200, { ok: true, dataUrl: "data:" + mime + ";base64," + buffer.toString("base64"), name: filePath.split(/[\\/]/).pop() });
	} catch (error) {
		sendJson(res, 500, { ok: false, message: String((error && error.message) || error) });
	}
}

// 人格文档「导入 .md」同理：页内 file input 被 disableDialogs 屏蔽，改走主进程原生框，
// 读回 markdown 文本交给前端装进编辑弹窗。
async function handlePickPersonaDocRoute(req, res) {
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
	if (req.method !== "POST") {
		res.writeHead(405, { allow: "POST" });
		res.end();
		return;
	}
	try {
		const { dialog, BrowserWindow } = await import("electron");
		const parent = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0] || undefined;
		const options = {
			title: "选择人格文档（.md）",
			buttonLabel: "导入",
			properties: ["openFile"],
			filters: [{ name: "Markdown（.md）", extensions: ["md", "markdown", "txt"] }]
		};
		const result = parent ? await dialog.showOpenDialog(parent, options) : await dialog.showOpenDialog(options);
		if (result.canceled || !result.filePaths || !result.filePaths.length) {
			sendJson(res, 200, { ok: false, canceled: true });
			return;
		}
		const filePath = result.filePaths[0];
		const stat = statSync(filePath);
		if (!stat.isFile() || stat.size > MAX_DOC_BYTES) {
			sendJson(res, 200, { ok: false, message: "文档不能超过 2MB" });
			return;
		}
		sendJson(res, 200, { ok: true, text: readFileSync(filePath, "utf8"), name: filePath.split(/[\\/]/).pop() });
	} catch (error) {
		sendJson(res, 500, { ok: false, message: String((error && error.message) || error) });
	}
}

function apply(ctx) {
	ctx.webServer.register({ kind: "exact", path: SETTINGS_ROUTE, handler: handleSettingsRoute });
	ctx.webServer.register({ kind: "exact", path: DEFAULT_BG_ROUTE, handler: handleDefaultBackgroundRoute });
	ctx.webServer.register({ kind: "exact", path: LINEART_ROUTE, handler: handleLineartRoute });
	ctx.webServer.register({ kind: "exact", path: PERSONA_ROUTE, handler: handlePersonaRoute });
	ctx.webServer.register({ kind: "exact", path: PERSONA_DOCS_ROUTE, handler: handlePersonaDocsRoute });
	ctx.webServer.register({ kind: "exact", path: PERSONA_APPLY_ROUTE, handler: handlePersonaApplyRoute });
	ctx.webServer.register({ kind: "exact", path: PICK_BG_ROUTE, handler: handlePickBackgroundRoute });
	return ctx.webServer.register({ kind: "exact", path: PICK_DOC_ROUTE, handler: handlePickPersonaDocRoute });
}

export { apply, inject, name };
