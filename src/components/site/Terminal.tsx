import { useState } from "react";
import { useFeed } from "../../lib/feed";
import { useWallet } from "../../lib/wallet";
import { TokenIcon } from "./TokenIcon";
import { fmtUsd, fmtPct } from "../../lib/fmt";

const FEE_RATE = 0.0025;

export function Terminal() {
  const { selected, bySymbol } = useFeed();
  const { address, openChooser } = useWallet();
  const m = bySymbol(selected);
  const [notice, setNotice] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");
  const [otype, setOtype] = useState<"market" | "limit">("market");
  const [collateral, setCollateral] = useState(1200);
  const [leverage, setLeverage] = useState(25);

  const maxLev = m?.leverage ?? 100;
  const lev = Math.min(leverage, maxLev);
  const entry = m?.price ?? 0;
  const size = collateral * lev;
  const liq = side === "long" ? entry * (1 - 0.9 / lev) : entry * (1 + 0.9 / lev);
  const fee = size * FEE_RATE;
  const up = (m?.change24h ?? 0) >= 0;
  const fillPct = ((lev - 2) / (maxLev - 2)) * 100;

  const spot = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="card spot term rise" onMouseMove={spot}>
      <div className="term-top">
        <div className="term-id">
          <TokenIcon symbol={selected} src={m?.logo} size={44} />
          <div>
            <div className="nm">{selected}-PERP<span className="max">{maxLev}× max</span></div>
            <div className="sub">{m?.name ?? selected}</div>
          </div>
        </div>
        <div className="term-px">
          <div className="p">{fmtUsd(entry)}</div>
          <div className={"c " + (up ? "up" : "down")}>{up ? "▲" : "▼"} {fmtPct(m?.change24h ?? 0)} · 24h</div>
        </div>
      </div>

      <div className="seg">
        <button className={"long " + (side === "long" ? "on" : "")} onClick={() => setSide("long")}>Long</button>
        <button className={"short " + (side === "short" ? "on" : "")} onClick={() => setSide("short")}>Short</button>
      </div>

      <div className="seg">
        <button className={"otype " + (otype === "market" ? "on" : "")} onClick={() => setOtype("market")}>Market</button>
        <button className={"otype " + (otype === "limit" ? "on" : "")} onClick={() => setOtype("limit")}>Limit</button>
      </div>

      <div className="field-label">Collateral</div>
      <div className="amount">
        <input
          type="number"
          min={0}
          value={collateral}
          onChange={(e) => setCollateral(Math.max(0, Number(e.target.value) || 0))}
        />
        <span className="unit">USDC</span>
      </div>

      <div className="field-label" style={{ marginBottom: 0 }}>
        <div className="lev-head">
          <span>Leverage</span>
          <span className="x">{lev}×</span>
        </div>
      </div>
      <input
        className="range"
        type="range"
        min={2}
        max={maxLev}
        value={lev}
        onChange={(e) => setLeverage(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--green) ${fillPct}%, #2a2720 ${fillPct}%)` }}
      />

      <div className="trows">
        <div className="trow"><span className="k">Entry</span><span className="v">{fmtUsd(entry)}</span></div>
        <div className="trow"><span className="k">Liq. price</span><span className="v">{fmtUsd(liq)}</span></div>
        <div className="trow"><span className="k">Size</span><span className="v">${size.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></div>
        <div className="trow"><span className="k">Fee</span><span className="v">${fee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
      </div>

      {notice && <div className="term-notice">{notice}</div>}
      <button
        onClick={() => {
          if (!address) { openChooser(); return; }
          setNotice(`${side === "long" ? "Long" : "Short"} ${selected} ${lev}× · ${size.toLocaleString("en-US", { maximumFractionDigits: 0 })} USDC — order submitted. Awaiting on-chain confirmation.`);
          setTimeout(() => setNotice(""), 5000);
        }}
        className="btn btn-lg term-submit"
        style={side === "short" ? { background: "linear-gradient(180deg,#f0676b,var(--down))", color: "#fff", boxShadow: "0 12px 26px -12px rgba(229,72,77,.7)" } : { background: "linear-gradient(180deg,var(--green-2),var(--green))", color: "#fff", boxShadow: "0 12px 26px -12px rgba(47,165,106,.7)" }}
      >
        {side === "long" ? "Long" : "Short"} {selected}
      </button>
    </div>
  );
}
