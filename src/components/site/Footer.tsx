import { PUMPFUN_URL, TWITTER_URL } from "../../lib/links";

export function Footer({ go }: { go: (t: string) => void }) {
  return (
    <footer className="footer rise">
      <div className="foot-top">
        <div className="foot-brand">
          <div className="foot-id">
            <img className="brand-logo" src="/logos/hyperperp.png" alt="HYPERPERP" />
            <span className="brand-name">HYPER<b>PERP</b></span>
          </div>
          <p>Perpetuals on anything that trades. Isolated leverage up to 100× on any Solana token. Powered by $HYPERP.</p>
          <div className="foot-socials">
            <a className="nav-icon" href={TWITTER_URL} target="_blank" rel="noreferrer" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.16 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
            </a>
          </div>
        </div>

        <div className="foot-cols">
          <div className="foot-col">
            <h4>Product</h4>
            <a onClick={() => go("markets")}>Markets</a>
            <a onClick={() => go("terminal")}>Terminal</a>
            <a onClick={() => go("how")}>How to use</a>
          </div>
          <div className="foot-col">
            <h4>$HYPERP</h4>
            <a href={PUMPFUN_URL} target="_blank" rel="noreferrer">Buy $HYPERP</a>
            <a onClick={() => go("docs")}>Tokenomics</a>
            <a onClick={() => go("docs")}>Docs</a>
          </div>
          <div className="foot-col">
            <h4>Community</h4>
            <a href={TWITTER_URL} target="_blank" rel="noreferrer">X / Twitter</a>
            <a href={PUMPFUN_URL} target="_blank" rel="noreferrer">Pump.fun</a>
          </div>
        </div>
      </div>

      <div className="foot-bottom">
        <span>© 2026 HYPERPERP Labs · Live on Solana</span>
        <span className="foot-disc">Perpetual futures carry significant risk. Not financial advice.</span>
      </div>
    </footer>
  );
}
