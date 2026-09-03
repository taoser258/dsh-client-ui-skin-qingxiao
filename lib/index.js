import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const name = "@taosee258/dsh-client-ui-skin-qingxiao";
const inject = ["webServer"];
const SETTINGS_ROUTE = "/api/dsh-qingxiao/settings";
const DEFAULT_BG_ROUTE = "/api/dsh-qingxiao/default-background";
const SETTINGS_DIR = "dsh-client-ui-skin-qingxiao";
const SETTINGS_FILE = "settings.json";
const DEFAULT_BG_FILE = fileURLToPath(new URL("../assets/qx.jpg", import.meta.url));
const MAX_BODY_BYTES = 15 * 1024 * 1024;
const MAX_BACKGROUND_BYTES = 7 * 1024 * 1024;

const BOOLEAN_KEYS = [
	"textContrastBoost", "panelBlur", "goldTrim",
	"particles", "lightCharms", "darkCharms",
	// v0.1.4 毛玻璃虚化：总开关 + 插件窗/原生面板两个分项
	"frostMaster", "frostPlugin", "frostNative"
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
	const profile = process.env.DSH_DESKTOP_PROFILE;
	return profile && /^[A-Za-z0-9_-]+$/.test(profile) ? profile : "web";
}

function profileDir() {
	return join(process.env.DSH_HOME || join(homedir(), ".dsh"), "profiles", profileName());
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

function apply(ctx) {
	ctx.webServer.register({ kind: "exact", path: SETTINGS_ROUTE, handler: handleSettingsRoute });
	return ctx.webServer.register({ kind: "exact", path: DEFAULT_BG_ROUTE, handler: handleDefaultBackgroundRoute });
}

export { apply, inject, name };
