"use client";

import { useRef, useState } from "react";
import { lineup } from "@/data/lineup";
import type { Act } from "@/data/types";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { scramble } from "@/lib/scramble";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Lineup.module.css";

const tierClass = { 1: styles.tier1, 2: styles.tier2, 3: styles.tier3 } as const;

export function Lineup() {
  const ref = useRef<HTMLElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const [unmasked, setUnmasked] = useState(false);
  const [peek, setPeek] = useState<{ initials: string; genre: string }>({ initials: "", genre: "" });
  const fine = useRef(false);

  useGSAP(
    () => {
      fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // rows drift against each other as the band scrolls past
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(`.${styles.tier2}`, { x: -30 }, { x: 30, ease: "none", scrollTrigger: st });
        gsap.fromTo(`.${styles.tier3}`, { x: 30 }, { x: -20, ease: "none", scrollTrigger: { ...st } });
      });
      const section = ref.current;
      if (!fine.current || !peekRef.current || !section) return;
      gsap.set(peekRef.current, { xPercent: 12, yPercent: -108, scale: 0.85 });
      const xTo = gsap.quickTo(peekRef.current, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(peekRef.current, "y", { duration: 0.5, ease: "power3" });
      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      section.addEventListener("pointermove", move);
      return () => section.removeEventListener("pointermove", move);
    },
    { scope: ref },
  );

  // pointer handlers (run outside render)
  function enter(act: Act, nameEl: HTMLElement | null) {
    const masked = !!act.masked && !unmasked;
    if (nameEl && !act.masked && !prefersReducedMotion()) scramble(nameEl, act.name, 500);
    const peekEl = peekRef.current;
    if (!fine.current || !peekEl) return;
    setPeek({ initials: masked ? "?" : act.initials, genre: masked ? act.masked!.revealNote : act.genre });
    gsap.to(peekEl, { autoAlpha: 1, scale: 1, rotate: gsap.utils.random(-4, 4), duration: 0.35, ease: "back.out(2)" });
  }
  function leave() {
    const peekEl = peekRef.current;
    if (fine.current && peekEl) gsap.to(peekEl, { autoAlpha: 0, scale: 0.85, duration: 0.25 });
  }

  return (
    <section className={`band band-blood ${styles.lineup}`} id="lineup" ref={ref}>
      <div className={`wrap ${styles.inner}`}>
        <SectionHead
          eyebrow="Lineup"
          title="Pro Nights"
          demoNote="Demo names"
          sub="Seven acts across three nights. Hover a name to see its slot, and tap the headliner to unmask it."
        />
        <ul className={styles.poster}>
          {lineup.map((act) => (
            <ActItem key={act.name} act={act} unmasked={unmasked} onUnmask={() => setUnmasked((u) => !u)} onEnter={enter} onLeave={leave} />
          ))}
        </ul>
      </div>
      <div className={styles.peek} ref={peekRef} aria-hidden="true">
        <div className={styles.peekImg}>
          <span className={styles.peekIni}>{peek.initials}</span>
        </div>
        <div className={styles.peekCap}>
          <span>{peek.genre}</span>
          <span>Artist photo slot</span>
        </div>
      </div>
    </section>
  );
}

type ItemProps = {
  act: Act;
  unmasked: boolean;
  onUnmask: () => void;
  onEnter: (act: Act, el: HTMLElement | null) => void;
  onLeave: () => void;
};

function ActItem({ act, unmasked, onUnmask, onEnter, onLeave }: ItemProps) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const name = (
    <span className={styles.nm} ref={nameRef}>
      {act.name}
    </span>
  );

  return (
    <li className={`${styles.act} ${tierClass[act.tier]}`} onPointerEnter={() => onEnter(act, nameRef.current)} onPointerLeave={onLeave}>
      {act.masked ? (
        <button
          type="button"
          className={styles.unmask}
          aria-pressed={unmasked}
          aria-label={unmasked ? act.name : "Headliner, tap to unmask"}
          onClick={() => {
            if (!unmasked && nameRef.current && !prefersReducedMotion()) scramble(nameRef.current, act.name, 900);
            onUnmask();
          }}
        >
          <span className={styles.nmWrap}>
            {name}
            <span className={styles.strip} aria-hidden="true">
              <b>{act.masked.label}</b>
              <span>{act.masked.hint}</span>
            </span>
          </span>
        </button>
      ) : (
        name
      )}
      <span className={styles.meta}>{act.slot}</span>
    </li>
  );
}
