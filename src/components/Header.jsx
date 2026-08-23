import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { site, mainNav } from "../data/site";
import { useUI } from "../context/UIContext";
import { useShop } from "../context/ShopContext";

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="hg-nav__chev">
      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [condensed, setCondensed] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const { toggleMobileNav, mobileNavOpen, openModal } = useUI();
  const { compare } = useShop();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 40));

  // Close any open dropdown on Escape without trapping focus.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenIndex(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.header
      className={`hg-header ${condensed ? "is-condensed" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hg-header__inner hg-shell">
        <Link to="/" className="hg-logo" aria-label={`${site.name} — home`}>
          <img src={site.logo} alt="" width="150" height="40" />
        </Link>

        <nav className="hg-nav" aria-label="Primary">
          <ul className="hg-nav__list">
            {mainNav.map((item, i) => {
              const hasChildren = Boolean(item.children?.length);
              return (
                <li
                  key={item.label}
                  className="hg-nav__item"
                  onMouseEnter={() => hasChildren && setOpenIndex(i)}
                  onMouseLeave={() => hasChildren && setOpenIndex(null)}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `hg-nav__link ${isActive ? "is-active" : ""}`}
                    aria-expanded={hasChildren ? openIndex === i : undefined}
                    onFocus={() => hasChildren && setOpenIndex(i)}
                  >
                    {item.label}
                    {hasChildren && <Chevron />}
                  </NavLink>

                  <AnimatePresence>
                    {hasChildren && openIndex === i && (
                      <motion.ul
                        className="hg-drop"
                        initial={{ opacity: 0, y: 10, rotateX: -12 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: 6, rotateX: -8 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <Link to={c.to} className="hg-drop__link" onClick={() => setOpenIndex(null)}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hg-header__actions">
          <Link to="/collection" className="hg-iconlink" aria-label={`Compare, ${compare.length} selected`}>
            <span aria-hidden="true">⇄</span>
            {compare.length > 0 && <em className="hg-dot hg-mono">{compare.length}</em>}
          </Link>

          <button className="hg-btn hg-btn--sm hg-header__cta" onClick={() => openModal("consultation")}>
            Book consultation
          </button>

          <button
            className="hg-burger"
            onClick={toggleMobileNav}
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          >
            <span className={mobileNavOpen ? "is-x" : ""} />
            <span className={mobileNavOpen ? "is-x" : ""} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
