import {
	closeSync, createReadStream, existsSync, fsyncSync, lstatSync, mkdirSync, openSync,
	readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync, unlinkSync,
	writeFileSync, writeSync
} from "node:fs";
import { randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, sep } from "node:path";
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
const DIAGNOSE_ROUTE = "/api/dsh-qingxiao/diagnose";
const MEDIA_ROUTE = "/api/dsh-qingxiao/media";
const MEDIA_DIR = "media";
const MEDIA_INDEX = "index.json";
const MEDIA_ID_RE = /^[a-f0-9]{32}$/u;
const MEDIA_MIME_EXT = {
	"video/mp4": "mp4",
	"video/webm": "webm",
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp"
};
const MEDIA_EXT_MIME = {
	mp4: "video/mp4",
	webm: "video/webm",
	jpg: "image/jpeg",
	png: "image/png",
	webp: "image/webp"
};
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
// 背景以 data URL 存进 settings：base64 约放大 1.37 倍，14MB 字符串上限 ≈ 10MB 原图
const MAX_BACKGROUND_BYTES = 14 * 1024 * 1024;
// 亮/暗两套背景可同时自定义（各 ≤14MB），body 上限必须容得下两者之和，否则
// 「两张都换过」的用户永远保存不进去（旧版 20MB 上限会先 req.destroy 再给不出响应）。
const MAX_BODY_BYTES = 32 * 1024 * 1024;
const MAX_DOC_BYTES = 2 * 1024 * 1024;
// GET /persona 的注入预览上限：超限截断，避免打开人格页就传几 MB JSON。
const MAX_PREVIEW_CHARS = 200 * 1000;

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
	"bootAnimation",
	// 0.5.0 画卷 2.0：输入压暗 / URL 轮播
	"bgAutoDim", "bgRotationOn",
	// 0.6.0 视频壁纸
	"bgVideoEnabled", "bgVideoLowPower", "bgVideoCompat"
];
const NUMBER_RANGES = {
	scrimOpacity: [20, 95],
	panelOpacity: [30, 100],
	contentWidth: [500, 1000],
	particleCount: [0, 60],
	particleSpeed: [20, 200],
	fontScale: [85, 125],
	// 虚化强度 0–30px（0 = 关闭等效，前端把 0 视作总开关 off）
	frostBlur: [0, 30],
	// 画卷 2.0：构图焦点
	bgFocusX: [0, 100],
	bgFocusY: [0, 100],
	bgRotationMinutes: [5, 1440],
	// 0.7.0 个性化定制：行高 / 字距（em）
	lineHeight: [1.3, 2.0],
	letterSpacing: [-0.02, 0.08]
};
// 0.7.0 个性化定制：字体与色板只存枚举 id，颜色只收 #RRGGBB。
// 与 client.js 的 QX_FONT_UI / QX_FONT_CODE / QX_PALETTES 保持一致。
const FONT_UI_IDS = new Set([
	"system", "source-han-sans", "yahei", "pingfang", "lxgw-wenkai", "source-han-serif", "kaiti"
]);
const FONT_CODE_IDS = new Set([
	"system", "consolas", "cascadia-code", "jetbrains-mono", "fira-code", "menlo"
]);
const PALETTE_IDS = new Set(["jade", "ink", "bamboo", "lotus", "amber", "crimson"]);
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

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

// loopback 只证明「请求来自本机」，挡不住「本机浏览器里的其它网页」：
// 一个普通网页可以用 text/plain（简单请求，无 CORS 预检）向 127.0.0.1 的端口发
// JSON 字符串，服务端 JSON.parse 照单全收，于是能改写人格库、往 AGENTS.md 里写
// 持久指令。这里补两道源码级防线：
//   1) 写请求必须带 application/json —— 跨站带这个头会触发预检，而本服务不返回
//      任何 CORS 响应头，浏览器会自行拒绝；
//   2) 带 Origin / Sec-Fetch-Site 的请求必须是同源。
// 本机脚本（curl、测试）两者都没有，仍然放行，保持原有的 loopback 信任模型。
function isSameOriginRequest(req) {
	// Sec-Fetch-* 由浏览器强制写入、页面脚本无法伪造，是最可靠的一手信号；
	// 反代场景下浏览器看到的仍是 same-origin，所以这里优先采信它。
	const site = req.headers["sec-fetch-site"];
	if (site === "same-origin" || site === "none") return true;
	if (site) return false;
	// 老浏览器不发 Sec-Fetch-*：退回 Origin/Host 同源比较。
	const origin = req.headers.origin;
	if (origin === undefined) return true;	// 非浏览器上下文（本机脚本、测试）
	if (!origin || origin === "null") return false;
	try {
		return new URL(origin).host === (req.headers.host || "");
	} catch {
		return false;
	}
}

function isJsonBody(req) {
	const type = String(req.headers["content-type"] || "").toLowerCase();
	return type.indexOf("application/json") === 0;
}

// 写接口统一前置检查；返回 true 表示已响应，调用方直接 return。
function rejectCrossSite(res, req) {
	if (isSameOriginRequest(req)) return false;
	sendJson(res, 403, { ok: false, message: "跨站请求被拒绝" });
	return true;
}

function rejectWrite(res, req) {
	if (rejectCrossSite(res, req)) return true;
	if (!isJsonBody(req)) {
		sendJson(res, 415, { ok: false, message: "content-type 必须是 application/json" });
		return true;
	}
	return false;
}

