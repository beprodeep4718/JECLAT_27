"use client";

import { Fragment, useEffect, useRef } from "react";
import { fest } from "@/data/fest";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import styles from "./Ticker.module.css";

const ITEMS = [
  `${fest.theme.title}: ${fest.theme.subtitle}`,
  fest.dateRange,
  "bn",
  `${fest.collegeShort} Jalpaiguri`,
  fest.tagline,
];

/** Lyric-sheet style marquee ("/" between bars). Speed and skew follow scroll velocity; scrolling up reverses it. */
export function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { velocity } = useSmoothScroll();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;
    let x = 0;
    let vel = 0;
    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(0.05, deltaMs / 1000);
      vel += (velocity() - vel) * 0.2;
      const half = track.scrollWidth / 2;
      x -= (70 + Math.abs(vel) * 40) * dt * (vel < -0.5 ? -1 : 1);
      if (half > 0) {
        if (-x >= half) x += half;
        if (x > 0) x -= half;
      }
      const skew = Math.max(-10, Math.min(10, -vel * 0.5));
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [velocity]);

  const run = (
    <span>
      {ITEMS.map((item, i) => (
        <Fragment key={i}>
          {item === "bn" ? <span className="bn">{fest.theme.inspirationBn}</span> : item}
          <i className={styles.sl}>/</i>
        </Fragment>
      ))}
    </span>
  );

  return (
    // the clip box keeps the rotated band from widening the page (iOS ignores body overflow-x)
    <div className={styles.clip} aria-hidden="true">
      <div className={styles.ticker}>
        <div className={styles.track} ref={trackRef}>
          {/* four copies: two halves, so the loop can wrap seamlessly */}
          {run}
          {run}
          {run}
          {run}
        </div>
      </div>
    </div>
  );
}
