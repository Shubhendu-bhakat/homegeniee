import { motion, useScroll, useSpring } from "motion/react";

/** Reading progress. Thin, blue, top of viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return <motion.div className="hg-progress" style={{ scaleX }} aria-hidden="true" />;
}
