import React, { useState } from "react";
import { TAGLINE, ONE_LINER, LAUNCH_FEE_SOL, MAX_LEVERAGE, ORDER_TYPES } from "../../lib/constants";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import logoImg from "../../../public/logo.png";

function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function Hero() {
  return (
    <section className="relative pt-28 pb-24 px-6 overflow-hidden hero-gradient">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <Badge pulse className="fade-up fade-up-1">Beta &middot; Live on Solana</Badge>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.03em] leading-[1.05] fade-up fade-up-2">
            <span className="gradient-text">Open a perp</span>
            <br />on anything that trades.
          </h1>

          <p className="text-lg text-text-secondary max-w-lg leading-relaxed fade-up fade-up-3">
            {ONE_LINER}
          </p>

          <div className="flex flex-wrap gap-4 fade-up fade-up-4">
            <Button size="lg" onClick={() => navigate("/launchpad")}>Explore markets</Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/launchpad/create")}>Launch a market</Button>
          </div>

          <div className="flex flex-wrap gap-8 pt-2 fade-up fade-up-5">
            <StatPill icon="chart" value={`${MAX_LEVERAGE}×`} label="Max leverage" />
            <StatPill icon="layers" value={`${ORDER_TYPES}`} label="Order types" />
            <StatPill icon="zap" value={`${LAUNCH_FEE_SOL} SOL`} label="Launch fee" />
          </div>
        </div>

        <div className="fade-up fade-up-3">
          <TradingCardPreview />
        </div>
      </div>
    </section>
  );
}

function StatPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
        <span className="text-accent text-xs font-bold">
          {icon === "chart" && "~"}
          {icon === "layers" && "#"}
          {icon === "zap" && "$"}
        </span>
      </div>
      <div>
        <div className="font-bold text-sm text-accent">{value}</div>
        <div className="text-[11px] text-text-muted">{label}</div>
      </div>
    </div>
  );
}

function TradingCardPreview() {
  const [side, setSide] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState(25);

  const entryPrice = 1.8472;
  const collateral = 100;
  const size = collateral * leverage;
  const fee = size * 0.0025;
  const liqPrice = side === "long"
    ? entryPrice * (1 - (1 / leverage) * 0.98)
    : entryPrice * (1 + (1 / leverage) * 0.98);

  return (
    <div className="relative max-w-sm mx-auto lg:mx-0 lg:ml-auto" style={{ animation: "float 6s ease-in-out infinite" }}>
      <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl" />
      <div className="relative bg-surface rounded-2xl border border-border p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent text-sm ring-2 ring-accent/20">WI</div>
            <div>
              <div className="font-bold text-text">WIF-PERP</div>
              <div className="text-xs text-text-muted">dogwifhat</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold font-mono text-text">${entryPrice.toFixed(4)}</div>
            <div className="text-xs text-long font-semibold">+2.41%</div>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setSide("long")}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              side === "long"
                ? "bg-long text-bg shadow-lg shadow-long/20"
                : "bg-surface-alt text-text-muted hover:text-text-secondary"
            }`}
          >
            Long
          </button>
          <button
            onClick={() => setSide("short")}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              side === "short"
                ? "bg-short text-white shadow-lg shadow-short/20"
                : "bg-surface-alt text-text-muted hover:text-text-secondary"
            }`}
          >
            Short
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-muted">Leverage</span>
              <span className="font-bold text-accent">{leverage}×</span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-alt cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>2×</span>
              <span>100×</span>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-xl p-3.5 space-y-2 border border-border-light">
            <Row label="Collateral" value={`$${collateral.toFixed(2)}`} />
            <Row label="Size" value={`$${size.toLocaleString()}`} />
            <Row label="Entry" value={`$${entryPrice.toFixed(4)}`} />
            <Row label="Liq. price" value={`$${liqPrice.toFixed(4)}`} highlight />
            <Row label="Fee" value={`$${fee.toFixed(2)}`} />
          </div>

          <button
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              side === "long"
                ? "bg-long text-bg hover:shadow-lg hover:shadow-long/25"
                : "bg-short text-white hover:shadow-lg hover:shadow-short/25"
            }`}
          >
            {side === "long" ? "Long" : "Short"} WIF-PERP
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <span className={highlight ? "text-short font-semibold font-mono" : "font-medium font-mono text-text-secondary"}>{value}</span>
    </div>
  );
}
