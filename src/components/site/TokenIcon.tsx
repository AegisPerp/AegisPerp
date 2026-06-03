import { useState } from "react";

const MONO_COLORS: Record<string, string> = {
  HYPERP: "linear-gradient(135deg,#f5d44e,#c8a415 60%,#9a7d0a)",
};

export function TokenIcon({
  symbol,
  src,
  size = 34,
}: {
  symbol: string;
  src?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const label = symbol.slice(0, symbol.length <= 4 ? 2 : 3);

  if (failed || !src) {
    return (
      <span
        className="tk-mono"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.36,
          background: MONO_COLORS[symbol],
        }}
        aria-label={symbol}
      >
        {label}
      </span>
    );
  }
  return (
    <img
      className="tk-ico"
      src={src}
      alt={symbol}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
