// Lightweight standalone server for the AEGISPERP landing page.
// It only serves the bundled frontend + static coin logos — no SQLite / price
// service / matching engine — so it always boots regardless of backend deps.
// Run:  bun --hot serve.ts   (or `bun dev`)   →   http://localhost:3007

const PORT = Number(process.env.PORT || 3007);
const MAINTENANCE_FLAG = import.meta.dir + "/.maintenance";

const maintenancePage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>AEGISPERP — Maintenance</title>
  <link rel="icon" type="image/png" href="/logo.png"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
         background:#0a0a0a;color:#fff;font-family:'Inter',system-ui,sans-serif;
         text-align:center;padding:24px}
    .card{max-width:480px}
    .logo{width:80px;height:auto;margin-bottom:24px;
          filter:drop-shadow(0 0 24px rgba(200,164,21,.4))}
    h1{font-size:28px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px}
    h1 span{color:#c8a415}
    p{color:#94a3b8;font-size:16px;line-height:1.6;margin-bottom:24px}
    .pulse{width:12px;height:12px;border-radius:50%;background:#c8a415;
           display:inline-block;margin-right:8px;animation:pulse 1.5s ease-in-out infinite}
    .status{font-size:14px;color:#64748b;display:flex;align-items:center;justify-content:center}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
  </style>
</head>
<body>
  <div class="card">
    <img class="logo" src="/logo.png" alt="AEGISPERP"/>
    <h1>AEGIS<span>PERP</span></h1>
    <p>We're upgrading our systems to serve you better.<br/>Please check back shortly.</p>
    <div class="status"><span class="pulse"></span>Maintenance in progress</div>
  </div>
</body>
</html>`;

async function isMaintenanceMode(): Promise<boolean> {
  return Bun.file(MAINTENANCE_FLAG).exists();
}

function maintenanceResponse(): Response {
  return new Response(maintenancePage, {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8", "Retry-After": "300" },
  });
}

async function staticFile(path: string): Promise<Response> {
  const file = Bun.file(path);
  if (await file.exists()) return new Response(file);
  return new Response("Not found", { status: 404 });
}

const DIST = import.meta.dir + "/dist";
const HASHED = /-[a-z0-9]{8}\.(js|css|png|jpg|svg|woff2?)$/i;

let server: ReturnType<typeof Bun.serve>;

server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    const logosMatch = path.match(/^\/logos\/(.+)$/);
    if (logosMatch) return staticFile(`public/logos/${logosMatch[1]}`);

    const tokensMatch = path.match(/^\/tokens\/(.+)$/);
    if (tokensMatch) return staticFile(`public/tokens/${tokensMatch[1]}`);

    const brandMatch = path.match(/^\/brand\/(.+)$/);
    if (brandMatch) return staticFile(`public/brand/${brandMatch[1]}`);

    if (path === "/logo.jpeg" || path === "/logo.png") return staticFile("public/logo.png");

    if (path === "/ws/prices") {
      if (server.upgrade(req)) return undefined as any;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    if (await isMaintenanceMode()) return maintenanceResponse();

    // Serve from pre-built dist/
    let filePath = path === "/" ? "/index.html" : decodeURIComponent(path);
    let file = Bun.file(DIST + filePath);
    if (!(await file.exists())) {
      file = Bun.file(DIST + "/index.html");
      filePath = "/index.html";
    }
    const headers: Record<string, string> = {
      "Content-Type": file.type || "application/octet-stream",
    };
    headers["Cache-Control"] = HASHED.test(filePath)
      ? "public, max-age=31536000, immutable"
      : "public, max-age=60";
    return new Response(file, { headers });
  },
  websocket: { open() {}, message() {}, close() {} },
});

console.log(`AEGISPERP landing → http://localhost:${PORT}`);
