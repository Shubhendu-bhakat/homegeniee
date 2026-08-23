import { useState } from "react";
import { motion } from "motion/react";
import { faqs, aboutPromises, aboutDoes } from "../data/faqs";
import { site } from "../data/site";
import Reveal, { RevealGroup, RevealItem } from "../components/Reveal";
import LouverDivider from "../components/LouverDivider";
import HeroSlider from "../components/HeroSlider";
import { projects } from "../data/projects";
import TrustStrip from "../sections/TrustStrip";

const U = "https://homegeniee.com/wp-content/uploads";
const strip = [
  `${U}/2025/08/WhatsApp-Image-2025-07-22-at-15.06.13-4.jpeg`,
  `${U}/2025/07/restaurant-entrance-with-wood-doors-two-turquoise-chairs-with-plant-scaled.jpg`,
  `${U}/2025/08/image.png`,
  `${U}/2025/07/10704.webp`,
  `${U}/2025/08/wood-layout-img-1.jpg`,
];

function Faq({ item, i, open, onToggle }) {
  const id = `faq-${i}`;
  return (
    <li className={`hg-faq ${open ? "is-open" : ""}`}>
      <h3>
        <button className="hg-faq__q" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          <span>{item.q}</span>
          <motion.span
            className="hg-faq__mark"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            +
          </motion.span>
        </button>
      </h3>
      {/* Stays mounted when collapsed so the answers remain crawlable —
          this site competes on "interior designers in Kolkata", and the FAQ
          is the densest keyword block on the page. `inert` keeps collapsed
          answers out of the tab order and the accessibility tree. */}
      <motion.div
        id={id}
        className="hg-faq__a"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        inert={!open}
      >
        <p>{item.a}</p>
      </motion.div>
    </li>
  );
}

export default function About() {
  const [openIndex, setOpenIndex] = useState(0);

  // FAQPage structured data — the WordPress site had none, and this is the
  // cheapest available win for local search on "interior designers in Kolkata".
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          <HeroSlider slides={projects} />
        </div>
        <div className="hg-shell hg-phead__copy">
          <Reveal delay={0.06}><span className="hg-eyebrow">Some words about us</span></Reveal>
          <Reveal delay={0.12}><h1 className="hg-phead__title">Home Geniee: transforming spaces since {site.since}</h1></Reveal>
          <Reveal delay={0.18}>
            <p className="hg-lede">
              At Home Geniee, we believe your home should reflect your unique style, comfort, and personality.
              Since {site.since}, we've been helping homeowners and businesses across Kolkata turn their spaces
              into beautiful, functional, and inspiring environments.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="hg-strip" aria-hidden="true">
        <motion.div
          className="hg-strip__track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {[...strip, ...strip].map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" decoding="async" />
          ))}
        </motion.div>
      </div>

      <section className="hg-section hg-about">
        <div className="hg-shell hg-about__cols">
          <Reveal className="hg-about__block">
            <p className="hg-sheet">About our vision</p>
            <h2 className="hg-h3">Design, made legible</h2>
            <p className="hg-about__body">
              Interior design can feel overwhelming with endless choices and confusing processes. Our vision is
              simple — to make design accessible, transparent, and stress-free. We guide you at every step,
              ensuring your journey is smooth, enjoyable, and tailored to your lifestyle.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="hg-about__block">
            <p className="hg-sheet">What we do</p>
            <h2 className="hg-h3">More than an interior design company</h2>
            <p className="hg-about__body">
              Home Geniee is a one-stop platform. Whether you dream of a stylish living room, a cozy balcony
              garden, or a complete home makeover, we provide end-to-end design and execution under one roof.
            </p>
            <ul className="hg-about__does">
              {aboutDoes.map((d) => (
                <li key={d.title}>
                  <strong>{d.title}</strong>
                  <span>{d.body}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="hg-section hg-section--light hg-promise">
        <div className="hg-shell">
          <Reveal><p className="hg-sheet">Our promise</p></Reveal>
          <Reveal delay={0.06}>
            <h2 className="hg-h2">Trust, quality, and lasting value</h2>
          </Reveal>
          <RevealGroup className="hg-promise__grid" stagger={0.06}>
            {aboutPromises.map((p) => (
              <RevealItem key={p} className="hg-promise__item">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 9.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{p}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <LouverDivider label="Questions" />

      <section className="hg-section hg-faqs">
        <div className="hg-shell hg-faqs__inner">
          <Reveal>
            <p className="hg-sheet">Frequently asked questions</p>
            <h2 className="hg-h2">Before you call</h2>
          </Reveal>
          <ul className="hg-faqs__list">
            {faqs.map((f, i) => (
              <Faq
                key={f.q}
                item={f}
                i={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </ul>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