// 覆盖写一律走 tmp + rename：中途失败不会留下半截文件，也不会破坏原文件。
function writeFileAtomic(target, text) {
	mkdirSync(dirname(target), { recursive: true });
	const temporary = target + ".tmp";
	writeFileSync(temporary, text, "utf8");
	try {
		renameSync(temporary, target);
	} catch {
		// Windows 下 rename 覆盖已存在文件可能失败：删旧再改名后重试一次。
		rmSync(target, { force: true });
		renameSync(temporary, target);
	}
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

function isBgUrl(value) {
	if (typeof value !== "string" || value.length > 2048 || !/^https?:\/\//i.test(value)) return false;
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

// 视频 URL：https 任意；http 只允许本机（避免明文远程）；拒绝 HLS/DASH 与凭据。
function isVideoUrl(value) {
	if (typeof value !== "string" || value.length > 2048 || !/^https?:\/\//i.test(value)) return null;
	try {
		const url = new URL(value);
		if (url.username || url.password) return null;
		if (/\.(m3u8|mpd)$/i.test(url.pathname)) return null;
		if (url.protocol === "http:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1" && url.hostname !== "[::1]" && url.hostname !== "::1") return null;
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;
		return url.href;
	} catch {
		return null;
	}
}

function isBackground(value) {
	if (value === null) return true;
	if (typeof value !== "string") return false;
	if (/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(value)) {
		return Buffer.byteLength(value, "utf8") <= MAX_BACKGROUND_BYTES;
	}
	// 画卷 2.0：允许 http(s) 图片 URL（不下载、不代理，仅交给浏览器加载）
	return isBgUrl(value);
}

function sanitizeSettings(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const clean = {};
	for (const key of BOOLEAN_KEYS) {
		if (typeof value[key] === "boolean") clean[key] = value[key];
	}
	if (value.bgFit === "cover" || value.bgFit === "contain") clean.bgFit = value.bgFit;
	// 0.7.0 个性化定制
	if (FONT_UI_IDS.has(value.fontUi)) clean.fontUi = value.fontUi;
	if (FONT_CODE_IDS.has(value.fontCode)) clean.fontCode = value.fontCode;
	if (PALETTE_IDS.has(value.paletteId)) clean.paletteId = value.paletteId;
	if (value.accentColor === null) clean.accentColor = null;
	else if (typeof value.accentColor === "string" && HEX_COLOR_RE.test(value.accentColor)) {
		clean.accentColor = value.accentColor.toLowerCase();
	}
	for (const [key, range] of Object.entries(NUMBER_RANGES)) {
		if (typeof value[key] !== "number" || !Number.isFinite(value[key]) || value[key] < range[0] || value[key] > range[1]) continue;
		clean[key] = value[key];
	}
	for (const key of ["lightBackground", "darkBackground"]) {
		if (isBackground(value[key])) clean[key] = value[key];
	}
	if (Array.isArray(value.bgRotation)) {
		clean.bgRotation = value.bgRotation.filter((v) => isBgUrl(v)).slice(0, 20);
	}
	for (const key of ["lightVideoId", "darkVideoId", "lightVideoPosterId", "darkVideoPosterId"]) {
		if (value[key] === null || (typeof value[key] === "string" && MEDIA_ID_RE.test(value[key]))) clean[key] = value[key];
	}
	for (const key of ["lightVideoUrl", "darkVideoUrl"]) {
		if (value[key] === null) clean[key] = null;
		else if (typeof value[key] === "string") {
			const url = isVideoUrl(value[key]);
			if (url) clean[key] = url;
		}
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

// 文档入参校验：统一按 UTF-8 字节数卡 2MB。
// 旧版 create/import 用 String#slice 按「字符」截断，2M 个汉字能写进 6MB，
// 与 update 的口径不一致，还会把超长内容注进 AGENTS.md。
function checkedDoc(value, label) {
	if (value === undefined || value === null) return "";
	if (typeof value !== "string") throw new Error(label + " 必须是字符串");
	if (Buffer.byteLength(value, "utf8") > MAX_DOC_BYTES) throw new Error(label + " 文档过大（上限 2MB）");
	return value;
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

// 剥离哨兵块：循环处理所有成对块。
// 旧版有三处坑，这里一并修掉：
//   1) 只处理第一对块，文件里残留两个块时会越积越多；
//   2) 对整篇做 /\n{3,}/g 压缩，连块外、甚至代码块内部的空行都会被改；
//   3) 遇到「有 start 无 end」会对不上，导致下一次从旧 start 删到新块的 end。
function stripPersonaBlocks(text) {
	let out = text;
	let changed = false;
	for (;;) {
		const a = out.indexOf(PERSONA_BLOCK_START);
		if (a < 0) break;
		const b = out.indexOf(PERSONA_BLOCK_END, a + PERSONA_BLOCK_START.length);
		if (b < 0) return { text: out, changed, unterminated: true };
		out = out.slice(0, a) + out.slice(b + PERSONA_BLOCK_END.length);
		changed = true;
	}
	return { text: out, changed, unterminated: false };
}

function applyPersona() {
	const config = readPersonaConfig();
	const path = agentsPath();
	const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
	const stripped = stripPersonaBlocks(existing);
	// 结构异常时一律不动文件：交给用户手工处理，绝不猜边界。
	if (stripped.unterminated) {
		return {
			enabled: config.enabled,
			path,
			written: false,
			error: "unterminated",
			message: "AGENTS.md 里的人格块只有起始哨兵、没有结束哨兵。为避免误删文件其余内容，本次未写入；请手工删掉那行起始哨兵后重试。"
		};
	}
	// 只在接缝处规整空白：去掉剥离后残留的首部空行与尾部空白。
	const base = stripped.text.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
	if (!config.enabled) {
		// 没有任何块就什么都不做，避免为了「关掉一个不存在的块」重写用户的文件。
		if (!stripped.changed) return { enabled: false, path, removed: false };
		if (base) writeFileAtomic(path, base + "\n");
		else rmSync(path, { force: true });
		return { enabled: false, path, removed: true };
	}
	const soul = config.includeSoul ? extractCore(readPersonaDoc("soul")) : "";
	const style = config.includeStyle ? extractCore(readPersonaDoc("style")) : "";
	const personaName = (findPersona(config.activeId) || builtinPersona()).name;
	const block = buildPersonaBlock(config, soul, style, personaName);
	const out = base ? base + "\n\n" + block + "\n" : block + "\n";
	writeFileAtomic(path, out);
	return { enabled: true, path, written: true, bytes: Buffer.byteLength(block, "utf8") };
}

function personaStatus() {
	const path = agentsPath();
	try {
		if (!existsSync(path)) return false;
		const text = readFileSync(path, "utf8");
		const a = text.indexOf(PERSONA_BLOCK_START);
		if (a < 0) return false;
		// 必须成对才算「已注入」：只有 start 的半截块是损坏状态，不能报 ok。
		return text.indexOf(PERSONA_BLOCK_END, a + PERSONA_BLOCK_START.length) > 0;
	} catch { return false; }
}

const PAYLOAD_TOO_LARGE = "payload-too-large";

function readBody(req) {
	return new Promise((resolve, reject) => {
		let size = 0;
		let overflow = false;
		const chunks = [];
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > MAX_BODY_BYTES) {
				// 旧版在这里 req.destroy()，客户端只看到连接重置、拿不到任何错误体。
				// 改为「停止缓存但继续读完」，让请求正常结束后能回 413 + JSON。
				overflow = true;
				chunks.length = 0;
				return;
			}
			if (!overflow) chunks.push(chunk);
		});
		req.on("end", () => {
			if (overflow) {
				const error = new Error("payload too large");
				error.code = PAYLOAD_TOO_LARGE;
				reject(error);
				return;
			}
			resolve(Buffer.concat(chunks).toString("utf8"));
		});
		req.on("error", reject);
	});
}

// 写接口的统一失败出口：超限回 413（而不是让连接直接断掉），其余回 400。
function sendWriteError(res, error) {
	if (error && error.code === PAYLOAD_TOO_LARGE) {
		sendJson(res, 413, { ok: false, message: "请求体过大（上限 " + Math.round(MAX_BODY_BYTES / 1024 / 1024) + "MB）" });
		return;
	}
	sendJson(res, 400, { ok: false, message: String((error && error.message) || error) });
}

// applyPersona 遇到结构异常时不写文件，这里统一回 409，让 UI 显示具体原因。
function sendApplied(res, settings, applied, extra) {
	if (applied && applied.error) {
		sendJson(res, 409, Object.assign({ ok: false, message: applied.message, applied }, extra || {}));
		return;
	}
	sendJson(res, 200, Object.assign({ ok: true, settings, applied }, extra || {}));
}

async function handleSettingsRoute(req, res) {
	if (!isLoopback(req)) {
		sendJson(res, 403, { ok: false, message: "仅允许本机访问" });
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
	if (rejectWrite(res, req)) return;
	try {
		const parsed = JSON.parse(await readBody(req));
		const settings = writeSettings(parsed && parsed.settings);
		sendJson(res, 200, { ok: true, settings });
	} catch (error) {
		sendWriteError(res, error);
	}
}

// 只读诊断：帮助用户/开发者判断「皮肤为什么没加载」。
// 不修改 profile，不写文件；只报告插件挂载、市场禁用与 patch 行状态。
function readPatchRowFlags(patchPath, rowId) {
	const result = { found: false, disabled: false, forced: false, rows: [] };
	try {
		const lines = readFileSync(patchPath, "utf8").split(/\r?\n/);
		for (let i = 0; i < lines.length; i += 1) {
			const row = /^-\s*id:\s*['"]?([A-Za-z0-9_.-]+)['"]?\s*$/u.exec(lines[i]);
			if (!row || row[1] !== rowId) continue;
			result.found = true;
			let flag = null;
			for (let j = i + 1; j < lines.length; j += 1) {
				if (/^- /u.test(lines[j])) break;
				const m = /^\s+disabled:\s*(true|false)\s*$/u.exec(lines[j]);
				if (m) { flag = m[1] === "true"; break; }
			}
			result.rows.push({ line: i + 1, disabled: flag });
			if (flag === true) result.disabled = true;
			if (flag === false) result.forced = true;
		}
	} catch (error) {
		result.error = String((error && error.code) || (error && error.message) || error);
	}
	return result;
}

function handleDiagnoseRoute(req, res) {
	if (!isLoopback(req)) { sendJson(res, 403, { ok: false, message: "仅允许本机访问" }); return; }
	if (req.method !== "GET") { res.writeHead(405, { allow: "GET" }); res.end(); return; }
	const profile = profileDir();
	const settingsFile = settingsPath();
	const marketPath = join(profile, ".dsh-market", "state.json");
	const patchPath = join(profile, "cordis.patch.yml");
	const market = { path: marketPath, disabled: false };
	try {
		const state = JSON.parse(readFileSync(marketPath, "utf8"));
		market.disabled = Array.isArray(state.disabled) && state.disabled.includes(name);
	} catch (error) {
		market.error = String((error && error.code) || (error && error.message) || error);
	}
	const patch = readPatchRowFlags(patchPath, "ui-skin-qingxiao");
	const patchInfo = { path: patchPath, found: patch.found, disabled: patch.disabled, forced: patch.forced, rows: patch.rows };
	if (patch.error) patchInfo.error = patch.error;
	sendJson(res, 200, {
		ok: true,
		profile,
		settingsPath: settingsFile,
		settingsExists: existsSync(settingsFile),
		market,
		patch: patchInfo
	});
}

let defaultBgCache = null;
function handleDefaultBackgroundRoute(req, res) {
	// 只回随包静态图、不含用户数据，但仍与其它路由保持一致：不对外提供探测面。
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
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
	if (!isLoopback(req)) {
		res.writeHead(403);
		res.end("forbidden");
		return;
	}
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
		sendJson(res, 403, { ok: false, message: "仅允许本机访问" });
		return;
	}
	if (req.method === "GET") {
		const cfg = readPersonaConfig();
		let preview = "";
		let previewTruncated = false;
		try {
			preview = buildPersonaBlock(cfg,
				cfg.includeSoul ? extractCore(readPersonaDoc("soul")) : "",
				cfg.includeStyle ? extractCore(readPersonaDoc("style")) : "",
				(findPersona(cfg.activeId) || builtinPersona()).name);
		} catch {}
		if (preview.length > MAX_PREVIEW_CHARS) {
			preview = preview.slice(0, MAX_PREVIEW_CHARS) + "\n\n…（预览已截断，完整内容见 AGENTS.md）";
			previewTruncated = true;
		}
		sendJson(res, 200, { ok: true, settings: cfg, injected: personaStatus(), agentsPath: agentsPath(), preview, previewTruncated });
		return;
	}
	if (req.method !== "PUT") {
		res.writeHead(405, { allow: "GET, PUT" });
		res.end();
		return;
	}
	if (rejectWrite(res, req)) return;
	try {
		const parsed = JSON.parse(await readBody(req));
		const settings = writePersonaConfig(parsed && parsed.settings);
		const applied = applyPersona();
		sendApplied(res, settings, applied);
	} catch (error) {
		sendWriteError(res, error);
	}
}

async function handlePersonaDocsRoute(req, res) {
	if (!isLoopback(req)) {
		sendJson(res, 403, { ok: false, message: "仅允许本机访问" });
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
	if (rejectWrite(res, req)) return;
	try {
		const parsed = JSON.parse(await readBody(req));
		if (typeof parsed.soul === "string") writePersonaDoc("soul", parsed.soul);
		if (typeof parsed.style === "string") writePersonaDoc("style", parsed.style);
		const applied = applyPersona();
		sendApplied(res, readPersonaConfig(), applied);
	} catch (error) {
		sendWriteError(res, error);
	}
}

async function handlePersonaApplyRoute(req, res) {
	if (!isLoopback(req)) {
		sendJson(res, 403, { ok: false, message: "仅允许本机访问" });
		return;
	}
	if (req.method !== "POST") {
		res.writeHead(405, { allow: "POST" });
		res.end();
		return;
	}
	// 无请求体，只校验来源，不校验 content-type。
	if (rejectCrossSite(res, req)) return;
	try {
		const applied = applyPersona();
		if (applied.error) {
			sendJson(res, 409, { ok: false, message: applied.message, applied });
			return;
		}
		sendJson(res, 200, { ok: true, applied });
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
		sendJson(res, 403, { ok: false, message: "仅允许本机访问" });
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
	if (rejectWrite(res, req)) return;
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
			sendApplied(res, settings, applyPersona(), personaListSummary());
		} else if (action === "setEnabled") {
			// 「不使用人格」= 关闭注入（保留 activeId，方便下次再开）
			if (typeof body.enabled !== "boolean") throw new Error("缺少 enabled");
			const settings = writePersonaConfig({ ...config, enabled: body.enabled });
			sendApplied(res, settings, applyPersona(), personaListSummary());
		} else if (action === "create") {
			const name = (typeof body.name === "string" && body.name.trim().slice(0, 40)) || "未命名人格";
			const entry = {
				id: newPersonaId(), name,
				soul: checkedDoc(body.soul, "soul"),
				style: checkedDoc(body.style, "style")
			};
			const list = readLibrary();
			list.push(entry);
			writeLibrary(list);
			const settings = writePersonaConfig({ ...config, activeId: entry.id, source: "custom" });
			sendApplied(res, settings, applyPersona(), { id: entry.id, ...personaListSummary() });
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
			sendApplied(res, readPersonaConfig(), isActive ? applyPersona() : { enabled: readPersonaConfig().enabled }, personaListSummary());
		} else if (action === "import") {
			const name = (typeof body.name === "string" && body.name.trim().slice(0, 40)) || "导入的人格";
			const entry = { id: newPersonaId(), name, soul: checkedDoc(body.soul, "soul"), style: checkedDoc(body.style, "style") };
			const list = readLibrary();
			list.push(entry);
			writeLibrary(list);
			const settings = writePersonaConfig({ ...config, activeId: entry.id, source: "custom" });
			sendApplied(res, settings, applyPersona(), { id: entry.id, ...personaListSummary() });
		} else if (action === "rename") {
			const list = readLibrary();
			const entry = list.find((p) => p.id === body.id);
			if (!entry) throw new Error("人格不存在（内置人格不参与重命名）");
			entry.name = (typeof body.name === "string" && body.name.trim().slice(0, 40)) || entry.name;
			writeLibrary(list);
			// 改名若命中的正是当前启用人格，注入块里的角色名也要跟着变，否则 AGENTS.md
			// 会留着旧名字直到下一次注入。
			const renamedActive = readPersonaConfig().activeId === entry.id;
			sendApplied(res, readPersonaConfig(), renamedActive ? applyPersona() : { enabled: readPersonaConfig().enabled }, personaListSummary());
		} else if (action === "delete") {
			const id = String(body.id || "");
			if (id === BUILTIN_PERSONA_ID) throw new Error("内置清宵不可删除");
			const before = readLibrary();
			const list = before.filter((p) => p.id !== id);
			if (list.length === before.length) throw new Error("人格不存在");
			writeLibrary(list);
			let settings = config;
			if (config.activeId === id) settings = writePersonaConfig({ ...config, activeId: BUILTIN_PERSONA_ID, source: "builtin" });
			sendApplied(res, settings, applyPersona(), personaListSummary());
		} else {
			throw new Error("未知操作");
		}
	} catch (error) {
		sendWriteError(res, error);
	}
}

// ── 0.6.0 媒体库：本地视频壁纸（profile 内文件 + Range 路由） ──
function mediaLimits() {
	const read = (name, fallback) => {
		const value = Number(process.env[name]);
		return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
	};
	return {
		maxVideo: read("DSH_QX_MEDIA_MAX_VIDEO", 64 * 1024 * 1024),
		maxPoster: read("DSH_QX_MEDIA_MAX_POSTER", 2 * 1024 * 1024),
		maxTotal: read("DSH_QX_MEDIA_MAX_TOTAL", 512 * 1024 * 1024),
		maxItems: read("DSH_QX_MEDIA_MAX_ITEMS", 8)
	};
}

function mediaDirPath() { return join(profileDir(), "data", SETTINGS_DIR, MEDIA_DIR); }
function mediaIndexPath() { return join(mediaDirPath(), MEDIA_INDEX); }
function mediaFilePath(id, mime) {
	const ext = MEDIA_MIME_EXT[mime];
	return ext ? join(mediaDirPath(), id + "." + ext) : null;
}
function mediaItemBytes(index) {
	return Object.values(index.items || {}).reduce((sum, item) => sum + (Number(item && item.bytes) || 0), 0);
}

// 只看字节，不信文件名/扩展名/声明类型。
function sniffVideo(buffer) {
	if (!buffer || buffer.length < 16) return null;
	if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
		const docType = buffer.indexOf(Buffer.from([0x42, 0x82]));
		if (docType >= 0) {
			const tail = buffer.toString("latin1", docType + 2, Math.min(buffer.length, docType + 48));
			if (tail.indexOf("webm") !== -1) return "video/webm";
		}
		return null;
	}
	const at = buffer.indexOf("ftyp", 0, "ascii");
	if (at >= 4 && at < 4096) {
		const brand = buffer.toString("latin1", at + 4, at + 8);
		const allowed = ["isom", "iso2", "iso4", "iso5", "iso6", "mp41", "mp42", "avc1", "M4V ", "dash"];
		const denied = ["qt  ", "heic", "heix", "mif1", "msf1", "avif", "avis"];
		if (denied.includes(brand)) return null;
		if (allowed.includes(brand)) return "video/mp4";
	}
	return null;
}

function sniffPoster(buffer) {
	if (!buffer || buffer.length < 12) return null;
	if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
		buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a) return "image/png";
	if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
	if (buffer.toString("latin1", 0, 4) === "RIFF" && buffer.toString("latin1", 8, 12) === "WEBP") return "image/webp";
	return null;
}

function scanMediaItems() {
	const items = {};
	let names = [];
	try { names = readdirSync(mediaDirPath()); } catch { return items; }
	for (const name of names) {
		const match = /^([a-f0-9]{32})\.(mp4|webm|jpg|png|webp)$/u.exec(name);
		if (!match) continue;
		try {
			const file = join(mediaDirPath(), name);
			const stat = statSync(file);
			if (!stat.isFile()) continue;
			const mime = MEDIA_EXT_MIME[match[2]];
			items[match[1]] = {
				kind: mime.startsWith("video/") ? "video" : "poster",
				mime, bytes: stat.size, name: "",
				createdAt: new Date(stat.mtimeMs).toISOString()
			};
		} catch { /* skip unreadable */ }
	}
	return items;
}

function readMediaIndex() {
	const file = mediaIndexPath();
	const valid = (value) => value && value.version === 1 && value.items && typeof value.items === "object" && !Array.isArray(value.items);
	try {
		const parsed = JSON.parse(readFileSync(file, "utf8"));
		if (!valid(parsed)) throw new Error("invalid media index");
		return { version: 1, items: parsed.items, corrupt: false };
	} catch (error) {
		if (error && error.code !== "ENOENT") {
			try {
				const backup = JSON.parse(readFileSync(file + ".bak", "utf8"));
				if (valid(backup)) return { version: 1, items: backup.items, corrupt: false };
			} catch { /* fall through to scan */ }
		}
		return { version: 1, items: scanMediaItems(), corrupt: Boolean(error && error.code !== "ENOENT") };
	}
}

function writeMediaIndex(index) {
	const file = mediaIndexPath();
	mkdirSync(dirname(file), { recursive: true });
	try { if (existsSync(file)) writeFileAtomic(file + ".bak", readFileSync(file, "utf8")); } catch { /* backup optional */ }
	writeFileAtomic(file, JSON.stringify(index));
}

let mediaLock = Promise.resolve();
function withMediaLock(run) {
	const next = mediaLock.then(run, run);
	mediaLock = next.catch(() => {});
	return next;
}

function sendJsonHead(res, status, value) {
	const data = Buffer.from(JSON.stringify(value), "utf8");
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"content-length": String(data.length)
	});
	res.end();
}

function parseRange(header, size) {
	if (!header) return null;
	const value = String(header).trim();
	if (value.indexOf(",") !== -1) return null; // 多段 Range：回完整 200
	const match = /^bytes=(\d*)-(\d*)$/u.exec(value);
	if (!match || (match[1] === "" && match[2] === "")) return { invalid: true };
	let start;
	let end;
	if (match[1] === "") {
		const suffix = Number(match[2]);
		if (!Number.isFinite(suffix) || suffix <= 0) return { invalid: true };
		start = Math.max(0, size - suffix);
		end = size - 1;
	} else {
		start = Number(match[1]);
		end = match[2] === "" ? size - 1 : Number(match[2]);
	}
	if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= size || end < start) return { invalid: true };
	return { start, end: Math.min(end, size - 1) };
}

