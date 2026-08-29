import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { projects } from "../data/projects";
import SectionHeading from "../components/SectionHeading";
import { RevealGroup, RevealItem } from "../components/Reveal";

/**
 * Portfolio. The card body sits on a 3D plane and the image scales inside a
 * fixed frame, so hover reads as leaning in rather than as a zoom effect.
 * Clicking a card takes the visitor to that project's own page.
 */
export default function Projects() {
  return (
    <section className="hg-section hg-projects" aria-labelledby="hg-projects-title">
      <div className="hg-shell">
        <SectionHeading
          eyebrow="Connect people"
          title={<span id="hg-projects-title">Some of our projects</span>}
        />

        <RevealGroup className="hg-projects__grid" stagger={0.07}>
          {projects.map((p) => (
            <RevealItem key={p.slug}>
              <motion.article
                className="hg-proj"
                whileHover="on"
                initial="off"
                animate="off"
              >
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
                    <motion.span
                      className="hg-proj__wash"
                      variants={{ off: { opacity: 0.55 }, on: { opacity: 0.2 } }}
                      transition={{ duration: 0.4 }}
                      aria-hidden="true"
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
          <Link to="/gallery" className="hg-btn hg-btn--ghost">View more</Link>
        </div>
      </div>
    </section>
  );
}
