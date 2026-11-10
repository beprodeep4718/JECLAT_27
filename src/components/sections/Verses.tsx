"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { verses } from "@/data/schedule";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Verses.module.css";

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.045, duration: 0.45, ease: [0.2, 0.85, 0.2, 1] as const } }),
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export function Verses() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const verse = verses[active];

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : verses.length - 1)) % verses.length;
    setActive(n);
    tabRefs.current[n]?.focus();
  };

  return (
    <section className="band band-paper" id="verses">
      <div className="wrap">
        <SectionHead
          eyebrow="Schedule"
          title="The Verses"
          demoNote="Demo schedule"
          sub="Three nights, one story. The mask goes on, it cracks, and on the last night it falls."
        />

        <div className={styles.tabs} role="tablist" aria-label="Festival days">
          {verses.map((v, i) => (
            <button
              key={v.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${v.id}`}
              aria-selected={i === active}
              aria-controls="verse-panel"
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className={styles.numeral} aria-hidden="true">
                {v.numeral}
              </span>
              <span className={styles.tabName}>{v.name}</span>
              <span className={styles.tabSub}>
                {v.dateLabel} · {v.chapter}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.blurb}>
          <p>{verse.blurb}</p>
          <span className="mono">
            Side {verse.side} · {verse.tracks.length} tracks
          </span>
        </div>

        <div className={styles.tracklist} id="verse-panel" role="tabpanel" aria-labelledby={`tab-${verse.id}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={verse.id}>
              {verse.tracks.map((t, i) => (
                <motion.div
                  key={t.time + t.title}
                  className={`${styles.track} ${t.highlight ? styles.night : ""}`}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <span className={styles.pos}>
                    {verse.side}
                    {i + 1}
                  </span>
                  <span className={styles.time}>{t.time}</span>
                  <span className={styles.name}>{t.title}</span>
                  <span className={styles.venue}>{t.venue}</span>
                  <span className={styles.cat}>{t.category}</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
