import React from "react";
import { Card } from "../ui/Card";
import { Sparkline } from "../ui/Sparkline";
import { AnimCounter } from "../ui/AnimCounter";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em]">
            Three steps. <span className="text-text-secondary">No gatekeepers.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden group" glow>
            <div className="absolute top-3 right-4 text-[5rem] font-extrabold text-accent/[0.04] leading-none select-none">01</div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(0,230,138,0.15)] transition-shadow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant listings</h3>
              <p className="text-text-muted text-sm mb-6 leading-relaxed">Pay 0.3 SOL, ship a perp. Market goes live before the next block.</p>
              <div className="bg-bg-secondary rounded-xl p-4 border border-border-light">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center text-[9px] font-bold text-accent ring-1 ring-accent/20">W</div>
                    <span className="text-xs font-semibold text-text">WIF</span>
                    <span className="text-[10px] text-text-muted ml-auto font-mono">50× max</span>
                  </div>
                  <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-accent-dim rounded-full w-3/4 transition-all" />
                  </div>
                  <div className="flex justify-between text-[10px] text-text-muted">
                    <span>Launch fee: 0.3 SOL</span>
                    <span className="text-accent font-semibold">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group" glow>
            <div className="absolute top-3 right-4 text-[5rem] font-extrabold text-accent/[0.04] leading-none select-none">02</div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(0,230,138,0.15)] transition-shadow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 16l4-8 4 4 5-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Bonding-curve liquidity</h3>
              <p className="text-text-muted text-sm mb-6 leading-relaxed">Tight spreads from minute one. Virtual AMM sized to your leverage cap.</p>
              <div className="bg-bg-secondary rounded-xl p-4 border border-border-light">
                <svg viewBox="0 0 200 80" className="w-full h-20">
                  <defs>
                    <linearGradient id="curveGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#00E68A" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#00E68A" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 10 70 Q 50 68 80 50 T 140 20 T 190 10" fill="none" stroke="#00E68A" strokeWidth="2" />
                  <path d="M 10 70 Q 50 68 80 50 T 140 20 T 190 10 V 80 H 10 Z" fill="url(#curveGrad)" />
                  <line x1="140" y1="0" x2="140" y2="80" stroke="#00E68A" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
                  <text x="140" y="78" fontSize="7" fill="#64748B" textAnchor="middle" fontFamily="monospace">$50K vol</text>
                  <text x="148" y="12" fontSize="6" fill="#00E68A" fontWeight="bold" fontFamily="monospace">GRADUATED</text>
                </svg>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden group" glow>
            <div className="absolute top-3 right-4 text-[5rem] font-extrabold text-accent/[0.04] leading-none select-none">03</div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(0,230,138,0.15)] transition-shadow">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Creator share</h3>
              <p className="text-text-muted text-sm mb-6 leading-relaxed">Earn 10% of all trading fees on your market. Forever.</p>
              <div className="bg-bg-secondary rounded-xl p-4 border border-border-light">
                <div className="flex items-end justify-between mb-3">
                  <Sparkline width={120} height={40} color="#00E68A" />
                  <div className="text-right">
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Lifetime</div>
                    <div className="font-bold text-accent text-sm font-mono">
                      <AnimCounter target={4823} prefix="$" decimals={0} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-[11px]">
                  <div>
                    <span className="text-text-muted">24h </span>
                    <span className="font-semibold text-long font-mono">$127</span>
                  </div>
                  <div>
                    <span className="text-text-muted">7d </span>
                    <span className="font-semibold text-text-secondary font-mono">$891</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
