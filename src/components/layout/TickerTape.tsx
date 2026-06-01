import React from "react";
import { MOCK_TOKENS } from "../../lib/constants";
import { formatPrice, formatChange } from "../../lib/utils";

interface TickerTapeProps {
  direction?: "left" | "right";
  tokens?: typeof MOCK_TOKENS;
}

export function TickerTape({ direction = "left", tokens }: TickerTapeProps) {
  const items = tokens || MOCK_TOKENS;
  const duped = [...items, ...items];

  return (
    <div className="w-full overflow-hidden py-3 border-y border-border bg-bg-secondary/50">
      <div className={direction === "left" ? "ticker-left" : "ticker-right"} style={{ display: "flex", width: "max-content" }}>
        {duped.map((token, i) => (
          <div
            key={`${token.symbol}-${i}`}
            className="flex items-center gap-3 px-4 py-2 mx-1.5 bg-surface/50 rounded-lg border border-border hover:border-accent/20 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
              {token.symbol.slice(0, 2)}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-xs text-text">{token.symbol}</span>
              <span className="text-xs font-mono text-text-secondary">{formatPrice(token.price)}</span>
              <span className={`text-xs font-semibold ${token.change >= 0 ? "text-long" : "text-short"}`}>
                {formatChange(token.change)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
