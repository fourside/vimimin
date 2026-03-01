import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 8932;
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const fixturesDir = resolve(__dirname, "fixtures");

const MIME = {
	".html": "text/html",
	".css": "text/css",
	".js": "application/javascript",
};

const server = createServer(async (req, res) => {
	const filePath = resolve(fixturesDir, (req.url ?? "/").slice(1));
	if (!filePath.startsWith(fixturesDir)) {
		res.writeHead(403);
		res.end("Forbidden");
		return;
	}
	try {
		const data = await readFile(filePath);
		const ext = extname(filePath);
		res.writeHead(200, {
			"Content-Type": MIME[ext] ?? "application/octet-stream",
		});
		res.end(data);
	} catch {
		res.writeHead(404);
		res.end("Not Found");
	}
});

server.listen(PORT, () => {
	console.log(`Fixture server running on http://localhost:${PORT}`);
});
