import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SOURCES } from "./sources";

export interface Market {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  openInterest: number;
  leverage: number;
  logo: string;
  spark: number[];
}
export interface IndexStat { price: number; change24h: number; }

const L = (s: string) => `/logos/${s}.png`;

// Tradable perp markets ($HYPERP itself is NOT tradable — it's the brand index).
// Seed prices are placeholders shown until the first realtime tick arrives.
const SEED: Omit<Market, "spark">[] = [
  { symbol: "SOL",    name: "Solana",          price: 142.5,     change24h: 0, volume24h: 1_250_000, openInterest: 4_200_000, leverage: 100, logo: L("SOL") },
  { symbol: "WIF",    name: "dogwifhat",       price: 1.847,     change24h: 0, volume24h: 670_000,   openInterest: 980_000,   leverage: 75,  logo: L("WIF") },
  { symbol: "BONK",   name: "Bonk",            price: 0.0000234, change24h: 0, volume24h: 890_000,   openInterest: 1_100_000, leverage: 50,  logo: L("BONK") },
  { symbol: "JUP",    name: "Jupiter",         price: 0.89,      change24h: 0, volume24h: 540_000,   openInterest: 760_000,   leverage: 50,  logo: L("JUP") },
  { symbol: "PYTH",   name: "Pyth Network",    price: 0.34,      change24h: 0, volume24h: 320_000,   openInterest: 410_000,   leverage: 25,  logo: L("PYTH") },
  { symbol: "JTO",    name: "Jito",            price: 2.41,      change24h: 0, volume24h: 280_000,   openInterest: 350_000,   leverage: 50,  logo: L("JTO") },
  { symbol: "RENDER", name: "Render",          price: 7.32,      change24h: 0, volume24h: 240_000,   openInterest: 300_000,   leverage: 25,  logo: L("RENDER") },
  { symbol: "POPCAT", name: "Popcat",          price: 0.92,      change24h: 0, volume24h: 240_000,   openInterest: 300_000,   leverage: 25,  logo: L("POPCAT") },
  { symbol: "MEW",    name: "cat in a dogs world", price: 0.0084, change24h: 0, volume24h: 130_000,  openInterest: 180_000,   leverage: 25,  logo: L("MEW") },
];
function initMarkets(): Market[] { return SEED.map((m) => ({ ...m, spark: [m.price] })); }

interface FeedValue {
  markets: Market[];
  hyperp: IndexStat;
  connected: boolean;
  source: string;
  selected: string;
  setSelected: (s: string) => void;
  bySymbol: (s: string) => Market | undefined;
}
const FeedCtx = createContext<FeedValue | null>(null);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Market[]>(initMarkets);
  const [hyperp, setHyperp] = useState<IndexStat>({ price: 24.8, change24h: 0 });
  const [connected, setConnected] = useState(false);
  const [source, setSource] = useState("connecting…");
  const [selected, setSelected] = useState("SOL");
  const ref = useRef<Market[]>(markets);
  ref.current = markets;
  const alpRef = useRef(hyperp);
  alpRef.current = hyperp;
  const live = useRef<Record<string, { price?: number; change?: number }>>({});

  // 1s render tick: apply the latest realtime values (no simulation).
  useEffect(() => {
    const id = setInterval(() => {
      const prev = ref.current;
      let changed = false;
      const next = prev.map((m) => {
        const ext = live.current[m.symbol];
        if (ext?.price && isFinite(ext.price)) {
          const round = ext.price < 1 ? +ext.price.toFixed(9) : +ext.price.toFixed(4);
          const change = ext.change != null && isFinite(ext.change) ? +ext.change.toFixed(2) : m.change24h;
          if (round !== m.price || change !== m.change24h) {
            changed = true;
            return { ...m, price: round, change24h: change, spark: [...m.spark.slice(-39), round] };
          }
        }
        return m;
      });
      if (!changed) return;
      setMarkets(next);
      // $HYPERP brand index = average of the live markets' 24h change
      const chg = next.reduce((s, m) => s + m.change24h, 0) / next.length;
      let driftSum = 0, n = 0;
      next.forEach((nm, i) => { const old = prev[i]; if (old?.price) { driftSum += (nm.price - old.price) / old.price; n++; } });
      const a = alpRef.current;
      setHyperp({ price: +(a.price * (1 + (n ? driftSum / n : 0))).toFixed(4), change24h: +chg.toFixed(2) });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Multi-source realtime controller with failover.
  useEffect(() => {
    let idx = 0;
    let ctl: { stop(): void } | null = null;
    let watchdog: ReturnType<typeof setTimeout>;
    let disposed = false;
    let lastPush = 0;
    let activatedAt = 0;
    let curName = "";

    const push = (sym: string, price: number, change: number | undefined) => {
      if (!isFinite(price) || price <= 0) return;
      const cur = live.current[sym] || {};
      live.current[sym] = { price, change: change != null && isFinite(change) ? change : cur.change };
      lastPush = Date.now();
      setConnected(true);
      if (curName !== SOURCES[idx].name) { curName = SOURCES[idx].name; setSource(curName); }
    };
    const advance = () => {
      if (disposed) return;
      try { ctl?.stop(); } catch {}
      idx = (idx + 1) % SOURCES.length;
      start();
    };
    const start = () => {
      if (disposed) return;
      activatedAt = Date.now();
      const name = SOURCES[idx].name;
      if (curName !== name && lastPush === 0) setSource(`trying ${name}…`);
      try { ctl = SOURCES[idx].start(push, advance); }
      catch { ctl = null; watchdog = setTimeout(advance, 300); return; }
      clearTimeout(watchdog);
      watchdog = setTimeout(() => { if (lastPush < activatedAt) advance(); }, 9000); // no data in 9s → next
    };

    // staleness monitor: if the active source goes quiet, fail over
    const stale = setInterval(() => { if (!disposed && lastPush && Date.now() - lastPush > 15000) advance(); }, 5000);

    start();
    return () => { disposed = true; clearTimeout(watchdog); clearInterval(stale); try { ctl?.stop(); } catch {} };
  }, []);

  const value: FeedValue = {
    markets, hyperp, connected, source, selected, setSelected,
    bySymbol: (s) => ref.current.find((m) => m.symbol === s),
  };
  return <FeedCtx.Provider value={value}>{children}</FeedCtx.Provider>;
}

export function useFeed(): FeedValue {
  const v = useContext(FeedCtx);
  if (!v) throw new Error("useFeed must be used within FeedProvider");
  return v;
}
