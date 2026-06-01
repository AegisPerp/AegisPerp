# SUPERPROMPT — Permissionless Perpetual Launchpad on Solana

> **Purpose**: This document is the single source of truth for building, deploying, and marketing a permissionless perpetual-futures launchpad platform on Solana. Feed this entire file to Claude Code as context before starting any task.

---

## 0 · PROJECT IDENTITY

```
Name         : [PROJECT_NAME]        ← replace everywhere
Ticker       : $[TICKER]             ← replace everywhere
Domain       : [yourdomain.fun]      ← replace everywhere
Twitter/X    : @[handle]             ← replace everywhere
Tagline      : "Open a perp on anything that trades."
One-liner    : A permissionless perpetual launchpad on Solana. Any SPL token becomes a leveraged market the moment its launch fee clears.
Narrative    : "pump.fun democratized token launches. We democratize leverage."
```

### Brand Palette

```
Background       : #EAEFF5
Surface          : #FFFFFF
Surface Alt      : #F4F7FA
Accent (Teal)    : #0E9E92
Accent Light     : rgba(14,158,146,0.08)
Long (Green)     : #0FA968
Short (Red)      : #E5484D
Text Primary     : #0A1628
Text Muted       : #5A6A7E
Border           : #D4DCE6
Border Light     : #E4EAF0
```

### Typography

```
Primary Font     : DM Sans (Google Fonts)
Fallback         : -apple-system, BlinkMacSystemFont, sans-serif
Headings         : 800 weight, letter-spacing: -0.03em
Body             : 400-500 weight, line-height: 1.6
Monospace        : JetBrains Mono (for code/data)
```

---

## 1 · PRODUCT CONCEPT & MEKANIK

### 1.1 What This Platform Does

Platform ini memungkinkan siapapun untuk:
1. **Launch** — Bayar 0.3 SOL flat fee → langsung bikin perpetual futures market untuk token SPL apapun
2. **Trade** — Long/Short token apapun yang ada di launchpad dengan leverage sampai 100×, isolated margin
3. **Earn** — Creator market dapat 10% dari semua trading fee selamanya

### 1.2 Core Mechanics

#### Market Lifecycle (3 States)

```
SEEDED → GRADUATED → RETIRED

1. SEEDED
   - Market baru dibuat, virtual bonding curve liquidity
   - Formula: x * y = k (constant product)
   - Virtual depth = base_depth × (max_leverage / 25)
   - Trades clear against curve, sub-1% slippage untuk $10K order

2. GRADUATED
   - Trigger: cumulative_real_volume ≥ $50,000
   - Real LP liquidity takes over
   - Bonding curve jadi fallback

3. RETIRED
   - Trigger: 24h volume < floor selama 30 hari berturut-turut
   - Reduce-only mode (bisa close, gak bisa open baru)
```

#### Leverage Tiers & Margin Requirements

```
┌──────────┬─────────────────┬──────────────┐
│ Tier     │ Initial Margin  │ Maint Margin │
├──────────┼─────────────────┼──────────────┤
│ ≤ 10×    │ 10%             │ 5%           │
│ ≤ 25×    │ 4%              │ 2%           │
│ ≤ 50×    │ 2%              │ 1%           │
│ ≤ 100×   │ 1%              │ 0.5%         │
└──────────┴─────────────────┴──────────────┘
```

#### Fee Structure

```
┌─────────────────┬─────────────┬──────────────────────────────────┐
│ Surface          │ Amount      │ Notes                           │
├─────────────────┼─────────────┼──────────────────────────────────┤
│ Launch fee       │ 0.3 SOL     │ One-time, non-refundable        │
│ Trading fee      │ 3-100 bps   │ Per side, set by creator        │
│ Liquidation fee  │ 0.5%        │ Of remaining collateral         │
│ Funding rate     │ Variable    │ Hourly, capped ±0.05%/interval  │
│ Min position     │ $5          │ Notional                        │
│ Max position     │ $250K       │ Per market per wallet            │
└─────────────────┴─────────────┴──────────────────────────────────┘
```

#### Fee Distribution

```
Creator    : 10%  → per-block to creator wallet
Protocol   : 60%  → per-epoch to treasury
Insurance  : 20%  → per-epoch to fund
LPs        : 10%  → per-epoch pro rata (post-graduation)
```

#### 6 Order Types

```
1. Market           (instant)
2. Limit            (passive)
3. Stop-market      (trigger)
4. Take-profit      (trigger)
5. Stop-loss        (trigger)
6. Interpolated     (advanced - DCA-style entry)
```

#### Oracle & Price Feed

```
- Pull price dari Pyth Network / Birdeye / Jupiter Price API
- Staleness threshold: 60 detik
- Jika feed stale > 60s → market masuk protective mode (reduce-only)
- TWAP fallback planned untuk v0.2
```

