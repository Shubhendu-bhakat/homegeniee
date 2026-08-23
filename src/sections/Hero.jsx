import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "../data/site";
import { projects } from "../data/projects";
import { useUI } from "../context/UIContext";
import MagneticButton from "../components/MagneticButton";
import HeroSlider from "../components/HeroSlider";

/** Banner destinations carried over from the homepage slider. */
const quickEntries = [
  { label: "Green Scape", to: "/services/green-scape#balcony" },
  { label: "Wall Decor", to: "/services/wall-decor" },
  { label: "Architecture & Civil", to: "/services/architectural-civil" },
  { label: "HomeGeniee Collection", to: "/collection" },
  { label: "Facade Decor", to: "/services/facade-elevational" },
];

const stats = [
  { value: "2016", label: "Designing since" },
  { value: "14", label: "Service verticals" },
  { value: "10 yrs", label: "Upto, warranty" },
  { value: "24 hrs", label: "Callback window" },
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
  const copyY = useTransform(scrollY, [0, 700], [0, 90]);
  const sceneY = useTransform(scrollY, [0, 700], [0, -60]);

  return (
    <section className="hg-hero" aria-labelledby="hg-hero-title">
      <motion.div className="hg-hero__scene" style={reduce ? undefined : { y: sceneY }} aria-hidden="true">
        <HeroSlider slides={projects} />
      </motion.div>

      <div className="hg-hero__veil" aria-hidden="true" />

      <motion.div className="hg-hero__copy hg-shell" style={reduce ? undefined : { y: copyY }}>
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
          <a href={`tel:${site.phonePrimary}`} className="hg-btn hg-btn--ghost">Call {site.phonePrimaryLabel}</a>
        </motion.div>

        <motion.ul
          className="hg-hero__quick"
          initial="hidden"
          animate="shown"
          variants={{ shown: { transition: { delayChildren: 0.95, staggerChildren: 0.06 } } }}
        >
          {quickEntries.map((q) => (
            <motion.li key={q.label} variants={{ hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0 } }}>
              <Link to={q.to} className="hg-hero__chip">{q.label}</Link>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.dl
        className="hg-hero__stats"
        initial="hidden"
        animate="shown"
        variants={{ shown: { transition: { delayChildren: 1.05, staggerChildren: 0.08 } } }}
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            className="hg-hero__stat"
            variants={{ hidden: { opacity: 0, y: 20 }, shown: { opacity: 1, y: 0 } }}
          >
            <dt className="hg-hero__statValue hg-mono">{s.value}</dt>
            <dd className="hg-hero__statLabel">{s.label}</dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}
