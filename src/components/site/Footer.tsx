import { PUMPFUN_URL, TWITTER_URL, GITHUB_URL } from "../../lib/links";

export function Footer({ go }: { go: (t: string) => void }) {
  return (
    <footer className="footer rise">
      <div className="foot-top">
        <div className="foot-brand">
          <div className="foot-id">
            <img className="brand-logo" src="/logos/alpha.png" alt="AlphaPerp" />
            <span className="brand-name">Alpha<b>Perp</b></span>
          </div>
          <p>Perps on anything that trades. Up to 100× isolated leverage on any Solana token. Powered by $ALPERP.</p>
          <div className="foot-socials">
            <a className="nav-icon" href={TWITTER_URL} target="_blank" rel="noreferrer" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.16 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
            </a>
            <a className="nav-icon" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" /></svg>
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
            <h4>$ALPERP</h4>
            <a href={PUMPFUN_URL} target="_blank" rel="noreferrer">Buy $ALPERP</a>
            <a onClick={() => go("docs")}>Tokenomics</a>
            <a onClick={() => go("docs")}>Docs</a>
          </div>
          <div className="foot-col">
            <h4>Community</h4>
            <a href={TWITTER_URL} target="_blank" rel="noreferrer">X / Twitter</a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
            <a href={PUMPFUN_URL} target="_blank" rel="noreferrer">Pump.fun</a>
          </div>
        </div>
      </div>

      <div className="foot-bottom">
        <span>© 2026 AlphaPerp Labs · Live on Solana</span>
        <span className="foot-disc">Perpetual futures are high-risk. Not financial advice.</span>
      </div>
    </footer>
  );
}