---

## 2 · TECH STACK

### 2.1 Frontend

```
Framework        : Next.js 14 (App Router)
Language         : TypeScript
Styling          : Tailwind CSS + custom CSS variables (palette di atas)
Animations       : Framer Motion
Wallet           : @solana/wallet-adapter-react + Phantom/Solflare
Charts           : Lightweight Charts (TradingView) atau custom SVG
State            : Zustand
Deploy           : Docker container di VPS (Traefik reverse proxy)
```

### 2.2 Backend API

```
Runtime          : Node.js 20 LTS
Framework        : Hono (lightweight, fast)
Language         : TypeScript
Database         : SQLite via sql.js (atau better-sqlite3)
ORM              : Drizzle ORM (optional, bisa raw SQL)
Price Feed       : Jupiter Price API v2 + Birdeye DeFi API
WebSocket        : ws library untuk live price streaming
Deploy           : PM2 process manager di VPS
```

### 2.3 Infrastructure

```
VPS              : Hostinger KVM
Reverse Proxy    : Traefik v3 (sudah ada di Portainer stack)
SSL              : Let's Encrypt via Traefik
Container        : Docker + Docker Compose
Process Manager  : PM2 (untuk backend Node.js)
Domain           : [yourdomain.fun] → A record ke VPS IP
```

---

## 3 · PROJECT STRUCTURE

```
[project-root]/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── .env.example
├── .env
│
├── public/
│   ├── favicon.svg
│   ├── logo.svg
│   ├── logo-mark.svg
│   ├── og-image.png              (1200×630)
│   ├── brand/
│   │   ├── banner.png            (1500×500 Twitter banner)
│   │   └── pfp.png               (1024×1024)
│   └── tokens/                   (token icons, 64×64 PNG)
│       ├── WIF.png
│       ├── BONK.png
│       └── ...
│
├── src/
│   ├── app/                      (Next.js App Router)
│   │   ├── layout.tsx            (root layout, fonts, meta)
│   │   ├── page.tsx              (landing / marketing site)
│   │   ├── globals.css
│   │   │
│   │   ├── launchpad/
│   │   │   ├── page.tsx          (market board - list semua market)
│   │   │   ├── create/
│   │   │   │   └── page.tsx      (create new market form)
│   │   │   └── [slug]/
│   │   │       └── page.tsx      (trading terminal per market)
│   │   │
│   │   ├── docs/
│   │   │   └── page.tsx          (documentation single-page)
│   │   │
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   └── privacy/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── TickerTape.tsx
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── StatsStrip.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── TerminalShowcase.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── launchpad/
│   │   │   ├── MarketCard.tsx
│   │   │   ├── MarketGrid.tsx
│   │   │   ├── FilterTabs.tsx     (trending/new/gainers/losers/watchlist)
│   │   │   └── CreateMarketForm.tsx
│   │   │
│   │   ├── terminal/
│   │   │   ├── TradingPanel.tsx   (long/short toggle, leverage, collateral)
│   │   │   ├── OrderForm.tsx
│   │   │   ├── PositionTable.tsx
│   │   │   ├── PriceChart.tsx     (TradingView lightweight charts)
│   │   │   ├── OrderBook.tsx
│   │   │   ├── RecentFills.tsx
│   │   │   └── MarketHeader.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Slider.tsx
│   │       ├── Sparkline.tsx
│   │       ├── AnimCounter.tsx
│   │       └── Skeleton.tsx
│   │
│   ├── lib/
│   │   ├── constants.ts           (palette, endpoints, config)
│   │   ├── utils.ts               (formatters, helpers)
│   │   ├── api.ts                 (API client functions)
│   │   └── solana.ts              (wallet connection, tx helpers)
│   │
│   ├── hooks/
│   │   ├── useMarkets.ts
│   │   ├── usePrices.ts
│   │   ├── usePositions.ts
│   │   └── useWebSocket.ts
│   │
│   ├── store/
│   │   ├── marketStore.ts         (Zustand)
│   │   ├── tradeStore.ts
│   │   └── walletStore.ts
│   │
│   └── types/
│       ├── market.ts
│       ├── order.ts
│       ├── position.ts
│       └── price.ts
│
├── server/                        (Backend API — bisa jadi repo terpisah)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts               (Hono app entry)
│   │   ├── db/
│   │   │   ├── schema.sql
│   │   │   └── database.ts        (sql.js init)
│   │   │
│   │   ├── routes/
│   │   │   ├── markets.ts         (CRUD markets)
│   │   │   ├── prices.ts          (price feed proxy/cache)
│   │   │   ├── positions.ts       (position management)
│   │   │   ├── orders.ts          (order placement/cancel)
│   │   │   ├── trades.ts          (trade history)
│   │   │   └── stats.ts           (platform stats)
│   │   │
│   │   ├── services/
│   │   │   ├── priceService.ts    (Jupiter/Birdeye price fetcher)
│   │   │   ├── bondingCurve.ts    (virtual AMM logic)
│   │   │   ├── marginEngine.ts    (margin calc, liq price)
│   │   │   ├── fundingRate.ts     (hourly funding calc)
│   │   │   ├── matchingEngine.ts  (order matching)
│   │   │   └── liquidation.ts     (position liquidation checker)
│   │   │
│   │   ├── ws/
│   │   │   └── priceStream.ts     (WebSocket server for live prices)
│   │   │
│   │   └── utils/
│   │       ├── solana.ts          (on-chain interactions)
│   │       └── helpers.ts
│   │
│   └── data/
│       └── platform.db            (SQLite database file)
│
└── scripts/
    ├── seed-markets.ts            (seed initial markets from top tokens)
    ├── deploy.sh                  (VPS deployment script)
    └── backup-db.sh
```

