import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";
import ConsultationModal from "./components/ConsultationModal";
import SignInModal from "./components/SignInModal";
import AskHomeGeniee from "./components/AskHomeGeniee";
import FloatingActions from "./components/FloatingActions";
import CookieBar from "./components/CookieBar";
import ScrollProgress from "./components/ScrollProgress";

import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import Collection from "./pages/Collection";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";

/** Reset scroll on navigation, except when the URL carries an anchor. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

const page = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.24, ease: [0.65, 0, 0.35, 1] } },
};

export default function App() {
  const location = useLocation();

  return (
    <>
      <a className="hg-skip" href="#main">Skip to main content</a>
      <ScrollProgress />
      <Header />
      <MobileNav />

      <main id="main">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={page} initial="initial" animate="enter" exit="exit">
            <ScrollToTop />
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/services/:slug" element={<ServicePage />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Legacy WordPress paths kept alive so old links still resolve. */}
              <Route path="/about-us" element={<About />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/interior-design" element={<ServicePage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <ConsultationModal />
      <SignInModal />
      <AskHomeGeniee />
      <FloatingActions />
      <CookieBar />
    </>
  );
}
