import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import TrustStrip from "../sections/TrustStrip";

/**
 * Shared layout for the Privacy Policy and Terms pages: a plain header, a
 * contents list that stays beside the text on large screens, and numbered
 * sections. `sections` is [{ id, title, body }], where body is JSX.
 */
export default function LegalPage({ title, eyebrow, updated, intro, sections }) {
  return (
    <>
      <header className="hg-phead hg-legal__head">
        <div className="hg-shell hg-phead__copy">
          <Reveal as="nav" className="hg-crumbs hg-mono" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span aria-hidden="true">/</span> <span>{title}</span>
          </Reveal>
          <Reveal delay={0.06}><span className="hg-eyebrow">{eyebrow}</span></Reveal>
          <Reveal delay={0.12}><h1 className="hg-phead__title">{title}</h1></Reveal>
          <Reveal delay={0.18}><p className="hg-legal__updated hg-mono">Last updated: {updated}</p></Reveal>
        </div>
      </header>

      <section className="hg-section hg-section--light hg-legal">
        <div className="hg-shell hg-legal__layout">
          <nav className="hg-legal__toc" aria-label="On this page">
            <p className="hg-sheet">Contents</p>
            <ol>
              {sections.map((s, i) => (
                <li key={s.id}><a href={`#${s.id}`}><span className="hg-mono">{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>
              ))}
            </ol>
          </nav>

          <article className="hg-legal__body">
            {intro && <p className="hg-legal__intro">{intro}</p>}
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="hg-legal__sec">
                <h2><span className="hg-mono">{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </article>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