---

## 4 · DATABASE SCHEMA

```sql
-- ═══ MARKETS ═══
CREATE TABLE markets (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  slug          TEXT UNIQUE NOT NULL,              -- "wif", "bonk", etc
  token_mint    TEXT NOT NULL,                     -- SPL token mint address
  token_symbol  TEXT NOT NULL,                     -- "WIF"
  token_name    TEXT NOT NULL,                     -- "dogwifhat"
  token_icon    TEXT,                              -- URL to icon
  max_leverage  INTEGER NOT NULL DEFAULT 50,       -- 2-100
  trading_fee   INTEGER NOT NULL DEFAULT 25,       -- basis points (25 = 0.25%)
  collateral    TEXT NOT NULL DEFAULT 'USDC',
  status        TEXT NOT NULL DEFAULT 'seeded',    -- seeded | graduated | retired
  creator       TEXT NOT NULL,                     -- creator wallet address
  launch_tx     TEXT,                              -- launch transaction signature
  virtual_depth REAL NOT NULL DEFAULT 120000,      -- initial virtual depth USD
  cumulative_vol REAL NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══ POSITIONS ═══
CREATE TABLE positions (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  wallet        TEXT NOT NULL,                     -- trader wallet
  side          TEXT NOT NULL,                     -- 'long' | 'short'
  leverage      REAL NOT NULL,
  collateral    REAL NOT NULL,                     -- USDC amount
  size          REAL NOT NULL,                     -- notional size
  entry_price   REAL NOT NULL,
  liq_price     REAL NOT NULL,
  status        TEXT NOT NULL DEFAULT 'open',      -- open | closed | liquidated
  pnl           REAL DEFAULT 0,
  opened_at     TEXT NOT NULL DEFAULT (datetime('now')),
  closed_at     TEXT,
  close_price   REAL
);

-- ═══ ORDERS ═══
CREATE TABLE orders (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  wallet        TEXT NOT NULL,
  order_type    TEXT NOT NULL,                     -- market|limit|stop_market|take_profit|stop_loss|interpolated
  side          TEXT NOT NULL,                     -- long | short
  leverage      REAL NOT NULL,
  collateral    REAL NOT NULL,
  trigger_price REAL,                              -- for limit/stop orders
  status        TEXT NOT NULL DEFAULT 'pending',   -- pending|filled|cancelled|expired
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  filled_at     TEXT,
  fill_price    REAL
);

-- ═══ TRADES ═══
CREATE TABLE trades (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  position_id   TEXT REFERENCES positions(id),
  wallet        TEXT NOT NULL,
  side          TEXT NOT NULL,
  leverage      REAL NOT NULL,
  size          REAL NOT NULL,
  price         REAL NOT NULL,
  fee           REAL NOT NULL,
  creator_fee   REAL NOT NULL,                     -- 10% of fee → creator
  executed_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══ PRICE CACHE ═══
CREATE TABLE price_cache (
  token_mint    TEXT PRIMARY KEY,
  symbol        TEXT NOT NULL,
  price         REAL NOT NULL,
  change_24h    REAL DEFAULT 0,
  volume_24h    REAL DEFAULT 0,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══ CREATOR EARNINGS ═══
CREATE TABLE creator_earnings (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  market_id     TEXT NOT NULL REFERENCES markets(id),
  wallet        TEXT NOT NULL,
  amount        REAL NOT NULL,
  trade_id      TEXT REFERENCES trades(id),
  earned_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══ PLATFORM STATS ═══
CREATE TABLE platform_stats (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  total_markets INTEGER DEFAULT 0,
  total_volume  REAL DEFAULT 0,
  total_trades  INTEGER DEFAULT 0,
  total_fees    REAL DEFAULT 0,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ═══ INDEXES ═══
CREATE INDEX idx_positions_market ON positions(market_id);
CREATE INDEX idx_positions_wallet ON positions(wallet);
CREATE INDEX idx_positions_status ON positions(status);
CREATE INDEX idx_orders_market ON orders(market_id);
CREATE INDEX idx_orders_wallet ON orders(wallet);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_trades_market ON trades(market_id);
CREATE INDEX idx_trades_wallet ON trades(wallet);
CREATE INDEX idx_creator_earnings_market ON creator_earnings(market_id);
CREATE INDEX idx_creator_earnings_wallet ON creator_earnings(wallet);
```

