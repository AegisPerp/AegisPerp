// Lightweight standalone server for the HyperPerp landing page.
// It only serves the bundled frontend + static coin logos — no SQLite / price
// service / matching engine — so it always boots regardless of backend deps.
// Run:  bun --hot serve.ts   (or `bun dev`)   →   http://localhost:3002
import index from "./src/index.html";

const PORT = Number(process.env.PORT || 3018);

async function staticFile(path: string): Promise<Response> {
  const file = Bun.file(path);
  if (await file.exists()) return new Response(file);
  return new Response("Not found", { status: 404 });
}

let server: ReturnType<typeof Bun.serve>;

server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0", // listen on all interfaces so it's reachable externally
  routes: {
    // official coin logos + brand assets from /public
    "/logos/:f": (req) => staticFile(`public/logos/${(req.params as any).f}`),
    "/tokens/:f": (req) => staticFile(`public/tokens/${(req.params as any).f}`),
    "/brand/:f": (req) => staticFile(`public/brand/${(req.params as any).f}`),
    "/logo.jpeg": () => staticFile("public/logo.jpeg"),

    // optional realtime socket (no publisher here; the UI falls back to its
    // built-in smooth simulation when no messages arrive)
    "/ws/prices": (req) => {
      if ((server as any).upgrade(req)) return undefined as any;
      return new Response("WebSocket upgrade failed", { status: 400 });
    },

    // everything else → the bundled single-page app
    "/*": index,
  },
  websocket: { open() {}, message() {}, close() {} },
  development: process.env.NODE_ENV !== "production" && { hmr: true, console: true },
});

console.log(`HyperPerp landing → http://localhost:${PORT}`);
