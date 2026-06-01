const TOC = [
  ["overview", "Overview"],
  ["token", "$ALPERP token & tokenomics"],
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
        <h1>AlphaPerp — the permissionless perp launchpad on Solana.</h1>
        <p>
          AlphaPerp turns any Solana token into a leveraged perpetual market the moment its launch fee
          clears. No listing committee, no gatekeeping — paste a mint, set max leverage, sign once, and the
          market is live. <strong>$ALPERP</strong> is the native token that powers fees, discounts and governance
          across the protocol.
        </p>

        <h2 id="overview">Overview</h2>
        <p>
          Centralized venues decide which assets get a perp, take weeks to list them, and keep every cent of
          the fees. AlphaPerp flips that: anyone can spin up an isolated-margin perpetual market on any SPL
          token in seconds, liquidity bootstraps from a virtual bonding curve, and the person who launched the
          market earns a cut of its fees for life.
        </p>
        <ul>
          <li><strong>Permissionless</strong> — any mint can become a market for a flat 0.3 SOL fee.</li>
          <li><strong>Up to 100× isolated leverage</strong> with six order types.</li>
          <li><strong>Tight spreads from block one</strong> via a bonding-curve liquidity pool.</li>
          <li><strong>Creator revenue share</strong> — 10% of trading fees route to the launcher forever.</li>
        </ul>

        <h2 id="token">$ALPERP token &amp; tokenomics</h2>
        <p>$ALPERP is the protocol token. It is a standard Solana SPL token with a fixed, fully-diluted supply.</p>
        <table className="doc-table">
          <tbody>
            <tr><th>Token</th><td className="v">$ALPERP</td></tr>
            <tr><th>Network</th><td className="v">Solana (SPL)</td></tr>
            <tr><th>Total supply</th><td className="v">1,000,000,000 (1B)</td></tr>
            <tr><th>Distribution</th><td className="v">100% fair launch</td></tr>
            <tr><th>Team / VC / presale</th><td className="v">0% — none</td></tr>
            <tr><th>Launch venue</th><td className="v">Pump.fun</td></tr>
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
          <li><strong>Fee discounts</strong> — holding $ALPERP reduces taker/maker fees on every market.</li>
          <li><strong>Revenue share</strong> — a portion of protocol fees flows back to stakers.</li>
          <li><strong>Governance</strong> — vote on default leverage caps, graduation thresholds and fee splits.</li>
          <li><strong>Priority</strong> — early access to new market types and launch tooling.</li>
        </ul>

        <h2 id="fairlaunch">Fair launch on Pump.fun</h2>
        <p>
          $ALPERP launches <strong>100% fair</strong> on <strong>Pump.fun</strong>. There is no private round, no team
          allocation and no insider unlock — the entire 1B supply is available to the open market from the first
          second.
        </p>
        <ul>
          <li><strong>No presale &amp; no team tokens</strong> — every token is bought on the open bonding curve.</li>
          <li><strong>Bonding-curve pricing</strong> — price discovers organically on Pump.fun until graduation.</li>
          <li><strong>Liquidity to Raydium</strong> — on graduation, Pump.fun migrates liquidity and the LP is burned/locked.</li>
          <li><strong>One token, one chance</strong> — the contract address published at launch is the only official $ALPERP.</li>
        </ul>
        <div className="doc-callout">
          ⚠️ Always verify the official contract address from our X account before buying. Any token claiming to be
          $ALPERP that is not the address we publish is a scam.
        </div>

        <h2 id="launch">Launch a market</h2>
        <p>Spinning up a perp takes three steps and about ten seconds:</p>
        <ul>
          <li><strong>1. Paste the mint</strong> — any SPL token address.</li>
          <li><strong>2. Set max leverage</strong> — choose the ceiling traders can use (2×–100×).</li>
          <li><strong>3. Pay 0.3 SOL &amp; sign</strong> — the market goes live instantly and you become its creator.</li>
        </ul>
        <p>From that block on, the market trades against a virtual bonding-curve pool and you collect a share of every fee it generates.</p>

        <h2 id="trade">Trading perps</h2>
        <p>Every market is an isolated-margin perpetual. Supported order types:</p>
        <ul>
          <li>Market &amp; Limit</li>
          <li>Stop-market &amp; Stop-limit</li>
          <li>Take-profit &amp; Reduce-only</li>
        </ul>
        <p>Collateral is posted in USDC. Positions are isolated, so risk on one market never touches another.</p>

        <h2 id="liquidity">Liquidity &amp; graduation</h2>
        <p>
          Newborn markets open against a <strong>virtual bonding-curve pool</strong> (default virtual depth ~$120K), so
          day-one trades clear at sub-percent slippage. Once a market crosses <strong>$50K in cumulative volume</strong> it
          “graduates” and transitions to deeper, real liquidity.
        </p>
        <table className="doc-table">
          <tbody>
            <tr><th>Virtual depth (default)</th><td className="v">$120,000</td></tr>
            <tr><th>Slippage @ $10K order</th><td className="v">~0.42%</td></tr>
            <tr><th>Graduation threshold</th><td className="v">$50,000 volume</td></tr>
          </tbody>
        </table>

        <h2 id="fees">Fees &amp; creator earnings</h2>
        <p>Trading fees are split transparently. Creators collect <strong>10% of every trading fee</strong> on the market they launched, for the life of that market.</p>
        <table className="doc-table">
          <thead><tr><th>Recipient</th><th>Share</th></tr></thead>
          <tbody>
            <tr><td>Market creator</td><td className="v">10%</td></tr>
            <tr><td>Protocol treasury</td><td className="v">60%</td></tr>
            <tr><td>Insurance fund</td><td className="v">20%</td></tr>
            <tr><td>Liquidity providers</td><td className="v">10%</td></tr>
          </tbody>
        </table>
        <p>Indicative taker fee is <code>0.02%</code> per fill; $ALPERP holders receive a discount.</p>

        <h2 id="leverage">Leverage &amp; liquidation</h2>
        <p>
          Leverage runs from 2× up to a per-market cap of 100×. Each position has a liquidation price derived from
          entry, leverage and a maintenance-margin buffer. As an example, a 25× long entered at <code>$1.8472</code> liquidates
          around <code>$1.7807</code>. The insurance fund backstops shortfalls during fast moves.
        </p>

        <h2 id="security">Risk &amp; disclaimer</h2>
        <p>
          Perpetual futures are high-risk. Leverage can wipe out your collateral quickly, and permissionless
          markets can be thin or volatile. Nothing here is financial advice. Only trade what you can afford to
          lose, and always confirm contract addresses yourself.
        </p>

        <h2 id="faq">FAQ</h2>
        <h3>Is $ALPERP live yet?</h3>
        <p>$ALPERP launches 100% fair on Pump.fun. The official contract address will be posted on our X account at launch.</p>
        <h3>Do I need $ALPERP to trade?</h3>
        <p>No — you trade perps with USDC collateral. Holding $ALPERP simply lowers your fees and unlocks governance.</p>
        <h3>What does it cost to launch a market?</h3>
        <p>A flat 0.3 SOL. After that you earn 10% of the market’s trading fees forever.</p>
        <h3>Which wallet do I connect?</h3>
        <p>Phantom is supported out of the box; your real SOL balance sets your launch budget on the launch card.</p>

        <p style={{ marginTop: 34, color: "var(--muted)" }}>
          More questions? Reach us on X (link in the navbar). © 2026 AlphaPerp Labs.
        </p>
      </article>
    </section>
  );
}