---

## 5 · BACKEND API ENDPOINTS

### 5.1 Markets

```
GET    /api/markets                    → List all markets (filterable)
  Query: ?status=seeded|graduated&sort=volume|new|gainers|losers&limit=50&offset=0
  Response: { markets: Market[], total: number }

GET    /api/markets/:slug              → Single market detail
  Response: { market: Market, stats: MarketStats }

POST   /api/markets                    → Create new market
  Body: { token_mint, max_leverage, trading_fee, creator_wallet, launch_tx }
  Response: { market: Market }

GET    /api/markets/:slug/trades       → Trade history for market
  Query: ?limit=50&offset=0
  Response: { trades: Trade[] }

GET    /api/markets/:slug/chart        → OHLCV candle data
  Query: ?interval=1m|5m|15m|1h|4h|1d&from=timestamp&to=timestamp
  Response: { candles: Candle[] }
```

### 5.2 Prices

```
GET    /api/prices                     → All cached prices
  Response: { prices: PriceData[] }

GET    /api/prices/:mint               → Price for specific token
  Response: { price, change_24h, volume_24h, updated_at }

WS     /ws/prices                      → Live price stream
  Subscribe: { action: "subscribe", markets: ["wif", "bonk"] }
  Message:   { market: "wif", price: 1.8472, timestamp: "..." }
```

### 5.3 Positions

```
GET    /api/positions                  → Positions for wallet
  Query: ?wallet=xxx&status=open|closed&market=wif
  Response: { positions: Position[] }

POST   /api/positions/open             → Open position
  Body: { market_id, wallet, side, leverage, collateral, order_type, trigger_price? }
  Response: { position: Position, trade: Trade }

POST   /api/positions/:id/close        → Close position
  Body: { wallet }
  Response: { position: Position, pnl: number }

GET    /api/positions/:id              → Single position detail
  Response: { position: Position, market: Market, current_pnl: number }
```

### 5.4 Orders

```
GET    /api/orders                     → Pending orders for wallet
  Query: ?wallet=xxx&market=wif
  Response: { orders: Order[] }

POST   /api/orders                     → Place order
  Body: { market_id, wallet, order_type, side, leverage, collateral, trigger_price? }
  Response: { order: Order }

DELETE /api/orders/:id                 → Cancel order
  Body: { wallet }
  Response: { success: true }
```

### 5.5 Stats & Earnings

```
GET    /api/stats                      → Platform-wide stats
  Response: { total_markets, total_volume, total_trades, total_fees }

GET    /api/earnings/:wallet           → Creator earnings for wallet
  Query: ?market=wif
  Response: { earnings: Earning[], total: number }

GET    /api/leaderboard                → Top markets by volume
  Query: ?period=24h|7d|30d&limit=20
  Response: { markets: MarketWithVolume[] }
```

---

## 6 · BACKEND SERVICES (BUSINESS LOGIC)

### 6.1 Price Service

```typescript
// server/src/services/priceService.ts
// Fetches prices dari Jupiter Price API v2
// Endpoint: https://api.jup.ag/price/v2?ids=mint1,mint2,...
// Cache ke SQLite price_cache table
// Refresh setiap 5 detik
// Broadcast via WebSocket ke connected clients
// Fallback: Birdeye API jika Jupiter down
```

### 6.2 Bonding Curve Service

```typescript
// server/src/services/bondingCurve.ts
// Virtual AMM menggunakan constant-product formula: x * y = k
//
// Saat market baru dibuat:
//   base_depth = 120000 (USD)
//   virtual_depth = base_depth * (max_leverage / 25)
//   x = virtual_depth / 2
//   y = virtual_depth / 2
//   k = x * y
//
// Quote buy/sell:
//   buy(amount):  new_y = k / (x + amount) → tokens_out = y - new_y
//   sell(tokens): new_x = k / (y + tokens) → usdc_out = x - new_x
//   slippage = abs(price_impact) / spot_price
//
// Graduation check:
//   if cumulative_real_volume >= 50000 → status = 'graduated'
```

### 6.3 Margin Engine

