import React from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = true, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface rounded-2xl border border-border p-6",
        hover && "hover-lift",
        glow && "glow-card",
        className
      )}
    >
      {children}
    </div>
  );
}
