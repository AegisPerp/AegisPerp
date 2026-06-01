import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { LAUNCH_FEE_SOL } from "../lib/constants";

interface CreateMarketPageProps {
  onNavigate: (path: string) => void;
}

export function CreateMarketPage({ onNavigate }: CreateMarketPageProps) {
  const [mint, setMint] = useState("");
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [maxLeverage, setMaxLeverage] = useState(50);
  const [tradingFee, setTradingFee] = useState(25);
  const [loading, setLoading] = useState(false);

  const handleLaunch = async () => {
    if (!mint || !symbol || !name) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate(`/launchpad/${symbol.toLowerCase()}`);
    }, 2000);
  };

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => onNavigate("/launchpad")} className="flex items-center gap-2 text-text-muted hover:text-accent mb-8 cursor-pointer transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-sm">Back to markets</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Launch a market</h1>
          <p className="text-text-muted text-sm mt-2">Create a perpetual futures market for any SPL token</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 space-y-7">
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wider">Token Mint Address</label>
            <input
              type="text"
              value={mint}
              onChange={(e) => setMint(e.target.value)}
              placeholder="Paste SPL token mint address..."
              className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-border text-sm font-mono text-text placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wider">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. WIF"
                className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-border text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wider">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. dogwifhat"
                className="w-full px-4 py-3.5 rounded-xl bg-bg-secondary border border-border text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Max Leverage</span>
              <span className="font-bold text-accent font-mono">{maxLeverage}×</span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              value={maxLeverage}
              onChange={(e) => setMaxLeverage(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-alt cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
              <span>2×</span>
              <span>100×</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2.5">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Trading Fee</span>
              <span className="font-bold text-accent font-mono">{tradingFee} bps <span className="text-text-muted">({(tradingFee / 100).toFixed(2)}%)</span></span>
            </div>
            <input
              type="range"
              min="3"
              max="100"
              value={tradingFee}
              onChange={(e) => setTradingFee(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-alt cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
              <span>3 bps</span>
              <span>100 bps</span>
            </div>
          </div>

          {symbol && (
            <div className="bg-bg-secondary rounded-xl p-5 border border-border-light">
              <div className="text-[10px] text-text-muted uppercase tracking-widest mb-3 font-semibold">Preview</div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent ring-2 ring-accent/20">
                  {symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-text">{symbol}-PERP</div>
                  <div className="text-xs text-text-muted">{name || "Token Name"}</div>
                </div>
                <div className="ml-auto text-right text-xs space-y-0.5">
                  <div className="font-mono text-accent font-semibold">{maxLeverage}× max</div>
                  <div className="font-mono text-text-muted">{tradingFee} bps fee</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Launch fee</div>
              <div className="text-2xl font-extrabold text-text">{LAUNCH_FEE_SOL} <span className="text-accent">SOL</span></div>
            </div>
            <Button
              size="lg"
              onClick={handleLaunch}
              disabled={!mint || !symbol || !name || loading}
              className="disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
            >
              {loading ? "Launching..." : "Launch market"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
