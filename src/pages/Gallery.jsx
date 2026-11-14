import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { projects, youtubeId } from "../data/projects";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import TrustStrip from "../sections/TrustStrip";
import HeroVideoBackground from "../components/HeroVideoBackground";
import { pageClips } from "../data/heroClips";
import { useUI } from "../context/UIContext";

const videoProjects = projects.filter((p) => p.video);

export default function Gallery() {
  const { openModal } = useUI();

  return (
    <>
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          <HeroVideoBackground clips={pageClips.gallery} />
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
          <SectionHeading
            eyebrow="The full set"
            title="Every project, one wall at a time"
            lede={`${projects.length} homes across Kolkata — open one for the full walkthrough, the video and the material spec.`}
          />

          <RevealGroup className="hg-gallery__grid" stagger={0.06}>
            {projects.map((p, i) => (
              <RevealItem key={p.slug} className={i % 3 === 0 ? "hg-gallery__cell--wide" : ""}>
                <motion.article className="hg-gallery__card" whileHover="on" initial="off" animate="off">
                  <Link to={`/projects/${p.slug}`} className="hg-gallery__item" id={p.slug} aria-label={`View ${p.title}`}>
                    <motion.img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      variants={{ off: { scale: 1 }, on: { scale: 1.06 } }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.span
                      className="hg-gallery__cap"
                      variants={{ off: { y: 0 }, on: { y: -4 } }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <em className="hg-mono">{p.scope}</em>
                      <strong>{p.title}</strong>
                      <span className="hg-mono hg-gallery__more">View project →</span>
                    </motion.span>
                  </Link>
                </motion.article>
              </RevealItem>
            ))}
          </RevealGroup>

        </div>
      </section>

      {videoProjects.length > 0 && (
        <section className="hg-section hg-section--light hg-gallery-vid" aria-labelledby="hg-gallery-vid-title">
          <div className="hg-shell">
            <SectionHeading
              eyebrow="Walkthroughs"
              title={<span id="hg-gallery-vid-title">Watch a project take shape</span>}
              lede="On-site footage from a few of the homes above — the same video sits on each project's own page."
            />

            <RevealGroup className="hg-vidgrid" stagger={0.08}>
              {videoProjects.map((p) => {
                const id = youtubeId(p.video);
                return (
                  <RevealItem key={p.slug}>
                    <article className="hg-vidcard">
                      <span className="hg-vidcard__thumb">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&playsinline=1`}
                          title={p.title}
                          loading="lazy"
                          allow="autoplay; encrypted-media"
                          tabIndex={-1}
                        />
                      </span>
                      <Link to={`/projects/${p.slug}`} className="hg-vidcard__meta" aria-label={`View ${p.title}`}>
                        <strong>{p.title}</strong>
                        <em className="hg-mono">{p.scope}</em>
                        <span className="hg-mono hg-vidcard__more">View project →</span>
                      </Link>
                    </article>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </section>
      )}

      <section className="hg-section hg-gallery">
        <div className="hg-shell">
          <div className="hg-gallery__cta">
            <p className="hg-lede">Send your design and we will build it.</p>
            <div className="hg-gallery__ctaActions">
              <button className="hg-btn hg-btn--gold" onClick={() => openModal("consultation")}>Start your project</button>
              <Link to="/services/interior-design#calculate-cost" className="hg-btn hg-btn--ghost">Get free estimation</Link>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
