// Realtime price sources with automatic failover. Each source pushes
// (symbol, priceUSD, change24h%) and calls fail() on error/close/empty.
// NO simulation — only real market data.

export interface Asset {
  sym: string;
  binance?: string; bybit?: string; okx?: string; gate?: string;
  coinbase?: string; kraken?: string; bitget?: string;
  cc: string; gecko: string; coincap?: string;
}

export const ASSETS: Asset[] = [
  // Top 10 market cap
  { sym: "BTC",    binance: "BTCUSDT",    bybit: "BTCUSDT",    okx: "BTC-USDT",    gate: "BTC_USDT",    coinbase: "BTC-USD",    kraken: "XBT/USD",    bitget: "BTCUSDT",    cc: "BTC",    gecko: "bitcoin",                 coincap: "bitcoin" },
  { sym: "ETH",    binance: "ETHUSDT",    bybit: "ETHUSDT",    okx: "ETH-USDT",    gate: "ETH_USDT",    coinbase: "ETH-USD",    kraken: "ETH/USD",    bitget: "ETHUSDT",    cc: "ETH",    gecko: "ethereum",                coincap: "ethereum" },
  { sym: "BNB",    binance: "BNBUSDT",    bybit: "BNBUSDT",    okx: "BNB-USDT",    gate: "BNB_USDT",                            kraken: "BNB/USD",    bitget: "BNBUSDT",    cc: "BNB",    gecko: "binancecoin",             coincap: "binance-coin" },
  { sym: "XRP",    binance: "XRPUSDT",    bybit: "XRPUSDT",    okx: "XRP-USDT",    gate: "XRP_USDT",    coinbase: "XRP-USD",    kraken: "XRP/USD",    bitget: "XRPUSDT",    cc: "XRP",    gecko: "ripple",                  coincap: "xrp" },
  { sym: "ADA",    binance: "ADAUSDT",    bybit: "ADAUSDT",    okx: "ADA-USDT",    gate: "ADA_USDT",    coinbase: "ADA-USD",    kraken: "ADA/USD",    bitget: "ADAUSDT",    cc: "ADA",    gecko: "cardano",                 coincap: "cardano" },
  { sym: "DOGE",   binance: "DOGEUSDT",   bybit: "DOGEUSDT",   okx: "DOGE-USDT",   gate: "DOGE_USDT",   coinbase: "DOGE-USD",   kraken: "DOGE/USD",   bitget: "DOGEUSDT",   cc: "DOGE",   gecko: "dogecoin",                coincap: "dogecoin" },
  { sym: "SOL",    binance: "SOLUSDT",    bybit: "SOLUSDT",    okx: "SOL-USDT",    gate: "SOL_USDT",    coinbase: "SOL-USD",    kraken: "SOL/USD",    bitget: "SOLUSDT",    cc: "SOL",    gecko: "solana",                  coincap: "solana" },
  { sym: "AVAX",   binance: "AVAXUSDT",   bybit: "AVAXUSDT",   okx: "AVAX-USDT",   gate: "AVAX_USDT",   coinbase: "AVAX-USD",   kraken: "AVAX/USD",   bitget: "AVAXUSDT",   cc: "AVAX",   gecko: "avalanche-2",             coincap: "avalanche" },
  { sym: "DOT",    binance: "DOTUSDT",    bybit: "DOTUSDT",    okx: "DOT-USDT",    gate: "DOT_USDT",    coinbase: "DOT-USD",    kraken: "DOT/USD",    bitget: "DOTUSDT",    cc: "DOT",    gecko: "polkadot",                coincap: "polkadot" },
  { sym: "LINK",   binance: "LINKUSDT",   bybit: "LINKUSDT",   okx: "LINK-USDT",   gate: "LINK_USDT",   coinbase: "LINK-USD",   kraken: "LINK/USD",   bitget: "LINKUSDT",   cc: "LINK",   gecko: "chainlink",               coincap: "chainlink" },
  { sym: "SUI",    binance: "SUIUSDT",    bybit: "SUIUSDT",    okx: "SUI-USDT",    gate: "SUI_USDT",    coinbase: "SUI-USD",    kraken: "SUI/USD",    bitget: "SUIUSDT",    cc: "SUI",    gecko: "sui",                     coincap: "sui" },
  { sym: "PEPE",   binance: "PEPEUSDT",   bybit: "PEPEUSDT",   okx: "PEPE-USDT",   gate: "PEPE_USDT",   coinbase: "PEPE-USD",                         bitget: "PEPEUSDT",   cc: "PEPE",   gecko: "pepe",                    coincap: "pepe" },
  // Solana ecosystem
  { sym: "WIF",    binance: "WIFUSDT",    bybit: "WIFUSDT",    okx: "WIF-USDT",    gate: "WIF_USDT",    coinbase: "WIF-USD",    kraken: "WIF/USD",    bitget: "WIFUSDT",    cc: "WIF",    gecko: "dogwifcoin" },
  { sym: "BONK",   binance: "BONKUSDT",   bybit: "BONKUSDT",   okx: "BONK-USDT",   gate: "BONK_USDT",   coinbase: "BONK-USD",   kraken: "BONK/USD",   bitget: "BONKUSDT",   cc: "BONK",   gecko: "bonk",                    coincap: "bonk" },
  { sym: "JUP",    binance: "JUPUSDT",    bybit: "JUPUSDT",    okx: "JUP-USDT",    gate: "JUP_USDT",    coinbase: "JUP-USD",    kraken: "JUP/USD",    bitget: "JUPUSDT",    cc: "JUP",    gecko: "jupiter-exchange-solana" },
  { sym: "PYTH",   binance: "PYTHUSDT",   bybit: "PYTHUSDT",   okx: "PYTH-USDT",   gate: "PYTH_USDT",   coinbase: "PYTH-USD",   kraken: "PYTH/USD",   bitget: "PYTHUSDT",   cc: "PYTH",   gecko: "pyth-network" },
  { sym: "JTO",    binance: "JTOUSDT",    bybit: "JTOUSDT",    okx: "JTO-USDT",    gate: "JTO_USDT",    coinbase: "JTO-USD",    kraken: "JTO/USD",    bitget: "JTOUSDT",    cc: "JTO",    gecko: "jito-governance-token" },
  { sym: "RENDER", binance: "RENDERUSDT", bybit: "RENDERUSDT", okx: "RENDER-USDT", gate: "RENDER_USDT", coinbase: "RENDER-USD", kraken: "RENDER/USD", bitget: "RENDERUSDT", cc: "RENDER", gecko: "render-token",            coincap: "render-token" },
  { sym: "POPCAT",                        bybit: "POPCATUSDT", okx: "POPCAT-USDT", gate: "POPCAT_USDT",                                                bitget: "POPCATUSDT", cc: "POPCAT", gecko: "popcat" },
  { sym: "MEW",                           bybit: "MEWUSDT",    okx: "MEW-USDT",    gate: "MEW_USDT",                                                   bitget: "MEWUSDT",    cc: "MEW",    gecko: "cat-in-a-dogs-world" },
];

