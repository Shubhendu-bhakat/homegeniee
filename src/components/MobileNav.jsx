import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { mainNav, site } from "../data/site";
import { getService } from "../data/services";
import { useUI } from "../context/UIContext";

const panel = {
  hidden: { x: "100%" },
  shown: { x: 0, transition: { type: "spring", stiffness: 190, damping: 26, staggerChildren: 0.035, delayChildren: 0.08 } },
  out: { x: "100%", transition: { duration: 0.28, ease: [0.65, 0, 0.35, 1] } },
};
const row = {
  hidden: { opacity: 0, x: 28 },
  shown: { opacity: 1, x: 0 },
  out: { opacity: 0 },
};

// Verticals and their sub-verticals as one flat list, in nav order, each with a
// thumbnail and tagline from the service data so every row looks the same.
const slugOf = (to) => to.split("#")[0].split("/").pop();
const verticals = mainNav.flatMap((item) => [item, ...(item.children ?? [])]).map((v) => {
  const svc = getService(slugOf(v.to));
  return { label: v.label, to: v.to, image: svc?.image, tagline: v.to.includes("#") ? "In-house fabrication" : svc?.eyebrow };
});

export default function MobileNav() {
  const { mobileNavOpen, closeMobileNav, openModal } = useUI();

  return (
    <AnimatePresence>
      {mobileNavOpen && (
        <>
          <motion.div
            className="hg-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileNav}
          />
          <motion.nav
            className="hg-mobile"
            variants={panel}
            initial="hidden"
            animate="shown"
            exit="out"
            aria-label="Mobile"
          >
            <motion.div variants={row} className="hg-mobile__head">
              <h2 className="hg-mobile__title">Explore Our Verticals</h2>
              <button className="hg-mobile__close" onClick={closeMobileNav} aria-label="Close menu">✕</button>
            </motion.div>

            <ul className="hg-mobile__list">
              {verticals.map((v) => (
                <motion.li key={v.label} variants={row}>
                  <Link to={v.to} className="hg-mobile__card" onClick={closeMobileNav}>
                    {v.image && <img className="hg-mobile__thumb" src={v.image} alt="" loading="lazy" decoding="async" />}
                    <span className="hg-mobile__cardText">
                      <span className="hg-mobile__cardTitle">{v.label}</span>
                      {v.tagline && <span className="hg-mobile__cardTag">{v.tagline}</span>}
                    </span>
                    <span className="hg-mobile__go" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="14" height="14"><path d="M5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div variants={row} className="hg-mobile__foot">
              <button className="hg-btn" onClick={() => openModal("consultation")}>Book free consultation</button>
              <a href={`tel:${site.phonePrimary}`} className="hg-mono hg-mobile__tel">{site.phonePrimaryLabel}</a>
            </motion.div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
