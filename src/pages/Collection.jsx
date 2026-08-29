import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { products, productCategories } from "../data/products";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import TrustStrip from "../sections/TrustStrip";
import HeroSlider from "../components/HeroSlider";

const FILTERS = [{ id: "all", label: "All" }, ...productCategories];

export default function Collection() {
  const [cat, setCat] = useState("all");
  const [view, setView] = useState("all"); // all | wishlist | compare
  const { wishlist, compare, clearCompare } = useShop();

  const list = useMemo(() => {
    let out = products;
    if (view === "wishlist") out = out.filter((p) => wishlist.includes(p.id));
    if (view === "compare") out = out.filter((p) => compare.includes(p.id));
    if (cat !== "all") out = out.filter((p) => p.category === cat);
    return out;
  }, [cat, view, wishlist, compare]);

  return (
    <>
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          <HeroSlider slides={products.slice(0, 6)} />
        </div>
        <div className="hg-shell hg-phead__copy">
          <Reveal as="nav" className="hg-crumbs hg-mono" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link to="/services/furniture">Furniture</Link> <span aria-hidden="true">/</span> <span>Collection</span>
          </Reveal>
          <Reveal delay={0.06}><span className="hg-eyebrow">Transform your home with style</span></Reveal>
          <Reveal delay={0.12}><h1 className="hg-phead__title">Home Geniee Collection</h1></Reveal>
          <Reveal delay={0.18}>
            <p className="hg-lede">
              Discover a curated collection of stylish and functional home essentials. From modern designs to
              timeless classics, our selection enhances every corner of your home with elegance, comfort, and
              smart organization.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="hg-phead__note hg-mono">
              Pre-order showcase · no online checkout · every enquiry goes to WhatsApp or phone
            </p>
          </Reveal>
        </div>
      </header>

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

            <div className="hg-shop__views">
              <button
                className={`hg-chip hg-mono ${view === "all" ? "is-on" : ""}`}
                onClick={() => setView("all")}
                aria-pressed={view === "all"}
              >
                All
              </button>
              <button
                className={`hg-chip hg-mono ${view === "wishlist" ? "is-on" : ""}`}
                onClick={() => setView("wishlist")}
                aria-pressed={view === "wishlist"}
              >
                Wishlist ({wishlist.length})
              </button>
              <button
                className={`hg-chip hg-mono ${view === "compare" ? "is-on" : ""}`}
                onClick={() => setView("compare")}
                aria-pressed={view === "compare"}
              >
                Compare ({compare.length})
              </button>
              {view === "compare" && compare.length > 0 && (
                <button className="hg-chip hg-mono" onClick={clearCompare}>Clear</button>
              )}
            </div>
          </div>

          <p className="hg-shop__count hg-mono" aria-live="polite">
            {list.length} {list.length === 1 ? "design" : "designs"}
          </p>

          {list.length === 0 ? (
            <div className="hg-empty">
              <h2 className="hg-h3">Nothing here yet</h2>
              <p>
                {view === "wishlist"
                  ? "Tap the heart on any design to save it here."
                  : view === "compare"
                    ? "Add up to four designs to compare them side by side."
                    : "No designs in this category."}
              </p>
              <button className="hg-btn hg-btn--ghost" onClick={() => { setView("all"); setCat("all"); }}>
                Browse everything
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${cat}-${view}`}
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

      <TrustStrip />
    </>
  );
}
