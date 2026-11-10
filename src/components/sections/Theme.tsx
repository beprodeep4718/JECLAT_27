"use client";

import { useRef } from "react";
import { fest } from "@/data/fest";
import type { Stat } from "@/data/types";
import { cssToken, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Theme.module.css";

const fmtStat = (v: number, s: Stat) => `${s.prefix ?? ""}${v.toFixed(s.decimals ?? 0)}${s.suffix ?? ""}`;

export function Theme() {
  const ref = useRef<HTMLElement>(null);
  const words = fest.theme.quote.split(/\s+/);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the closing line lights up word by word (never hidden: smoke → haldi)
        gsap.fromTo(
          `.${styles.w}`,
          { color: cssToken("--smoke") },
          {
            color: cssToken("--haldi"),
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: `.${styles.quote}`, start: "top 82%", end: "bottom 45%", scrub: true },
          },
        );
        gsap.to(`.${styles.tag}`, {
          rotate: -2,
          y: -30,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        // stats count up once; the HTML already holds the final values
        gsap.utils.toArray<HTMLElement>(`[data-stat]`).forEach((el) => {
          const s = fest.stats[Number(el.dataset.stat)];
          const o = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 92%",
            once: true,
            onEnter: () =>
              gsap.to(o, { v: s.value, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = fmtStat(o.v, s)) }),
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section className={`band band-night ${styles.theme}`} id="theme" ref={ref}>
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">The theme</p>
        </div>
        <h2 className={styles.title} data-lean>
          <span className={styles.l1}>{fest.theme.title}:</span>
          <span className={styles.l2}>{fest.theme.subtitle}</span>
          <span className={styles.tag} aria-hidden="true">
            {fest.theme.inspirationBn}
          </span>
        </h2>
        <div className={styles.cols}>
          <div className={styles.copy}>
            {fest.theme.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <blockquote className={styles.quote}>
            {words.map((w, i) => (
              <span key={i}>
                <span className={styles.w}>{w}</span>{" "}
              </span>
            ))}
          </blockquote>
        </div>
        <dl className={styles.stats}>
          {fest.stats.map((s, i) => (
            <div className={styles.stat} key={s.label}>
              <dt>{s.label}</dt>
              <dd data-stat={i}>{fmtStat(s.value, s)}</dd>
            </div>
          ))}
        </dl>
        <p className={`mono ${styles.note}`}>{fest.notes.stats}</p>
      </div>
    </section>
  );
}
