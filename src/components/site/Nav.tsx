import { useState, useEffect } from "react";
import { TWITTER_URL } from "../../lib/links";
export function Nav({ view, go }: { view: "home" | "docs"; go: (t: string) => void }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <nav className="nav rise">
      <div className="nav-inner">
        <button className="brand" onClick={() => go("top")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <img className="brand-logo" src="/logos/aegisperp.png" alt="AEGISPERP" />
          <span className="brand-name">AEGIS<b>PERP</b></span>
        </button>

        <div className="nav-links">
          <a onClick={() => go("how")}>How to use</a>
          <a onClick={() => go("markets")}>Markets</a>
          <a className={view === "docs" ? "active" : ""} onClick={() => go("docs")}>Docs</a>
        </div>

        <div className="nav-right">
          <div className="nav-network">
            <span className="nav-net-dot" />
            <span className="nav-net-label">Solana</span>
          </div>
          <button
            className="nav-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            style={{ fontSize: "18px" }}
          >
            {theme === "light" ? "☾" : "☀"}
          </button>
          <a className="nav-icon" href={TWITTER_URL} target="_blank" rel="noreferrer" aria-label="X / Twitter" title="Follow on X">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.16 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
          </a>
          <button className="btn btn-primary" onClick={() => go("markets")}>Open app</button>
          <button className="btn btn-ghost" onClick={() => go("how")}>Launch</button>
        </div>
      </div>
    </nav>
  );
}
