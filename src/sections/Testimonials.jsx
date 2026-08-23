import { testimonials } from "../data/testimonials";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";

function Stars({ rating }) {
  return (
    <div className="hg-quote__stars hg-mono" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating - i >= 1;
        const half = !filled && rating - i > 0;
        return (
          <span key={i} className={filled ? "is-full" : half ? "is-half" : ""} aria-hidden="true">★</span>
        );
      })}
    </div>
  );
}

function Card({ t, duplicate = false }) {
  return (
    <figure className="hg-quote" aria-hidden={duplicate || undefined}>
      <Stars rating={t.rating} />
      <blockquote className="hg-quote__text">“{t.quote}”</blockquote>
      <figcaption className="hg-quote__by">
        <img className="hg-quote__avatar" src={t.avatar} alt="" width="48" height="48" loading="lazy" />
        <div>
          <cite className="hg-quote__name">{t.name}</cite>
          <span className="hg-quote__role hg-mono">{t.location} · {t.service}</span>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * A self-scrolling strip rather than a fixed grid — the list is doubled so
 * the loop is seamless, animated in plain CSS (pauses on hover, and the
 * site-wide reduced-motion rule already freezes it for anyone who prefers
 * that, no extra handling needed here).
 */
export default function Testimonials() {
  return (
    <section className="hg-section hg-quotes" aria-labelledby="hg-quotes-title">
      <div className="hg-shell">
        <SectionHeading
          eyebrow="Stories of satisfaction"
          title={<span id="hg-quotes-title">What people say after handover</span>}
          align="center"
        />
      </div>

      <Reveal className="hg-quotes__viewport">
        <div className="hg-quotes__track">
          {testimonials.map((t) => <Card key={t.name} t={t} />)}
          {testimonials.map((t) => <Card key={`${t.name}-dup`} t={t} duplicate />)}
        </div>
      </Reveal>
    </section>
  );
}
