/**
 * AlphaPerp devnet setup (FREE — devnet only).
 * Run AFTER `anchor deploy`:
 *   cd onchain && bun add @coral-xyz/anchor @solana/web3.js @solana/spl-token
 *   bun run scripts/setup.ts
 *
 * It: creates a test USDC mint + one mint per market, initializes the exchange,
 * creates each market on the vAMM, mints test USDC to the admin, and writes
 * ../src/lib/perp-config.json that the frontend reads to place real orders.
 */
import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import fs from "fs";
import os from "os";

const RPC = process.env.RPC || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("6h1imPy2SzZNBUa535uy2hcCWj2WFYbeMw5Qgnurtbom");
const TAKER_FEE_BPS = 2; // 0.02%

// markets to seed (price = current-ish; vAMM virtual quote depth = $120k)
const MARKETS = [
  { symbol: "SOL", price: 82 }, { symbol: "WIF", price: 0.19 }, { symbol: "BONK", price: 0.0000234 },
  { symbol: "JUP", price: 0.4 }, { symbol: "PYTH", price: 0.1 }, { symbol: "JTO", price: 1.7 },
  { symbol: "POPCAT", price: 0.3 }, { symbol: "MEW", price: 0.003 },
];
const VIRTUAL_QUOTE = 120_000 * 1e6; // 120k USDC (6 decimals)

function loadWallet(): Keypair {
  const p = `${os.homedir()}/.config/solana/id.json`;
  return Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(p, "utf8"))));
}
const pda = (seeds: (Buffer | Uint8Array)[]) => PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)[0];

async function main() {
  const conn = new Connection(RPC, "confirmed");
  const admin = loadWallet();
  const wallet = new anchor.Wallet(admin);
  const provider = new anchor.AnchorProvider(conn, wallet, { commitment: "confirmed" });
  anchor.setProvider(provider);
  const idl = JSON.parse(fs.readFileSync(`${import.meta.dir}/../target/idl/onchain.json`, "utf8"));
  const program = new anchor.Program(idl, provider);

  console.log("admin:", admin.publicKey.toBase58(), "balance:", await conn.getBalance(admin.publicKey) / 1e9, "SOL");

  // 1) test USDC mint (6 decimals)
  const usdc = await createMint(conn, admin, admin.publicKey, null, 6);
  console.log("USDC test mint:", usdc.toBase58());

  // 2) initialize exchange (+ vault + insurance)
  const exchange = pda([Buffer.from("exchange")]);
  const vault = pda([Buffer.from("vault")]);
  const insurance = pda([Buffer.from("insurance")]);
  await program.methods.initializeExchange(TAKER_FEE_BPS).accounts({
    admin: admin.publicKey, usdcMint: usdc, exchange, vault, insurance,
    tokenProgram: TOKEN_PROGRAM_ID, systemProgram: SystemProgram.programId, rent: SYSVAR_RENT_PUBKEY,
  }).rpc();
  console.log("exchange initialized:", exchange.toBase58());

  // 3) create markets (each needs a base Mint on devnet → create a test mint)
  const cfgMarkets: any[] = [];
  for (const m of MARKETS) {
    const baseMint = await createMint(conn, admin, admin.publicKey, null, 6);
    const market = pda([Buffer.from("market"), baseMint.toBuffer()]);
    const base = Math.floor(VIRTUAL_QUOTE / m.price);
    await program.methods
      .createMarket(100, new anchor.BN(base), new anchor.BN(VIRTUAL_QUOTE))
      .accounts({ creator: admin.publicKey, baseMint, exchange, market, systemProgram: SystemProgram.programId })
      .rpc();
    cfgMarkets.push({ symbol: m.symbol, baseMint: baseMint.toBase58(), market: market.toBase58() });
    console.log("market", m.symbol, "→", market.toBase58());
  }

  // 4) mint 100k test USDC to admin so you can trade immediately
  const ata = await getOrCreateAssociatedTokenAccount(conn, admin, usdc, admin.publicKey);
  await mintTo(conn, admin, usdc, ata.address, admin, 100_000 * 1e6);
  console.log("minted 100,000 test USDC to admin ATA:", ata.address.toBase58());

  // 5) write frontend config
  const config = {
    cluster: "devnet", rpc: RPC, programId: PROGRAM_ID.toBase58(),
    usdcMint: usdc.toBase58(), exchange: exchange.toBase58(), vault: vault.toBase58(),
    insurance: insurance.toBase58(), markets: cfgMarkets,
  };
  const out = `${import.meta.dir}/../../src/lib/perp-config.json`;
  fs.writeFileSync(out, JSON.stringify(config, null, 2));
  console.log("✅ wrote", out);
}
main().catch((e) => { console.error(e); process.exit(1); });
