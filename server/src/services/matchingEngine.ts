import db from "../db/database";
import { calcLiquidationPrice } from "./marginEngine";
import { getCachedPrice } from "./priceService";

interface OpenPositionParams {
  marketId: string;
  wallet: string;
  side: "long" | "short";
  leverage: number;
  collateral: number;
  orderType: string;
  triggerPrice?: number;
}

export function openPosition(params: OpenPositionParams) {
  const market = db.query("SELECT * FROM markets WHERE id = ?").get(params.marketId) as any;
  if (!market) throw new Error("Market not found");
  if (market.status === "retired") throw new Error("Market is retired");

  if (params.side !== "long" && params.side !== "short") throw new Error("Side must be 'long' or 'short'");
  if (!params.collateral || params.collateral < 5) throw new Error("Minimum collateral is $5");
  if (params.collateral > 250_000) throw new Error("Maximum collateral is $250,000");
  if (!params.leverage || params.leverage < 2) throw new Error("Minimum leverage is 2×");
  if (params.leverage > market.max_leverage) throw new Error(`Max leverage is ${market.max_leverage}×`);

  const cached = getCachedPrice(market.token_mint);
  const entryPrice = params.triggerPrice || cached?.price;
  if (!entryPrice) throw new Error("No price available");

  const size = params.collateral * params.leverage;
  const liqPrice = calcLiquidationPrice(params.side, entryPrice, params.leverage);
  const fee = size * (market.trading_fee / 10000);
  const creatorFee = fee * 0.10;

  const posId = crypto.randomUUID().slice(0, 16);
  db.query(`
    INSERT INTO positions (id, market_id, wallet, side, leverage, collateral, size, entry_price, liq_price, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
  `).run(posId, params.marketId, params.wallet, params.side, params.leverage, params.collateral, size, entryPrice, liqPrice);

  const tradeId = crypto.randomUUID().slice(0, 16);
  db.query(`
    INSERT INTO trades (id, market_id, position_id, wallet, side, leverage, size, price, fee, creator_fee)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(tradeId, params.marketId, posId, params.wallet, params.side, params.leverage, size, entryPrice, fee, creatorFee);

  db.query(`
    INSERT INTO creator_earnings (market_id, wallet, amount, trade_id)
    VALUES (?, ?, ?, ?)
  `).run(params.marketId, market.creator, creatorFee, tradeId);

  db.query(`
    UPDATE markets SET cumulative_vol = cumulative_vol + ?, updated_at = datetime('now') WHERE id = ?
  `).run(size, params.marketId);

  db.query(`
    UPDATE platform_stats
    SET total_volume = total_volume + ?, total_trades = total_trades + 1, total_fees = total_fees + ?, updated_at = datetime('now')
    WHERE id = 1
  `).run(size, fee);

  if (market.status === "seeded" && (market.cumulative_vol + size) >= 50000) {
    db.query("UPDATE markets SET status = 'graduated' WHERE id = ?").run(params.marketId);
  }

  return {
    position: { id: posId, market_id: params.marketId, wallet: params.wallet, side: params.side, leverage: params.leverage, collateral: params.collateral, size, entry_price: entryPrice, liq_price: liqPrice, status: "open" },
    trade: { id: tradeId, size, price: entryPrice, fee, creator_fee: creatorFee },
  };
}

export function closePosition(positionId: string, wallet: string) {
  const pos = db.query("SELECT * FROM positions WHERE id = ? AND wallet = ?").get(positionId, wallet) as any;
  if (!pos) throw new Error("Position not found");
  if (pos.status !== "open") throw new Error("Position not open");

  const market = db.query("SELECT * FROM markets WHERE id = ?").get(pos.market_id) as any;
  const cached = getCachedPrice(market.token_mint);
  if (!cached) throw new Error("No price available");

  const closePrice = cached.price;
  const pnl = pos.side === "long"
    ? ((closePrice - pos.entry_price) / pos.entry_price) * pos.size
    : ((pos.entry_price - closePrice) / pos.entry_price) * pos.size;

  db.query(`
    UPDATE positions SET status = 'closed', pnl = ?, closed_at = datetime('now'), close_price = ? WHERE id = ?
  `).run(pnl, closePrice, positionId);

  return { position: { ...pos, status: "closed", pnl, close_price: closePrice }, pnl };
}
