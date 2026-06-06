import { ConnectWallet } from "./ConnectWallet";
import { PUMPFUN_URL } from "../../lib/links";

export function Hero() {
  return (
    <header className="hero-center">
      <div className="badge rise d1">
        <span className="dot" /> Live now — early adopters are already earning
      </div>
      <h1 className="h1 rise d2">
        While you wait for listings,<br/>they're already <span className="grad">printing.</span>
      </h1>
      <p className="lead rise d3">
        Every hour a new perp market launches on AEGISPERP — and the creator pockets
        10% of every single trade. No approvals, no VCs, no waitlists.
        Just paste a token, set leverage up to 100×, and start collecting fees
        before your tweet goes live. <strong style={{ color: "var(--ink)" }}>The window won't stay open forever.</strong>
      </p>
      <div className="cta-row rise d4">
        <ConnectWallet />
        <button className="btn btn-ghost btn-lg" onClick={() => window.open(PUMPFUN_URL, "_blank")}>Buy $AGPERP now</button>
      </div>
      <div className="hero-stats rise d5">
        <div><div className="v">100<span className="u">×</span></div><div className="l">max leverage</div></div>
        <div><div className="v">10<span className="u">%</span></div><div className="l">fee share forever</div></div>
        <div><div className="v">0.3</div><div className="l">SOL to launch</div></div>
      </div>
    </header>
  );
}
