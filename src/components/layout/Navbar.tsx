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
