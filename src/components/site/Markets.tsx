import { useEffect, useRef, useState } from "react";
import { useFeed, type Market } from "../../lib/feed";
import { TokenIcon } from "./TokenIcon";
import { Sparkline } from "./Sparkline";
import { fmtUsd, fmtPct, fmtCompact } from "../../lib/fmt";

function Row({ m }: { m: Market }) {
  const { selected, setSelected } = useFeed();
  const [flash, setFlash] = useState<"" | "fu" | "fd">("");
  const prev = useRef(m.price);
  useEffect(() => {
    if (m.price !== prev.current) {
      setFlash(m.price > prev.current ? "fu" : "fd");
      prev.current = m.price;
      const id = setTimeout(() => setFlash(""), 450);
      return () => clearTimeout(id);
    }
  }, [m.price]);

  const up = m.change24h >= 0;
  return (
    <tr className={selected === m.symbol ? "sel" : ""} onClick={() => setSelected(m.symbol)}>
      <td>
        <div className="asset">
          <TokenIcon symbol={m.symbol} src={m.logo} size={34} />
          <div>
            <div className="sym">{m.symbol}</div>
            <div className="nm">{m.name}</div>
          </div>
        </div>
      </td>
      <td className={"r px " + flash}>{fmtUsd(m.price)}</td>
      <td className="r"><span className={"chg " + (up ? "up" : "down")}>{fmtPct(m.change24h)}</span></td>
      <td className="r hide mono">{fmtCompact(m.volume24h)}</td>
      <td className="r hide"><span className="lev">{m.leverage}×</span></td>
      <td className="r hide"><div style={{ display: "inline-block" }}><Sparkline data={m.spark} up={up} /></div></td>
      <td className="r">
        <button className="trade" onClick={(e) => { e.stopPropagation(); setSelected(m.symbol); }}>Trade</button>
      </td>
    </tr>
  );
}

export function Markets() {
  const { markets, connected } = useFeed();
  return (
    <section className="section rise" id="markets">
      <div className="sec-head">
        <div>
          <h2>Live markets</h2>
          <p>Click any market to load it on the chart — prices stream in real time.</p>
        </div>
        <span className="live">
          <span className="dot" style={{ background: connected ? "var(--accent)" : "var(--cyan)" }} />
          {connected ? "Live feed" : "Live"}
        </span>
      </div>
      <div className="card table-card">
        <table className="mk">
          <thead>
            <tr>
              <th>Market</th>
              <th className="r">Price</th>
              <th className="r">24h</th>
              <th className="r hide">Volume</th>
              <th className="r hide">Max lev.</th>
              <th className="r hide">Last 40</th>
              <th className="r"></th>
            </tr>
          </thead>
          <tbody>
            {markets.map((m) => <Row key={m.symbol} m={m} />)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
