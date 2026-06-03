import { useEffect, useState } from "react";
import { useFeed } from "../../lib/feed";
import { useWallet } from "../../lib/wallet";
import { TokenIcon } from "./TokenIcon";
import { ScrollReveal } from "./ScrollReveal";

function LaunchCard() {
  const { markets } = useFeed();
  const { address, balance, walletName, openChooser } = useWallet();
  const [mint, setMint] = useState("WIF");
  const [leverage, setLeverage] = useState(50);
  const [notice, setNotice] = useState("");

  const token = markets.find((m) => m.symbol === mint);
  const maxLev = token?.leverage ?? 100;
  const lev = Math.min(leverage, maxLev);
  useEffect(() => { setLeverage((l) => Math.min(l, maxLev)); }, [maxLev]);
  const fillPct = ((lev - 2) / (maxLev - 2 || 1)) * 100;
  const short = address ? address.slice(0, 4) + "…" + address.slice(-4) : "";

  const launch = () => {
    if (!address) { openChooser(); return; }
    setNotice(`${mint}-PERP @ ${lev}× ready — on-chain market creation activates after the devnet deploy.`);
    setTimeout(() => setNotice(""), 5000);
  };

  return (
    <div className="launch">
      <div className="field-label">Token mint</div>
      <div className="mint">
        <TokenIcon symbol={mint} src={token?.logo} size={26} />
        <select value={mint} onChange={(e) => setMint(e.target.value)}>
          {markets.map((m) => <option key={m.symbol} value={m.symbol}>{m.symbol} · {m.name}</option>)}
        </select>
      </div>

      <div className="wallet-row">
        <button className={"wallet-btn " + (address ? "on" : "")} onClick={openChooser}>
          {address ? (
            <><img src={`/logos/${walletName}.svg`} alt="" style={{ width: 15, height: 15, borderRadius: 4, marginRight: 6, verticalAlign: "-2px" }} />{short}</>
          ) : "Connect wallet"}
        </button>
        <div className="wallet-bal">
          {address ? <>Balance <b>{balance != null ? balance.toFixed(3) : "…"} SOL</b></> : "creator wallet"}
        </div>
      </div>

      <div className="field-label" style={{ marginBottom: 0 }}>
        <div className="lev-head"><span>Max leverage</span><span className="x">{lev}×</span></div>
      </div>
      <input
        className="range" type="range" min={2} max={maxLev} step={1} value={lev}
        onChange={(e) => setLeverage(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--green) ${fillPct}%, #dfe4ea ${fillPct}%)` }}
      />

      <div className="fee-row"><span className="k">Launch fee</span><span className="v">0.3 SOL</span></div>
      {notice && <div className="term-notice">{notice}</div>}
      <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={launch}>
        Launch market →
      </button>
    </div>
  );
}

const spot = (e: React.MouseEvent<HTMLDivElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export function HowItWorks() {
  return (
    <section className="section" id="how">
      <ScrollReveal className="reveal center-head">
        <div className="eyebrow">How it works</div>
        <h2>Three things no centralized<br />perp desk will ever give you.</h2>
      </ScrollReveal>

      <div className="steps">
        <ScrollReveal>
          <div className="card spot step" onMouseMove={spot}>
            <div className="no">01</div>
            <h3>Pay 0.3 SOL, ship a perp.</h3>
            <p>No listing process, no gatekeepers, no backroom deals. Paste a mint, configure your leverage, sign once — the market goes live before your post hits the timeline.</p>
            <LaunchCard />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="card spot step" onMouseMove={spot}>
            <div className="no">02</div>
            <h3>Narrow spreads from the start.</h3>
            <p>Fresh markets open against a virtual bonding-curve pool. Early trades settle with sub-percent slippage — the chart reads like a real market, not static noise.</p>
            <svg className="mini" viewBox="0 0 400 160" preserveAspectRatio="none">
              <defs><linearGradient id="bc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8a415" stopOpacity="0.25" /><stop offset="100%" stopColor="#c8a415" stopOpacity="0" /></linearGradient></defs>
              <path d="M8,138 C110,116 210,72 392,26 L392,160 L8,160 Z" fill="url(#bc)" />
              <path d="M8,138 C110,116 210,72 392,26" fill="none" stroke="#c8a415" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="262" y1="22" x2="262" y2="150" stroke="#c8a415" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.7" />
              <text x="266" y="30" fill="#c8a415" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">GRADUATION</text>
            </svg>
            <div className="mini-stats">
              <div><div className="k">Slippage @ $10K</div><div className="v">0.42%</div></div>
              <div><div className="k">Virtual depth</div><div className="v">$120K</div></div>
              <div><div className="k">Graduates at</div><div className="v">$50K vol</div></div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="card spot step" onMouseMove={spot}>
            <div className="no">03</div>
            <h3>Earn as long as the market exists.</h3>
            <p>10% of all trading fees on your market flows directly to your wallet, indefinitely. The volume doesn't need to come from you.</p>
            <svg className="mini" viewBox="0 0 400 160" preserveAspectRatio="none">
              <defs><linearGradient id="er" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8a415" stopOpacity="0.22" /><stop offset="100%" stopColor="#c8a415" stopOpacity="0" /></linearGradient></defs>
              <path d="M8,120 L48,104 L88,112 L128,72 L168,90 L208,58 L248,40 L288,62 L328,48 L392,66 L392,160 L8,160 Z" fill="url(#er)" />
              <path d="M8,120 L48,104 L88,112 L128,72 L168,90 L208,58 L248,40 L288,62 L328,48 L392,66" fill="none" stroke="#c8a415" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div className="mini-stats">
              <div><div className="k">Last 24h</div><div className="v g">$84.20</div></div>
              <div><div className="k">Last 7d</div><div className="v g">$612.40</div></div>
              <div><div className="k">Lifetime</div><div className="v g">$4,210</div></div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
