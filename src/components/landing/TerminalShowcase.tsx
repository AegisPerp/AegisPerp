import React, { useEffect, useState } from "react";
import { MOCK_FILLS } from "../../lib/constants";
import { formatVolume } from "../../lib/utils";

export function TerminalShowcase() {
  const [activeFill, setActiveFill] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFill((prev) => (prev + 1) % MOCK_FILLS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-28 px-6 bg-bg-secondary/80 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Terminal</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em]">
            One terminal. <span className="text-text-secondary">Every market.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-surface rounded-2xl border border-border p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent ring-1 ring-accent/20">WI</div>
              <div>
                <span className="font-bold text-text">WIF-PERP</span>
                <span className="text-[10px] text-text-muted ml-2 bg-surface-alt px-2 py-0.5 rounded font-mono">50×</span>
              </div>
              <div className="ml-auto text-right">
                <div className="font-mono font-bold text-text">$1.8472</div>
                <div className="text-xs text-long font-semibold">+2.41%</div>
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl p-5 h-52 flex items-center justify-center border border-border-light mb-5">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                <defs>
                  <linearGradient id="chartGrad2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E68A" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#00E68A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[80, 160, 240, 320].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                ))}
                {[30, 60, 90].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                ))}
                <path
                  d="M 0 90 Q 20 85 40 80 T 80 75 T 120 68 T 160 60 T 200 55 T 240 48 T 280 40 T 320 42 T 360 35 T 400 28"
                  fill="none"
                  stroke="#00E68A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 90 Q 20 85 40 80 T 80 75 T 120 68 T 160 60 T 200 55 T 240 48 T 280 40 T 320 42 T 360 35 T 400 28 V 120 H 0 Z"
                  fill="url(#chartGrad2)"
                />
              </svg>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "24h Vol", value: "$284K" },
                { label: "Open Interest", value: "$1.2M" },
                { label: "Funding", value: "+0.012%" },
                { label: "Trades", value: "1,247" },
              ].map((stat) => (
                <div key={stat.label} className="bg-bg-secondary rounded-lg p-2.5 text-center border border-border-light">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
                  <div className="font-bold text-sm font-mono text-text mt-0.5">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-2xl border border-border p-5">
              <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                Live fills
              </h4>
              <div className="space-y-1.5">
                {MOCK_FILLS.slice(0, 6).map((fill, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-all duration-500 ${
                      i === activeFill
                        ? "bg-accent/[0.07] border border-accent/20 shadow-sm shadow-accent/5"
                        : "bg-bg-secondary/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${fill.side === "long" ? "bg-long" : "bg-short"}`} />
                      <span className="font-semibold text-xs text-text">{fill.token}</span>
                      <span className="text-text-muted text-[10px] font-mono">{fill.leverage}×</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-mono text-xs text-text-secondary">{formatVolume(fill.size)}</span>
                      <span className="text-text-muted text-[10px]">{fill.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-5">
              <h4 className="font-bold text-sm mb-4">Fee distribution</h4>
              <div className="space-y-3.5">
                {[
                  { label: "Creator", pct: 10, color: "bg-accent" },
                  { label: "Protocol", pct: 60, color: "bg-text-secondary" },
                  { label: "Insurance", pct: 20, color: "bg-long/60" },
                  { label: "LPs", pct: 10, color: "bg-text-muted" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[11px] text-text-muted w-16 font-medium">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold font-mono w-8 text-right text-text-secondary">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
