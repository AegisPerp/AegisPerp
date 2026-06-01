export interface MarginTier {
  initial: number;
  maintenance: number;
}

export function getMarginTier(leverage: number): MarginTier {
  if (leverage <= 10) return { initial: 0.10, maintenance: 0.05 };
  if (leverage <= 25) return { initial: 0.04, maintenance: 0.02 };
  if (leverage <= 50) return { initial: 0.02, maintenance: 0.01 };
  return { initial: 0.01, maintenance: 0.005 };
}

export function calcLiquidationPrice(
  side: "long" | "short",
  entryPrice: number,
  leverage: number
): number {
  const tier = getMarginTier(leverage);
  if (side === "long") {
    return entryPrice * (1 - (1 / leverage) * (1 - tier.maintenance));
  }
  return entryPrice * (1 + (1 / leverage) * (1 - tier.maintenance));
}

export function calcUnrealizedPnl(
  side: "long" | "short",
  entryPrice: number,
  currentPrice: number,
  size: number
): number {
  if (side === "long") {
    return ((currentPrice - entryPrice) / entryPrice) * size;
  }
  return ((entryPrice - currentPrice) / entryPrice) * size;
}

export function calcMarginRatio(
  collateral: number,
  unrealizedPnl: number,
  size: number
): number {
  return (collateral + unrealizedPnl) / size;
}

export function shouldLiquidate(
  side: "long" | "short",
  entryPrice: number,
  currentPrice: number,
  leverage: number,
  collateral: number,
  size: number
): boolean {
  const tier = getMarginTier(leverage);
  const pnl = calcUnrealizedPnl(side, entryPrice, currentPrice, size);
  const marginRatio = calcMarginRatio(collateral, pnl, size);
  return marginRatio <= tier.maintenance;
}
