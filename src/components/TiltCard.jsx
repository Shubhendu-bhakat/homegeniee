import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";

/**
 * Pointer-tracked 3D tilt. Real perspective transform, not a fake shadow —
 * children sitting on a positive translateZ genuinely lift off the card face.
 */
export default function TiltCard({
  children,
  className = "",
  max = 9,
  scale = 1.02,
  glare = true,
  ...rest
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduce) {
    return <div className={`hg-tilt ${className}`} {...rest}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`hg-tilt ${className}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="hg-tilt__glare"
          style={{ "--gx": glareX, "--gy": glareY }}
        />
      )}
    </motion.div>
  );
}
