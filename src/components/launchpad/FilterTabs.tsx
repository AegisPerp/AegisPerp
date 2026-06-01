import React from "react";
import { cn } from "../../lib/utils";

interface FilterTabsProps {
  active: string;
  onChange: (tab: string) => void;
}

const TABS = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Losers" },
];

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
            active === tab.id
              ? "bg-accent text-bg shadow-sm shadow-accent/20"
              : "bg-surface text-text-muted hover:text-text-secondary hover:bg-surface-alt border border-border"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
