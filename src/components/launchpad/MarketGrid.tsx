import React, { useEffect, useState } from "react";
import { MarketCard } from "./MarketCard";
import { MOCK_TOKENS } from "../../lib/constants";

interface MarketGridProps {
  filter: string;
  search: string;
  onNavigate: (slug: string) => void;
}

export function MarketGrid({ filter, search, onNavigate }: MarketGridProps) {
  const [markets, setMarkets] = useState(MOCK_TOKENS);

  let filtered = markets;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m => m.symbol.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
  }

  if (filter === "gainers") {
    filtered = [...filtered].sort((a, b) => b.change - a.change);
  } else if (filter === "losers") {
    filtered = [...filtered].sort((a, b) => a.change - b.change);
  } else if (filter === "new") {
    filtered = [...filtered].reverse();
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((m) => (
        <MarketCard
          key={m.symbol}
          slug={m.symbol.toLowerCase()}
          symbol={m.symbol}
          name={m.name}
          price={m.price}
          change24h={m.change}
          volume24h={m.volume}
          oi={m.oi}
          maxLeverage={m.maxLev}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
