import type { ReactNode } from "react";
import { IS_DEMO } from "@/data/fest";

type Props = {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  /** Shown as a dashed badge while IS_DEMO is true */
  demoNote?: string;
  id?: string;
};

/** Eyebrow + big condensed title (+ optional demo badge and lede). `data-lean` opts the title into the scroll lean-in. */
export function SectionHead({ eyebrow, title, sub, demoNote, id }: Props) {
  const heading = (
    <h2 className="sec-title" id={id} data-lean>
      {title}
    </h2>
  );
  return (
    <div className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      {demoNote && IS_DEMO ? (
        <div className="sec-head-row">
          {heading}
          <span className="demo-note">{demoNote}</span>
        </div>
      ) : (
        heading
      )}
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  );
}