async function handleMediaUpload(req, res) {
	const url = new URL(req.url, "http://127.0.0.1");
	const kind = url.searchParams.get("kind") || "video";
	if (kind !== "video" && kind !== "poster") {
		sendJson(res, 400, { ok: false, code: "bad-kind", message: "只支持 kind=video 或 kind=poster" });
		return;
	}
	const declared = String(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
	const allowedType = kind === "video"
		? (declared === "video/mp4" || declared === "video/webm" || declared === "application/octet-stream")
		: (declared === "image/jpeg" || declared === "image/png" || declared === "image/webp" || declared === "application/octet-stream");
	if (!allowedType) {
		sendJson(res, 415, {
			ok: false, code: "unsupported-type",
			message: kind === "video" ? "只接受 video/mp4、video/webm 或 application/octet-stream" : "只接受 image/jpeg、image/png、image/webp 或 application/octet-stream"
		});
		return;
	}
	const limits = mediaLimits();
	const maxBytes = kind === "video" ? limits.maxVideo : limits.maxPoster;
	const declaredLength = Number(req.headers["content-length"]);
	if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
		req.resume();
		sendJson(res, 413, { ok: false, code: "too-large", limitBytes: maxBytes });
		return;
	}
	mkdirSync(mediaDirPath(), { recursive: true });
	const id = randomBytes(16).toString("hex");
	const temp = join(mediaDirPath(), ".tmp-" + id);
	let fd;
	try { fd = openSync(temp, "wx", 0o600); }
	catch { sendJson(res, 507, { ok: false, code: "storage-full", message: "无法创建临时文件" }); return; }
	let total = 0;
	let head = Buffer.alloc(0);
	let mime = null;
	let tooLarge = false;
	let rejected = false;
	let writeError = null;
	try {
		for await (const chunk of req) {
			total += chunk.length;
			if (total > maxBytes) { tooLarge = true; continue; }
			if (!mime && !rejected) {
				if (head.length < 4096) head = Buffer.concat([head, chunk]).subarray(0, 4096);
				if (head.length >= 16) {
					const sniffed = kind === "video" ? sniffVideo(head) : sniffPoster(head);
					if (!sniffed || (declared !== "application/octet-stream" && declared !== sniffed)) rejected = true;
					else mime = sniffed;
				}
			}
			if (rejected || tooLarge) continue;
			writeSync(fd, chunk);
		}
	} catch (error) {
		writeError = error;
	} finally {
		try { fsyncSync(fd); } catch { /* ignore */ }
		try { closeSync(fd); } catch { /* ignore */ }
	}
	if (tooLarge) {
		try { unlinkSync(temp); } catch { /* ignore */ }
		sendJson(res, 413, { ok: false, code: "too-large", limitBytes: maxBytes });
		return;
	}
	if (writeError) {
		try { unlinkSync(temp); } catch { /* ignore */ }
		const storage = writeError.code === "ENOSPC" || writeError.code === "EDQUOT";
		sendJson(res, storage ? 507 : 500, { ok: false, code: storage ? "storage-full" : "write-failed", message: "写入失败" });
		return;
	}
	if (!mime) {
		mime = kind === "video" ? sniffVideo(head) : sniffPoster(head);
		if (mime && declared !== "application/octet-stream" && declared !== mime) rejected = true;
	}
	if (!mime || rejected || total === 0) {
		try { unlinkSync(temp); } catch { /* ignore */ }
		sendJson(res, 415, { ok: false, code: "unsupported-type", message: kind === "video" ? "不是有效的 MP4/WebM 视频" : "不是有效的 JPEG/PNG/WebP 图片" });
		return;
	}
	const name = String(url.searchParams.get("name") || "").replace(/[\\/:*?"<>|\r\n\t]/g, " ").trim().slice(0, 80);
	const item = { kind, mime, bytes: total, name, createdAt: new Date().toISOString() };
	let committed;
	try {
		committed = await withMediaLock(async () => {
			const index = readMediaIndex();
			const used = mediaItemBytes(index);
			if (used + total > limits.maxTotal || Object.keys(index.items).length >= limits.maxItems) return { error: "quota" };
			const file = mediaFilePath(id, mime);
			renameSync(temp, file);
			index.items[id] = item;
			try { writeMediaIndex(index); }
			catch (error) { try { unlinkSync(file); } catch { /* ignore */ } throw error; }
			return { id };
		});
	} catch {
		try { unlinkSync(temp); } catch { /* ignore */ }
		sendJson(res, 500, { ok: false, code: "index-failed", message: "媒体索引写入失败" });
		return;
	}
	if (committed.error === "quota") {
		try { unlinkSync(temp); } catch { /* ignore */ }
		const index = readMediaIndex();
		sendJson(res, 507, { ok: false, code: "quota-exceeded", usedBytes: mediaItemBytes(index), limitBytes: limits.maxTotal, maxItems: limits.maxItems });
		return;
	}
	sendJson(res, 201, { ok: true, id, kind, mime, bytes: total, name, createdAt: item.createdAt, src: MEDIA_ROUTE + "?id=" + id });
}

function handleMediaGet(req, res, id) {
	if (!MEDIA_ID_RE.test(id)) { sendJson(res, 404, { ok: false, message: "媒体不存在" }); return; }
	const index = readMediaIndex();
	const item = index.items[id];
	if (!item || item.pendingDelete) { sendJson(res, 404, { ok: false, message: "媒体不存在" }); return; }
	const file = mediaFilePath(id, item.mime);
	if (!file) { sendJson(res, 404, { ok: false, message: "媒体不存在" }); return; }
	let stat;
	try {
		const link = lstatSync(file);
		if (!link.isFile() || link.isSymbolicLink()) throw new Error("not a regular file");
		const real = realpathSync(file);
		const root = realpathSync(mediaDirPath());
		if (real !== root && !real.startsWith(root + sep)) throw new Error("outside media dir");
		stat = statSync(file);
		if (stat.size !== item.bytes) throw new Error("size mismatch");
	} catch { sendJson(res, 404, { ok: false, message: "媒体不存在" }); return; }
	const etag = '"' + id + '"';
	const cache = "private, max-age=31536000, immutable, no-transform";
	const headers = {
		"content-type": item.mime,
		"accept-ranges": "bytes",
		"etag": etag,
		"cache-control": cache,
		"x-content-type-options": "nosniff",
		"cross-origin-resource-policy": "same-origin",
		"content-disposition": 'inline; filename="' + id + "." + MEDIA_MIME_EXT[item.mime] + '"'
	};
	const inm = req.headers["if-none-match"];
	if (inm && String(inm).split(",").map((value) => value.trim().replace(/^W\//, "")).includes(etag)) {
		res.writeHead(304, { etag, "cache-control": cache });
		res.end();
		return;
	}
	if (req.method === "HEAD") {
		res.writeHead(200, Object.assign({}, headers, { "content-length": String(stat.size) }));
		res.end();
		return;
	}
	let range = null;
	const rangeHeader = req.headers["range"];
	const ifRange = req.headers["if-range"];
	if (rangeHeader && (!ifRange || String(ifRange).trim() === etag)) range = parseRange(rangeHeader, stat.size);
	if (range && range.invalid) {
		res.writeHead(416, Object.assign({}, headers, { "content-range": "bytes */" + stat.size, "content-length": "0" }));
		res.end();
		return;
	}
	const start = range ? range.start : 0;
	const end = range ? range.end : stat.size - 1;
	const status = range ? 206 : 200;
	const responseHeaders = Object.assign({}, headers, { "content-length": String(end - start + 1) });
	if (range) responseHeaders["content-range"] = "bytes " + start + "-" + end + "/" + stat.size;
	res.writeHead(status, responseHeaders);
	const stream = createReadStream(file, { start, end, autoClose: true });
	stream.on("error", () => { try { res.destroy(); } catch { /* ignore */ } });
	req.on("close", () => { try { stream.destroy(); } catch { /* ignore */ } });
	stream.pipe(res);
}

function handleMediaList(req, res) {
	const index = readMediaIndex();
	const settings = readSettings();
	const refs = {};
	const addRef = (id, key) => { if (id) (refs[id] = refs[id] || []).push(key); };
	addRef(settings.lightVideoId, "lightVideoId");
	addRef(settings.darkVideoId, "darkVideoId");
	addRef(settings.lightVideoPosterId, "lightVideoPosterId");
	addRef(settings.darkVideoPosterId, "darkVideoPosterId");
	const items = Object.entries(index.items).map(([id, item]) => Object.assign({ id }, item, { refs: refs[id] || [] }));
	const limits = mediaLimits();
	const payload = {
		ok: true,
		usedBytes: mediaItemBytes(index),
		limitBytes: limits.maxTotal,
		maxItems: limits.maxItems,
		items,
		corrupt: index.corrupt || undefined
	};
	if (req.method === "HEAD") sendJsonHead(res, 200, payload);
	else sendJson(res, 200, payload);
}

async function handleMediaDelete(req, res, id) {
	if (!MEDIA_ID_RE.test(id)) { sendJson(res, 404, { ok: false, message: "媒体不存在" }); return; }
	const url = new URL(req.url, "http://127.0.0.1");
	const force = url.searchParams.get("force") === "1";
	const result = await withMediaLock(async () => {
		const index = readMediaIndex();
		const item = index.items[id];
		if (!item) return { missing: true };
		const settings = readSettings();
		const refKeys = ["lightVideoId", "darkVideoId", "lightVideoPosterId", "darkVideoPosterId"].filter((key) => settings[key] === id);
		if (refKeys.length && !force) return { inUse: true, refs: refKeys };
		if (refKeys.length) {
			for (const key of refKeys) settings[key] = null;
			writeSettings(settings);
		}
		const file = mediaFilePath(id, item.mime);
		let pending = false;
		if (file) {
			try { unlinkSync(file); }
			catch (error) {
				if (error.code === "ENOENT") { /* already gone */ }
				else if (error.code === "EBUSY" || error.code === "EPERM") pending = true;
				else return { error: true };
			}
		}
		if (pending) {
			item.pendingDelete = true;
			index.items[id] = item;
			writeMediaIndex(index);
			return { pending: true };
		}
		delete index.items[id];
		writeMediaIndex(index);
		return { removed: true, usedBytes: mediaItemBytes(index) };
	});
	if (result.missing) { sendJson(res, 200, { ok: true, removed: true, usedBytes: mediaItemBytes(readMediaIndex()) }); return; }
	if (result.inUse) { sendJson(res, 409, { ok: false, code: "in-use", refs: result.refs }); return; }
	if (result.error) { sendJson(res, 500, { ok: false, code: "delete-failed" }); return; }
	if (result.pending) { sendJson(res, 202, { ok: true, pending: true, usedBytes: mediaItemBytes(readMediaIndex()) }); return; }
	sendJson(res, 200, { ok: true, removed: true, usedBytes: result.usedBytes });
}

async function handleMediaRoute(req, res) {
	if (!isLoopback(req)) { sendJson(res, 403, { ok: false, message: "仅允许本机访问" }); return; }
	if (rejectCrossSite(res, req)) return;
	const url = new URL(req.url, "http://127.0.0.1");
	const id = url.searchParams.get("id");
	if (req.method === "PUT") { await handleMediaUpload(req, res); return; }
	if (req.method === "DELETE") { await handleMediaDelete(req, res, id || ""); return; }
	if (req.method === "GET" || req.method === "HEAD") {
		if (id) handleMediaGet(req, res, id);
		else handleMediaList(req, res);
		return;
	}
	res.writeHead(405, { allow: "GET, HEAD, PUT, DELETE" });
	res.end();
}

// 保守 GC：只清 1 小时前的 .tmp-* 和 pendingDelete；不删索引外的未知文件。
function sweepMediaStore() {
	try {
		mkdirSync(mediaDirPath(), { recursive: true });
		const index = readMediaIndex();
		if (index.corrupt) return;
		let names = [];
		try { names = readdirSync(mediaDirPath()); } catch { names = []; }
		const cutoff = Date.now() - 60 * 60 * 1000;
		for (const name of names) {
			if (!name.startsWith(".tmp-")) continue;
			try {
				const stat = statSync(join(mediaDirPath(), name));
				if (stat.mtimeMs < cutoff) unlinkSync(join(mediaDirPath(), name));
			} catch { /* ignore */ }
		}
		let changed = false;
		for (const [id, item] of Object.entries(index.items)) {
			if (!item || !item.pendingDelete) continue;
			const file = mediaFilePath(id, item.mime);
			if (file) {
				try { unlinkSync(file); }
				catch (error) { if (error.code !== "ENOENT") continue; }
			}
			delete index.items[id];
			changed = true;
		}
		if (changed) writeMediaIndex(index);
	} catch { /* best effort */ }
}

function apply(ctx) {
	migratePersonaLibrary();
	const disposers = [];
	const add = (path, handler) => {
		disposers.push(ctx.webServer.register({ kind: "exact", path, handler }));
	};
	add(SETTINGS_ROUTE, handleSettingsRoute);
	add(DIAGNOSE_ROUTE, handleDiagnoseRoute);
	add(DEFAULT_BG_ROUTE, handleDefaultBackgroundRoute);
	add(LINEART_ROUTE, handleLineartRoute);
	add(PERSONA_ROUTE, handlePersonaRoute);
	add(PERSONA_DOCS_ROUTE, handlePersonaDocsRoute);
	add(PERSONA_APPLY_ROUTE, handlePersonaApplyRoute);
	add(PERSONA_LIBRARY_ROUTE, handlePersonaLibraryRoute);
	add(MEDIA_ROUTE, handleMediaRoute);
	try { sweepMediaStore(); } catch { /* best effort */ }
	return () => {
		for (const dispose of disposers) { try { dispose(); } catch { /* ignore */ } }
	};
}

export { apply, inject, name };
