import React from "react";
import { Sparkline } from "../ui/Sparkline";
import { formatPrice, formatChange, formatVolume } from "../../lib/utils";

interface MarketCardProps {
  slug: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  oi: number;
  maxLeverage: number;
  onNavigate: (slug: string) => void;
}

export function MarketCard({ slug, symbol, name, price, change24h, volume24h, oi, maxLeverage, onNavigate }: MarketCardProps) {
  return (
    <div
      className="bg-surface rounded-2xl border border-border p-5 hover-lift glow-card cursor-pointer group"
      onClick={() => onNavigate(slug)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent ring-1 ring-accent/20 group-hover:ring-accent/40 transition-all">
            {symbol.slice(0, 2)}
          </div>
          <div>
            <div className="font-bold text-text text-sm">{symbol}-PERP</div>
            <div className="text-[11px] text-text-muted">{name}</div>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-accent/10 text-accent px-2 py-1 rounded-md border border-accent/20 font-mono">{maxLeverage}×</span>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-lg font-bold font-mono text-text">${formatPrice(price)}</div>
          <span className={`text-xs font-semibold ${change24h >= 0 ? "text-long" : "text-short"}`}>
            {formatChange(change24h)}
            <span className="text-text-muted font-normal ml-1">24h</span>
          </span>
        </div>
        <Sparkline width={70} height={28} color={change24h >= 0 ? "#00E68A" : "#FF4D6A"} />
      </div>

      <div className="flex items-center justify-between text-[11px] text-text-muted pt-3 border-t border-border">
        <span className="font-mono">Vol {formatVolume(volume24h)}</span>
        <span className="font-mono">OI {formatVolume(oi)}</span>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(slug); }}
          className="flex-1 py-2 text-[11px] font-semibold rounded-lg bg-long/10 text-long hover:bg-long/20 border border-long/10 hover:border-long/30 transition-all cursor-pointer"
        >
          Long
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(slug); }}
          className="flex-1 py-2 text-[11px] font-semibold rounded-lg bg-short/10 text-short hover:bg-short/20 border border-short/10 hover:border-short/30 transition-all cursor-pointer"
        >
          Short
        </button>
      </div>
    </div>
  );
}
