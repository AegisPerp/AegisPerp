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

// Tradable perp markets ($AGPERP itself is NOT tradable — it's the brand index).
// Seed prices are placeholders shown until the first realtime tick arrives.
const SEED: Omit<Market, "spark">[] = [
  // Top market cap
  { symbol: "BTC",    name: "Bitcoin",           price: 104250,    change24h: 0, volume24h: 38_500_000, openInterest: 52_000_000, leverage: 100, logo: L("BTC") },
  { symbol: "ETH",    name: "Ethereum",          price: 2520,      change24h: 0, volume24h: 18_200_000, openInterest: 28_000_000, leverage: 100, logo: L("ETH") },
  { symbol: "BNB",    name: "BNB",               price: 680,       change24h: 0, volume24h: 2_800_000,  openInterest: 5_200_000,  leverage: 75,  logo: L("BNB") },
  { symbol: "XRP",    name: "XRP",               price: 2.38,      change24h: 0, volume24h: 3_400_000,  openInterest: 6_100_000,  leverage: 75,  logo: L("XRP") },
  { symbol: "ADA",    name: "Cardano",           price: 0.74,      change24h: 0, volume24h: 1_200_000,  openInterest: 2_800_000,  leverage: 50,  logo: L("ADA") },
  { symbol: "DOGE",   name: "Dogecoin",          price: 0.218,     change24h: 0, volume24h: 2_600_000,  openInterest: 4_100_000,  leverage: 75,  logo: L("DOGE") },
  { symbol: "SOL",    name: "Solana",            price: 172.5,     change24h: 0, volume24h: 4_250_000,  openInterest: 8_200_000,  leverage: 100, logo: L("SOL") },
  { symbol: "AVAX",   name: "Avalanche",         price: 24.5,      change24h: 0, volume24h: 980_000,    openInterest: 1_800_000,  leverage: 50,  logo: L("AVAX") },
  { symbol: "DOT",    name: "Polkadot",          price: 4.52,      change24h: 0, volume24h: 680_000,    openInterest: 1_200_000,  leverage: 50,  logo: L("DOT") },
  { symbol: "LINK",   name: "Chainlink",         price: 15.8,      change24h: 0, volume24h: 1_100_000,  openInterest: 2_400_000,  leverage: 50,  logo: L("LINK") },
  { symbol: "SUI",    name: "Sui",               price: 3.72,      change24h: 0, volume24h: 1_400_000,  openInterest: 2_600_000,  leverage: 50,  logo: L("SUI") },
  { symbol: "PEPE",   name: "Pepe",              price: 0.0000142, change24h: 0, volume24h: 1_800_000,  openInterest: 3_200_000,  leverage: 50,  logo: L("PEPE") },
  // Solana ecosystem
  { symbol: "WIF",    name: "dogwifhat",         price: 1.847,     change24h: 0, volume24h: 670_000,    openInterest: 980_000,    leverage: 75,  logo: L("WIF") },
  { symbol: "BONK",   name: "Bonk",              price: 0.0000234, change24h: 0, volume24h: 890_000,    openInterest: 1_100_000,  leverage: 50,  logo: L("BONK") },
  { symbol: "JUP",    name: "Jupiter",           price: 0.89,      change24h: 0, volume24h: 540_000,    openInterest: 760_000,    leverage: 50,  logo: L("JUP") },
  { symbol: "PYTH",   name: "Pyth Network",      price: 0.34,      change24h: 0, volume24h: 320_000,    openInterest: 410_000,    leverage: 25,  logo: L("PYTH") },
  { symbol: "JTO",    name: "Jito",              price: 2.41,      change24h: 0, volume24h: 280_000,    openInterest: 350_000,    leverage: 50,  logo: L("JTO") },
  { symbol: "RENDER", name: "Render",            price: 7.32,      change24h: 0, volume24h: 240_000,    openInterest: 300_000,    leverage: 25,  logo: L("RENDER") },
  { symbol: "POPCAT", name: "Popcat",            price: 0.92,      change24h: 0, volume24h: 240_000,    openInterest: 300_000,    leverage: 25,  logo: L("POPCAT") },
  { symbol: "MEW",    name: "cat in a dogs world", price: 0.0084,  change24h: 0, volume24h: 130_000,    openInterest: 180_000,    leverage: 25,  logo: L("MEW") },
];
function initMarkets(): Market[] { return SEED.map((m) => ({ ...m, spark: [m.price] })); }

interface FeedValue {
  markets: Market[];
  agperp: IndexStat;
  connected: boolean;
  source: string;
  selected: string;
  setSelected: (s: string) => void;
  bySymbol: (s: string) => Market | undefined;
}
const FeedCtx = createContext<FeedValue | null>(null);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Market[]>(initMarkets);
  const [agperp, setAgperp] = useState<IndexStat>({ price: 24.8, change24h: 0 });
  const [connected, setConnected] = useState(false);
  const [source, setSource] = useState("connecting…");
  const [selected, setSelected] = useState("BTC");
  const ref = useRef<Market[]>(markets);
  ref.current = markets;
  const alpRef = useRef(agperp);
  alpRef.current = agperp;
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
      // $AGPERP brand index = average of the live markets' 24h change
      const chg = next.reduce((s, m) => s + m.change24h, 0) / next.length;
      let driftSum = 0, n = 0;
      next.forEach((nm, i) => { const old = prev[i]; if (old?.price) { driftSum += (nm.price - old.price) / old.price; n++; } });
      const a = alpRef.current;
      setAgperp({ price: +(a.price * (1 + (n ? driftSum / n : 0))).toFixed(4), change24h: +chg.toFixed(2) });
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
    markets, agperp, connected, source, selected, setSelected,
    bySymbol: (s) => ref.current.find((m) => m.symbol === s),
  };
  return <FeedCtx.Provider value={value}>{children}</FeedCtx.Provider>;
}

export function useFeed(): FeedValue {
  const v = useContext(FeedCtx);
  if (!v) throw new Error("useFeed must be used within FeedProvider");
  return v;
}
