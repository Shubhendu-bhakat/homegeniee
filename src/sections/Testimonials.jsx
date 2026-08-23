import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { testimonials } from "../data/testimonials";
import SectionHeading from "../components/SectionHeading";

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, rotateY: dir > 0 ? 8 : -8 }),
  center: { opacity: 1, x: 0, rotateY: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, rotateY: dir > 0 ? -8 : 8 }),
};

export default function Testimonials() {
  const [[index, dir], setState] = useState([0, 0]);
  const reduce = useReducedMotion();
  const t = testimonials[index];

  const go = useCallback((next) => {
    setState(([i]) => {
      const len = testimonials.length;
      return [(next + len) % len, next > i ? 1 : -1];
    });
  }, []);

  // Auto-advance, paused when the user prefers reduced motion.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setState(([i]) => [(i + 1) % testimonials.length, 1]), 6500);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="hg-section hg-quotes" aria-labelledby="hg-quotes-title">
      <div className="hg-shell">
        <SectionHeading
          eyebrow="Stories of satisfaction"
          title={<span id="hg-quotes-title">What people say after handover</span>}
          align="center"
        />

        <div className="hg-quotes__stage">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={index}
              className="hg-quote"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="hg-quote__text">{t.quote}</p>
              <footer className="hg-quote__by">
                <cite className="hg-quote__name">{t.name}</cite>
                <span className="hg-quote__role hg-mono">{t.role}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="hg-quotes__nav">
          <button className="hg-quotes__arrow" onClick={() => go(index - 1)} aria-label="Previous testimonial">←</button>
          <div className="hg-quotes__dots" role="tablist" aria-label="Testimonials">
            {testimonials.map((q, i) => (
              <button
                key={q.name}
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial from ${q.name}`}
                className={`hg-quotes__dot ${i === index ? "is-on" : ""}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button className="hg-quotes__arrow" onClick={() => go(index + 1)} aria-label="Next testimonial">→</button>
        </div>
      </div>
    </section>
  );
}
