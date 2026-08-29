// Dev-only preview server: serves preview/mockup.html plus the two api routes
// the skin registers in production (settings persistence + default artwork).
// Usage: node preview/dev-server.mjs [port]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname, extname } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const port = Number(process.argv[2]) || 8931;
const mime = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".jpg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
	".json": "application/json"
};

const server = createServer(async (req, res) => {
	const url = new URL(req.url, "http://127.0.0.1");
	if (url.pathname === "/api/dsh-qingxiao/default-background") {
		const jpg = await readFile(join(root, "assets", "qx.jpg"));
		res.writeHead(200, { "content-type": "image/jpeg", "cache-control": "no-store" });
		res.end(jpg);
		return;
	}
	if (url.pathname === "/api/dsh-qingxiao/settings") {
		res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
		res.end(JSON.stringify({ ok: true, settings: {} }));
		return;
	}
	let path = url.pathname === "/" ? "/preview/mockup.html" : url.pathname;
	try {
		const data = await readFile(join(root, path));
		res.writeHead(200, { "content-type": mime[extname(path)] || "application/octet-stream" });
		res.end(data);
	} catch {
		res.writeHead(404);
		res.end("not found");
	}
});

server.listen(port, "127.0.0.1", () => {
	console.log(`qingxiao preview server: http://127.0.0.1:${port}/`);
});
