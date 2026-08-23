import { differentiators, site } from "../data/site";
import SectionHeading from "../components/SectionHeading";
import { RevealGroup, RevealItem } from "../components/Reveal";

const marks = [
  <path key="a" d="M4 17v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5M6 17v3M18 17v3M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />,
  <g key="b"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" strokeLinecap="round" /></g>,
  <g key="c"><circle cx="12" cy="12" r="8" /><path d="M9 9.5h6M9 14.5h6M12 6.5v11" strokeLinecap="round" /></g>,
  <path key="d" d="M12 3l7 3v6c0 4-3 7.4-7 9-4-1.6-7-5-7-9V6l7-3ZM9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />,
];

export default function WhyUs() {
  return (
    <section className="hg-section hg-section--light hg-why" aria-labelledby="hg-why-title">
      <div className="hg-shell">
        <SectionHeading
          eyebrow="Why choose Home Geniee"
          title={<span id="hg-why-title">Four things we will not negotiate on</span>}
          lede="Followed in this order, on every project — not a menu to pick from."
        />

        <div className="hg-why__stepline" aria-hidden="true">
          {differentiators.map((d, i) => (
            <span className="hg-why__step" key={d.title}>
              <em>{String(i + 1).padStart(2, "0")}</em>
              {i < differentiators.length - 1 && <i className="hg-why__stepLine" />}
            </span>
          ))}
        </div>

        <RevealGroup className="hg-why__grid" stagger={0.09}>
          {differentiators.map((d, i) => (
            <RevealItem key={d.title} className="hg-why__card">
              <span className="hg-why__badge">
                <svg className="hg-why__icon" width="26" height="26" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  {marks[i]}
                </svg>
              </span>
              <h3 className="hg-why__title">{d.title}</h3>
              <p className="hg-why__note">{d.note}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="hg-why__cta">
          <a href={`tel:${site.appointment}`} className="hg-btn">Book an appointment</a>
        </div>
      </div>
    </section>
  );
}
