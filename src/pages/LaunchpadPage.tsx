import React, { useState } from "react";
import { MarketGrid } from "../components/launchpad/MarketGrid";
import { FilterTabs } from "../components/launchpad/FilterTabs";

interface LaunchpadPageProps {
  onNavigate: (path: string) => void;
}

export function LaunchpadPage({ onNavigate }: LaunchpadPageProps) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Markets</h1>
            <p className="text-text-muted text-sm mt-1">Trade perpetuals on any token</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search markets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 w-64 transition-all"
              />
            </div>
            <button
              onClick={() => onNavigate("/launchpad/create")}
              className="px-5 py-2.5 rounded-xl bg-accent text-bg text-sm font-semibold btn-hover cursor-pointer hover:shadow-[0_0_20px_rgba(0,230,138,0.2)]"
            >
              + Launch market
            </button>
          </div>
        </div>

        <FilterTabs active={filter} onChange={setFilter} />

        <div className="mt-6">
          <MarketGrid
            filter={filter}
            search={search}
            onNavigate={(slug) => onNavigate(`/launchpad/${slug}`)}
          />
        </div>
      </div>
    </div>
  );
}
