import { useEffect } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { services, getService } from "../data/services";
import { site } from "../data/site";
import { useUI } from "../context/UIContext";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import LouverDivider from "../components/LouverDivider";
import HeroSlider from "../components/HeroSlider";
import CostCalculator from "../components/CostCalculator";
import TrustStrip from "../sections/TrustStrip";
import useIsDesktop from "../hooks/useIsDesktop";

/**
 * One route serves all fourteen verticals. The anchor sub-sections preserve the
 * WordPress deep links (#boq, #mep, #vertical …) so existing inbound links and
 * anything already indexed still land in the right place.
 */
export default function ServicePage() {
  const { slug } = useParams();
  const { hash } = useLocation();
  const { openModal } = useUI();
  const service = getService(slug);
  const isDesktop = useIsDesktop();
  const callHref = isDesktop
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Home Geniee, I'd like to talk about a project.")}`
    : `tel:${site.phonePrimary}`;

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }, [hash, slug]);

  if (!service) return <Navigate to="/" replace />;

  const others = services.filter((s) => s.slug !== slug).slice(0, 6);
  // This service's own photo leads, then three others slide through behind
  // it — the same carousel the homepage runs, not a single static frame.
  const slides = [service, ...others.slice(0, 3)];

  return (
    <>
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          <HeroSlider slides={slides} />
        </div>
        <div className="hg-shell hg-phead__copy">
          <Reveal as="nav" className="hg-crumbs hg-mono" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span aria-hidden="true">/</span> <span>{service.title}</span>
          </Reveal>
          <Reveal delay={0.08}><span className="hg-eyebrow">{service.eyebrow}</span></Reveal>
          <Reveal delay={0.14}><h1 className="hg-phead__title">{service.title}</h1></Reveal>
          <Reveal delay={0.2}><p className="hg-lede">{service.body}</p></Reveal>
          <Reveal delay={0.26} className="hg-phead__actions">
            {slug === "interior-design" ? (
              <a href="#calculate-cost" className="hg-btn">Get free estimate ↓</a>
            ) : (
              <button className="hg-btn" onClick={() => openModal("consultation")}>Book free consultation</button>
            )}
            <a
              href={callHref}
              className="hg-btn hg-btn--ghost"
              target={isDesktop ? "_blank" : undefined}
              rel={isDesktop ? "noreferrer noopener" : undefined}
            >
              Call now
            </a>
          </Reveal>
        </div>
      </header>

      {slug === "interior-design" && <CostCalculator />}

      {service.sections.length > 0 && (
        <>
          <nav className="hg-anchors" aria-label="On this page">
            <ul className="hg-shell hg-anchors__list">
              {service.sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="hg-anchors__link hg-mono">{s.label}</a></li>
              ))}
            </ul>
          </nav>

          <section className="hg-section hg-detail">
            <div className="hg-shell">
              <RevealGroup className="hg-detail__list" stagger={0.06}>
                {service.sections.map((s, i) => (
                  <RevealItem key={s.id}>
                    <article className="hg-detail__row" id={s.id}>
                      <span className="hg-detail__idx hg-mono">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h2 className="hg-detail__title">{s.label}</h2>
                        <p className="hg-detail__body">{s.body}</p>
                      </div>
                      {s.href ? (
                        <Link to={s.href} className="hg-detail__cta hg-mono">View →</Link>
                      ) : (
                        <button className="hg-detail__cta hg-mono" onClick={() => openModal("consultation", service.title)}>
                          Enquire →
                        </button>
                      )}
                    </article>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>
        </>
      )}

      <LouverDivider label="More services" />

      <section className="hg-section hg-related">
        <div className="hg-shell">
          <p className="hg-sheet">Recent Interior Transformations</p>
          <RevealGroup className="hg-related__grid" stagger={0.05}>
            {others.map((o) => (
              <RevealItem key={o.slug}>
                <Link to={o.href ?? `/services/${o.slug}`} className="hg-related__card">
                  <div className="hg-related__media">
                    <img src={o.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="hg-related__body">
                    <span className="hg-eyebrow">{o.eyebrow}</span>
                    <h3 className="hg-related__title">{o.title}</h3>
                    <span className="hg-mono hg-related__more">View →</span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
