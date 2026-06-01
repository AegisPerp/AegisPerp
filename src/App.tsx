import { useState } from "react";
import { FeedProvider } from "./lib/feed";
import { WalletProvider } from "./lib/wallet";
import { WalletModal } from "./components/site/WalletModal";
import { Nav } from "./components/site/Nav";
import { Hero } from "./components/site/Hero";
import { StatBar } from "./components/site/StatBar";
import { Marquee } from "./components/site/Marquee";
import { HowItWorks } from "./components/site/HowItWorks";
import { LiveChart } from "./components/site/LiveChart";
import { Terminal } from "./components/site/Terminal";
import { Markets } from "./components/site/Markets";
import { DocsPage } from "./components/site/DocsPage";
import { Footer } from "./components/site/Footer";

export function App() {
  const [view, setView] = useState<"home" | "docs">("home");

  const go = (target: string) => {
    if (target === "docs") { setView("docs"); window.scrollTo({ top: 0 }); return; }
    if (target === "top") { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setView("home");
    setTimeout(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);
  };

  return (
    <FeedProvider>
     <WalletProvider>
      <div className="bg-fx" aria-hidden />
      <div className="bg-grid" aria-hidden />
      <WalletModal />
      <Nav view={view} go={go} />

      {view === "docs" ? (
        <main className="wrap"><DocsPage /></main>
      ) : (
        <main className="wrap">
          <Hero />
          {/* running realtime prices right below the hero */}
          <Marquee />
          {/* how it works (reference images 3 & 4) */}
          <HowItWorks />
          <StatBar />
          <section className="section" id="terminal">
            <div className="center-head rise">
              <div className="eyebrow">One terminal</div>
              <h2>The same desk across<br />every market you touch.</h2>
              <p>Pick any market from the table — the chart and this terminal update live with it.</p>
            </div>
            <div className="desk">
              <LiveChart />
              <Terminal />
            </div>
          </section>
          <Markets />
        </main>
      )}

      <div className="wrap"><Footer go={go} /></div>
     </WalletProvider>
    </FeedProvider>
  );
}

export default App;
