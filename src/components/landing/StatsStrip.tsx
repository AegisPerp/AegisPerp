import React from "react";
import { AnimCounter } from "../ui/AnimCounter";

export function StatsStrip() {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
        {[
          { target: 142, suffix: "+", label: "Markets launched", color: "text-accent" },
          { target: 2.4, prefix: "$", suffix: "M", decimals: 1, label: "Total volume", color: "text-text" },
          { target: 8741, label: "Total trades", color: "text-text" },
          { target: 12.4, prefix: "$", suffix: "K", decimals: 1, label: "Creator earnings", color: "text-long" },
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className={`text-3xl md:text-4xl font-extrabold tracking-tight ${stat.color}`}>
              <AnimCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
