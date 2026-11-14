import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "../data/site";
import { useUI } from "../context/UIContext";
import MagneticButton from "../components/MagneticButton";
import HeroVideoBackground from "../components/HeroVideoBackground";
import useHeroExit from "../hooks/useHeroExit";

const stats = [
  { value: "2016", label: "Designing since" },
  { value: "Multiple", label: "Service verticals" },
  { value: "10 yrs", label: "Upto, warranty" },
  { value: "24 hrs", label: "Callback window" },
  { value: "No hidden cost", label: "One transparent estimate" },
  { value: "On time", label: "Delivered as promised" },
];

const line = {
  hidden: { opacity: 0, y: "0.7em" },
  shown: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.28 + i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const { openModal } = useUI();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const sceneY = useTransform(scrollY, [0, 700], [0, -60]);
  const { ref: heroRef, hero: heroStyle, copy: copyStyle, dim: dimStyle } = useHeroExit();

  return (
    <motion.section className="hg-hero" aria-labelledby="hg-hero-title" ref={heroRef} style={heroStyle}>
      <motion.div className="hg-hero__scene" style={reduce ? undefined : { y: sceneY }} aria-hidden="true">
        <HeroVideoBackground />
      </motion.div>

      <div className="hg-hero__veil" aria-hidden="true" />
      <motion.div className="hg-hero-dim" style={dimStyle} aria-hidden="true" />

      {/* No parallax here any more — it used to drift .hg-hero__copy down
          on scroll while .hg-hero__statline stayed put in normal flow,
          which is exactly what let the two overlap mid-scroll. Only the
          background now parallaxes. */}
      <motion.div className="hg-hero__copy hg-shell" style={copyStyle}>
        <motion.p
          className="hg-sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Kolkata · Since {site.since}
        </motion.p>

        <h1 id="hg-hero-title" className="hg-hero__title">
          {["Every room,", "end to end,", "under one roof."].map((l, i) => (
            <span className="hg-hero__lineWrap" key={l}>
              <motion.span className="hg-hero__line" custom={i} variants={line} initial="hidden" animate="shown">
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hg-hero__lede"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Interior designers in Kolkata specialising in premium home decor, modular kitchen design and complete
          home interior solutions tailored to modern lifestyles — with the drawings, the estimate and the
          execution handled by the same team.
        </motion.p>

        <motion.div
          className="hg-hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagneticButton onClick={() => openModal("consultation")}>Book free consultation</MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="hg-hero__statline"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.6 }}
      >
        <dl className="hg-hero__statTrack">
          {[...stats, ...stats].map((s, i) => (
            <div className="hg-hero__stat" key={`${s.label}-${i}`} aria-hidden={i >= stats.length || undefined}>
              <dt className="hg-hero__statValue hg-mono">{s.value}</dt>
              <dd className="hg-hero__statLabel">{s.label}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </motion.section>
  );
}
