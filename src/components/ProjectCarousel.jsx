import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const COPIES = 3; // render the list three times and keep the viewport parked on the middle copy

/**
 * The usual project cards (same markup as the old grid) in a row that
 * loops forever: the list is rendered three times, and whenever a
 * scroll settles outside the middle copy the track is silently shifted by one
 * copy's width, which lands on an identical frame — so there is no visible
 * jump and no end to reach in either direction.
 */
export default function ProjectCarousel({ items, label = "Projects" }) {
  const trackRef = useRef(null);
  const settleRef = useRef(0);

  const setWidth = () => {
    // Distance from a card to its twin in the next copy — includes the gap
    // between copies, which scrollWidth / COPIES would miss and leave the
    // shifted frame a few pixels off its snap point.
    const el = trackRef.current;
    const n = el?.children.length / COPIES;
    return el && n ? el.children[n].offsetLeft - el.children[0].offsetLeft : 0;
  };

  const normalize = useCallback(() => {
    const el = trackRef.current;
    const w = setWidth();
    if (!el || !w) return;
    if (el.scrollLeft < w) el.scrollLeft += w;
    else if (el.scrollLeft >= w * 2) el.scrollLeft -= w;
  }, []);

  // Park on the middle copy before first paint, and again if the layout
  // (and so one copy's width) changes.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = setWidth();
    const ro = new ResizeObserver(() => normalize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length, normalize]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Wait for the scroll to settle (fling, snap or smooth arrow scroll)
    // before shifting, so we never cut a moving scroll short.
    const onScroll = () => {
      clearTimeout(settleRef.current);
      settleRef.current = setTimeout(normalize, 140);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(settleRef.current);
    };
  }, [normalize]);

  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".hg-rank__item");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const by = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    // A fast double-click can outrun the settle timer; normalise first so
    // there is always a full copy of runway in the direction of travel.
    normalize();
    el.scrollBy({ left: dir * by, behavior: "smooth" });
  };

  const all = Array.from({ length: COPIES }, (_, c) => items.map((p) => ({ p, c }))).flat();

  return (
    <div className="hg-rank" role="region" aria-roledescription="carousel" aria-label={label}>
      <button type="button" className="hg-rank__nav hg-rank__nav--prev" onClick={() => step(-1)} aria-label="Previous projects">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>

      <ul className="hg-rank__track" ref={trackRef}>
        {all.map(({ p, c }) => {
          const clone = c !== 1;
          return (
            <li key={`${c}-${p.slug}`} className="hg-rank__item" aria-hidden={clone || undefined}>
              <motion.article className="hg-proj" whileHover="on" initial="off" animate="off">
                <Link
                  to={`/projects/${p.slug}`}
                  className="hg-proj__link"
                  aria-label={`View ${p.title}`}
                  tabIndex={clone ? -1 : undefined}
                  draggable="false"
                >
                  <div className="hg-proj__frame">
                    <motion.img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      variants={{ off: { scale: 1 }, on: { scale: 1.07 } }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <motion.div
                    className="hg-proj__meta"
                    variants={{ off: { y: 0 }, on: { y: -6 } }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="hg-proj__title">{p.title}</h3>
                    <span className="hg-proj__scope hg-mono">{p.scope}</span>
                  </motion.div>
                </Link>
              </motion.article>
            </li>
          );
        })}
      </ul>

      <button type="button" className="hg-rank__nav hg-rank__nav--next" onClick={() => step(1)} aria-label="Next projects">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
