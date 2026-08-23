import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * The button drifts toward the cursor within its own bounds. Small effect,
 * used only on primary CTAs so it stays a signal that something is clickable.
 */
export default function MagneticButton({
  children,
  as: Tag = "button",
  className = "hg-btn",
  strength = 0.28,
  ...rest
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => { x.set(0); y.set(0); };
  const M = motion[Tag] ?? motion.button;

  return (
    <M
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={reduce ? undefined : { x, y }}
      {...rest}
    >
      {children}
    </M>
  );
}