export type Push = (sym: string, price: number, change: number | undefined) => void;
export interface SourceCtl { stop(): void; }
export interface Source { name: string; start(push: Push, fail: () => void): SourceCtl; }

const rev = (key: keyof Asset) => {
  const m: Record<string, string> = {};
  for (const a of ASSETS) { const v = a[key] as string | undefined; if (v) m[v] = a.sym; }
  return m;
};

function wsSource(
  name: string,
  url: string,
  onOpen: (ws: WebSocket) => void,
  onMsg: (data: any, push: Push) => void,
  pingMs?: number,
  pingMsg?: string,
): Source {
  return {
    name,
    start(push, fail) {
      let ws: WebSocket;
      let ping: ReturnType<typeof setInterval> | undefined;
      try { ws = new WebSocket(url); } catch { setTimeout(fail, 0); return { stop() {} }; }
      ws.onopen = () => { try { onOpen(ws); } catch { fail(); } if (pingMs) ping = setInterval(() => { try { if (ws.readyState === 1) ws.send(pingMsg!); } catch {} }, pingMs); };
      ws.onerror = () => fail();
      ws.onclose = () => fail();
      ws.onmessage = (e) => {
        if (pingMsg && e.data === "pong") return;
        try { onMsg(JSON.parse(e.data), push); } catch { /* ignore frame */ }
      };
      return { stop() { if (ping) clearInterval(ping); try { ws.onclose = null; ws.onerror = null; ws.close(); } catch {} } };
    },
  };
}

function restSource(name: string, intervalMs: number, fetcher: (push: Push) => Promise<boolean>): Source {
  return {
    name,
    start(push, fail) {
      let stopped = false;
      const run = async () => {
        try { const ok = await fetcher(push); if (!ok && !stopped) fail(); }
        catch { if (!stopped) fail(); }
      };
      run();
      const iv = setInterval(() => { if (!stopped) run(); }, intervalMs);
      return { stop() { stopped = true; clearInterval(iv); } };
    },
  };
}

