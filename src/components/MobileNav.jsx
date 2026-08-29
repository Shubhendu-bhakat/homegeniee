import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { mainNav, site } from "../data/site";
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
              <span className="hg-mono hg-mobile__label">Menu</span>
              <button className="hg-mobile__close" onClick={closeMobileNav} aria-label="Close menu">✕</button>
            </motion.div>

            <ul className="hg-mobile__list">
              {mainNav.map((item) => (
                <motion.li key={item.label} variants={row}>
                  <Link to={item.to} className="hg-mobile__link" onClick={closeMobileNav}>
                    {item.label}
                  </Link>
                  {item.children?.length > 0 && (
                    <ul className="hg-mobile__sub">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <Link to={c.to} onClick={closeMobileNav}>{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
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
