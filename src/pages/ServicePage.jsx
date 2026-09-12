import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { services, getService } from "../data/services";
import { projects } from "../data/projects";
import { site } from "../data/site";
import { useUI } from "../context/UIContext";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import LouverDivider from "../components/LouverDivider";
import HeroSlider from "../components/HeroSlider";
import HeroVideoBackground from "../components/HeroVideoBackground";
import CostCalculator from "../components/CostCalculator";
import TrustStrip from "../sections/TrustStrip";
import useIsDesktop from "../hooks/useIsDesktop";

const featuredProjects = projects.slice(0, 3);

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

  // The calculator stays out of the page entirely until a "Get free
  // estimate" CTA asks for it — a link carrying the #calculate-cost hash
  // (from another page) counts as asking for it too, so it still opens
  // straight to the calculator instead of landing on a dead anchor.
  const [showCalculator, setShowCalculator] = useState(hash === "#calculate-cost");
  const revealCalculator = () => setShowCalculator(true);

  useEffect(() => {
    if (hash === "#calculate-cost") setShowCalculator(true);
  }, [hash]);

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }, [hash, slug, showCalculator]);

  // The calculator now sits at the very bottom of the page — a click on
  // "Get free estimate" needs to scroll down to it itself, it can't rely on
  // the hash-driven effect above (there's no hash on a plain button click).
  useEffect(() => {
    if (!showCalculator) return;
    const t = setTimeout(() => {
      document.getElementById("calculate-cost")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [showCalculator]);

  if (!service) return <Navigate to="/" replace />;

  const others = services.filter((s) => s.slug !== slug).slice(0, 6);
  // This service's own photo leads, then three others slide through behind
  // it — the same carousel the homepage runs, not a single static frame.
  const slides = [service, ...others.slice(0, 3)];

  return (
    <>
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          {slug === "interior-design" ? (
            <HeroVideoBackground clips={[{ src: "/videos/hero-2.mp4", poster: "/videos/hero-2-poster.jpg" }]} />
          ) : (
            <HeroSlider slides={slides} />
          )}
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
              <>
                <button className="hg-btn" onClick={revealCalculator}>Get free estimation ↓</button>
                <a href="#interior-projects" className="hg-btn hg-btn--ghost">View our projects</a>
              </>
            ) : (
              <>
                <button className="hg-btn" onClick={() => openModal("consultation")}>Book free consultation</button>
                <a
                  href={callHref}
                  className="hg-btn hg-btn--ghost"
                  target={isDesktop ? "_blank" : undefined}
                  rel={isDesktop ? "noreferrer noopener" : undefined}
                >
                  Call now
                </a>
              </>
            )}
          </Reveal>
        </div>
      </header>

      {slug === "interior-design" && (
        <section className="hg-section hg-projects" id="interior-projects" aria-labelledby="hg-interior-projects-title">
          <div className="hg-shell">
            <SectionHeading
              eyebrow="Connect people"
              title={<span id="hg-interior-projects-title">Some of our interior design projects</span>}
            />

            <RevealGroup className="hg-projects__grid" stagger={0.07}>
              {featuredProjects.map((p) => (
                <RevealItem key={p.slug}>
                  <motion.article className="hg-proj" whileHover="on" initial="off" animate="off">
                    <Link to={`/projects/${p.slug}`} className="hg-proj__link" aria-label={`View ${p.title}`}>
                      <div className="hg-proj__frame">
                        <motion.img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          variants={{ off: { scale: 1 }, on: { scale: 1.07 } }}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <motion.div
                        className="hg-proj__meta"
                        variants={{ off: { y: 0 }, on: { y: -6 } }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <h3 className="hg-proj__title">{p.title}</h3>
                        <span className="hg-proj__scope hg-mono">{p.scope}</span>
                      </motion.div>
                    </Link>
                  </motion.article>
                </RevealItem>
              ))}
            </RevealGroup>

            <div className="hg-projects__foot">
              <button className="hg-btn hg-btn--gold" onClick={revealCalculator}>Get free estimation ↓</button>
              <Link to="/gallery" className="hg-btn">View more</Link>
            </div>
          </div>
        </section>
      )}

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
              {service.sections.every((s) => s.image) ? (
                // Every sub-module here is a real page of its own — the
                // whole card is the link, same photo-card treatment as
                // "Recent Interior Transformations" below, not a text row.
                <RevealGroup className="hg-related__grid" stagger={0.06}>
                  {service.sections.map((s, i) => {
                    const card = (
                      <>
                        <div className="hg-related__media">
                          <img src={s.image} alt="" loading="lazy" decoding="async" />
                        </div>
                        <div className="hg-related__body">
                          <span className="hg-mono hg-detail__idx hg-detail__idx--inline">{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="hg-related__title">{s.label}</h3>
                          <p className="hg-detail__body">{s.body}</p>
                          <span className="hg-mono hg-related__more">{s.href ? "View →" : "Enquire →"}</span>
                        </div>
                      </>
                    );
                    return (
                      <RevealItem key={s.id}>
                        {s.href ? (
                          <Link to={s.href} className="hg-related__card" id={s.id}>{card}</Link>
                        ) : (
                          <button
                            type="button"
                            className="hg-related__card hg-related__card--btn"
                            id={s.id}
                            onClick={() => openModal("consultation", service.title)}
                          >
                            {card}
                          </button>
                        )}
                      </RevealItem>
                    );
                  })}
                </RevealGroup>
              ) : (
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
              )}
            </div>
          </section>
        </>
      )}

      {slug !== "interior-design" && slug !== "wall-decor" && (
        <>
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
        </>
      )}

      {slug === "interior-design" && showCalculator && <CostCalculator />}

      <TrustStrip />
    </>
  );
}
