"use client";

import { useEffect, useState } from "react";
import { pad2 } from "@/lib/format";
import styles from "./Hero.module.css";

type Parts = { d: number; h: number; m: number; s: number };

function partsUntil(target: number): Parts {
  let ms = Math.max(0, target - Date.now());
  const d = Math.floor(ms / 864e5);
  ms -= d * 864e5;
  const h = Math.floor(ms / 36e5);
  ms -= h * 36e5;
  const m = Math.floor(ms / 6e4);
  ms -= m * 6e4;
  return { d, h, m, s: Math.floor(ms / 1e3) };
}

/** Renders "--" on the server and fills in on mount, so prerendered HTML never bakes in a stale time. */
export function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const t = new Date(target).getTime();
    const tick = () => setParts(partsUntil(t));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: [keyof Parts, string][] = [
    ["d", "Days"],
    ["h", "Hrs"],
    ["m", "Min"],
    ["s", "Sec"],
  ];

  return (
    <div className={styles.countdown}>
      <p className="eyebrow" id="countdown-label">
        Bass drops in
      </p>
      <div className={styles.cells} role="timer" aria-labelledby="countdown-label">
        {cells.map(([k, label]) => (
          <div className={styles.cell} key={k}>
            <b>{parts ? pad2(parts[k]) : "--"}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
