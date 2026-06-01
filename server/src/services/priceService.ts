import db from "../db/database";

const JUPITER_API = process.env.JUPITER_PRICE_API || "https://api.jup.ag/price/v2";
const REFRESH_INTERVAL = 5000;

let priceInterval: ReturnType<typeof setInterval> | null = null;
let subscribers: Set<(data: any) => void> = new Set();

export async function fetchPrices(mints: string[]): Promise<Record<string, { price: number; change24h: number }>> {
  try {
    const url = `${JUPITER_API}?ids=${mints.join(",")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Jupiter API error: ${res.status}`);
    const json = await res.json() as any;

    const result: Record<string, { price: number; change24h: number }> = {};
    for (const [mint, data] of Object.entries(json.data || {})) {
      const d = data as any;
      result[mint] = {
        price: Number(d.price) || 0,
        change24h: 0,
      };
    }
    return result;
  } catch (e) {
    console.error("Price fetch error:", e);
    return {};
  }
}

export function getCachedPrices(): any[] {
  return db.query("SELECT * FROM price_cache ORDER BY symbol ASC").all();
}

export function getCachedPrice(mint: string): any {
  return db.query("SELECT * FROM price_cache WHERE token_mint = ?").get(mint);
}

export function updatePriceCache(mint: string, symbol: string, price: number, change24h: number, volume24h: number) {
  db.query(`
    INSERT INTO price_cache (token_mint, symbol, price, change_24h, volume_24h, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(token_mint) DO UPDATE SET
      price = excluded.price,
      change_24h = excluded.change_24h,
      volume_24h = excluded.volume_24h,
      updated_at = datetime('now')
  `).run(mint, symbol, price, change24h, volume24h);
}

export function subscribe(cb: (data: any) => void) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export function startPriceService() {
  if (priceInterval) return;

  const refreshPrices = async () => {
    const markets = db.query("SELECT token_mint, token_symbol FROM markets WHERE status != 'retired'").all() as any[];
    if (markets.length === 0) return;

    const mints = markets.map(m => m.token_mint);
    const prices = await fetchPrices(mints);

    for (const market of markets) {
      const priceData = prices[market.token_mint];
      if (priceData) {
        updatePriceCache(market.token_mint, market.token_symbol, priceData.price, priceData.change24h, 0);
        for (const cb of subscribers) {
          cb({ market: market.token_symbol.toLowerCase(), price: priceData.price, change24h: priceData.change24h });
        }
      }
    }
  };

  refreshPrices();
  priceInterval = setInterval(refreshPrices, REFRESH_INTERVAL);
}
