import { TWITTER_URL } from "../../lib/links";

export function Nav({ view, go }: { view: "home" | "docs"; go: (t: string) => void }) {
  return (
    <nav className="nav rise">
      <div className="nav-inner">
        <button className="brand" onClick={() => go("top")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <img className="brand-logo" src="/logos/alpha.png" alt="AlphaPerp" />
          <span className="brand-name">Alpha<b>Perp</b></span>
        </button>

        <div className="nav-links">
          <a onClick={() => go("how")}>How to use</a>
          <a onClick={() => go("markets")}>Markets</a>
          <a className={view === "docs" ? "active" : ""} onClick={() => go("docs")}>Docs</a>
        </div>

        <div className="nav-right">
          <a className="nav-icon" href={TWITTER_URL} target="_blank" rel="noreferrer" aria-label="X / Twitter" title="Follow on X">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.16 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
          </a>
          <button className="btn btn-primary" onClick={() => go("markets")}>Open app</button>
        </div>
      </div>
    </nav>
  );
}
