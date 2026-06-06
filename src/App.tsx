import { useState } from "react";
import { FeedProvider } from "./lib/feed";
import { WalletProvider } from "./lib/wallet";
import { WalletModal } from "./components/site/WalletModal";
import { Nav } from "./components/site/Nav";
import { Hero } from "./components/site/Hero";
import { StatBar } from "./components/site/StatBar";
import { Marquee } from "./components/site/Marquee";
import { Partners } from "./components/site/Partners";
import { HowItWorks } from "./components/site/HowItWorks";
import { LiveChart } from "./components/site/LiveChart";
import { Terminal } from "./components/site/Terminal";
import { Markets } from "./components/site/Markets";
import { DocsPage } from "./components/site/DocsPage";
import { Footer } from "./components/site/Footer";
import { ParticleBg } from "./components/site/ParticleBg";
import { ScrollReveal } from "./components/site/ScrollReveal";
import { ActivityFeed } from "./components/site/ActivityFeed";

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
      <ParticleBg />
      <WalletModal />
      <Nav view={view} go={go} />

      {view === "docs" ? (
        <main className="wrap"><DocsPage /></main>
      ) : (
        <main className="wrap">
          <Hero />
          {/* running realtime prices right below the hero */}
          <Marquee />
          <Partners />
          {/* how it works (reference images 3 & 4) */}
          <HowItWorks />
          <StatBar />
          <ActivityFeed />
          <section className="section" id="terminal">
            <ScrollReveal className="reveal center-head">
              <div className="eyebrow">Your edge</div>
              <h2>One terminal.<br />Every market. Zero lag.</h2>
              <p>Click a market, the chart locks in. Execute in under a second. While others fumble between tabs, you're already in the trade.</p>
            </ScrollReveal>
            <ScrollReveal className="reveal">
              <div className="desk">
                <LiveChart />
                <Terminal />
              </div>
            </ScrollReveal>
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
