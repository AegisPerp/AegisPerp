import db from "../db/database";
import { shouldLiquidate, calcUnrealizedPnl } from "./marginEngine";
import { getCachedPrice } from "./priceService";

const LIQUIDATION_FEE_RATE = 0.005;
let liquidationInterval: ReturnType<typeof setInterval> | null = null;
let onLiquidation: ((data: any) => void) | null = null;

export function setLiquidationCallback(cb: (data: any) => void) {
  onLiquidation = cb;
}

function checkLiquidations() {
  const positions = db.query(`
    SELECT p.*, m.token_mint, m.token_symbol, m.slug
    FROM positions p
    JOIN markets m ON p.market_id = m.id
    WHERE p.status = 'open'
  `).all() as any[];

  for (const pos of positions) {
    const cached = getCachedPrice(pos.token_mint);
    if (!cached) continue;

    const currentPrice = cached.price;
    if (shouldLiquidate(pos.side, pos.entry_price, currentPrice, pos.leverage, pos.collateral, pos.size)) {
      const pnl = calcUnrealizedPnl(pos.side, pos.entry_price, currentPrice, pos.size);
      const remaining = pos.collateral + pnl;
      const liqFee = Math.max(0, remaining * LIQUIDATION_FEE_RATE);

      db.query(`
        UPDATE positions
        SET status = 'liquidated', pnl = ?, closed_at = datetime('now'), close_price = ?
        WHERE id = ?
      `).run(pnl, currentPrice, pos.id);

      db.query(`
        UPDATE platform_stats SET total_fees = total_fees + ? WHERE id = 1
      `).run(liqFee);

      if (onLiquidation) {
        onLiquidation({
          position_id: pos.id,
          market: pos.slug,
          side: pos.side,
          size: pos.size,
          entry_price: pos.entry_price,
          liq_price: currentPrice,
          pnl,
        });
      }
    }
  }
}

export function startLiquidationChecker() {
  if (liquidationInterval) return;
  liquidationInterval = setInterval(checkLiquidations, 5000);
}