```typescript
// server/src/services/marginEngine.ts
//
// Calculate liquidation price:
//   LONG:  liq_price = entry_price * (1 - (1/leverage) * (1 - maint_margin_rate))
//   SHORT: liq_price = entry_price * (1 + (1/leverage) * (1 - maint_margin_rate))
//
// Calculate unrealized PnL:
//   LONG:  pnl = (current_price - entry_price) / entry_price * size
//   SHORT: pnl = (entry_price - current_price) / entry_price * size
//
// Margin ratio check:
//   margin_ratio = (collateral + unrealized_pnl) / size
//   if margin_ratio <= maint_margin → LIQUIDATE
//
// getMarginTier(leverage):
//   ≤10 → { initial: 0.10, maintenance: 0.05 }
//   ≤25 → { initial: 0.04, maintenance: 0.02 }
//   ≤50 → { initial: 0.02, maintenance: 0.01 }
//   ≤100 → { initial: 0.01, maintenance: 0.005 }
```

### 6.4 Funding Rate

```typescript
// server/src/services/fundingRate.ts
//
// Settles every hour
// Rate = clamp((mark_price - index_price) / index_price, -0.0005, 0.0005)
//
// If rate > 0: longs pay shorts
// If rate < 0: shorts pay longs
//
// Payment per position = position_size * funding_rate
// Runs as cron job setiap jam
```

### 6.5 Liquidation Checker

```typescript
// server/src/services/liquidation.ts
//
// Runs every 5 seconds (setInterval)
// 1. Get all open positions
// 2. For each position, get current price from cache
// 3. Calculate margin ratio
// 4. If margin_ratio <= maintenance_margin:
//    a. Close position at current market price
//    b. Calculate liquidation fee (0.5% of remaining collateral)
//    c. Split fee: 50% keeper, 50% insurance fund
//    d. Return remaining collateral (if any) to trader
//    e. Update position status = 'liquidated'
//    f. Broadcast liquidation event via WebSocket
```

---

## 7 · LANDING PAGE SPECIFICATION

### 7.1 Sections (Top to Bottom)

```
1. NAVBAR
   - Logo + project name (left)
   - Links: Markets, Launch, Docs (center)
   - X/Twitter icon + "Open app" button (right)
   - Glassmorphism on scroll (backdrop-filter: blur(16px))

2. HERO
   - Badge: "Beta · Live on Solana" with pulse dot
   - H1: "Open a perp on anything that trades."
   - Subtitle: one-liner description
   - 2 CTAs: "Explore markets" (dark) + "Launch a market" (outlined)
   - Stats strip: 100× max leverage | 6 order types | 0.3 SOL to launch

3. TRADING CARD PREVIEW (right side of hero or below)
   - Mock trading terminal card showing WIF-PERP
   - Interactive: Long/Short toggle, leverage slider
   - Live-looking price display

4. TICKER TAPE #1
   - Infinite scroll left, 12+ token cards
   - Each card: icon + symbol + price + 24h change (green/red)

5. TICKER TAPE #2
   - Infinite scroll RIGHT (opposite direction)
   - Different set of tokens

6. HOW IT WORKS (3 columns)
   Card 01: "Instant listings"
     → Pay 0.3 SOL, ship a perp
     → Contains: mini create-market form mockup
   Card 02: "Bonding-curve liquidity"
     → Tight spreads from minute one
     → Contains: SVG bonding curve chart with graduation line
   Card 03: "Creator share"
     → You collect for the life of the market
     → Contains: earnings sparkline + 24h/7d/lifetime stats

7. TERMINAL SHOWCASE
   - Full trading terminal mockup (larger)
   - Alongside: live fills feed + fee distribution table
   - Header: "One terminal — The same desk across every market"

8. CTA SECTION
   - "Pick a token. Set the leverage. Ship the perp."
   - 2 buttons: Launch a market + Browse first

9. FOOTER TICKER TAPE
   - One more infinite scroll

10. FOOTER
    - 4 columns: Brand info | Product links | Build links | Company links
    - Copyright + beta badge
```

### 7.2 Animations & Interactions

```
- Page load: fade-up stagger for hero elements (0ms, 100ms, 200ms, 300ms)
- Scroll-triggered: AnimCounter counts from 0 to target saat masuk viewport
- Ticker tape: infinite CSS scroll, pause on hover
- Cards: translateY(-3px) + box-shadow on hover
- Buttons: translateY(-2px) + glow shadow on hover
- Live fills: auto-highlight cycling setiap 2.5s
- Navbar: transparent → glassmorphism on scroll (threshold: 20px)
- Pulse animation: live indicator dots (opacity 1→0.3→1, 2s loop)
- Trading panel: side toggle changes button color + recalculates liq price
- Leverage slider: real-time update size, fee, liq price
```

---

## 8 · PAGES DETAIL

