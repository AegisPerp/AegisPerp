import { useState } from "react";

const MONO_COLORS: Record<string, string> = {
  AGPERP: "linear-gradient(135deg,#f5d44e,#c8a415 60%,#9a7d0a)",
  BTC:    "linear-gradient(135deg,#f7931a,#e2820e 60%,#c46f0a)",
  ETH:    "linear-gradient(135deg,#627eea,#4c6adf 60%,#3651c5)",
  BNB:    "linear-gradient(135deg,#f3ba2f,#e0a91e 60%,#c89610)",
  XRP:    "linear-gradient(135deg,#00aae4,#008dc4 60%,#0070a0)",
  ADA:    "linear-gradient(135deg,#0033ad,#002990 60%,#001f70)",
  DOGE:   "linear-gradient(135deg,#c2a633,#b89b28 60%,#9a811e)",
  AVAX:   "linear-gradient(135deg,#e84142,#d63738 60%,#b82e2e)",
  DOT:    "linear-gradient(135deg,#e6007a,#cc006b 60%,#a8005a)",
  LINK:   "linear-gradient(135deg,#2a5ada,#2350c8 60%,#1c42a8)",
  SUI:    "linear-gradient(135deg,#6fbcf0,#4da8e8 60%,#3090d0)",
  PEPE:   "linear-gradient(135deg,#3d9a3c,#348a34 60%,#2a7028)",
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
