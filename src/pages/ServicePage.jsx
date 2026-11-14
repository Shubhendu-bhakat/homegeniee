import { useEffect } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { getService, FEATURED_SLUGS } from "../data/services";
import { projectsFor } from "../data/projects";
import { site } from "../data/site";
import { useUI } from "../context/UIContext";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { serviceClips } from "../data/heroClips";
import HeroVideoBackground from "../components/HeroVideoBackground";
import CostCalculator from "../components/CostCalculator";
import ProjectCarousel from "../components/ProjectCarousel";
import KitchenLayouts from "../components/KitchenLayouts";
import WallTreatments from "../components/WallTreatments";
import TrustStrip from "../sections/TrustStrip";
import ProductShop from "../sections/ProductShop";
import useIsDesktop from "../hooks/useIsDesktop";
import useHeroExit from "../hooks/useHeroExit";

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
  // Same gentle parallax drift as the homepage hero.
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const sceneY = useTransform(scrollY, [0, 700], [0, -60]);
  const { ref: heroRef, hero: heroStyle, copy: copyStyle, dim: dimStyle } = useHeroExit();
  const callHref = isDesktop
    ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Home Geniee, I'd like to talk about a project.")}`
    : `tel:${site.phonePrimary}`;

  useEffect(() => {
    if (!hash) return;
    // getElementById, not querySelector: a hash like "#3d" starts with a digit,
    // which is a valid URL fragment but an invalid CSS selector and would throw.
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  }, [hash, slug]);

  if (!service) return <Navigate to="/" replace />;

  // The four headline verticals share the interior design page layout:
  // video hero, project carousel, cost calculator and sub-module cards.
  const featured = FEATURED_SLUGS.includes(slug) || slug === "wall-decor";
  const heroClips = serviceClips[slug] ?? serviceClips["interior-design"];
  const pageProjects = projectsFor(slug);
  const subject = service.short ?? service.title;


  return (
    <>
      {/* Full-screen hero, same size as the homepage's; eases into a card
          and dims as the content sheet below slides up over it. */}
      <motion.header className="hg-phead hg-phead--hero" ref={heroRef} style={heroStyle}>
        <motion.div className="hg-hero-dim" style={dimStyle} aria-hidden="true" />
        <motion.div className="hg-phead__media" style={reduce ? undefined : { y: sceneY }} aria-hidden="true">
          <HeroVideoBackground clips={heroClips} key={slug} />
        </motion.div>
        <motion.div className="hg-shell hg-phead__copy" style={copyStyle}>
          <Reveal as="nav" className="hg-crumbs hg-mono" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span aria-hidden="true">/</span> <span>{service.title}</span>
          </Reveal>
          <Reveal delay={0.08}><span className="hg-eyebrow">{service.eyebrow}</span></Reveal>
          <Reveal delay={0.14}><h1 className="hg-phead__title">{service.title}</h1></Reveal>
          <Reveal delay={0.2}><p className="hg-lede">{service.body}</p></Reveal>
          <Reveal delay={0.26} className="hg-phead__actions">
            {featured ? (
              <>
                <a href="#calculate-cost" className="hg-btn">Get free estimation ↓</a>
                <a href="#service-projects" className="hg-btn hg-btn--ghost">View our projects</a>
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
        </motion.div>
      </motion.header>

      <div className="hg-sheetOver">

      {slug === "modular-kitchen" && <KitchenLayouts />}

      {slug === "wall-decor" && <WallTreatments />}

      {slug === "furniture" && <ProductShop />}

      {featured && pageProjects.length > 0 && (
        <section className="hg-section hg-projects" id="service-projects" aria-labelledby="hg-service-projects-title">
          <div className="hg-shell">
            <SectionHeading
              eyebrow="Connect people"
              title={<span id="hg-service-projects-title">Some of our {subject.toLowerCase()} projects</span>}
            />

            <Reveal delay={0.08}>
              <ProjectCarousel key={slug} items={pageProjects} label={`${subject} projects`} />
            </Reveal>

            <div className="hg-projects__foot">
              <a href="#calculate-cost" className="hg-btn hg-btn--gold">Get free estimation ↓</a>
              <Link to="/gallery" className="hg-btn">View more</Link>
            </div>
          </div>
        </section>
      )}

      {featured && <CostCalculator key={slug} service={slug} />}

      {service.sections.length > 0 && (
        <>
          {!featured && (
          <nav className="hg-anchors" aria-label="On this page">
            <ul className="hg-shell hg-anchors__list">
              {service.sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="hg-anchors__link hg-mono">{s.label}</a></li>
              ))}
            </ul>
          </nav>
          )}

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

      <TrustStrip />
      </div>
    </>
  );
}