### 8.1 /launchpad (Market Board)

```
Layout:
- Header: search bar + filter tabs
- Filter tabs: All | Trending | New | Gainers | Losers | Watchlist | My Positions
- Grid of MarketCards (responsive: 1/2/3/4 columns)

MarketCard:
┌──────────────────────────────────┐
│ [icon] WIF-PERP        50× max  │
│ dogwifhat                        │
│                                  │
│ $1.8472          ▲ 2.41% · 24h  │
│ [sparkline chart]                │
│                                  │
│ Vol 24h: $284K    OI: $1.2M     │
│ [Long btn]  [Short btn]         │
└──────────────────────────────────┘

Sort options: Volume (24h) | Price change | Newest | Max leverage
```

### 8.2 /launchpad/create (Create Market)

```
Form fields:
1. Token Mint Address (paste SPL mint, auto-fetch metadata)
2. Max Leverage slider (2× - 100×)
3. Trading Fee slider (3 - 100 bps)
4. Preview card showing: symbol, name, leverage, fee, collateral type
5. Launch fee display: 0.3 SOL
6. "Launch market →" button (triggers wallet sign)

Post-launch:
- Success animation
- Link to new market page
- Share buttons (Twitter pre-filled)
```

### 8.3 /launchpad/[slug] (Trading Terminal)

```
Layout (desktop):
┌─────────────────────────────────────────────────────┐
│ [Market Header: icon, name, price, 24h change]      │
├───────────────────────┬─────────────────────────────┤
│                       │  Order Panel                │
│   Price Chart         │  - Long/Short toggle        │
│   (TradingView LC)    │  - Order type selector      │
│                       │  - Collateral input         │
│                       │  - Leverage slider          │
│                       │  - Entry/Liq/Size/Fee info  │
│                       │  - Submit button            │
├───────────────────────┼─────────────────────────────┤
│ Open Positions Table  │  Recent Fills / Order Book  │
│ Market Info / Stats   │  Market parameters          │
└───────────────────────┴─────────────────────────────┘

Mobile: stacked vertically, chart → order panel → positions
```

### 8.4 /docs (Documentation)

```
Single page, sections anchored:
- Overview (#overview)
- Quickstart (#quickstart)
- Manifesto (#manifesto)
- Markets (#markets)
- Order Types (#orders)
- Risk & Liquidation (#risk)
- Bonding Curve (#curve)
- Creator Fees (#creators)
- Fees & Limits (#fees)
- API (#api) — "coming soon"
- Status (#status) — component status table
- Brand Kit (#brand) — logo downloads + palette
- Changelog (#changelog)
- FAQ (#faq)
- Disclosures (#disclosures)

Style: sidebar nav (desktop), hamburger (mobile)
Monospace code blocks for formulas
Tables for parameters
```

---

## 9 · DEPLOYMENT

### 9.1 Docker Compose

```yaml
version: "3.8"

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: perp-frontend
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.perp.rule=Host(`[yourdomain.fun]`)"
      - "traefik.http.routers.perp.entrypoints=websecure"
      - "traefik.http.routers.perp.tls.certresolver=letsencrypt"
      - "traefik.http.services.perp.loadbalancer.server.port=3000"
    networks:
      - traefik-net

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: perp-backend
    restart: unless-stopped
    volumes:
      - ./server/data:/app/data
    environment:
      - PORT=4000
      - DATABASE_PATH=/app/data/platform.db
      - JUPITER_API_URL=https://api.jup.ag/price/v2
      - SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.perp-api.rule=Host(`api.[yourdomain.fun]`)"
      - "traefik.http.routers.perp-api.entrypoints=websecure"
      - "traefik.http.routers.perp-api.tls.certresolver=letsencrypt"
      - "traefik.http.services.perp-api.loadbalancer.server.port=4000"
    networks:
      - traefik-net

networks:
  traefik-net:
    external: true
```

### 9.2 Dockerfile (Frontend)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### 9.3 Deployment Script

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Deploying [PROJECT_NAME]..."

# Pull latest
git pull origin main

# Build & restart
docker compose build --no-cache
docker compose up -d

# Check health
sleep 5
curl -s https://[yourdomain.fun] > /dev/null && echo "✅ Frontend live" || echo "❌ Frontend down"
curl -s https://api.[yourdomain.fun]/api/stats > /dev/null && echo "✅ Backend live" || echo "❌ Backend down"

