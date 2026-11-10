import { fest } from "@/data/fest";
import { partners } from "@/data/info";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./Rewind.module.css";

export function Rewind() {
  const { film, frames } = fest.rewind;
  const filmInner = (
    <>
      <span className={styles.filmWord} aria-hidden="true">
        Rewind
      </span>
      <span className={styles.filmCap}>{film.caption}</span>
      <span className={styles.play} aria-hidden="true" />
      <span className="sr-only">Play the {fest.rewind.title} aftermovie</span>
    </>
  );

  return (
    <section className="band band-night" id="rewind">
      <div className="wrap">
        <SectionHead eyebrow="Rewind" title={fest.rewind.title} sub={fest.rewind.sub} />
        <div className={styles.grid}>
          {film.href ? (
            <a className={styles.film} href={film.href} target="_blank" rel="noopener noreferrer">
              {filmInner}
            </a>
          ) : (
            <button type="button" className={styles.film} data-toast={`Demo: the ${fest.rewind.title} aftermovie plays here.`}>
              {filmInner}
            </button>
          )}
          <div className={styles.frames}>
            {frames.map((f) => (
              <div className={styles.frame} key={f}>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.partners}>
          <p className="eyebrow">Partners</p>
          <ul className={styles.partnerGrid}>
            {partners.map((p) => (
              <li key={p.tier}>
                <span>{p.tier}</span>
                <b>{p.name ?? "Your logo"}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
