import { useFeed } from "../../lib/feed";
import { TokenIcon } from "./TokenIcon";
import { fmtUsd, fmtPct } from "../../lib/fmt";

export function Marquee() {
  const { markets, setSelected } = useFeed();
  if (markets.length === 0) return <section className="marquee" />;
  const loop = [...markets, ...markets];

  return (
    <section className="marquee rise">
      <div className="marquee-track">
        {loop.map((m, i) => {
          const up = m.change24h >= 0;
          return (
            <div className="mq" key={m.symbol + i} onClick={() => setSelected(m.symbol)}>
              <TokenIcon symbol={m.symbol} src={m.logo} size={26} />
              <span className="s">{m.symbol}</span>
              <span className="p">{fmtUsd(m.price)}</span>
              <span className={"c " + (up ? "up" : "down")}>{up ? "▲" : "▼"} {fmtPct(m.change24h)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
