-- Markets
CREATE TABLE IF NOT EXISTS markets (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  slug          TEXT UNIQUE NOT NULL,
  token_mint    TEXT NOT NULL,
  token_symbol  TEXT NOT NULL,
  token_name    TEXT NOT NULL,
  token_icon    TEXT,
  max_leverage  INTEGER NOT NULL DEFAULT 50,
  trading_fee   INTEGER NOT NULL DEFAULT 25,
  collateral    TEXT NOT NULL DEFAULT 'USDC',
  status        TEXT NOT NULL DEFAULT 'seeded',
  creator       TEXT NOT NULL,
  launch_tx     TEXT,
  virtual_depth REAL NOT NULL DEFAULT 120000,
  cumulative_vol REAL NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Positions
CREATE TABLE IF NOT EXISTS positions (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  wallet        TEXT NOT NULL,
  side          TEXT NOT NULL,
  leverage      REAL NOT NULL,
  collateral    REAL NOT NULL,
  size          REAL NOT NULL,
  entry_price   REAL NOT NULL,
  liq_price     REAL NOT NULL,
  status        TEXT NOT NULL DEFAULT 'open',
  pnl           REAL DEFAULT 0,
  opened_at     TEXT NOT NULL DEFAULT (datetime('now')),
  closed_at     TEXT,
  close_price   REAL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  wallet        TEXT NOT NULL,
  order_type    TEXT NOT NULL,
  side          TEXT NOT NULL,
  leverage      REAL NOT NULL,
  collateral    REAL NOT NULL,
  trigger_price REAL,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  filled_at     TEXT,
  fill_price    REAL
);

-- Trades
CREATE TABLE IF NOT EXISTS trades (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  position_id   TEXT REFERENCES positions(id),
  wallet        TEXT NOT NULL,
  side          TEXT NOT NULL,
  leverage      REAL NOT NULL,
  size          REAL NOT NULL,
  price         REAL NOT NULL,
  fee           REAL NOT NULL,
  creator_fee   REAL NOT NULL,
  executed_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Price Cache
CREATE TABLE IF NOT EXISTS price_cache (
  token_mint    TEXT PRIMARY KEY,
  symbol        TEXT NOT NULL,
  price         REAL NOT NULL,
  change_24h    REAL DEFAULT 0,
  volume_24h    REAL DEFAULT 0,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Creator Earnings
CREATE TABLE IF NOT EXISTS creator_earnings (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  wallet        TEXT NOT NULL,
  amount        REAL NOT NULL,
  trade_id      TEXT REFERENCES trades(id),
  earned_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Platform Stats
CREATE TABLE IF NOT EXISTS platform_stats (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  total_markets INTEGER DEFAULT 0,
  total_volume  REAL DEFAULT 0,
  total_trades  INTEGER DEFAULT 0,
  total_fees    REAL DEFAULT 0,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_positions_market ON positions(market_id);
CREATE INDEX IF NOT EXISTS idx_positions_wallet ON positions(wallet);
CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status);
CREATE INDEX IF NOT EXISTS idx_orders_market ON orders(market_id);
CREATE INDEX IF NOT EXISTS idx_orders_wallet ON orders(wallet);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_trades_market ON trades(market_id);
CREATE INDEX IF NOT EXISTS idx_trades_wallet ON trades(wallet);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_market ON creator_earnings(market_id);
CREATE INDEX IF NOT EXISTS idx_creator_earnings_wallet ON creator_earnings(wallet);

-- Seed platform stats
INSERT OR IGNORE INTO platform_stats (id, total_markets, total_volume, total_trades, total_fees) VALUES (1, 0, 0, 0, 0);
