// Serves the PRE-BUILT static site in ./dist — no bundler, no backend, no
// TypeScript compilation at request time. Gzips text assets so the JS bundle
// transfers fast. Build first with `bun run build:web` (or just `bun dev`).
const DIST = import.meta.dir + "/dist";
const PORT = Number(process.env.PORT || 3018);
const COMPRESSIBLE = /\.(js|css|html|svg|json|map|txt|ico)$/i;
const HASHED = /-[a-z0-9]{8}\.(js|css)$/i;

Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    let file = Bun.file(DIST + path);
    if (!(await file.exists())) {
      file = Bun.file(DIST + "/index.html"); // SPA fallback
      path = "/index.html";
    }
    const headers: Record<string, string> = {
      "Content-Type": file.type || "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
    };
    headers["Cache-Control"] = HASHED.test(path)
      ? "public, max-age=31536000, immutable"
      : "public, max-age=60";

    const accept = req.headers.get("accept-encoding") || "";
    if (COMPRESSIBLE.test(path) && accept.includes("gzip")) {
      const gz = Bun.gzipSync(new Uint8Array(await file.arrayBuffer()));
      headers["Content-Encoding"] = "gzip";
      headers["Vary"] = "Accept-Encoding";
      return new Response(gz, { headers });
    }
    return new Response(file, { headers });
  },
});

console.log(`AXISPERP (static) → http://0.0.0.0:${PORT}  (open http://194.233.84.10:${PORT})`);
