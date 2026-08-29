import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * The site's signature transition. Vertical slats rotate open as the divider
 * passes through the viewport, the way a real louver screen does. Slats are
 * offset by index so the opening travels left-to-right instead of snapping
 * flat all at once.
 *
 * The motif is taken from HomeGeniee's own catalogue — Louver Panel, Jafri/CNC
 * ceiling, vertical gardening — so it reads as the material, not decoration.
 */
function Slat({ i, count, progress, tone }) {
  const offset = (i / count) * 0.45;
  const rotateY = useTransform(progress, [0 + offset, 0.65 + offset], [0, 74]);
  const opacity = useTransform(progress, [0 + offset, 0.65 + offset], [1, 0.14]);

  return (
    <motion.span
      className="hg-louver__slat"
      style={{ rotateY, opacity, background: tone }}
      aria-hidden="true"
    />
  );
}

export default function LouverDivider({ count = 28, tone = "var(--clay)", label }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div className="hg-louver" ref={ref} role="presentation">
      {!reduce && (
        <div className="hg-louver__rack">
          {Array.from({ length: count }, (_, i) => (
            <Slat key={i} i={i} count={count} progress={scrollYProgress} tone={tone} />
          ))}
        </div>
      )}
      {label && <span className="hg-louver__label hg-mono">{label}</span>}
    </div>
  );
}
