import React, { useState } from "react";
import { MOCK_TOKENS, MOCK_FILLS } from "../lib/constants";
import { formatPrice, formatChange, formatVolume } from "../lib/utils";

interface TradingPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export function TradingPage({ slug, onNavigate }: TradingPageProps) {
  const token = MOCK_TOKENS.find(t => t.symbol.toLowerCase() === slug) || MOCK_TOKENS[0];
  const [side, setSide] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState(25);
  const [collateral, setCollateral] = useState("100");
  const [orderType, setOrderType] = useState("market");

  const collateralNum = Number(collateral) || 0;
  const size = collateralNum * leverage;
  const fee = size * 0.0025;
  const liqPrice = side === "long"
    ? token.price * (1 - (1 / leverage) * 0.98)
    : token.price * (1 + (1 / leverage) * 0.98);

  return (
    <div className="pt-20 pb-8 px-4 lg:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Market Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
          <button onClick={() => onNavigate("/launchpad")} className="text-text-muted hover:text-accent transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-accent/5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent text-sm ring-2 ring-accent/20">
            {token.symbol.slice(0, 2)}
          </div>
          <div>
            <h1 className="font-bold text-xl text-text">{token.symbol}-PERP</h1>
            <span className="text-xs text-text-muted">{token.name} &middot; <span className="font-mono">{token.maxLev}× max</span></span>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-bold font-mono text-text">${formatPrice(token.price)}</div>
            <span className={`text-sm font-semibold ${token.change >= 0 ? "text-long" : "text-short"}`}>
              {formatChange(token.change)}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Chart */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-surface rounded-2xl border border-border p-6 h-80 flex items-center justify-center">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                <defs>
                  <linearGradient id="tpGrad2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E68A" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#00E68A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[100, 200, 300, 400, 500].map(x => <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />)}
                {[40, 80, 120, 160].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />)}
                <path d="M 0 150 Q 30 140 60 135 T 120 120 T 180 110 T 240 95 T 300 80 T 360 85 T 420 65 T 480 55 T 540 45 T 600 35" fill="none" stroke="#00E68A" strokeWidth="2" strokeLinecap="round" />
                <path d="M 0 150 Q 30 140 60 135 T 120 120 T 180 110 T 240 95 T 300 80 T 360 85 T 420 65 T 480 55 T 540 45 T 600 35 V 200 H 0 Z" fill="url(#tpGrad2)" />
              </svg>
            </div>

            {/* Positions Table */}
            <div className="bg-surface rounded-2xl border border-border p-5">
              <h3 className="font-bold text-sm mb-4 text-text">Open Positions</h3>
              <div className="text-center py-10 text-text-muted text-sm border border-dashed border-border rounded-xl">
                Connect wallet to view positions
              </div>
            </div>
          </div>

          {/* Order Panel */}
          <div className="space-y-5">
            <div className="bg-surface rounded-2xl border border-border p-5">
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setSide("long")}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    side === "long"
                      ? "bg-long text-bg shadow-lg shadow-long/20"
                      : "bg-surface-alt text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Long
                </button>
                <button
                  onClick={() => setSide("short")}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    side === "short"
                      ? "bg-short text-white shadow-lg shadow-short/20"
                      : "bg-surface-alt text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Short
                </button>
              </div>

              <div className="flex gap-1 mb-5 bg-bg-secondary rounded-lg p-1 border border-border-light">
                {["market", "limit", "stop"].map(t => (
                  <button
                    key={t}
                    onClick={() => setOrderType(t)}
                    className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md capitalize transition-all cursor-pointer ${
                      orderType === t ? "bg-surface shadow-sm text-text border border-border" : "text-text-muted border border-transparent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <label className="text-[11px] text-text-muted mb-1.5 block uppercase tracking-wider font-medium">Collateral (USDC)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={collateral}
                    onChange={(e) => setCollateral(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border text-sm font-mono text-text focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                    placeholder="100.00"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    {[25, 50, 100].map(v => (
                      <button key={v} onClick={() => setCollateral(String(v))} className="px-2 py-0.5 text-[10px] bg-surface rounded border border-border text-text-muted hover:text-accent hover:border-accent/30 cursor-pointer transition-colors font-mono">${v}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-muted text-[11px] uppercase tracking-wider font-medium">Leverage</span>
                  <span className="font-bold text-accent font-mono">{leverage}×</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max={token.maxLev}
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-surface-alt cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                  <span>2×</span>
                  <span>{token.maxLev}×</span>
                </div>
              </div>

              <div className="bg-bg-secondary rounded-xl p-4 space-y-2.5 mb-5 border border-border-light">
                <InfoRow label="Size" value={`$${size.toLocaleString()}`} />
                <InfoRow label="Entry price" value={`$${formatPrice(token.price)}`} />
                <InfoRow label="Liq. price" value={`$${formatPrice(liqPrice)}`} highlight />
                <InfoRow label="Fee (0.25%)" value={`$${fee.toFixed(2)}`} />
              </div>

              <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                side === "long"
                  ? "bg-long text-bg hover:shadow-lg hover:shadow-long/25"
                  : "bg-short text-white hover:shadow-lg hover:shadow-short/25"
              }`}>
                {side === "long" ? "Long" : "Short"} {token.symbol}-PERP
              </button>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-5">
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                Recent fills
              </h4>
              <div className="space-y-1.5">
                {MOCK_FILLS.slice(0, 5).map((fill, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-surface-alt/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${fill.side === "long" ? "bg-long" : "bg-short"}`} />
                      <span className="font-semibold text-text">{fill.token}</span>
                      <span className="text-text-muted font-mono text-[10px]">{fill.leverage}×</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-text-secondary">{formatVolume(fill.size)}</span>
                      <span className="text-text-muted text-[10px]">{fill.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <span className={highlight ? "text-short font-semibold font-mono" : "font-medium font-mono text-text-secondary"}>{value}</span>
    </div>
  );
}
