import Hero from "../sections/Hero";
import ProcessJourney from "../sections/ProcessJourney";
import ServiceShowcase from "../sections/ServiceShowcase";
import WhyUs from "../sections/WhyUs";
import UtilityCollection from "../sections/UtilityCollection";
import Projects from "../sections/Projects";
import Testimonials from "../sections/Testimonials";
import TrustStrip from "../sections/TrustStrip";
import LouverDivider from "../components/LouverDivider";

export default function Home() {
  return (
    <>
      <Hero />
      <ProcessJourney />
      <LouverDivider label="Services" />
      <ServiceShowcase />
      <WhyUs />
      <UtilityCollection />
      <LouverDivider label="Portfolio" />
      <Projects />
      <Testimonials />
      <TrustStrip />
    </>
  );
}
