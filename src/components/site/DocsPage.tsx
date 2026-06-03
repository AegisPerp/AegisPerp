import { PUMPFUN_CA } from "../../lib/links";

const TOC = [
  ["overview", "Overview"],
  ["token", "$HYPERP token & tokenomics"],
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
        <h1>HYPERPERP — permissionless perpetual markets, built on Solana.</h1>
        <p>
          HYPERPERP lets anyone spin up a leveraged perpetual market on any Solana token as soon as the
          launch fee is paid. No committee, no approval queue — just paste a mint, choose your leverage cap,
          sign the transaction, and the market goes live. <strong>$HYPERP</strong> is the protocol's native token,
          driving fee discounts, revenue sharing and governance.
        </p>

        <h2 id="overview">Overview</h2>
        <p>
          Traditional exchanges choose which tokens deserve a perpetual, take weeks to list them, and pocket
          all the revenue. HYPERPERP inverts that model: anyone can create an isolated-margin perp on any SPL
          token in seconds, liquidity seeds itself through a virtual bonding curve, and the market launcher
          earns a share of trading fees permanently.
        </p>
        <ul>
          <li><strong>Permissionless</strong> — every mint is eligible; just pay a flat 0.3 SOL to go live.</li>
          <li><strong>Isolated leverage up to 100×</strong> and six order types.</li>
          <li><strong>Narrow spreads from the first block</strong>, powered by bonding-curve liquidity.</li>
          <li><strong>Creator earnings</strong> — 10% of all trading fees flow to the market launcher, permanently.</li>
        </ul>

        <h2 id="token">$HYPERP token &amp; tokenomics</h2>
        <p>$HYPERP is the protocol's native token — a standard Solana SPL token with a fixed, fully-diluted supply.</p>
        <table className="doc-table">
          <tbody>
            <tr><th>Token</th><td className="v">$HYPERP</td></tr>
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
        <h3>Utility</h3>
        <ul>
          <li><strong>Fee reduction</strong> — $HYPERP holders pay lower taker and maker fees across all markets.</li>
          <li><strong>Staking rewards</strong> — a share of protocol revenue is distributed to $HYPERP stakers.</li>
          <li><strong>Governance</strong> — vote on leverage limits, graduation criteria, and fee distribution.</li>
          <li><strong>Early access</strong> — priority access to new market formats and launch tools.</li>
        </ul>

        <h2 id="fairlaunch">Fair launch on Pump.fun</h2>
        <p>
          $HYPERP is a <strong>100% fair launch</strong> on <strong>Pump.fun</strong>. Zero private rounds, zero team
          allocation, zero insider unlocks — the full 1B supply hits the open market from second one.
        </p>
        <ul>
          <li><strong>No presale, no team tokens</strong> — all tokens are acquired through the public bonding curve.</li>
          <li><strong>Organic price discovery</strong> — the bonding curve on Pump.fun sets the price until graduation.</li>
          <li><strong>Raydium migration</strong> — upon graduation, Pump.fun moves liquidity to Raydium and the LP is burned/locked.</li>
          <li><strong>Single official token</strong> — the contract address announced at launch is the only legitimate $HYPERP.</li>
        </ul>
        <div className="doc-callout">
          ⚠️ Always confirm the contract address via our official X account before purchasing. Any token claiming to be
          $HYPERP with a different address is fraudulent.
        </div>

        <h2 id="launch">Launch a market</h2>
        <p>Creating a perpetual market takes three steps and roughly ten seconds:</p>
        <ul>
          <li><strong>1. Enter the mint</strong> — any SPL token address works.</li>
          <li><strong>2. Choose max leverage</strong> — set the upper bound for traders (2×–100×).</li>
          <li><strong>3. Pay 0.3 SOL &amp; sign</strong> — the market activates immediately and you're registered as its creator.</li>
        </ul>
        <p>From that point forward, the market operates against a virtual bonding-curve pool and you receive a portion of every fee it produces.</p>

        <h2 id="trade">Trading perps</h2>
        <p>All markets use isolated margin. Available order types:</p>
        <ul>
          <li>Market &amp; Limit</li>
          <li>Stop-market &amp; Stop-limit</li>
          <li>Take-profit &amp; Reduce-only</li>
        </ul>
        <p>Collateral is denominated in USDC. Each position is isolated — exposure on one market has no effect on another.</p>

        <h2 id="liquidity">Liquidity &amp; graduation</h2>
        <p>
          New markets launch against a <strong>virtual bonding-curve pool</strong> (default depth ~$120K), ensuring
          early trades settle with sub-percent slippage. When cumulative volume exceeds <strong>$50K</strong>, the market
          “graduates” and transitions to deeper, organic liquidity.
        </p>
        <table className="doc-table">
          <tbody>
            <tr><th>Virtual depth (default)</th><td className="v">$120,000</td></tr>
            <tr><th>Slippage @ $10K order</th><td className="v">~0.42%</td></tr>
            <tr><th>Graduation threshold</th><td className="v">$50,000 volume</td></tr>
          </tbody>
        </table>

        <h2 id="fees">Fees &amp; creator earnings</h2>
        <p>Fee distribution is fully transparent. Market creators receive <strong>10% of every trading fee</strong> generated on their market, in perpetuity.</p>
        <table className="doc-table">
          <thead><tr><th>Recipient</th><th>Share</th></tr></thead>
          <tbody>
            <tr><td>Market creator</td><td className="v">10%</td></tr>
            <tr><td>Protocol treasury</td><td className="v">60%</td></tr>
            <tr><td>Insurance fund</td><td className="v">20%</td></tr>
            <tr><td>Liquidity providers</td><td className="v">10%</td></tr>
          </tbody>
        </table>
        <p>Base taker fee is <code>0.02%</code> per fill; $HYPERP holders enjoy reduced rates.</p>

        <h2 id="leverage">Leverage &amp; liquidation</h2>
        <p>
          Leverage ranges from 2× to a per-market ceiling of 100×. Every position carries a liquidation price
          calculated from entry price, leverage ratio, and a maintenance-margin buffer. For instance, a 25× long
          entered at <code>$1.8472</code> would liquidate near <code>$1.7807</code>. The insurance fund covers shortfalls
          during rapid price movements.
        </p>

        <h2 id="security">Risk &amp; disclaimer</h2>
        <p>
          Perpetual futures carry significant risk. Leverage can eliminate your collateral rapidly, and
          permissionless markets may be illiquid or volatile. This is not financial advice. Never trade more
          than you can afford to lose, and always verify contract addresses independently.
        </p>

        <h2 id="faq">FAQ</h2>
        <h3>Is $HYPERP live yet?</h3>
        <p>$HYPERP will launch on Pump.fun — the official contract address will be announced on our X account. Always cross-check with our X before purchasing.</p>
        <h3>Do I need $HYPERP to trade?</h3>
        <p>No — perp trading uses USDC as collateral. Holding $HYPERP just reduces your fees and gives you governance rights.</p>
        <h3>What does it cost to launch a market?</h3>
        <p>A flat 0.3 SOL. From there, you earn 10% of all trading fees on that market, permanently.</p>
        <h3>Which wallet do I connect?</h3>
        <p>Phantom is natively supported; your actual SOL balance determines your available launch budget on the launch card.</p>

        <p style={{ marginTop: 34, color: "var(--muted)" }}>
          Got questions? Find us on X (link in the navbar). © 2026 HYPERPERP Labs.
        </p>
      </article>
    </section>
  );
}
