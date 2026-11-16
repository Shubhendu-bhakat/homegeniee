import { orderWhatsapp, orderWhatsappLabel } from "../data/products";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
});

/**
 * No cart — HomeGeniee has no online checkout. The primary action is a
 * pre-filled WhatsApp enquiry, which is how orders actually get placed today.
 */
export default function ProductCard({ product }) {
  const enquiry = `https://wa.me/${orderWhatsapp}?text=${encodeURIComponent(
    `Hi Home Geniee, I'd like to enquire about ${product.name}.`
  )}`;

  return (
    <article className="hg-prod">
      <div className="hg-prod__media">
        {product.isNew && <span className="hg-badge hg-prod__new">New</span>}
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
      </div>

      <div className="hg-prod__body">
        <h3 className="hg-prod__title">{product.name}</h3>
        <p className="hg-prod__meta hg-mono">
          {product.price != null ? inr.format(product.price) : "Price on enquiry"}
        </p>
        {product.custom && <p className="hg-prod__note">Customization available</p>}

        <div className="hg-prod__actions">
          <a className="hg-btn hg-btn--sm" href={enquiry} target="_blank" rel="noreferrer noopener">
            Enquire on WhatsApp
          </a>
        </div>
        <p className="hg-prod__wa hg-mono">Order: {orderWhatsappLabel}</p>
      </div>
    </article>
  );
}
