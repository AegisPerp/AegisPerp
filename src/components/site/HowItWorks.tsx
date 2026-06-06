import { useEffect, useRef, useState } from "react";
import { useFeed } from "../../lib/feed";
import { ScrollReveal } from "./ScrollReveal";

/* ── Animated icon: Rocket with flame flicker ── */
function RocketIcon() {
  return (
    <div className="pillar-icon pillar-icon--launch">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4C24 4 32 12 32 24C32 32 28 38 24 42C20 38 16 32 16 24C16 12 24 4 24 4Z" fill="url(#rk)" stroke="#c8a415" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="24" cy="22" r="4" fill="#fff" stroke="#c8a415" strokeWidth="1.5"/>
        <path className="flame" d="M21 42C21 42 22 46 24 48C26 46 27 42 27 42" stroke="#e8c026" strokeWidth="2.5" strokeLinecap="round"/>
        <defs><linearGradient id="rk" x1="24" y1="4" x2="24" y2="42"><stop stopColor="#f5d44e"/><stop offset="1" stopColor="#c8a415"/></linearGradient></defs>
      </svg>
    </div>
  );
}

/* ── Animated icon: Spread bars pulsing ── */
function SpreadIcon() {
  return (
    <div className="pillar-icon pillar-icon--spread">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect className="bar bar1" x="6" y="28" width="8" height="14" rx="3" fill="#c8a415" opacity="0.6"/>
        <rect className="bar bar2" x="20" y="16" width="8" height="26" rx="3" fill="#c8a415" opacity="0.8"/>
        <rect className="bar bar3" x="34" y="8" width="8" height="34" rx="3" fill="#c8a415"/>
        <path d="M10 26L24 14L38 6" stroke="#f5d44e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3"/>
      </svg>
    </div>
  );
}

/* ── Animated icon: Coin stack growing ── */
function EarnIcon() {
  return (
    <div className="pillar-icon pillar-icon--earn">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <ellipse className="coin c1" cx="24" cy="38" rx="14" ry="5" fill="#c8a415" opacity="0.4"/>
        <ellipse className="coin c2" cx="24" cy="32" rx="14" ry="5" fill="#c8a415" opacity="0.6"/>
        <ellipse className="coin c3" cx="24" cy="26" rx="14" ry="5" fill="#c8a415" opacity="0.8"/>
        <ellipse className="coin c4" cx="24" cy="20" rx="14" ry="5" fill="#e8c026"/>
        <text x="24" y="23" textAnchor="middle" fill="#0a0a08" fontSize="8" fontWeight="800" fontFamily="var(--mono)">$</text>
      </svg>
    </div>
  );
}

/* ── Live depth bar: animated bid/ask spread ── */
function DepthBar() {
  const [spread, setSpread] = useState(0.42);
  const [bid, setBid] = useState(62);
  const [ask, setAsk] = useState(38);

  useEffect(() => {
    const iv = setInterval(() => {
      setSpread(+(0.2 + Math.random() * 0.5).toFixed(2));
      const b = 55 + Math.random() * 15;
      setBid(Math.round(b));
      setAsk(Math.round(100 - b));
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="depth-bar-wrap">
      <div className="depth-bar">
        <div className="depth-bid" style={{ width: `${bid}%` }}>
          <span>BID {bid}%</span>
        </div>
        <div className="depth-ask" style={{ width: `${ask}%` }}>
          <span>ASK {ask}%</span>
        </div>
      </div>
      <div className="depth-stats">
        <div><span className="k">Spread</span><span className="v">{spread}%</span></div>
        <div><span className="k">Depth</span><span className="v">$120K</span></div>
        <div><span className="k">Slippage</span><span className="v">0.42%</span></div>
      </div>
    </div>
  );
}

/* ── Revenue counter: ticks up continuously ── */
function RevenueCounter() {
  const [revenue, setRevenue] = useState(4210.0);
  const [daily, setDaily] = useState(84.2);
  const ref = useRef(revenue);
  ref.current = revenue;

  useEffect(() => {
    const iv = setInterval(() => {
      const tick = 0.01 + Math.random() * 0.08;
      setRevenue((r) => +(r + tick).toFixed(2));
      setDaily((d) => +(d + tick * 0.3).toFixed(2));
    }, 600);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="revenue-wrap">
      <div className="revenue-main">
        <span className="revenue-label">Your earnings so far</span>
        <span className="revenue-val">${revenue.toLocaleString("en", { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="revenue-rows">
        <div className="revenue-row">
          <span className="k">Today</span>
          <span className="v up">+${daily.toFixed(2)}</span>
        </div>
        <div className="revenue-row">
          <span className="k">This week</span>
          <span className="v up">+$612.40</span>
        </div>
        <div className="revenue-row">
          <span className="k">Your cut</span>
          <span className="v">10% of all fees</span>
        </div>
      </div>
    </div>
  );
}

/* ── Mini launch form (compact) ── */
function MiniLaunch() {
  const { markets } = useFeed();
  const [mint, setMint] = useState("WIF");
  const [lev, setLev] = useState(50);
  const [launched, setLaunched] = useState(false);

  const token = markets.find((m) => m.symbol === mint);
  const maxLev = token?.leverage ?? 100;
  const safeLev = Math.min(lev, maxLev);
  const fillPct = ((safeLev - 2) / (maxLev - 2 || 1)) * 100;

  const fire = () => { setLaunched(true); setTimeout(() => setLaunched(false), 2500); };

  return (
    <div className="mini-launch">
      <div className="ml-row">
        <select className="ml-select" value={mint} onChange={(e) => { setMint(e.target.value); setLaunched(false); }}>
          {markets.map((m) => <option key={m.symbol} value={m.symbol}>{m.symbol}</option>)}
        </select>
        <span className="ml-lev">{safeLev}x</span>
      </div>
      <input
        className="range" type="range" min={2} max={maxLev} step={1} value={safeLev}
        onChange={(e) => setLev(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--green) ${fillPct}%, #2a2720 ${fillPct}%)` }}
      />
      <button className={"btn btn-primary ml-btn" + (launched ? " launched" : "")} onClick={fire}>
        {launched ? "Launched!" : "Launch now →"}
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
        <div className="eyebrow">Why AEGISPERP</div>
        <h2>CEXs take weeks to list.<br/>You take 10 seconds.</h2>
      </ScrollReveal>

      <div className="pillars">
        <ScrollReveal className="reveal reveal-d1">
          <div className="card spot pillar" onMouseMove={spot}>
            <RocketIcon />
            <h3>Ship first. Ask never.</h3>
            <p>No applications. No committees. No begging for a listing. Pay 0.3 SOL, your market is live before your competitor even opens a support ticket.</p>
            <MiniLaunch />
            <div className="pillar-tag">0.3 SOL — that's it</div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="reveal reveal-d2">
          <div className="card spot pillar" onMouseMove={spot}>
            <SpreadIcon />
            <h3>Real liquidity. Instantly.</h3>
            <p>Not a ghost order book — bonding-curve depth from block one. Sub-percent slippage while other platforms show you "coming soon."</p>
            <DepthBar />
          </div>
        </ScrollReveal>

        <ScrollReveal className="reveal reveal-d3">
          <div className="card spot pillar" onMouseMove={spot}>
            <EarnIcon />
            <h3>Get paid while you sleep.</h3>
            <p>10% of every trade fee on your market hits your wallet automatically. Not for a month. Not for a year. Forever. The volume compounds, your income compounds.</p>
            <RevenueCounter />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
