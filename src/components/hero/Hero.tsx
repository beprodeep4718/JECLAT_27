"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import logo from "@/assets/jeclat-mask.webp";
import { fest } from "@/data/fest";
import { gsap, useGSAP } from "@/lib/gsap";
import { Countdown } from "./Countdown";
import styles from "./Hero.module.css";

// Three.js loads in its own chunk after hydration; the <Image> below is the
// first paint and the fallback when WebGL or motion is unavailable.
const MaskCanvas = dynamic(() => import("./MaskCanvas"), { ssr: false });

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [glReady, setGlReady] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(`.${styles.top} > *, .${styles.left} > *, .${styles.right} > *`, {
          y: 22,
          opacity: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.1,
        });
        gsap.from(`.${styles.word}`, { yPercent: 22, duration: 1.3, ease: "power4.out" });
        gsap.to(`.${styles.word}`, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: heroRef },
  );

  return (
    <section className={styles.hero} id="top" ref={heroRef}>
      <div className={`${styles.grid} wrap`}>
        <div className={styles.top}>
          <p className="mono">{fest.college} presents</p>
          <p className="mono">
            <b>{fest.dateLabel}</b> &nbsp;/&nbsp; {fest.venue}
          </p>
        </div>

        <div className={styles.left}>
          <p className="eyebrow">Theme {fest.year}</p>
          <h2 className={styles.theme}>
            <em>{fest.theme.title}:</em> {fest.theme.subtitle}
          </h2>
          <p className={styles.inspo}>
            Inspired by <span className="bn">{fest.theme.inspirationBn}</span> ({fest.theme.inspirationEn}),{" "}
            {fest.theme.inspirationNote}.
          </p>
        </div>

        <div className={`${styles.slot} ${glReady ? styles.glOn : ""}`} ref={slotRef}>
          <Image
            src={logo}
            alt={`${fest.name} ${fest.year} logo: a face formed from melting JECLAT lettering in crimson and mustard`}
            className={styles.fallback}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 900px) 78vw, 30vw"
          />
          <MaskCanvas slotRef={slotRef} heroRef={heroRef} src={logo.src} onReady={() => setGlReady(true)} />
        </div>

        <div className={styles.right}>
          <p className={styles.lede}>{fest.heroLede}</p>
          <div className={styles.ctas}>
            <a className="btn btn-haldi" href="#passes">
              Get passes <span className="arr">→</span>
            </a>
            <a className="btn btn-ghost" href="#verses">
              See schedule
            </a>
          </div>
          <Countdown target={fest.startsAt} />
        </div>

        {/* visible: the big wordmark; read by search engines + screen readers: the full name */}
        <h1 className={styles.word}>
          {fest.name}
          <span className={styles.yr}>{fest.shortYear}</span>
          <span className="sr-only">{`, ${fest.tagline} at ${fest.college}`}</span>
        </h1>
      </div>
    </section>
  );
}
