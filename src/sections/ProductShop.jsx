import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { products, productCategories } from "../data/products";
import ProductCard from "../components/ProductCard";

const FILTERS = [{ id: "all", label: "All" }, ...productCategories];

/** HomeGeniee Collection product listing; rendered directly on the Furniture page. */
export default function ProductShop() {
  const [cat, setCat] = useState("all");

  const list = useMemo(() => {
    let out = products;
    if (cat !== "all") out = out.filter((p) => p.category === cat);
    return out;
  }, [cat]);

  return (
    <section className="hg-section hg-section--light hg-shop">
        <div className="hg-shell">
          <div className="hg-shop__bar">
            <div className="hg-tabs hg-tabs--wrap" role="tablist" aria-label="Filter by category">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={cat === f.id}
                  className={`hg-tab ${cat === f.id ? "is-active" : ""}`}
                  onClick={() => setCat(f.id)}
                >
                  {f.label}
                  {cat === f.id && <motion.span layoutId="hg-shop-mark" className="hg-tab__mark" />}
                </button>
              ))}
            </div>
          </div>
  
          <p className="hg-shop__count hg-mono" aria-live="polite">
            {list.length} {list.length === 1 ? "design" : "designs"}
          </p>
  
          {list.length === 0 ? (
            <div className="hg-empty">
              <h2 className="hg-h3">Nothing here yet</h2>
              <p>No designs in this category.</p>
              <button className="hg-btn hg-btn--ghost" onClick={() => setCat("all")}>
                Browse everything
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={cat}
                className="hg-shop__grid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {list.map((p) => <ProductCard key={p.id} product={p} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
  );
}
