import React, { useEffect, useState } from "react";
import { PROJECT_NAME } from "../../lib/constants";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import logoImg from "../../../public/logo.png";

function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border shadow-lg shadow-black/20" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2.5 cursor-pointer group">
          <img src={logoImg} alt="Logo" className="w-9 h-9 rounded-lg object-cover ring-1 ring-accent/20 group-hover:ring-accent/50 transition-all" />
          <span className="font-extrabold text-lg tracking-tight text-text group-hover:text-accent transition-colors">{PROJECT_NAME}</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Markets", path: "/launchpad" },
            { label: "Launch", path: "/launchpad/create" },
            { label: "Docs", path: "#how-it-works" },
          ].map(link => (
            <a
              key={link.label}
              href={link.path}
              onClick={(e) => {
                if (!link.path.startsWith("#")) {
                  e.preventDefault();
                  navigate(link.path);
                }
              }}
              className="px-4 py-2 text-sm text-text-secondary hover:text-accent font-medium transition-colors rounded-lg hover:bg-accent/5 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="https://x.com/AegisPerp" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://github.com/AegisPerp/AegisPerp" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
          <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/launchpad")}>
            Open App
          </Button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-text-secondary hover:text-text cursor-pointer">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /> : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-border px-6 py-4 space-y-2">
          {[
            { label: "Markets", path: "/launchpad" },
            { label: "Launch", path: "/launchpad/create" },
          ].map(link => (
            <a
              key={link.label}
              href={link.path}
              onClick={(e) => { e.preventDefault(); navigate(link.path); setMenuOpen(false); }}
              className="block px-4 py-3 text-sm text-text-secondary hover:text-accent font-medium rounded-lg hover:bg-accent/5 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
