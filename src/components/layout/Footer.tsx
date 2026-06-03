import React from "react";
import { PROJECT_NAME } from "../../lib/constants";
import { Badge } from "../ui/Badge";
import logoImg from "../../../public/logo.png";

function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Logo" className="w-9 h-9 rounded-lg object-cover ring-1 ring-accent/20" />
              <span className="font-extrabold text-lg">{PROJECT_NAME}</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              The permissionless perpetual launchpad on Solana. Any SPL token becomes a leveraged market.
            </p>
            <Badge pulse>Beta</Badge>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Markets", href: "/launchpad" },
                { label: "Launch a market", href: "/launchpad/create" },
                { label: "Trading terminal", href: "/launchpad/wif" },
                { label: "Leaderboard", href: "#" },
              ],
            },
            {
              title: "Build",
              links: [
                { label: "Documentation", href: "#" },
                { label: "API (coming soon)", href: "#" },
                { label: "Brand kit", href: "#" },
                { label: "Changelog", href: "#" },
              ],
            },
            {
              title: "Community",
              links: [
                { label: "Twitter/X", href: "https://x.com/hyperperp", external: true },
                { label: "Discord", href: "#" },
                { label: "Terms", href: "#" },
                { label: "Privacy", href: "#" },
              ],
            },
          ].map(section => (
            <div key={section.title}>
              <h4 className="font-bold text-xs uppercase tracking-widest text-text-muted mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...((link as any).external ? { target: "_blank", rel: "noopener" } : {})}
                      onClick={(e) => {
                        if (!(link as any).external && link.href !== "#") {
                          e.preventDefault();
                          navigate(link.href);
                        }
                      }}
                      className="text-text-muted hover:text-accent transition-colors text-sm cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            &copy; 2024 {PROJECT_NAME}. All rights reserved.
          </p>
          <p className="text-text-muted/60 text-[11px] max-w-md text-center sm:text-right leading-relaxed">
            This is beta software. Trading perpetuals carries the risk of total loss. Nothing on this site is investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
