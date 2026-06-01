export interface CurveState {
  x: number;
  y: number;
  k: number;
  virtualDepth: number;
}

export function initCurve(virtualDepth: number): CurveState {
  const x = virtualDepth / 2;
  const y = virtualDepth / 2;
  return { x, y, k: x * y, virtualDepth };
}

export function quoteBuy(curve: CurveState, amountIn: number): { tokensOut: number; priceImpact: number; newCurve: CurveState } {
  const spotPrice = curve.x / curve.y;
  const newX = curve.x + amountIn;
  const newY = curve.k / newX;
  const tokensOut = curve.y - newY;
  const avgPrice = amountIn / tokensOut;
  const priceImpact = Math.abs(avgPrice - spotPrice) / spotPrice;

  return {
    tokensOut,
    priceImpact,
    newCurve: { ...curve, x: newX, y: newY },
  };
}

export function quoteSell(curve: CurveState, tokensIn: number): { usdcOut: number; priceImpact: number; newCurve: CurveState } {
  const spotPrice = curve.x / curve.y;
  const newY = curve.y + tokensIn;
  const newX = curve.k / newY;
  const usdcOut = curve.x - newX;
  const avgPrice = usdcOut / tokensIn;
  const priceImpact = Math.abs(spotPrice - avgPrice) / spotPrice;

  return {
    usdcOut,
    priceImpact,
    newCurve: { ...curve, x: newX, y: newY },
  };
}

export function getSpotPrice(curve: CurveState): number {
  return curve.x / curve.y;
}
