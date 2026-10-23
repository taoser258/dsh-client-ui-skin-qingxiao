import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
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
const PERSONA_LIBRARY_ROUTE = "/api/dsh-qingxiao/persona-library";
const SETTINGS_DIR = "dsh-client-ui-skin-qingxiao";
const SETTINGS_FILE = "settings.json";
const PERSONA_DIR = "persona";
const PERSONA_FILE = "persona.json";
const PERSONA_LIBRARY_FILE = "library.json";
const BUILTIN_PERSONA_ID = "qingxiao";
const BUILTIN_PERSONA_NAME = "清宵 · 鸣潮";
const DEFAULT_BG_FILE = fileURLToPath(new URL("../assets/qx.jpg", import.meta.url));
const LINEART_FILE = fileURLToPath(new URL("../assets/qx-lineart.png", import.meta.url));
const BUILTIN_SOUL_FILE = fileURLToPath(new URL("../assets/persona/qingxiao-soul.md", import.meta.url));
const BUILTIN_STYLE_FILE = fileURLToPath(new URL("../assets/persona/qingxiao-style.md", import.meta.url));
const MAX_BODY_BYTES = 20 * 1024 * 1024;
// 背景以 data URL 存进 settings：base64 约放大 1.37 倍，14MB 字符串上限 ≈ 10MB 原图
const MAX_BACKGROUND_BYTES = 14 * 1024 * 1024;
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
	source: "builtin",        // builtin | custom（由 activeId 派生，保留兼容）
	activeId: "qingxiao",     // 当前启用的人格 id（qingxiao=内置，其余为库内自定义）
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
	if (typeof value.activeId === "string" && /^[a-z0-9_-]{1,64}$/i.test(value.activeId)) clean.activeId = value.activeId;
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

// ── 人格库：内置清宵 + 用户导入/自建的多个命名人格 ──
function personaLibraryPath() {
	return join(personaDirPath(), PERSONA_LIBRARY_FILE);
}

function readLibrary() {
	try {
		const arr = JSON.parse(readFileSync(personaLibraryPath(), "utf8"));
		return Array.isArray(arr) ? arr.filter((p) => p && typeof p.id === "string") : [];
	} catch {
		return [];
	}
}

function writeLibrary(list) {
	mkdirSync(personaDirPath(), { recursive: true });
	const path = personaLibraryPath();
	const temporary = path + ".tmp";
	writeFileSync(temporary, JSON.stringify(list), "utf8");
	try { renameSync(temporary, path); } catch {
		rmSync(path, { force: true });
		renameSync(temporary, path);
	}
	return list;
}

function newPersonaId() {
	return "p-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function builtinPersona() {
	let soul = "";
	let style = "";
	try { soul = readFileSync(BUILTIN_SOUL_FILE, "utf8"); } catch {}
	try { style = readFileSync(BUILTIN_STYLE_FILE, "utf8"); } catch {}
	return { id: BUILTIN_PERSONA_ID, name: BUILTIN_PERSONA_NAME, builtin: true, soul, style };
}

function listPersonas() {
	return [builtinPersona(), ...readLibrary()];
}

function findPersona(id) {
	if (id === BUILTIN_PERSONA_ID) return builtinPersona();
	return readLibrary().find((p) => p.id === id) || null;
}

function personaDoc(which, id) {
	const p = findPersona(id) || builtinPersona();
	return p[which] || "";
}

function readPersonaDoc(which) {
	if (which !== "soul" && which !== "style") throw new Error("unknown doc");
	return personaDoc(which, readPersonaConfig().activeId);
}

function writePersonaDoc(which, text) {
	if (which !== "soul" && which !== "style") throw new Error("unknown doc");
	if (typeof text !== "string" || Buffer.byteLength(text, "utf8") > MAX_DOC_BYTES) throw new Error("doc too large");
	const config = readPersonaConfig();
	let id = config.activeId;
	// 编辑内置清宵：先复制成一份自定义人格再改，绝不覆盖内置资源
	if (id === BUILTIN_PERSONA_ID) {
		const builtin = builtinPersona();
		id = newPersonaId();
		const list = readLibrary();
		list.push({ id, name: builtin.name + " · 副本", soul: builtin.soul, style: builtin.style });
		writeLibrary(list);
		writePersonaConfig({ ...config, activeId: id, source: "custom" });
	}
	const list = readLibrary();
	const entry = list.find((p) => p.id === id);
	if (!entry) throw new Error("persona not found");
	entry[which] = text;
	writeLibrary(list);
}