echo "🎉 Deploy complete"
```

### 9.4 DNS Records

```
A     [yourdomain.fun]       → [VPS_IP]
A     api.[yourdomain.fun]   → [VPS_IP]
A     www.[yourdomain.fun]   → [VPS_IP]
```

---

## 10 · TOKEN LAUNCH (pump.fun)

### 10.1 Token Details

```
Name            : [PROJECT_NAME]
Symbol          : $[TICKER]
Description     : (lihat di bawah)
Image           : 1024×1024 PFP (brand kit)
Twitter         : @[handle]
Website         : https://[yourdomain.fun]
Telegram        : (optional)
```

### 10.2 pump.fun Description

```
[PROJECT_NAME] — The permissionless perp launchpad on Solana.

Any SPL token → leveraged market in one signature.
- Up to 100× isolated leverage
- 6 order types
- Bonding-curve liquidity from block one
- 10% creator fee share forever

$[TICKER] is the governance and utility token powering the [PROJECT_NAME] protocol.

🔗 https://[yourdomain.fun]
🐦 https://x.com/[handle]
```

### 10.3 Token Utility (Narrative)

```
1. Fee discounts      — Hold $[TICKER] → reduced trading fees
2. Governance         — Vote on protocol parameters
3. Revenue share      — Stake $[TICKER] → earn from protocol's 60% fee share
4. Market boost       — Pay listing fee in $[TICKER] at discount
5. Insurance fund     — $[TICKER] stakers backstop the insurance pool
```

---

## 11 · TWITTER/X MARKETING

### 11.1 Launch Thread (10 tweets)

```
TWEET 1 (HOOK):
Listing a perp takes 6 months and a Telegram negotiation.

We just made it take one signature.

Introducing [PROJECT_NAME] — the permissionless perp launchpad on Solana. 🧵

TWEET 2 (PROBLEM):
Every meme coin gets a pump.fun launch in seconds.

But leverage? That's still gatekept by centralized desks who pick winners, charge listing fees, and make you wait months.

Why should leverage be a privilege?

TWEET 3 (SOLUTION):
[PROJECT_NAME] fixes this.

→ Paste any SPL token mint
→ Pick max leverage (up to 100×)
→ Pay 0.3 SOL
→ Market is live before the next block

No committee. No listing call. No NDA.

TWEET 4 (BONDING CURVE):
"But who provides liquidity for a newborn perp?"

Every market opens against a virtual bonding curve — sized to the leverage cap.

Day-one $10K trades clear at sub-1% slippage. The chart looks like a chart from minute one.

TWEET 5 (CREATOR FEES):
Launch a market → earn 10% of every trading fee FOREVER.

Not 10% of your volume. 10% of ALL volume on that market.

The earlier you list, the more you earn.

TWEET 6 (TRADING):
The terminal:
• 6 order types (market, limit, stop, TP, SL, interpolated)
• Isolated margin — one position can never nuke another
• Sub-second liquidation watcher
• Same interface for every market

Built for degens who want speed, not dashboards.

TWEET 7 (LEVERAGE TIERS):
Leverage tiers keep the engine safe:

≤10× → 5% maintenance margin
≤25× → 2%
≤50× → 1%
≤100× → 0.5%

Higher leverage = tighter margin. No socialised losses. Ever.

TWEET 8 (WHY SOLANA):
Why Solana?

Sub-second blocks + micro fees = the only chain where keeper-driven liquidations actually work at scale.

The trading engine assumes both. And it shows.

TWEET 9 (TOKEN):
$[TICKER] — the token powering [PROJECT_NAME].

→ Fee discounts for holders
→ Revenue share via staking
→ Governance over protocol params
→ Insurance fund backstop

CA: [CONTRACT_ADDRESS]

TWEET 10 (CTA):
The pumpfun generation skipped the listing dance for spot.

We're doing the same for leverage.

🌐 [yourdomain.fun]
🐦 @[handle]
💰 $[TICKER]

Every token deserves a perp. Ship yours now.
```

### 11.2 CA Announcement Post

```
[PROJECT_NAME] is LIVE 🟢

The permissionless perp launchpad on Solana.

Any token → leveraged market → one signature.

CA: [CONTRACT_ADDRESS]

🌐 [yourdomain.fun]

100× leverage | 6 order types | Creator fee share forever

$[TICKER] 🧬
```

### 11.3 Follow-Up Posts (Rotation)

```
POST A (Feature spotlight):
Most perp DEXs: 6-month listing process, NDAs, minimum volume requirements.

[PROJECT_NAME]: paste mint, pick leverage, sign once.

Market live in 11 seconds. Creator earns fees forever.

This is how it should've always worked.

POST B (Social proof / stats):
[X] markets launched in [Y] hours.
$[Z] total volume processed.
[N] unique traders.

And we're still in beta.

What happens when the keeper network drops? 👀

POST C (Educational):
How the bonding curve works:

1. You launch a market with 50× leverage
2. Virtual pool depth = $120K (auto-sized)
3. First $10K trade: 0.42% slippage
4. At $50K cumulative volume → market graduates to real LP liquidity

