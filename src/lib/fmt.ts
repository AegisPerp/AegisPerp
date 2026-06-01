export function fmtPrice(p: number): string {
  if (!isFinite(p)) return "0";
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(2);
  if (p >= 0.01) return p.toFixed(4);
  return p.toLocaleString("en-US", { maximumFractionDigits: 9, minimumFractionDigits: 0 });
}
export const fmtUsd = (p: number) => "$" + fmtPrice(p);

export function fmtCompact(n: number): string {
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(0);
}

export const fmtPct = (p: number) => (p >= 0 ? "+" : "") + p.toFixed(2) + "%";
