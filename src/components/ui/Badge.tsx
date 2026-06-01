import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger";
  pulse?: boolean;
  className?: string;
}

export function Badge({ children, variant = "default", pulse, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase",
        variant === "default" && "bg-accent/10 text-accent border border-accent/20",
        variant === "success" && "bg-long/10 text-long border border-long/20",
        variant === "danger" && "bg-short/10 text-short border border-short/20",
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
