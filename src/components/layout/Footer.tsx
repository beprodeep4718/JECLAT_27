import Image from "next/image";
import logo from "@/assets/jeclat-mask.webp";
import { fest, IS_DEMO } from "@/data/fest";
import { NAV_LINKS } from "./nav-links";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`band band-blood ${styles.footer}`}>
      <div className="wrap">
        <p className={styles.line}>
          See you at <em>the {fest.theme.subtitle}.</em>
        </p>
        <div className={styles.cols}>
          <div>
            <h4>Fest</h4>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              {fest.socials.map((s) => (
                <li key={s.label}>
                  {s.label} · {s.handle}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Fest desk</h4>
            <ul>
              {fest.contacts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className={styles.word} aria-hidden="true">
          {fest.name}
          <Image src={logo} alt="" sizes="20vw" />
        </p>
        <div className={`mono ${styles.fine}`}>
          <span>
            © {fest.year} {fest.name} · {fest.college}
          </span>
          {IS_DEMO && <span>Demo content</span>}
        </div>
      </div>
    </footer>
  );
}
