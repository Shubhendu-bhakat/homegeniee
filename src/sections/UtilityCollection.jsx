import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { products, productCategories } from "../data/products";
import SectionHeading from "../components/SectionHeading";
import ProductCard from "../components/ProductCard";

/**
 * Category tabs use a shared layoutId for the underline so the marker slides
 * between tabs instead of cutting — the continuity tells you the panel below
 * is the same surface with different contents.
 */
export default function UtilityCollection() {
  const [active, setActive] = useState(productCategories[0].id);
  const shown = products.filter((p) => p.category === active).slice(0, 8);

  return (
    <section className="hg-section hg-section--light hg-utility" aria-labelledby="hg-utility-title">
      <div className="hg-shell">
        <SectionHeading
          eyebrow="Home Geniee Collection"
          title={<span id="hg-utility-title">Utility solutions for every space</span>}
          lede="Built units you can order as they are or have rebuilt to your dimensions. Browse here, then send us a message — there is no checkout, and that is deliberate."
        />

        <div className="hg-tabs" role="tablist" aria-label="Product categories">
          {productCategories.map((c) => (
            <button
              key={c.id}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={active === c.id}
              aria-controls={`panel-${c.id}`}
              className={`hg-tab ${active === c.id ? "is-active" : ""}`}
              onClick={() => setActive(c.id)}
            >
              {c.label}
              {active === c.id && <motion.span layoutId="hg-tab-mark" className="hg-tab__mark" />}
            </button>
          ))}
        </div>

        <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="hg-utility__grid"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              {shown.map((p) => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hg-utility__cta">
          <Link to="/collection" className="hg-btn hg-btn--ghost">See the full collection</Link>
        </div>
      </div>
    </section>
  );
}
