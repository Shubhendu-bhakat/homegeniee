import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * The hero's full-bleed photo carousel — real project photography standing
 * in for the WordPress site's original Slider Revolution banner. Slides
 * cross-fade with a slow Ken-Burns drift; autoplay pauses on hover and on
 * `prefers-reduced-motion`, where it settles on the first frame.
 */
export default function HeroSlider({ slides, interval = 5500 }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || slides.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [reduce, paused, slides.length, interval]);

  const slide = slides[i];

  return (
    <div
      className="hg-hero__slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={slide.image}
          src={slide.image}
          alt=""
          className="hg-hero__slide"
          initial={reduce ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] }, scale: { duration: interval / 1000 + 1, ease: "linear" } }}
        />
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="hg-hero__dots" role="tablist" aria-label="Featured projects">
          {slides.map((s, n) => (
            <button
              key={s.image}
              role="tab"
              aria-selected={n === i}
              aria-label={s.title ?? `Slide ${n + 1}`}
              className={`hg-hero__dot ${n === i ? "is-on" : ""}`}
              onClick={() => setI(n)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