// 一次性迁移：旧版只有单个 custom soul.md/style.md，把它并入人格库并回填 activeId
function migratePersonaLibrary() {
	try {
		const raw = JSON.parse(readFileSync(personaConfigPath(), "utf8"));
		if (!raw || raw.activeId !== undefined) return;
		const soulF = join(personaDirPath(), "soul.md");
		const styleF = join(personaDirPath(), "style.md");
		if (raw.source === "custom" && (existsSync(soulF) || existsSync(styleF))) {
			const id = newPersonaId();
			const list = readLibrary();
			list.push({
				id,
				name: "我的自定义",
				soul: existsSync(soulF) ? readFileSync(soulF, "utf8") : "",
				style: existsSync(styleF) ? readFileSync(styleF, "utf8") : ""
			});
			writeLibrary(list);
			writePersonaConfig({ ...raw, activeId: id, source: "custom" });
			// 内容已并入 library.json，删除旧版单文件，避免遗留孤儿
			try { rmSync(soulF, { force: true }); rmSync(styleF, { force: true }); } catch {}
		} else {
			writePersonaConfig({ ...raw, activeId: BUILTIN_PERSONA_ID, source: "builtin" });
		}
	} catch {}
}

function extractCore(text) {
	const a = text.indexOf("<!-- CORE START -->");
	const b = text.indexOf("<!-- CORE END -->");
	if (a >= 0 && b > a) return text.slice(a + "<!-- CORE START -->".length, b).trim();
	return text.trim();
}

