"use client";

import { useRef, useState } from "react";
import { competitions, totalPrizePool } from "@/data/events";
import { rupees, pad2 } from "@/lib/format";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Events.module.css";

/** Competitions rail: pinned + scrubbed sideways on wide screens, a swipe carousel on phones. */
export function Events() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(1);

  const progress = (p: number) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    setCurrent(Math.min(competitions.length, Math.floor(p * (competitions.length - 1) + 1.0001)));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const rail = railRef.current!;
        const dist = () => Math.max(0, rail.scrollWidth - document.documentElement.clientWidth);
        gsap.to(rail, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: pinRef.current,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => progress(self.progress),
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section className={`band band-night ${styles.events}`} id="events" ref={ref}>
      <div className={styles.pin} ref={pinRef}>
        <div className="wrap">
          <SectionHead
            eyebrow="Competitions"
            title="Battles"
            demoNote="Demo prizes"
            sub={`Eight competitions across three verses with ${rupees(totalPrizePool)} on the table. Register solo or bring your crew.`}
          />
        </div>

        <div
          className={styles.railWrap}
          onScroll={(e) => {
            const el = e.currentTarget;
            const w = el.scrollWidth - el.clientWidth;
            if (w > 0) progress(el.scrollLeft / w);
          }}
        >
          <div className={styles.rail} ref={railRef}>
            {competitions.map((c) => (
              <article key={c.slug} className={styles.card} data-glyph={c.glyph}>
                <div className={styles.cardTop}>
                  <span className={styles.chip}>{c.category}</span>
                  <span>{c.verses}</span>
                </div>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <dl>
                  <div>
                    <dt>Prize pool</dt>
                    <dd>{rupees(c.prizePool)}</dd>
                  </div>
                  <div>
                    <dt>{c.team === "Solo" || c.team === "Duo" ? "Entry" : "Team size"}</dt>
                    <dd>{c.team}</dd>
                  </div>
                </dl>
                {c.registerUrl ? (
                  <a className="btn btn-haldi" href={c.registerUrl}>
                    Register <span className="arr">→</span>
                  </a>
                ) : (
                  <button type="button" className="btn btn-haldi" data-toast={`Demo: ${c.name} registration opens at launch.`}>
                    Register <span className="arr">→</span>
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="wrap">
          <div className={styles.progress} aria-hidden="true">
            <span ref={barRef} />
          </div>
          <div className={styles.hint}>
            <span className="mono">Keep scrolling</span>
            <span className="mono">
              {pad2(current)} / {pad2(competitions.length)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
