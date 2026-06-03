<div align="center">

# HYPERPERP · $HYPERP

**Open a perp on anything that trades.**

A permissionless perpetual-futures launchpad on Solana. Turn any SPL token into a
leveraged market the moment its launch fee clears — up to **100× isolated leverage**,
six order types, and tight spreads from the very first block.

[hyperperp.fun](https://hyperperp.fun) · [X / Twitter](https://x.com/HyperPerp) · [Pump.fun](https://pump.fun)

</div>

---

## ✨ Features

- **Permissionless markets** — any SPL mint becomes a perp for a flat **0.3 SOL** launch fee. No listing committee.
- **Up to 100× isolated leverage**, six order types.
- **vAMM liquidity** — newborn markets open against a virtual bonding-curve pool, so day-one trades clear at sub-percent slippage. Markets graduate at $50K volume.
- **Creator revenue share** — **10%** of every trading fee on a market routes to its launcher, forever.
- **Live everything** — realtime candlestick chart (M5–1D) + price ticker via a **10-source failover feed**.
- **Wallets** — Phantom & Solflare.

## 🪙 $HYPERP token

| | |
|---|---|
| Token | **$HYPERP** (Solana SPL) |
| Total supply | **1,000,000,000 (1B)** |
| Distribution | **100% fair launch** |
| Team / VC / presale | **0% — none** |
| Launch venue | **Pump.fun** |

**Utility:** fee discounts, protocol revenue share, governance, priority access.

## 🧱 Tech stack

- **Frontend** — Bun + React 19 + [lightweight-charts](https://github.com/tradingview/lightweight-charts), hand-authored CSS (no framework lock-in).
- **On-chain** — Anchor (Rust) vAMM perp program: `initialize_exchange`, `create_market`, `open_position`, `close_position`, `update_funding`, `liquidate`.
- **Realtime feed** — Binance / Bybit / OKX / Gate / Coinbase / Kraken / Bitget / CryptoCompare / CoinGecko / Coincap with automatic failover.

## 📁 Structure

```
src/                  frontend (components/site, lib)
onchain/              Anchor program (programs/onchain) + devnet setup script
serve.ts · static.ts  lightweight static server (port 3002)
deploy/Caddyfile      HTTPS reverse-proxy template (Caddy + Let's Encrypt)
```

## 🚀 Run the website

```bash
bun install
bun run build:web     # bundle static site into dist/ + copy logos
bun static.ts         # serve dist on http://0.0.0.0:3002   (or: bun dev)
```

## ⛓️ On-chain program (devnet)

```bash
cd onchain
anchor build
anchor deploy --provider.cluster devnet
bun add @coral-xyz/anchor @solana/web3.js @solana/spl-token
bun run scripts/setup.ts   # init exchange, seed markets, mint test USDC
```

## ⚠️ Disclaimer

Perpetual futures are high-risk — leverage can wipe out your collateral quickly, and
permissionless markets can be thin or volatile. Nothing here is financial advice. The
on-chain program is **unaudited**; use devnet only until a security audit is complete.
Always verify the official $HYPERP contract address from our X account.

---

<div align="center">© 2026 HYPERPERP Labs · Live on Solana</div>
