import React, { useMemo } from "react";

interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function Sparkline({ data, width = 80, height = 30, color, className }: SparklineProps) {
  const { points, fillPoints } = useMemo(() => {
    const d = data || Array.from({ length: 24 }, (_, i) => Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5);
    const min = Math.min(...d);
    const max = Math.max(...d);
    const range = max - min || 1;
    const pts = d.map((v, i) => {
      const x = (i / (d.length - 1)) * width;
      const y = height - ((v - min) / range) * (height * 0.85);
      return `${x},${y}`;
    });
    return {
      points: pts.join(" "),
      fillPoints: `0,${height} ${pts.join(" ")} ${width},${height}`,
    };
  }, [data, width, height]);

  const isPositive = !data || data[data.length - 1] >= data[0];
  const lineColor = color || (isPositive ? "#00E68A" : "#FF4D6A");

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sg-${lineColor.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#sg-${lineColor.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
