import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "btn-hover inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer",
        variant === "primary" && "bg-accent text-bg hover:shadow-[0_0_30px_rgba(0,230,138,0.3)]",
        variant === "outline" && "border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/60",
        variant === "ghost" && "text-text-secondary hover:text-text hover:bg-surface-alt",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-sm",
        size === "lg" && "px-8 py-4 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
