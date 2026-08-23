import { Link } from "react-router-dom";
import { services } from "../data/services";
import { site } from "../data/site";
import SectionHeading from "../components/SectionHeading";
import TiltCard from "../components/TiltCard";
import { RevealGroup, RevealItem } from "../components/Reveal";

/**
 * All service verticals from the homepage, each keeping its original eyebrow,
 * heading and copy. Cards tilt in 3D on pointer; the image sits on a positive
 * translateZ so it genuinely lifts off the card face rather than faking depth.
 */
export default function ServiceShowcase() {
  return (
    <section className="hg-section hg-services" aria-labelledby="hg-services-title">
      <div className="hg-shell">
        <SectionHeading
          eyebrow="What we build"
          title={<span id="hg-services-title">Fourteen verticals, one point of contact</span>}
          lede="Interiors, civil work, facades, greenscape and paperwork. You brief one team and one team carries it through."
        />

        <RevealGroup className="hg-services__grid" stagger={0.06}>
          {services.map((s) => (
            <RevealItem key={s.slug}>
              <TiltCard className="hg-svc">
                <Link to={s.href ?? `/services/${s.slug}`} className="hg-svc__link">
                  <div className="hg-svc__media">
                    <img src={s.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="hg-svc__body">
                    <span className="hg-eyebrow">{s.eyebrow}</span>
                    <h3 className="hg-svc__title">{s.title}</h3>
                    <p className="hg-svc__copy">{s.body}</p>
                  </div>
                  <span className="hg-svc__more hg-mono">View more →</span>
                </Link>
                <a href={`tel:${site.phonePrimary}`} className="hg-svc__call hg-mono">Call now</a>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
