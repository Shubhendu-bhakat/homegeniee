import { trustPillars } from "../data/site";
import { RevealGroup, RevealItem } from "../components/Reveal";

export default function TrustStrip() {
  return (
    <section className="hg-trust" aria-label="Our promise">
      <RevealGroup className="hg-shell hg-trust__grid" stagger={0.07}>
        {trustPillars.map((p) => (
          <RevealItem key={p.title} className="hg-trust__item">
            <h3 className="hg-trust__title">{p.title}</h3>
            <p className="hg-trust__note hg-mono">{p.note}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
