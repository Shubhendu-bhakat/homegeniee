import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { projects } from "../data/projects";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import TrustStrip from "../sections/TrustStrip";
import HeroSlider from "../components/HeroSlider";
import { useUI } from "../context/UIContext";

export default function Gallery() {
  const { openModal } = useUI();

  return (
    <>
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          <HeroSlider slides={projects} />
        </div>
        <div className="hg-shell hg-phead__copy">
          <Reveal delay={0.06}><span className="hg-eyebrow">Connect people</span></Reveal>
          <Reveal delay={0.12}><h1 className="hg-phead__title">Some of our projects</h1></Reveal>
          <Reveal delay={0.18}>
            <p className="hg-lede">
              Homes across Kolkata, handed over. Each one started as a conversation and a measured drawing.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="hg-section hg-gallery">
        <div className="hg-shell">
          <RevealGroup className="hg-gallery__grid" stagger={0.06}>
            {projects.map((p, i) => (
              <RevealItem key={p.slug} className={i % 3 === 0 ? "hg-gallery__cell--wide" : ""}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                  <Link to={`/projects/${p.slug}`} className="hg-gallery__item" id={p.slug} aria-label={`View ${p.title}`}>
                    <img src={p.image} alt="" loading="lazy" decoding="async" />
                    <span className="hg-gallery__cap">
                      <strong>{p.title}</strong>
                      <em className="hg-mono">{p.scope}</em>
                    </span>
                  </Link>
                </motion.div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="hg-gallery__cta">
            <p className="hg-lede">Send your design and we will build it.</p>
            <button className="hg-btn" onClick={() => openModal("consultation")}>Start your project</button>
          </div>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
