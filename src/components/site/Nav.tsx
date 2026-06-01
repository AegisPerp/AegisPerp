import { TWITTER_URL, GITHUB_URL } from "../../lib/links";

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
          <a className="nav-icon" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub" title="View source on GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" /></svg>
          </a>
          <a className="nav-icon" href={TWITTER_URL} target="_blank" rel="noreferrer" aria-label="X / Twitter" title="Follow on X">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.16 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
          </a>
          <button className="btn btn-primary" onClick={() => go("markets")}>Open app</button>
        </div>
      </div>
    </nav>
  );
}
