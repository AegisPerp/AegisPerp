import { serve } from "bun";
import db from "./db/database";
import { startPriceService, getCachedPrices, getCachedPrice, subscribe } from "./services/priceService";
import { openPosition, closePosition } from "./services/matchingEngine";
import { startLiquidationChecker, setLiquidationCallback } from "./services/liquidation";
import { calcFundingRate } from "./services/fundingRate";

const PORT = Number(process.env.BACKEND_PORT || 3018);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function error(msg: string, status = 400) {
  return json({ error: msg }, status);
}

const server = serve({
  port: PORT,

  routes: {
    "/api/markets": {
      GET(req) {
        const url = new URL(req.url);
        const status = url.searchParams.get("status");
        const sort = url.searchParams.get("sort") || "volume";
        const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
        const offset = Number(url.searchParams.get("offset") || 0);

        let query = "SELECT * FROM markets WHERE 1=1";
        const params: any[] = [];

        if (status) {
          query += " AND status = ?";
          params.push(status);
        }

        if (sort === "volume") query += " ORDER BY cumulative_vol DESC";
        else if (sort === "new") query += " ORDER BY created_at DESC";
        else query += " ORDER BY cumulative_vol DESC";

        query += " LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const markets = db.query(query).all(...params);
        const total = db.query("SELECT COUNT(*) as cnt FROM markets").get() as any;

        return json({ markets, total: total.cnt });
      },

      async POST(req) {
        const body = await req.json();
        const { token_mint, token_symbol, token_name, max_leverage, trading_fee, creator_wallet, launch_tx } = body;

        if (!token_mint || !token_symbol || !token_name || !creator_wallet) {
          return error("Missing required fields");
        }

        const slug = token_symbol.toLowerCase();
        const existing = db.query("SELECT id FROM markets WHERE slug = ?").get(slug);
        if (existing) return error("Market already exists for this token");

        const leverage = Math.min(Math.max(Number(max_leverage) || 50, 2), 100);
        const fee = Math.min(Math.max(Number(trading_fee) || 25, 3), 100);
        const virtualDepth = 120000 * (leverage / 25);

        const id = crypto.randomUUID().slice(0, 16);
        db.query(`
          INSERT INTO markets (id, slug, token_mint, token_symbol, token_name, max_leverage, trading_fee, creator, launch_tx, virtual_depth)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, slug, token_mint, token_symbol, token_name, leverage, fee, creator_wallet, launch_tx || null, virtualDepth);

        db.query("UPDATE platform_stats SET total_markets = total_markets + 1 WHERE id = 1").run();

        const market = db.query("SELECT * FROM markets WHERE id = ?").get(id);
        return json({ market }, 201);
      },
    },

    "/api/markets/:slug": {
      GET(req) {
        const slug = req.params.slug;
        const market = db.query("SELECT * FROM markets WHERE slug = ?").get(slug);
        if (!market) return error("Market not found", 404);

        const stats = db.query(`
          SELECT COUNT(*) as trade_count, COALESCE(SUM(size), 0) as volume_24h
          FROM trades WHERE market_id = ? AND executed_at > datetime('now', '-24 hours')
        `).get((market as any).id);

        return json({ market, stats });
      },
    },

    "/api/markets/:slug/trades": {
      GET(req) {
        const slug = req.params.slug;
        const market = db.query("SELECT id FROM markets WHERE slug = ?").get(slug) as any;
        if (!market) return error("Market not found", 404);

        const url = new URL(req.url);
        const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
        const offset = Number(url.searchParams.get("offset") || 0);

        const trades = db.query(`
          SELECT * FROM trades WHERE market_id = ? ORDER BY executed_at DESC LIMIT ? OFFSET ?
        `).all(market.id, limit, offset);

        return json({ trades });
      },
    },

    "/api/prices": {
      GET() {
        return json({ prices: getCachedPrices() });
      },
    },

    "/api/prices/:mint": {
      GET(req) {
        const price = getCachedPrice(req.params.mint);
        if (!price) return error("Price not found", 404);
        return json(price);
      },
    },

    "/api/positions": {
      GET(req) {
        const url = new URL(req.url);
        const wallet = url.searchParams.get("wallet");
        const status = url.searchParams.get("status");
        const marketSlug = url.searchParams.get("market");

        if (!wallet) return error("wallet required");

        let query = "SELECT p.*, m.slug, m.token_symbol FROM positions p JOIN markets m ON p.market_id = m.id WHERE p.wallet = ?";
        const params: any[] = [wallet];

        if (status) { query += " AND p.status = ?"; params.push(status); }
        if (marketSlug) {
          query += " AND m.slug = ?"; params.push(marketSlug);
        }

        query += " ORDER BY p.opened_at DESC";
        const positions = db.query(query).all(...params);
        return json({ positions });
      },
    },

    "/api/positions/open": {
      async POST(req) {
        const body = await req.json();
        try {
          const result = openPosition({
            marketId: body.market_id,
            wallet: body.wallet,
            side: body.side,
            leverage: body.leverage,
            collateral: body.collateral,
            orderType: body.order_type || "market",
            triggerPrice: body.trigger_price,
          });
          return json(result, 201);
        } catch (e: any) {
          return error(e.message);
        }
      },
    },

    "/api/positions/:id/close": {
      async POST(req) {
        const body = await req.json();
        try {
          const result = closePosition(req.params.id, body.wallet);
          return json(result);
        } catch (e: any) {
          return error(e.message);
        }
      },
    },

    "/api/positions/:id": {
      GET(req) {
        const pos = db.query("SELECT * FROM positions WHERE id = ?").get(req.params.id) as any;
        if (!pos) return error("Position not found", 404);

        const market = db.query("SELECT * FROM markets WHERE id = ?").get(pos.market_id) as any;
        const cached = getCachedPrice(market?.token_mint);
        let currentPnl = 0;
        if (cached && pos.status === "open") {
          currentPnl = pos.side === "long"
            ? ((cached.price - pos.entry_price) / pos.entry_price) * pos.size
            : ((pos.entry_price - cached.price) / pos.entry_price) * pos.size;
        }

        return json({ position: pos, market, current_pnl: currentPnl });
      },
    },

    "/api/orders": {
      GET(req) {
        const url = new URL(req.url);
        const wallet = url.searchParams.get("wallet");
        if (!wallet) return error("wallet required");

        const orders = db.query(`
          SELECT o.*, m.slug, m.token_symbol FROM orders o
          JOIN markets m ON o.market_id = m.id
          WHERE o.wallet = ? AND o.status = 'pending'
          ORDER BY o.created_at DESC
        `).all(wallet);
        return json({ orders });
      },

      async POST(req) {
        const body = await req.json();
        const { market_id, wallet, order_type, side, leverage, collateral, trigger_price } = body;

        if (!market_id || !wallet || !order_type || !side || !leverage || !collateral) {
          return error("Missing fields");
        }

        if (order_type === "market") {
          try {
            const result = openPosition({ marketId: market_id, wallet, side, leverage, collateral, orderType: "market" });
            return json(result, 201);
          } catch (e: any) {
            return error(e.message);
          }
        }

        const id = crypto.randomUUID().slice(0, 16);
        db.query(`
          INSERT INTO orders (id, market_id, wallet, order_type, side, leverage, collateral, trigger_price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, market_id, wallet, order_type, side, leverage, collateral, trigger_price || null);

        const order = db.query("SELECT * FROM orders WHERE id = ?").get(id);
        return json({ order }, 201);
      },
    },

    "/api/orders/:id": {
      async DELETE(req) {
        const body = await req.json();
        const order = db.query("SELECT * FROM orders WHERE id = ? AND wallet = ?").get(req.params.id, body.wallet);
        if (!order) return error("Order not found", 404);

        db.query("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(req.params.id);
        return json({ success: true });
      },
    },

    "/api/stats": {
      GET() {
        const stats = db.query("SELECT * FROM platform_stats WHERE id = 1").get();
        return json(stats);
      },
    },

    "/api/earnings/:wallet": {
      GET(req) {
        const url = new URL(req.url);
        const market = url.searchParams.get("market");

        let query = "SELECT ce.*, m.slug, m.token_symbol FROM creator_earnings ce JOIN markets m ON ce.market_id = m.id WHERE ce.wallet = ?";
        const params: any[] = [req.params.wallet];

        if (market) {
          query += " AND m.slug = ?";
          params.push(market);
        }

        query += " ORDER BY ce.earned_at DESC";
        const earnings = db.query(query).all(...params);
        const total = earnings.reduce((sum: number, e: any) => sum + e.amount, 0);

        return json({ earnings, total });
      },
    },

    "/api/leaderboard": {
      GET(req) {
        const url = new URL(req.url);
        const period = url.searchParams.get("period") || "24h";
        const limit = Math.min(Number(url.searchParams.get("limit") || 20), 100);

        let interval = "-24 hours";
        if (period === "7d") interval = "-7 days";
        if (period === "30d") interval = "-30 days";

        const markets = db.query(`
          SELECT m.*, COALESCE(SUM(t.size), 0) as period_volume
          FROM markets m
          LEFT JOIN trades t ON t.market_id = m.id AND t.executed_at > datetime('now', ?)
          GROUP BY m.id
          ORDER BY period_volume DESC
          LIMIT ?
        `).all(interval, limit);

        return json({ markets });
      },
    },
  },

  websocket: {
    open(ws) {
      ws.subscribe("prices");
    },
    message(ws, message) {
      try {
        const data = JSON.parse(String(message));
        if (data.action === "subscribe" && data.markets) {
          for (const m of data.markets) {
            ws.subscribe(`market:${m}`);
          }
        }
      } catch {}
    },
    close(ws) {},
  },

  fetch(req, server) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/ws/prices") {
      if (server.upgrade(req)) return undefined;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

subscribe((data) => {
  server.publish("prices", JSON.stringify(data));
  server.publish(`market:${data.market}`, JSON.stringify(data));
});

setLiquidationCallback((data) => {
  server.publish("prices", JSON.stringify({ type: "liquidation", ...data }));
});

startPriceService();
startLiquidationChecker();

console.log(`Backend API running at http://localhost:${PORT}`);
