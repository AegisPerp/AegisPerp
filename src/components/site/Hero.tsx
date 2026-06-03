import { ConnectWallet } from "./ConnectWallet";
import { PUMPFUN_URL } from "../../lib/links";

export function Hero() {
  return (
    <header className="hero-center">
      <div className="badge rise d1">
        <span className="dot" /> Beta · Live on Solana
      </div>
      <h1 className="h1 rise d2">
        Open a perp on anything that <span className="grad">trades.</span>
      </h1>
      <p className="lead rise d3">
        HYPERPERP converts any Solana token into a leveraged perpetual the instant
        your launch fee settles — isolated leverage up to 100×, six order types, and
        narrow spreads right from block one. Powered by <strong style={{ color: "var(--ink)" }}>$HYPERP</strong>.
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
