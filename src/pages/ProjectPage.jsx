import { Link, Navigate, useParams } from "react-router-dom";
import { getProject, youtubeId } from "../data/projects";
import { useUI } from "../context/UIContext";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import TrustStrip from "../sections/TrustStrip";

/**
 * One project's own page — the gallery, the walkthrough video and the
 * material spec sheet that used to live in the WordPress single-project
 * template. `gallery`/`video`/`details` are all optional on the project
 * record, so a project with none of them still renders a normal page.
 */
export default function ProjectPage() {
  const { slug } = useParams();
  const { openModal } = useUI();
  const project = getProject(slug);

  if (!project) return <Navigate to="/gallery" replace />;

  const gallery = project.gallery ?? [project.image];
  const vid = youtubeId(project.video);

  return (
    <>
      <section className="hg-section hg-proj-page">
        <div className="hg-shell">
          <Reveal as="nav" className="hg-crumbs hg-mono" aria-label="Breadcrumb">
            <Link to="/gallery">Projects</Link> <span aria-hidden="true">/</span> <span>{project.title}</span>
          </Reveal>

          <div className="hg-proj-page__grid">
            <div className="hg-proj-page__media">
              <RevealGroup
                className={`hg-proj-page__gallery ${gallery.length === 1 ? "is-single" : ""}`}
                stagger={0.06}
              >
                {gallery.map((src, i) => (
                  <RevealItem key={src}>
                    <img src={src} alt={`${project.title} ${i + 1}`} loading="lazy" decoding="async" />
                  </RevealItem>
                ))}
              </RevealGroup>

              {vid && (
                <Reveal delay={0.1} className="hg-proj-page__video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=1`}
                    title={`${project.title} walkthrough`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Reveal>
              )}
            </div>

            <Reveal delay={0.15} as="aside" className="hg-proj-page__side">
              <h1 className="hg-proj-page__title">{project.title}</h1>
              <span className="hg-mono hg-proj-page__scope">{project.scope}</span>
              <hr />

              {project.details && (
                <div className="hg-proj-page__details">
                  <h2>Project Details:</h2>
                  <p className="hg-proj-page__detailsLead">{project.details.heading}—</p>
                  <ol>
                    {project.details.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}

              <button className="hg-btn hg-proj-page__cta" onClick={() => openModal("consultation", project.title)}>
                Book free consultation
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
