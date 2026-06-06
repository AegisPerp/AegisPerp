import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

function useCountUp(target: number, duration = 1200) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      setV(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setV(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function Stat({ value, suffix, label, decimals = 0, prefix = "" }: { value: number; suffix?: string; label: string; decimals?: number; prefix?: string }) {
  const n = useCountUp(value);
  return (
    <div className="card stat">
      <div className="v">
        {prefix}{n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
        {suffix && <span className="u">{suffix}</span>}
      </div>
      <div className="l">{label}</div>
    </div>
  );
}

export function StatBar() {
  return (
    <ScrollReveal className="reveal">
      <section className="statbar" id="stats">
        <Stat value={48.2} prefix="$" suffix="M" label="locked & earning" decimals={1} />
        <Stat value={412} label="markets launched" />
        <Stat value={1.2} prefix="$" suffix="B" label="volume traded" decimals={1} />
        <Stat value={186} prefix="$" suffix="K" label="paid to creators" />
      </section>
    </ScrollReveal>
  );
}
