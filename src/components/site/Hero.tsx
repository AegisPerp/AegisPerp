import { ConnectWallet } from "./ConnectWallet";
import { PUMPFUN_URL } from "../../lib/links";

export function Hero() {
  return (
    <header className="hero-center">
      <div className="badge rise d1">
        <span className="dot" /> Beta · Live on Solana
      </div>
      <h1 className="h1 rise d2">
        Any token. Any leverage. <span className="grad">One click.</span>
      </h1>
      <p className="lead rise d3">
        Every token deserves leverage. HYPERPERP lets anyone create an isolated-margin
        perpetual on any SPL token — 100× max, tight spreads from block one, and you
        earn 10% of every fee it generates. <strong style={{ color: "var(--ink)" }}>Forever.</strong>
      </p>
      <div className="cta-row rise d4">
        <ConnectWallet />
        <button className="btn btn-ghost btn-lg" onClick={() => window.open(PUMPFUN_URL, "_blank")}>Buy $HYPERP</button>
      </div>
      <div className="hero-stats rise d5">
        <div><div className="v">100<span className="u">×</span></div><div className="l">max leverage</div></div>
        <div><div className="v">6</div><div className="l">order types</div></div>
        <div><div className="v">0.02<span className="u">%</span></div><div className="l">taker fee</div></div>
      </div>
    </header>
  );
}