No cold start problem. Ever.
```

---

## 12 · DEVELOPMENT PHASES

### Phase 1: Landing Page + Token (Day 1-2)
```
□ Setup Next.js project with TypeScript + Tailwind
□ Implement landing page (all 10 sections from spec above)
□ Create brand assets (logo, PFP, banner, OG image)
□ Deploy to VPS via Docker + Traefik
□ Launch token on pump.fun
□ Post CA announcement tweet
```

### Phase 2: Market Board UI (Day 3-4)
```
□ Build /launchpad page with market grid
□ Seed 20-50 markets from top Solana tokens (hardcoded initially)
□ Implement filter tabs (trending/new/gainers/losers)
□ Connect Jupiter Price API for live prices
□ Add search functionality
```

### Phase 3: Trading Terminal UI (Day 5-7)
```
□ Build /launchpad/[slug] trading terminal page
□ Integrate TradingView Lightweight Charts
□ Build order panel (Long/Short, leverage, collateral)
□ Build position table (open positions display)
□ Build recent fills feed
□ WebSocket price streaming
```

### Phase 4: Backend API (Day 7-10)
```
□ Setup Hono server with SQLite
□ Implement all API endpoints
□ Build price service (Jupiter + cache)
□ Build bonding curve service
□ Build margin engine
□ Build liquidation checker
□ Deploy backend to VPS (api.[domain])
□ Connect frontend to backend APIs
```

### Phase 5: Market Creation Flow (Day 10-12)
```
□ Build /launchpad/create page
□ Implement token mint lookup (fetch metadata from chain)
□ Wallet connection flow (Phantom/Solflare)
□ Create market transaction (fee collection)
□ Post-creation redirect to new market
```

### Phase 6: Polish & Marketing (Day 12-14)
```
□ Documentation page (/docs)
□ Twitter thread campaign
□ Engage CT (Crypto Twitter)
□ Community building
□ Bug fixes + performance tuning
```

---

## 13 · ENVIRONMENT VARIABLES

```env
# .env.example

# ─── General ───
NODE_ENV=production
PORT=3000
API_URL=https://api.[yourdomain.fun]

# ─── Backend ───
BACKEND_PORT=4000
DATABASE_PATH=./data/platform.db

# ─── Solana ───
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_RPC_WS=wss://api.mainnet-beta.solana.com
# Kalau pake Helius:
# SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# ─── Price Feeds ───
JUPITER_PRICE_API=https://api.jup.ag/price/v2
BIRDEYE_API_KEY=your_birdeye_key
BIRDEYE_API_URL=https://public-api.birdeye.so

# ─── Platform Config ───
LAUNCH_FEE_SOL=0.3
MIN_LEVERAGE=2
MAX_LEVERAGE=100
MIN_TRADING_FEE_BPS=3
MAX_TRADING_FEE_BPS=100
GRADUATION_VOLUME=50000
DEFAULT_VIRTUAL_DEPTH=120000

# ─── Treasury ───
TREASURY_WALLET=your_treasury_wallet_address
INSURANCE_WALLET=your_insurance_wallet_address
```

---

## 14 · IMPORTANT NOTES

### What's Real vs Simulated

```
REAL (on-chain / functional):
✅ Token on pump.fun (real SPL token)
✅ Landing page (real website)
✅ Price feeds from Jupiter/Birdeye (real prices)
✅ Market creation form (collects 0.3 SOL, creates DB entry)

SIMULATED (off-chain / virtual):
⚠️ Trading engine runs server-side, NOT on-chain smart contracts
⚠️ Positions tracked in SQLite database, bukan on-chain
⚠️ Bonding curve is virtual (calculated server-side)
⚠️ Liquidations processed by backend, bukan keeper network
⚠️ PnL is calculated tapi gak settle on-chain

This is essentially a DEMO PLATFORM with real price data.
Untuk beneran on-chain perp DEX, butuh Rust/Anchor smart contracts.
```

### Legal Disclaimer

```
SELALU tampilkan disclaimer:
"This is beta software. Trading perpetuals carries the risk of total loss.
Nothing on this site is investment advice. Markets are launched permissionlessly
by third parties; the protocol does not endorse any token listed."
```

---

## 15 · QUICK-START COMMAND FOR CLAUDE CODE

```
Baca file SUPERPROMPT.md ini sebagai context utama.
Mulai dari Phase 1: buat Next.js project dengan landing page lengkap.
Ikuti exact color palette, typography, dan section layout dari spec.
Semua placeholder [PROJECT_NAME], $[TICKER], [yourdomain.fun] biarkan
sebagai placeholder — saya akan replace nanti.
Prioritas: landing page harus PIXEL-PERFECT mirip referensi,
interaktif, dan responsive. Backend menyusul setelah frontend selesai.
```