export const SOURCES: Source[] = [
  // 1) Binance
  wsSource("Binance",
    `wss://stream.binance.com:443/stream?streams=${ASSETS.filter(a => a.binance).map(a => a.binance!.toLowerCase() + "@ticker").join("/")}`,
    () => {},
    (msg, push) => { const m = rev("binance"); const d = msg.data; if (d && m[d.s]) push(m[d.s], +d.c, +d.P); },
  ),
  // 2) Bybit
  wsSource("Bybit", "wss://stream.bybit.com/v5/public/spot",
    (ws) => ws.send(JSON.stringify({ op: "subscribe", args: ASSETS.filter(a => a.bybit).map(a => `tickers.${a.bybit}`) })),
    (msg, push) => { const m = rev("bybit"); const t = msg.data; if (msg.topic && t && m[t.symbol] && t.lastPrice) push(m[t.symbol], +t.lastPrice, t.price24hPcnt != null ? +t.price24hPcnt * 100 : undefined); },
    18000, JSON.stringify({ op: "ping" }),
  ),
  // 3) OKX
  wsSource("OKX", "wss://ws.okx.com:8443/ws/v5/public",
    (ws) => ws.send(JSON.stringify({ op: "subscribe", args: ASSETS.filter(a => a.okx).map(a => ({ channel: "tickers", instId: a.okx })) })),
    (msg, push) => { const m = rev("okx"); if (msg.data && msg.arg?.channel === "tickers") for (const t of msg.data) { if (m[t.instId] && t.last) { const last = +t.last, open = +t.open24h; push(m[t.instId], last, open ? ((last - open) / open) * 100 : undefined); } } },
    20000, "ping",
  ),
  // 4) Gate.io
  wsSource("Gate.io", "wss://api.gateio.ws/ws/v4/",
    (ws) => ws.send(JSON.stringify({ time: Math.floor(Date.now() / 1000), channel: "spot.tickers", event: "subscribe", payload: ASSETS.filter(a => a.gate).map(a => a.gate) })),
    (msg, push) => { const m = rev("gate"); if (msg.event === "update" && msg.result) { const r = msg.result; if (m[r.currency_pair] && r.last) push(m[r.currency_pair], +r.last, r.change_percentage != null ? +r.change_percentage : undefined); } },
  ),
  // 5) Coinbase
  wsSource("Coinbase", "wss://ws-feed.exchange.coinbase.com",
    (ws) => ws.send(JSON.stringify({ type: "subscribe", product_ids: ASSETS.filter(a => a.coinbase).map(a => a.coinbase), channels: ["ticker"] })),
    (msg, push) => { const m = rev("coinbase"); if (msg.type === "ticker" && m[msg.product_id] && msg.price) { const p = +msg.price, o = +msg.open_24h; push(m[msg.product_id], p, o ? ((p - o) / o) * 100 : undefined); } },
  ),
  // 6) Kraken
  wsSource("Kraken", "wss://ws.kraken.com/v2",
    (ws) => ws.send(JSON.stringify({ method: "subscribe", params: { channel: "ticker", symbol: ASSETS.filter(a => a.kraken).map(a => a.kraken) } })),
    (msg, push) => { const m = rev("kraken"); if (msg.channel === "ticker" && Array.isArray(msg.data)) for (const t of msg.data) { if (m[t.symbol] && t.last != null) push(m[t.symbol], +t.last, t.change_pct != null ? +t.change_pct : undefined); } },
  ),
  // 7) Bitget
  wsSource("Bitget", "wss://ws.bitget.com/v2/ws/public",
    (ws) => ws.send(JSON.stringify({ op: "subscribe", args: ASSETS.filter(a => a.bitget).map(a => ({ instType: "SPOT", channel: "ticker", instId: a.bitget })) })),
    (msg, push) => { const m = rev("bitget"); if (msg.data && msg.arg?.channel === "ticker") for (const t of msg.data) { const sym = m[msg.arg.instId] || (t.instId && m[t.instId]); if (sym && t.lastPr) push(sym, +t.lastPr, t.change24h != null ? +t.change24h * 100 : undefined); } },
    25000, "ping",
  ),
  // 8) CryptoCompare (REST)
  restSource("CryptoCompare", 4000, async (push) => {
    const r = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${ASSETS.map(a => a.cc).join(",")}&tsyms=USD`);
    const j = await r.json(); const raw = j.RAW || {}; let any = false;
    for (const a of ASSETS) { const d = raw[a.cc]?.USD; if (d && d.PRICE) { push(a.sym, +d.PRICE, d.CHANGEPCT24HOUR != null ? +d.CHANGEPCT24HOUR : undefined); any = true; } }
    return any;
  }),
  // 9) CoinGecko (REST)
  restSource("CoinGecko", 8000, async (push) => {
    const m = rev("gecko");
    const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ASSETS.map(a => a.gecko).join(",")}&vs_currencies=usd&include_24hr_change=true`);
    const j = await r.json(); let any = false;
    for (const id in j) { const sym = m[id]; const d = j[id]; if (sym && d && d.usd) { push(sym, +d.usd, d.usd_24h_change != null ? +d.usd_24h_change : undefined); any = true; } }
    return any;
  }),
  // 10) Coincap (REST)
  restSource("Coincap", 6000, async (push) => {
    const m = rev("coincap");
    const r = await fetch(`https://api.coincap.io/v2/assets?ids=${ASSETS.filter(a => a.coincap).map(a => a.coincap).join(",")}`);
    const j = await r.json(); let any = false;
    for (const d of (j.data || [])) { const sym = m[d.id]; if (sym && d.priceUsd) { push(sym, +d.priceUsd, d.changePercent24Hr != null ? +d.changePercent24Hr : undefined); any = true; } }
    return any;
  }),
];
