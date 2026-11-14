import Hero from "../sections/Hero";
// import ProcessJourney from "../sections/ProcessJourney"; // commented out per client request
import ServiceShowcase from "../sections/ServiceShowcase";
import WhyUs from "../sections/WhyUs";
import Projects from "../sections/Projects";
import Testimonials from "../sections/Testimonials";
import TrustStrip from "../sections/TrustStrip";
import LouverDivider from "../components/LouverDivider";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <ProcessJourney /> */}
      {/* Content sheet slides up over the hero as it scrolls away — the
          scroll transition replaces the louver strip that used to sit here. */}
      <div className="hg-sheetOver">
        <ServiceShowcase />
        <WhyUs />
        <LouverDivider label="Portfolio" tone="var(--gold)" />
        <Projects />
        <Testimonials />
        <TrustStrip />
      </div>
    </>
  );
}
