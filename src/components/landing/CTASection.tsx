import React from "react";
import { Button } from "../ui/Button";

function navigate(path: string) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function CTASection() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] mb-6 leading-tight">
          Choose a token.<br />
          Dial in the leverage.<br />
          <span className="gradient-text">Launch the perp.</span>
        </h2>
        <p className="text-text-secondary text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          The pump.fun generation bypassed the listing process for spot markets. We're bringing that same freedom to leverage.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/launchpad/create")}>Launch a market</Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/launchpad")}>Browse first</Button>
        </div>
      </div>
    </section>
  );
}
