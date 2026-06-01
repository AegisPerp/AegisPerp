import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useFeed } from "../../lib/feed";
import { TokenIcon } from "./TokenIcon";
import { fmtUsd, fmtPct, fmtCompact } from "../../lib/fmt";

interface Candle { time: number; open: number; high: number; low: number; close: number; }

const TFS: { k: string; sec: number; bn: string }[] = [
  { k: "M5", sec: 300, bn: "5m" },
  { k: "M15", sec: 900, bn: "15m" },
  { k: "M30", sec: 1800, bn: "30m" },
  { k: "H1", sec: 3600, bn: "1h" },
  { k: "H4", sec: 14400, bn: "4h" },
  { k: "1D", sec: 86400, bn: "1d" },
];

// symbols that have a Binance USDT pair (others use synthetic history)
const BN: Record<string, string> = {
  SOL: "SOLUSDT", WIF: "WIFUSDT", BONK: "BONKUSDT", JUP: "JUPUSDT",
  PYTH: "PYTHUSDT", JTO: "JTOUSDT", RENDER: "RENDERUSDT",
};

function synth(base: number, count: number, intervalSec: number, vol: number, seed: number): Candle[] {
  const now = Math.floor(Date.now() / 1000);
  const start = now - (count - 1) * intervalSec;
  let s = seed;
  const r = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  let p = base;
  const out: Candle[] = [];
  for (let i = 0; i < count; i++) {
    const open = p;
    const close = open * (1 + (r() - 0.5) * vol * 2);
    const high = Math.max(open, close) * (1 + r() * vol);
    const low = Math.min(open, close) * (1 - r() * vol);
    out.push({ time: start + i * intervalSec, open, high, low, close });
    p = close;
  }
  const f = base / (out[out.length - 1]!.close || base);
  return out.map((c) => ({ time: c.time, open: c.open * f, high: c.high * f, low: c.low * f, close: c.close * f }));
}

export function LiveChart() {
  const { selected, bySymbol } = useFeed();
  const m = bySymbol(selected);

  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lastRef = useRef<Candle | null>(null);
  const intervalRef = useRef(86400);
  const prevPrice = useRef(0);
  const [flash, setFlash] = useState<"" | "up" | "down">("");
  const [tf, setTf] = useState("H1");
  const [live, setLive] = useState(false);

  const up = (m?.change24h ?? 0) >= 0;

  useEffect(() => {
    if (!hostRef.current) return;
    const chart = createChart(hostRef.current, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8b94a1", fontFamily: "JetBrains Mono, monospace", attributionLogo: false },
      grid: { vertLines: { color: "rgba(20,30,50,0.04)" }, horzLines: { color: "rgba(20,30,50,0.06)" } },
      rightPriceScale: { borderColor: "#e4e8ee" },
      timeScale: { borderColor: "#e4e8ee", timeVisible: true, secondsVisible: false },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { color: "rgba(47,165,106,0.4)", width: 1, style: LineStyle.Solid, labelBackgroundColor: "#2fa56a" },
        horzLine: { color: "rgba(47,165,106,0.4)", labelBackgroundColor: "#2fa56a" },
      },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#1fa971", downColor: "#e5484d", borderVisible: false,
      wickUpColor: "#1fa971", wickDownColor: "#e5484d",
    });
    chartRef.current = chart; seriesRef.current = series;
    return () => { chart.remove(); chartRef.current = null; seriesRef.current = null; };
  }, []);

  // load history (real Binance klines, else synthetic) on symbol/timeframe change
  useEffect(() => {
    let cancelled = false;
    const series = seriesRef.current;
    const mk = bySymbol(selected);
    if (!series || !mk) return;
    const conf = TFS.find((t) => t.k === tf)!;
    intervalRef.current = conf.sec;
    const apply = (candles: Candle[], isLive: boolean) => {
      if (cancelled || !seriesRef.current) return;
      seriesRef.current.setData(candles as any);
      lastRef.current = candles[candles.length - 1] ?? null;
      prevPrice.current = mk.price;
      setLive(isLive);
      chartRef.current?.timeScale().fitContent();
    };
    const pair = BN[selected];
    if (pair) {
      fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${conf.bn}&limit=140`)
        .then((r) => r.json())
        .then((rows: any[]) => {
          if (!Array.isArray(rows) || !rows.length) throw new Error("no klines");
          apply(rows.map((k) => ({ time: Math.floor(k[0] / 1000), open: +k[1], high: +k[2], low: +k[3], close: +k[4] })), true);
        })
        .catch(() => {
          const seed = (selected.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + conf.sec) * 7919;
          apply(synth(mk.price, 120, conf.sec, 0.02, seed), false);
        });
    } else {
      const seed = (selected.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + conf.sec) * 7919;
      apply(synth(mk.price, 120, conf.sec, 0.03, seed), false);
    }
    return () => { cancelled = true; };
  }, [selected, tf, bySymbol]);

  // stream live price into the forming candle
  useEffect(() => {
    const series = seriesRef.current;
    if (!series || !m || !lastRef.current) return;
    const price = m.price;
    const now = Math.floor(Date.now() / 1000);
    let last = lastRef.current;
    if (now >= last.time + intervalRef.current) {
      last = { time: last.time + intervalRef.current, open: last.close, high: price, low: price, close: price };
      lastRef.current = last;
    } else {
      last.close = price;
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
    }
    series.update(last as any);
    if (prevPrice.current && price !== prevPrice.current) {
      setFlash(price > prevPrice.current ? "up" : "down");
      const id = setTimeout(() => setFlash(""), 350);
      prevPrice.current = price;
      return () => clearTimeout(id);
    }
    prevPrice.current = price;
  }, [m?.price]);

  const spot = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="card spot chart-card rise d3" onMouseMove={spot}>
      <div className="cc-head">
        <div className="cc-id">
          <TokenIcon symbol={selected} src={m?.logo} size={40} />
          <div>
            <div className="cc-name">{m?.name ?? selected}</div>
            <div className="cc-sub">${selected}-PERP {live ? "· live" : ""}</div>
          </div>
        </div>
        <div className="cc-price">
          <div className={"cc-px " + flash}>{m ? fmtUsd(m.price) : "—"}</div>
          <span className={"chg " + (up ? "up" : "down")}>{up ? "▲" : "▼"} {m ? fmtPct(m.change24h) : ""}</span>
        </div>
      </div>

      <div className="cc-tf">
        {TFS.map((t) => (
          <button key={t.k} className={tf === t.k ? "on" : ""} onClick={() => setTf(t.k)}>{t.k}</button>
        ))}
      </div>

      <div className="chart-host" ref={hostRef} />

      <div className="cc-foot">
        <div><div className="k">24h Volume</div><div className="val">{m ? fmtCompact(m.volume24h) : "—"}</div></div>
        <div><div className="k">Open Interest</div><div className="val">{m ? fmtCompact(m.openInterest) : "—"}</div></div>
        <div><div className="k">Max Leverage</div><div className="val" style={{ color: "var(--green)" }}>{m?.leverage ?? "—"}×</div></div>
      </div>
    </div>
  );
}
