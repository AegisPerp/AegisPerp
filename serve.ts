// Lightweight standalone server for the HYPERPERP landing page.
// It only serves the bundled frontend + static coin logos — no SQLite / price
// service / matching engine — so it always boots regardless of backend deps.
// Run:  bun --hot serve.ts   (or `bun dev`)   →   http://localhost:3002
import index from "./src/index.html";

const PORT = Number(process.env.PORT || 3002);
const MAINTENANCE_FLAG = import.meta.dir + "/.maintenance";

const maintenancePage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>HYPERPERP — Maintenance</title>
  <link rel="icon" type="image/png" href="/logo.png"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
         background:#0a0a0a;color:#fff;font-family:'DM Sans',system-ui,sans-serif;
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
    <img class="logo" src="/logo.png" alt="HYPERPERP"/>
    <h1>HYPER<span>PERP</span></h1>
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

let server: ReturnType<typeof Bun.serve>;

server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  routes: {
    "/logos/:f": (req) => staticFile(`public/logos/${(req.params as any).f}`),
    "/tokens/:f": (req) => staticFile(`public/tokens/${(req.params as any).f}`),
    "/brand/:f": (req) => staticFile(`public/brand/${(req.params as any).f}`),
    "/logo.jpeg": () => staticFile("public/logo.png"),
    "/logo.png": () => staticFile("public/logo.png"),

    "/ws/prices": (req) => {
      if ((server as any).upgrade(req)) return undefined as any;
      return new Response("WebSocket upgrade failed", { status: 400 });
    },

    "/*": async (req) => {
      if (await isMaintenanceMode()) return maintenanceResponse();
      return index;
    },
  },
  websocket: { open() {}, message() {}, close() {} },
  development: process.env.NODE_ENV !== "production" && { hmr: true, console: true },
});

console.log(`HYPERPERP landing → http://localhost:${PORT}`);
