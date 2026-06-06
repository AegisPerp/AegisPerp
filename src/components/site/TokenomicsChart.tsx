import { useEffect, useRef, useState } from "react";

const SEGMENTS = [
  { label: "Creator", pct: 10, color: "#c8a415" },
  { label: "Treasury", pct: 60, color: "#e8c026" },
  { label: "Insurance", pct: 20, color: "#a68a0f" },
  { label: "LP", pct: 10, color: "#d4b41a" },
];

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 100;
const STROKE = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Place a label at the midpoint angle of a segment, pushed outward. */
function labelPos(startAngle: number, sweep: number) {
  const mid = startAngle + sweep / 2;
  const r = RADIUS + STROKE / 2 + 30;
  return {
    x: CX + r * Math.cos(mid),
    y: CY + r * Math.sin(mid),
  };
}

export function TokenomicsChart() {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Build segment data: start angle, dash length, etc.
  let cursor = -Math.PI / 2; // start at 12 o'clock
  const GAP_ANGLE = 0.04; // small gap between segments in radians
  const segs = SEGMENTS.map((s) => {
    const sweep = (s.pct / 100) * (2 * Math.PI) - GAP_ANGLE;
    const startAngle = cursor;
    cursor += sweep + GAP_ANGLE;
    const dashLen = (sweep / (2 * Math.PI)) * CIRCUMFERENCE;
    const offset = -(startAngle + Math.PI / 2) / (2 * Math.PI) * CIRCUMFERENCE;
    return { ...s, startAngle, sweep, dashLen, offset };
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 8px" }}>
      <svg
        ref={ref}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        style={{ overflow: "visible" }}
        role="img"
        aria-label="Fee distribution donut chart: Creator 10%, Treasury 60%, Insurance 20%, LP 10%"
      >
        {/* Background ring */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="var(--stroke, #e8e4dc)"
          strokeWidth={STROKE}
        />

        {/* Animated segments */}
        {segs.map((s, i) => (
          <circle
            key={s.label}
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={s.color}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            strokeDasharray={`${visible ? s.dashLen : 0} ${CIRCUMFERENCE}`}
            strokeDashoffset={s.offset}
            style={{
              transition: `stroke-dasharray 0.9s cubic-bezier(.4,0,.2,1) ${i * 0.15}s`,
              transformOrigin: `${CX}px ${CY}px`,
            }}
          />
        ))}

        {/* Labels with connecting lines */}
        {segs.map((s) => {
          const lp = labelPos(s.startAngle, s.sweep);
          const midAngle = s.startAngle + s.sweep / 2;
          const innerR = RADIUS + STROKE / 2 + 4;
          const ix = CX + innerR * Math.cos(midAngle);
          const iy = CY + innerR * Math.sin(midAngle);
          const anchor = lp.x > CX ? "start" : "end";
          return (
            <g key={s.label + "-label"} opacity={visible ? 1 : 0} style={{ transition: "opacity 0.6s ease 0.7s" }}>
              <line
                x1={ix}
                y1={iy}
                x2={lp.x}
                y2={lp.y}
                stroke={s.color}
                strokeWidth={1}
                opacity={0.6}
              />
              <text
                x={lp.x}
                y={lp.y - 6}
                textAnchor={anchor}
                fill="var(--ink, #1a1507)"
                fontSize="12"
                fontWeight="700"
                fontFamily="var(--mono, monospace)"
              >
                {s.pct}%
              </text>
              <text
                x={lp.x}
                y={lp.y + 9}
                textAnchor={anchor}
                fill="var(--muted, #8a7e6b)"
                fontSize="11"
                fontWeight="600"
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {/* Center text */}
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--ink, #1a1507)"
          fontSize="18"
          fontWeight="800"
          fontFamily="var(--mono, monospace)"
          letterSpacing="-0.03em"
        >
          $AGPERP
        </text>
        <text
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--muted, #8a7e6b)"
          fontSize="12"
          fontWeight="600"
        >
          1B Supply
        </text>
      </svg>
    </div>
  );
}