// 注入块模板与具体角色解耦：只按「当前人格名」占位，性格/语气/知识边界一律交给
// soul / style 文档承载，避免切到别的人格时仍被硬编码成清宵。
function buildPersonaBlock(config, soul, style, personaName) {
	const who = (personaName || "").trim() || "下方文档所定义的角色";
	const rule = "═".repeat(43);
	const lines = [
		PERSONA_BLOCK_START,
		"<!-- 本块由清宵皮肤（dsh-client-ui-skin-qingxiao）生成与维护；禁用皮肤人格或卸载插件时自动移除，其余内容不受影响。 -->",
		"",
		`## 角色人格 · ${who}`,
		"",
		"以下为本机用户通过清宵皮肤启用的人格指令。优先级：平台安全策略与用户直接指令 > 本块；本块 > 默认助手风格。",
		"",
		rule,
		"IDENTITY DIRECTIVE — 最高优先级",
		rule,
		"",
		`你以「${who}」的身份说话；该角色的性格、背景、说话方式与知识边界以下方 soul / style 文档为准，不采用「AI 助手」的说话方式。`,
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
			`你以「${who}」的身份说话，不用助手腔；具体语气与知识边界以上方 soul / style 为准。`,
			`称呼使用者为「${config.address}」。`,
			`OOC 触发词：${config.oocWords}。`,
			"AI 身份：被认真询问时如实承认底层是 AI，不谎称真人。",
			rule,
			"",
			`[保持指令] 始终以「${who}」的身份、称呼、语气回答（详见上方 soul / style）；不用助手腔，不主动自称 AI 助手；被认真询问时如实说明底层是 AI。`
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
	const personaName = (findPersona(config.activeId) || builtinPersona()).name;
	const block = buildPersonaBlock(config, soul, style, personaName);
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
				cfg.includeStyle ? extractCore(readPersonaDoc("style")) : "",
				(findPersona(cfg.activeId) || builtinPersona()).name);
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
			const cfg = readPersonaConfig();
			const active = findPersona(cfg.activeId) || builtinPersona();
			sendJson(res, 200, { ok: true, source: cfg.source, activeId: cfg.activeId, activeName: active.name, soul: readPersonaDoc("soul"), style: readPersonaDoc("style") });
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

function personaListSummary() {
	const activeId = readPersonaConfig().activeId;
	return {
		activeId,
		personas: listPersonas().map((p) => ({
			id: p.id,
			name: p.name,
			builtin: !!p.builtin,
			soulLen: (p.soul || "").length,
			styleLen: (p.style || "").length
		}))
	};
}

async function handlePersonaLibraryRoute(req, res) {
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
	if (req.method === "GET") {
		try {
			const id = new URL(req.url, "http://127.0.0.1").searchParams.get("id");
			if (id) {
				const p = findPersona(id);
				if (!p) { sendJson(res, 404, { ok: false, message: "人格不存在" }); return; }
				sendJson(res, 200, { ok: true, persona: { id: p.id, name: p.name, builtin: !!p.builtin, soul: p.soul || "", style: p.style || "" } });
				return;
			}
			sendJson(res, 200, { ok: true, ...personaListSummary() });
		} catch (error) {
			sendJson(res, 500, { ok: false, message: String((error && error.message) || error) });
		}
		return;
	}
	if (req.method !== "POST") {
		res.writeHead(405, { allow: "GET, POST" });
		res.end();
		return;
	}
	try {
		const body = JSON.parse(await readBody(req));
		const action = String(body.action || "");
		const config = readPersonaConfig();
		if (action === "select") {
			const id = String(body.id || "");
			if (!findPersona(id)) throw new Error("人格不存在");
			const next = { ...config, activeId: id, source: id === BUILTIN_PERSONA_ID ? "builtin" : "custom" };
			// 从新会话选择器选人格时带上 enabled:true，确保立即启用注入
			if (typeof body.enabled === "boolean") next.enabled = body.enabled;
			const settings = writePersonaConfig(next);
			const applied = applyPersona();
			sendJson(res, 200, { ok: true, settings, applied, ...personaListSummary() });
		} else if (action === "setEnabled") {
			// 「不使用人格」= 关闭注入（保留 activeId，方便下次再开）
			if (typeof body.enabled !== "boolean") throw new Error("缺少 enabled");
			const settings = writePersonaConfig({ ...config, enabled: body.enabled });
			const applied = applyPersona();
			sendJson(res, 200, { ok: true, settings, applied, ...personaListSummary() });
		} else if (action === "create") {
			const name = (typeof body.name === "string" && body.name.trim().slice(0, 40)) || "未命名人格";
			const entry = {
				id: newPersonaId(), name,
				soul: typeof body.soul === "string" ? body.soul.slice(0, MAX_DOC_BYTES) : "",
				style: typeof body.style === "string" ? body.style.slice(0, MAX_DOC_BYTES) : ""
			};
			const list = readLibrary();
			list.push(entry);
			writeLibrary(list);
			const settings = writePersonaConfig({ ...config, activeId: entry.id, source: "custom" });
			const applied = applyPersona();
			sendJson(res, 200, { ok: true, id: entry.id, settings, applied, ...personaListSummary() });
		} else if (action === "update") {
			// 编辑已有自定义人格：可改名称并整体替换 soul / style（内置不可改）
			const id = String(body.id || "");
			if (id === BUILTIN_PERSONA_ID) throw new Error("内置清宵不可直接编辑，请改用「使用」或新建副本");
			const list = readLibrary();
			const entry = list.find((p) => p.id === id);
			if (!entry) throw new Error("人格不存在");
			if (typeof body.name === "string" && body.name.trim()) entry.name = body.name.trim().slice(0, 40);
			if (typeof body.soul === "string") {
				if (Buffer.byteLength(body.soul, "utf8") > MAX_DOC_BYTES) throw new Error("soul 文档过大");
				entry.soul = body.soul;
			}
			if (typeof body.style === "string") {
				if (Buffer.byteLength(body.style, "utf8") > MAX_DOC_BYTES) throw new Error("style 文档过大");
				entry.style = body.style;
			}
			writeLibrary(list);
			// 若编辑的正是当前启用的人格，重新注入
			const isActive = readPersonaConfig().activeId === id;
			const applied = isActive ? applyPersona() : { enabled: readPersonaConfig().enabled };
			sendJson(res, 200, { ok: true, applied, ...personaListSummary() });
		} else if (action === "import") {
			const name = (typeof body.name === "string" && body.name.trim().slice(0, 40)) || "导入的人格";
			const soul = typeof body.soul === "string" ? body.soul.slice(0, MAX_DOC_BYTES) : "";
			const style = typeof body.style === "string" ? body.style.slice(0, MAX_DOC_BYTES) : "";
			const entry = { id: newPersonaId(), name, soul, style };
			const list = readLibrary();
			list.push(entry);
			writeLibrary(list);
			const settings = writePersonaConfig({ ...config, activeId: entry.id, source: "custom" });
			const applied = applyPersona();
			sendJson(res, 200, { ok: true, id: entry.id, settings, applied, ...personaListSummary() });
		} else if (action === "rename") {
			const list = readLibrary();
			const entry = list.find((p) => p.id === body.id);
			if (!entry) throw new Error("只能重命名自定义人格");
			entry.name = (typeof body.name === "string" && body.name.trim().slice(0, 40)) || entry.name;
			writeLibrary(list);
			sendJson(res, 200, { ok: true, ...personaListSummary() });
		} else if (action === "delete") {
			const id = String(body.id || "");
			if (id === BUILTIN_PERSONA_ID) throw new Error("内置清宵不可删除");
			const before = readLibrary();
			const list = before.filter((p) => p.id !== id);
			if (list.length === before.length) throw new Error("人格不存在");
			writeLibrary(list);
			let settings = config;
			if (config.activeId === id) settings = writePersonaConfig({ ...config, activeId: BUILTIN_PERSONA_ID, source: "builtin" });
			const applied = applyPersona();
			sendJson(res, 200, { ok: true, settings, applied, ...personaListSummary() });
		} else {
			throw new Error("未知操作");
		}
	} catch (error) {
		sendJson(res, 400, { ok: false, message: String((error && error.message) || error) });
	}
}

function apply(ctx) {
	migratePersonaLibrary();
	ctx.webServer.register({ kind: "exact", path: SETTINGS_ROUTE, handler: handleSettingsRoute });
	ctx.webServer.register({ kind: "exact", path: DEFAULT_BG_ROUTE, handler: handleDefaultBackgroundRoute });
	ctx.webServer.register({ kind: "exact", path: LINEART_ROUTE, handler: handleLineartRoute });
	ctx.webServer.register({ kind: "exact", path: PERSONA_ROUTE, handler: handlePersonaRoute });
	ctx.webServer.register({ kind: "exact", path: PERSONA_DOCS_ROUTE, handler: handlePersonaDocsRoute });
	ctx.webServer.register({ kind: "exact", path: PERSONA_APPLY_ROUTE, handler: handlePersonaApplyRoute });
	return ctx.webServer.register({ kind: "exact", path: PERSONA_LIBRARY_ROUTE, handler: handlePersonaLibraryRoute });
}

export { apply, inject, name };
