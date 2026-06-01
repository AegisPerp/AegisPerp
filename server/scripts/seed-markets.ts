import db from "../src/db/database";

const SEED_MARKETS = [
  { symbol: "WIF", name: "dogwifhat", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", maxLev: 50, fee: 25 },
  { symbol: "BONK", name: "Bonk", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", maxLev: 25, fee: 30 },
  { symbol: "JTO", name: "Jito", mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL", maxLev: 50, fee: 20 },
  { symbol: "JUP", name: "Jupiter", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", maxLev: 50, fee: 20 },
  { symbol: "PYTH", name: "Pyth Network", mint: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3", maxLev: 25, fee: 25 },
  { symbol: "RENDER", name: "Render", mint: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", maxLev: 50, fee: 20 },
  { symbol: "W", name: "Wormhole", mint: "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ", maxLev: 25, fee: 25 },
  { symbol: "TNSR", name: "Tensor", mint: "TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6", maxLev: 25, fee: 30 },
  { symbol: "POPCAT", name: "Popcat", mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", maxLev: 50, fee: 25 },
  { symbol: "MEW", name: "cat in a dogs world", mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", maxLev: 25, fee: 30 },
  { symbol: "BOME", name: "BOOK OF MEME", mint: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82", maxLev: 25, fee: 30 },
  { symbol: "WEN", name: "Wen", mint: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk", maxLev: 10, fee: 50 },
  { symbol: "KMNO", name: "Kamino", mint: "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS", maxLev: 25, fee: 25 },
  { symbol: "DRIFT", name: "Drift Protocol", mint: "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7", maxLev: 50, fee: 20 },
  { symbol: "RAY", name: "Raydium", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", maxLev: 50, fee: 20 },
  { symbol: "ORCA", name: "Orca", mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", maxLev: 25, fee: 25 },
  { symbol: "MNDE", name: "Marinade", mint: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey", maxLev: 25, fee: 25 },
  { symbol: "HONEY", name: "Hivemapper", mint: "4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy", maxLev: 10, fee: 50 },
  { symbol: "MOBILE", name: "Helium Mobile", mint: "mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6", maxLev: 10, fee: 50 },
  { symbol: "ZEUS", name: "Zeus Network", mint: "ZEUS1aR7aX8DFFJf5QjWj2ftDDdNTroMNGo8YoQm3Gq", maxLev: 25, fee: 30 },
];

const CREATOR_WALLET = "11111111111111111111111111111111";

console.log("Seeding markets...");

for (const m of SEED_MARKETS) {
  const slug = m.symbol.toLowerCase();
  const existing = db.query("SELECT id FROM markets WHERE slug = ?").get(slug);
  if (existing) {
    console.log(`  Skipping ${m.symbol} (already exists)`);
    continue;
  }

  const id = crypto.randomUUID().slice(0, 16);
  const virtualDepth = 120000 * (m.maxLev / 25);

  db.query(`
    INSERT INTO markets (id, slug, token_mint, token_symbol, token_name, max_leverage, trading_fee, creator, virtual_depth)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, slug, m.mint, m.symbol, m.name, m.maxLev, m.fee, CREATOR_WALLET, virtualDepth);

  db.query("UPDATE platform_stats SET total_markets = total_markets + 1 WHERE id = 1").run();
  console.log(`  Created ${m.symbol}-PERP (${m.maxLev}× max, ${m.fee} bps fee)`);
}

console.log(`Done! ${SEED_MARKETS.length} markets seeded.`);
