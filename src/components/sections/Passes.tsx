import Image from "next/image";
import type { CSSProperties } from "react";
import logo from "@/assets/jeclat-mask.webp";
import { fest, IS_DEMO } from "@/data/fest";
import { passes } from "@/data/passes";
import { rupees } from "@/lib/format";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Passes.module.css";

const tone = { single: styles.single, ep: styles.ep, lp: styles.lp } as const;
const btnTone = { single: "btn-ink", ep: "btn-haldi", lp: "btn-haldi" } as const;

/**
 * Passes as record sleeves. Each record is sized to its real format (7″, 10″, 12″)
 * and spins at its real speed on hover: 45 RPM = 1.333s/rev, 33⅓ RPM = 1.8s/rev.
 */
export function Passes() {
  return (
    <section className="band band-paper" id="passes">
      <div className="wrap">
        <SectionHead
          eyebrow="Passes"
          title="Pick your pressing"
          demoNote="Demo prices"
          sub="Every pass is a record. The bigger the pressing, the more of the fest you get."
        />
        <div className={styles.sleeves}>
          {passes.map((p) => (
            <article
              key={p.id}
              className={`${styles.sleeve} ${tone[p.id]}`}
              style={{ "--in": p.inches, "--spin": p.rpm === "45" ? "1.333s" : "1.8s" } as CSSProperties}
            >
              <div className={styles.record} aria-hidden="true">
                <div className={styles.disc}>
                  <div className={styles.label}>
                    <Image src={logo} alt="" sizes="120px" />
                  </div>
                </div>
              </div>
              <div className={styles.cover}>
                {p.badge && <span className={styles.sticker}>{p.badge}</span>}
                <div className={styles.coverTop}>
                  <span>{p.format}</span>
                  <span>{p.rpm} RPM</span>
                </div>
                <h3>{p.title}</h3>
                <p className={styles.price}>
                  {rupees(p.price)}
                  <small>{p.per}</small>
                </p>
                <ul className={styles.perks}>
                  {p.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                {p.buyUrl ? (
                  <a className={`btn ${btnTone[p.id]}`} href={p.buyUrl}>
                    {p.cta}
                  </a>
                ) : (
                  <button type="button" className={`btn ${btnTone[p.id]}`} data-toast={`Demo: ${p.title} checkout opens at launch.`}>
                    {p.cta}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className={`mono ${styles.note}`}>
          {fest.notes.passes}
          {IS_DEMO && " (Demo rules)"}
        </p>
      </div>
    </section>
  );
}
