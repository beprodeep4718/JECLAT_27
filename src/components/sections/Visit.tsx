import { fest, IS_DEMO } from "@/data/fest";
import { faqs } from "@/data/info";
import styles from "./Visit.module.css";

export function Visit() {
  return (
    <section className="band band-paper" id="visit">
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className="eyebrow">Plan your visit</p>
          <h2 className={`sec-title ${styles.title}`} data-lean>
            Find the cypher
          </h2>
          <address className={styles.address}>
            {fest.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <dl className={styles.reach}>
            {fest.reach.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <div className={styles.faq}>
            {faqs.map((f, i) => (
              <details key={f.question} open={i === 0}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
          <p className={`mono ${styles.note}`}>
            {IS_DEMO && "Demo answers. "}
            {fest.notes.faq}
          </p>
        </div>
      </div>
    </section>
  );
}
