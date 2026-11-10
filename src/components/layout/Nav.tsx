"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import logo from "@/assets/jeclat-mask.webp";
import { fest } from "@/data/fest";
import { gsap } from "@/lib/gsap";
import { useBeat } from "@/components/providers/BeatProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useToast } from "@/components/providers/ToastProvider";
import { NAV_LINKS } from "./nav-links";
import styles from "./Nav.module.css";

function BeatButton() {
  const { isOn, toggle, level } = useBeat();
  const toast = useToast();
  const ref = useRef<HTMLButtonElement>(null);

  // Drive the equaliser bars straight from the beat level, outside React renders.
  useEffect(() => {
    const tick = () => ref.current?.style.setProperty("--beat", level.current.toFixed(3));
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [level]);

  return (
    <button
      ref={ref}
      type="button"
      className={styles.beat}
      aria-pressed={isOn}
      aria-label="Play the fest beat"
      onClick={() => {
        if (toggle()) toast("Beat on. Watch the mask crack on every kick.");
      }}
    >
      <span className={styles.eq} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={styles.beatLabel}>{isOn ? "Stop the beat" : "Drop the beat"}</span>
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scroll = useSmoothScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    scroll.lock(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, scroll]);

  const goFromMenu = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    scroll.lock(false);
    scroll.scrollTo(href);
  };

  return (
    <>
      <header className={`${styles.nav} ${scrolled || open ? styles.scrolled : ""}`}>
        <div className={`${styles.inner} wrap`}>
          <a className={styles.brand} href="#top" aria-label={`${fest.name} ${fest.year}, back to top`}>
            <Image src={logo} alt="" width={34} loading="eager" />
            <span>
              {fest.name}
              <i>{fest.shortYear}</i>
            </span>
          </a>
          <nav className={styles.links} aria-label="Sections">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <BeatButton />
          <a className={`btn btn-haldi ${styles.cta}`} href="#passes">
            Get passes
          </a>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className={styles.menu}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Menu">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => goFromMenu(e, l.href)}
                  initial={{ y: "60%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + i * 0.05, duration: 0.5, ease: [0.2, 0.85, 0.2, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <a className="btn btn-haldi" href="#passes" onClick={(e) => goFromMenu(e, "#passes")}>
              Get passes <span className="arr">→</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
