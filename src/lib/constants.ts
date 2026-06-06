export const PROJECT_NAME = "AEGISPERP";
export const TICKER = "$AGPERP";
export const DOMAIN = "aegisperp.fun";
export const TWITTER_HANDLE = "@AegisPerp";
export const TAGLINE = "Any token. Any leverage. One click.";
export const ONE_LINER =
  "A permissionless perpetual-futures launchpad on Solana. Every SPL token becomes a leveraged market the instant its launch fee settles.";

export const LAUNCH_FEE_SOL = 0.3;
export const MAX_LEVERAGE = 100;
export const ORDER_TYPES = 6;
export const GRADUATION_VOLUME = 50_000;
export const DEFAULT_VIRTUAL_DEPTH = 120_000;

export const PALETTE = {
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F3EF",
  accent: "#C8A415",
  accentLight: "rgba(200,164,21,0.08)",
  long: "#1FA971",
  short: "#E5484D",
  text: "#1A1507",
  textMuted: "#8A7E6B",
  border: "#E8E4DC",
  borderLight: "#F5F3EF",
} as const;

export const MOCK_TOKENS = [
  { symbol: "WIF", name: "dogwifhat", price: 1.8472, change: 2.41, volume: 284_000, oi: 1_200_000, maxLev: 50 },
  { symbol: "BONK", name: "Bonk", price: 0.00002341, change: -1.23, volume: 512_000, oi: 890_000, maxLev: 25 },
  { symbol: "JTO", name: "Jito", price: 3.247, change: 5.67, volume: 1_340_000, oi: 2_100_000, maxLev: 50 },
  { symbol: "JUP", name: "Jupiter", price: 1.0234, change: -0.45, volume: 890_000, oi: 1_500_000, maxLev: 50 },
  { symbol: "PYTH", name: "Pyth Network", price: 0.4521, change: 3.12, volume: 432_000, oi: 780_000, maxLev: 25 },
  { symbol: "RENDER", name: "Render", price: 7.891, change: 1.89, volume: 2_100_000, oi: 3_400_000, maxLev: 50 },
  { symbol: "W", name: "Wormhole", price: 0.5432, change: -2.34, volume: 321_000, oi: 540_000, maxLev: 25 },
  { symbol: "TNSR", name: "Tensor", price: 0.8912, change: 8.45, volume: 178_000, oi: 320_000, maxLev: 25 },
  { symbol: "POPCAT", name: "Popcat", price: 1.234, change: 12.34, volume: 890_000, oi: 1_100_000, maxLev: 50 },
  { symbol: "MEW", name: "cat in a dogs world", price: 0.00891, change: -4.56, volume: 234_000, oi: 410_000, maxLev: 25 },
  { symbol: "BOME", name: "BOOK OF MEME", price: 0.01234, change: 6.78, volume: 567_000, oi: 890_000, maxLev: 25 },
  { symbol: "WEN", name: "Wen", price: 0.000234, change: -0.89, volume: 123_000, oi: 210_000, maxLev: 10 },
  { symbol: "KMNO", name: "Kamino", price: 0.1234, change: 4.56, volume: 345_000, oi: 560_000, maxLev: 25 },
  { symbol: "DRIFT", name: "Drift Protocol", price: 1.567, change: 2.34, volume: 456_000, oi: 780_000, maxLev: 50 },
  { symbol: "RAY", name: "Raydium", price: 2.345, change: -1.67, volume: 678_000, oi: 1_100_000, maxLev: 50 },
  { symbol: "ORCA", name: "Orca", price: 4.567, change: 0.89, volume: 234_000, oi: 410_000, maxLev: 25 },
];

export const MOCK_FILLS = [
  { side: "long" as const, token: "WIF", size: 12_450, price: 1.8472, leverage: 25, time: "2s ago" },
  { side: "short" as const, token: "BONK", size: 8_200, price: 0.00002341, leverage: 50, time: "5s ago" },
  { side: "long" as const, token: "JTO", size: 34_100, price: 3.247, leverage: 10, time: "8s ago" },
  { side: "short" as const, token: "WIF", size: 5_600, price: 1.8465, leverage: 100, time: "12s ago" },
  { side: "long" as const, token: "POPCAT", size: 22_300, price: 1.234, leverage: 50, time: "15s ago" },
  { side: "long" as const, token: "JUP", size: 15_800, price: 1.0234, leverage: 25, time: "18s ago" },
  { side: "short" as const, token: "RENDER", size: 41_200, price: 7.891, leverage: 10, time: "22s ago" },
  { side: "long" as const, token: "RAY", size: 9_400, price: 2.345, leverage: 50, time: "25s ago" },
];
