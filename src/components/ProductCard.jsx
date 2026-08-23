import { motion } from "motion/react";
import TiltCard from "./TiltCard";
import { useShop } from "../context/ShopContext";
import { orderWhatsapp, orderWhatsappLabel } from "../data/products";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
});

/**
 * No cart — HomeGeniee has no online checkout. The primary action is a
 * pre-filled WhatsApp enquiry, which is how orders actually get placed today.
 */
export default function ProductCard({ product }) {
  const { toggleWishlist, toggleCompare, inWishlist, inCompare } = useShop();
  const saved = inWishlist(product.id);
  const comparing = inCompare(product.id);

  const enquiry = `https://wa.me/${orderWhatsapp}?text=${encodeURIComponent(
    `Hi Home Geniee, I'd like to enquire about ${product.name}.`
  )}`;

  return (
    <TiltCard className="hg-prod" max={7}>
      <div className="hg-prod__media">
        {product.isNew && <span className="hg-badge hg-prod__new">New</span>}
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        <motion.button
          className={`hg-prod__heart ${saved ? "is-on" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          whileTap={{ scale: 0.82 }}
        >
          <motion.span animate={{ scale: saved ? [1, 1.35, 1] : 1 }} transition={{ duration: 0.3 }} aria-hidden="true">
            ♥
          </motion.span>
        </motion.button>
      </div>

      <div className="hg-prod__body">
        <h3 className="hg-prod__title">{product.name}</h3>
        <p className="hg-prod__meta hg-mono">
          {product.price != null ? inr.format(product.price) : "Price on enquiry"}
        </p>
        <p className="hg-prod__note">
          Home Geniee Collection{product.custom ? " · Customization available" : ""}
        </p>

        <div className="hg-prod__actions">
          <a className="hg-btn hg-btn--sm" href={enquiry} target="_blank" rel="noreferrer noopener">
            Enquire on WhatsApp
          </a>
          <button
            className={`hg-prod__compare hg-mono ${comparing ? "is-on" : ""}`}
            onClick={() => toggleCompare(product.id)}
            aria-pressed={comparing}
          >
            {comparing ? "In compare" : "Compare"}
          </button>
        </div>
        <p className="hg-prod__wa hg-mono">Order: {orderWhatsappLabel}</p>
      </div>
    </TiltCard>
  );
}
