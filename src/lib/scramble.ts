const GLYPHS = "অকখগঘচজটডতদনপবমরলশসহ#%&/<>+=*";

/**
 * Glitch an element's text through random Latin/Bengali glyphs, then settle on `text`.
 * The element's width is frozen while it runs so neighbours don't jump.
 */
export function scramble(el: HTMLElement, text: string, duration = 650) {
  const width = el.getBoundingClientRect().width;
  const start = performance.now();
  el.style.width = `${width}px`;
  el.style.overflow = "hidden";
  let raf = 0;

  const step = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      out += ch === " " || i / text.length < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) raf = requestAnimationFrame(step);
    else finish();
  };
  const finish = () => {
    el.textContent = text;
    el.style.width = "";
    el.style.overflow = "";
  };

  raf = requestAnimationFrame(step);
  return () => {
    cancelAnimationFrame(raf);
    finish();
  };
}
