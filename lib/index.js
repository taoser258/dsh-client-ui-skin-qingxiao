import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join } from "node:path";
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
