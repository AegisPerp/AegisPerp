import { useState, useEffect, useRef, useCallback } from "react";

const TOKENS = ["BTC", "ETH", "BNB", "XRP", "ADA", "DOGE", "SOL", "AVAX", "DOT", "LINK", "SUI", "PEPE", "WIF", "BONK", "JUP", "PYTH", "JTO", "RENDER", "POPCAT", "MEW", "ORCA"];

function fakeAddr(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  const head = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const tail = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${head}...${tail}`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randBetween(lo: number, hi: number): number {
  return lo + Math.random() * (hi - lo);
}

type Activity = {
  id: number;
  emoji: string;
  text: string;
  age: string;
  state: "entering" | "visible" | "exiting";
};

function generateActivity(id: number): Activity {
  const token = pick(TOKENS);
  const addr = fakeAddr();
  const templates = [
    { emoji: "\u{1F680}", text: `${token}-PERP market launched by ${addr}` },
    { emoji: "\u{1F4C8}", text: `Long ${token}-PERP $${Math.floor(randBetween(1_200, 85_000)).toLocaleString()} @ ${pick([5, 10, 25, 50])}x` },
    { emoji: "\u{1F4C9}", text: `Short ${token}-PERP $${Math.floor(randBetween(800, 42_000)).toLocaleString()} @ ${pick([10, 25, 50, 100])}x` },
    { emoji: "\u{1F4B0}", text: `Creator earned $${randBetween(8, 420).toFixed(2)} from ${token}-PERP fees` },
    { emoji: "\u{1F3AF}", text: `${token}-PERP graduated at $${Math.floor(randBetween(25_000, 150_000)).toLocaleString()} volume` },
  ];
  const t = pick(templates);
  const ages = ["1s ago", "2s ago", "3s ago", "4s ago", "5s ago", "6s ago", "8s ago"];
  return { id, ...t, age: pick(ages), state: "entering" };
}

const VISIBLE_COUNT = 6;
const INTERVAL_MS = 3000;

export function ActivityFeed() {
  const nextId = useRef(VISIBLE_COUNT);

  // seed initial items
  const [items, setItems] = useState<Activity[]>(() => {
    const seed: Activity[] = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      seed.push({ ...generateActivity(i), state: "visible" });
    }
    return seed;
  });

  const tick = useCallback(() => {
    // mark oldest item as exiting
    setItems((prev) => {
      const updated = prev.map((item, i) =>
        i === prev.length - 1 ? { ...item, state: "exiting" as const } : item
      );
      return updated;
    });

    // after exit animation, add new item at top and remove last
    setTimeout(() => {
      setItems((prev) => {
        const newItem = generateActivity(nextId.current++);
        newItem.state = "entering";
        const trimmed = prev.slice(0, prev.length - 1);
        return [newItem, ...trimmed];
      });

      // mark entering item as visible after animation
      setTimeout(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.state === "entering" ? { ...item, state: "visible" } : item
          )
        );
      }, 50);
    }, 300);
  }, []);

  useEffect(() => {
    const id = setInterval(tick, INTERVAL_MS);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <section className="activity-section rise" id="activity">
      <div className="center-head">
        <div className="eyebrow">Happening now</div>
        <h2>People are making money<br/>while you're reading this.</h2>
      </div>
      <div className="activity-feed card">
        {items.map((item) => (
          <div
            key={item.id}
            className={`activity-item${item.state === "entering" ? " entering" : ""}${item.state === "exiting" ? " exiting" : ""}`}
          >
            <span className="activity-emoji">{item.emoji}</span>
            <span className="activity-text">{item.text}</span>
            <span className="activity-age">{item.age}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
