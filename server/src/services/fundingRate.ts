const MAX_FUNDING_RATE = 0.0005;

export function calcFundingRate(markPrice: number, indexPrice: number): number {
  const raw = (markPrice - indexPrice) / indexPrice;
  return Math.max(-MAX_FUNDING_RATE, Math.min(MAX_FUNDING_RATE, raw));
}

export function calcFundingPayment(positionSize: number, fundingRate: number): number {
  return positionSize * fundingRate;
}
