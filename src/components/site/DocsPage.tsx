import { PUMPFUN_CA } from "../../lib/links";
import { TokenomicsChart } from "./TokenomicsChart";

const TOC = [
  ["overview", "Overview"],
  ["token", "$AGPERP token & tokenomics"],
  ["fairlaunch", "Fair launch on Pump.fun"],
  ["launch", "Launch a market"],
  ["trade", "Trading perps"],
  ["liquidity", "Liquidity & graduation"],
  ["fees", "Fees & creator earnings"],
  ["leverage", "Leverage & liquidation"],
  ["security", "Risk & disclaimer"],
  ["faq", "FAQ"],
];

export function DocsPage() {
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <section className="docs">
      <aside className="docs-toc">
        {TOC.map(([id, label]) => (
          <a key={id} onClick={() => jump(id)}>{label}</a>
        ))}
      </aside>

      <article className="docs-body">
        <div className="eyebrow">Documentation</div>
        <h1>AEGISPERP — stop waiting for listings. Start printing.</h1>
        <p>
          Every minute you wait for a centralized exchange to list your token is a minute someone else is
          already earning from it. AEGISPERP lets you launch a leveraged perp market on <em>any</em> Solana
          token in 10 seconds flat — no committee, no approval queue, no gatekeepers. Paste a mint, choose
          your leverage, sign, and the market goes live. You earn <strong>10% of every trading fee forever</strong>.
          <strong>$AGPERP</strong> is the protocol's native token — fee discounts, revenue sharing, governance.
          The people who move first own the markets. The rest watch.
        </p>

        <h2 id="overview">Overview</h2>
        <p>
          Centralized exchanges decide which tokens deserve a perp. They take weeks. They keep all the revenue.
          And you? You get nothing. AEGISPERP flips the table: <em>you</em> create the market, <em>you</em> set
          the rules, and <em>you</em> collect fees from every single trade — forever.
        </p>
        <ul>
          <li><strong>Zero gatekeepers</strong> — every SPL mint is eligible. Pay 0.3 SOL, go live instantly.</li>
          <li><strong>100× isolated leverage</strong> — six order types, tight spreads from block one.</li>
          <li><strong>Liquidity from the first second</strong> — virtual bonding curve seeds depth automatically.</li>
          <li><strong>You get paid</strong> — 10% of every trading fee flows to you, the market creator. Permanently.</li>
        </ul>

        <h2 id="token">$AGPERP token &amp; tokenomics</h2>
        <p>$AGPERP is the key to the protocol. Hold it and you pay less fees, earn staking rewards, and vote on the future of permissionless perps. Fixed supply. No inflation. No hidden unlocks.</p>
        <table className="doc-table">
          <tbody>
            <tr><th>Token</th><td className="v">$AGPERP</td></tr>
            <tr><th>Network</th><td className="v">Solana (SPL)</td></tr>
            <tr><th>Total supply</th><td className="v">1,000,000,000 (1B)</td></tr>
            <tr><th>Distribution</th><td className="v">100% fair launch</td></tr>
            <tr><th>Team / VC / presale</th><td className="v">0% — none</td></tr>
            <tr><th>Launch venue</th><td className="v">Pump.fun</td></tr>
            <tr><th>Contract address</th><td className="v" style={{fontFamily:"monospace",fontSize:"0.85em",wordBreak:"break-all"}}>{PUMPFUN_CA || "TBA — verify on our X at launch"}</td></tr>
          </tbody>
        </table>
        <div className="doc-pill-row">
          <span className="doc-pill">Supply <b>1,000,000,000</b></span>
          <span className="doc-pill">Fair launch <b>100%</b></span>
          <span className="doc-pill">Team allocation <b>0%</b></span>
          <span className="doc-pill">Presale <b>0%</b></span>
        </div>
        <h3>Fee distribution</h3>
        <TokenomicsChart />
        <h3>Utility — why you want this token</h3>
        <ul>
          <li><strong>Pay less, keep more</strong> — holders get reduced taker and maker fees across every market.</li>
          <li><strong>Earn while you sleep</strong> — protocol revenue flows to $AGPERP stakers. Passive income, on-chain.</li>
          <li><strong>Shape the protocol</strong> — vote on leverage limits, graduation criteria, fee splits.</li>
          <li><strong>First in line</strong> — priority access to new market formats and launch tools before anyone else.</li>
        </ul>

        <h2 id="fairlaunch">Fair launch on Pump.fun</h2>
        <p>
          No VCs. No team allocation. No insider unlocks. <strong>100% fair launch on Pump.fun</strong> — the
          full 1B supply hits the open market from second one. Everyone enters on the same terms. The only
          advantage is being early.
        </p>
        <ul>
          <li><strong>Zero insiders</strong> — every single token is acquired through the public bonding curve.</li>
          <li><strong>Pure price discovery</strong> — the Pump.fun curve sets the price. No manipulation, no dark pools.</li>
          <li><strong>Raydium graduation</strong> — liquidity migrates to Raydium and the LP is burned/locked. Permanent.</li>
          <li><strong>One official token</strong> — the contract address on our X is the only legitimate $AGPERP. Period.</li>
        </ul>
        <div className="doc-callout">
          ⚠️ Always confirm the contract address via our official X account before purchasing. Any token claiming to be
          $AGPERP with a different address is fraudulent.
        </div>

        <h2 id="launch">Launch a market — 10 seconds, 3 steps</h2>
        <p>While centralized exchanges take weeks to evaluate, committee-approve, and list a single perp — you do it before your coffee cools:</p>
        <ul>
          <li><strong>1. Paste the mint</strong> — any SPL token. Any.</li>
          <li><strong>2. Set max leverage</strong> — from 2× up to 100×. Your call.</li>
          <li><strong>3. Pay 0.3 SOL, sign, done</strong> — market goes live instantly. You're the creator. Fees start flowing to you.</li>
        </ul>
        <p>That's it. From this moment, every trade on your market sends 10% of the fee directly to your wallet. You built a revenue stream in less time than it takes to read this paragraph.</p>

        <h2 id="trade">Trading perps</h2>
        <p>Full-featured perp trading. Isolated margin. No cross-contamination between positions — blow up on one market, the rest stay clean.</p>
        <ul>
          <li>Market &amp; Limit</li>
          <li>Stop-market &amp; Stop-limit</li>
          <li>Take-profit &amp; Reduce-only</li>
        </ul>
        <p>Collateral in USDC. Six order types. Sub-second execution. Everything a pro trader needs, nothing they don't.</p>

        <h2 id="liquidity">Liquidity &amp; graduation</h2>
        <p>
          {'"'}But who provides liquidity for a brand-new market?{'"'} We do — automatically. Every market launches against
          a <strong>virtual bonding-curve pool</strong> with ~$120K depth. Your first trade settles with sub-percent
          slippage. When volume hits <strong>$50K</strong>, the market graduates to deeper, organic liquidity.
          No bootstrapping. No begging market makers.
        </p>
        <table className="doc-table">
          <tbody>
            <tr><th>Virtual depth (default)</th><td className="v">$120,000</td></tr>
            <tr><th>Slippage @ $10K order</th><td className="v">~0.42%</td></tr>
            <tr><th>Graduation threshold</th><td className="v">$50,000 volume</td></tr>
          </tbody>
        </table>

        <h2 id="fees">Fees &amp; creator earnings</h2>
        <p>This is the part everyone skips to. Market creators receive <strong>10% of every trading fee</strong> generated on their market — not for a month, not for a year. <strong>Forever.</strong> Fully transparent, fully on-chain.</p>
        <table className="doc-table">
          <thead><tr><th>Recipient</th><th>Share</th></tr></thead>
          <tbody>
            <tr><td>Market creator</td><td className="v">10%</td></tr>
            <tr><td>Protocol treasury</td><td className="v">60%</td></tr>
            <tr><td>Insurance fund</td><td className="v">20%</td></tr>
            <tr><td>Liquidity providers</td><td className="v">10%</td></tr>
          </tbody>
        </table>
        <p>Base taker fee is <code>0.02%</code> per fill; $AGPERP holders enjoy reduced rates.</p>

        <h2 id="leverage">Leverage &amp; liquidation</h2>
        <p>
          Up to 100× leverage. High risk, high reward — you know the game. Every position has a clear liquidation
          price calculated from entry, leverage ratio, and maintenance margin. Example: a 25× long at <code>$1.8472</code>
          liquidates near <code>$1.7807</code>. The insurance fund backstops shortfalls during rapid moves.
          Trade with conviction, not with hope.
        </p>

        <h2 id="security">Risk &amp; disclaimer</h2>
        <p>
          Real talk: perpetual futures carry significant risk. Leverage amplifies gains <em>and</em> losses —
          your collateral can disappear in seconds. Permissionless markets can be illiquid or volatile.
          This is not financial advice. Never risk more than you can afford to lose. Always verify contract
          addresses independently. The protocol gives you power — what you do with it is on you.
        </p>

        <h2 id="faq">FAQ</h2>
        <h3>Is $AGPERP live yet?</h3>
        <p>$AGPERP launches on Pump.fun — the official contract address drops on our X. If you're not following us, you're already late. Always cross-check before purchasing.</p>
        <h3>Do I need $AGPERP to trade?</h3>
        <p>No — perp trading uses USDC as collateral. But holders pay lower fees and earn staking rewards. The question isn't whether you need it — it's how much you want to keep.</p>
        <h3>What does it cost to launch a market?</h3>
        <p>0.3 SOL. That's it. From that moment, you earn 10% of every trading fee on that market — forever. Best ROI you'll find on-chain.</p>
        <h3>Which wallet do I connect?</h3>
        <p>Phantom and Solflare are natively supported. Connect, launch, trade — all from one wallet.</p>

        <p style={{ marginTop: 34, color: "var(--muted)" }}>
          Still have questions? Find us on X (link in the navbar). Or just launch a market and figure it out. © 2026 AEGISPERP Labs.
        </p>
      </article>
    </section>
  );
}
