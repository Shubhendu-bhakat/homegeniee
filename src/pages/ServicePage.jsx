import { useEffect } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { services, getService } from "../data/services";
import { site } from "../data/site";
import { useUI } from "../context/UIContext";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import LouverDivider from "../components/LouverDivider";
import TrustStrip from "../sections/TrustStrip";

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

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }, [hash, slug]);

  if (!service) return <Navigate to="/" replace />;

  const others = services.filter((s) => s.slug !== slug).slice(0, 6);

  return (
    <>
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          <motion.img
            src={service.image}
            alt=""
            initial={{ scale: 1.14, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.42 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="hg-shell hg-phead__copy">
          <Reveal as="nav" className="hg-crumbs hg-mono" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span aria-hidden="true">/</span> <span>{service.title}</span>
          </Reveal>
          <Reveal delay={0.08}><span className="hg-eyebrow">{service.eyebrow}</span></Reveal>
          <Reveal delay={0.14}><h1 className="hg-phead__title">{service.title}</h1></Reveal>
          <Reveal delay={0.2}><p className="hg-lede">{service.body}</p></Reveal>
          <Reveal delay={0.26} className="hg-phead__actions">
            <button className="hg-btn" onClick={() => openModal("consultation")}>Book free consultation</button>
            <a href={`tel:${site.phonePrimary}`} className="hg-btn hg-btn--ghost">Call now</a>
          </Reveal>
        </div>
      </header>

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
                      <button className="hg-detail__cta hg-mono" onClick={() => openModal("consultation", service.title)}>
                        Enquire →
                      </button>
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
          <p className="hg-sheet">Also from Home Geniee</p>
          <RevealGroup className="hg-related__grid" stagger={0.05}>
            {others.map((o) => (
              <RevealItem key={o.slug}>
                <Link to={o.href ?? `/services/${o.slug}`} className="hg-related__card">
                  <span className="hg-eyebrow">{o.eyebrow}</span>
                  <h3 className="hg-related__title">{o.title}</h3>
                  <span className="hg-mono hg-related__more">View →</span>
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
