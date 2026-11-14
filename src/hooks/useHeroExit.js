import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Scroll-linked exit for full-screen video heroes. As the hero scrolls away
 * it eases back into a rounded card (scale + corner radius), dims, and its
 * copy lifts and fades — while the page content (`.hg-sheetOver`) slides up
 * over it. Returns the ref for the hero element and motion styles for the
 * hero, its copy and a dimming overlay; all undefined for reduced motion.
 */
export default function useHeroExit() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.6], [0, 36]);
  const copyY = useTransform(scrollYProgress, [0, 0.6], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  if (reduce) return { ref, hero: undefined, copy: undefined, dim: undefined };
  return {
    ref,
    hero: { scale, borderRadius },
    copy: { y: copyY, opacity: copyOpacity },
    dim: { opacity: dim },
  };
}
