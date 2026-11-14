import { Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";
import ConsultationModal from "./components/ConsultationModal";
import SignInModal from "./components/SignInModal";
import AskHomeGeniee from "./components/AskHomeGeniee";
import FloatingActions from "./components/FloatingActions";
// Deliberately neutral name: ad/tracker blockers (Brave Shields, uBlock)
// block file URLs and classes containing "cookie"/"consent", which in dev
// broke the whole app with ERR_BLOCKED_BY_CLIENT.
import SiteNotice from "./components/SiteNotice";
import ScrollProgress from "./components/ScrollProgress";

import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import Gallery from "./pages/Gallery";
import ProjectPage from "./pages/ProjectPage";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Per-path scroll memory for the life of the tab — lets "back" return to
// the section the user was actually looking at (e.g. the Projects grid)
// instead of dumping them at the top of the homepage.
const scrollPositions = new Map();

/** Reset scroll on a fresh navigation; restore it on back/forward. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (hash) return;
    if (navType === "POP") {
      window.scrollTo({ top: scrollPositions.get(pathname) ?? 0, behavior: "instant" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash, navType]);

  useEffect(() => {
    const onScroll = () => scrollPositions.set(pathname, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}

const page = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.24, ease: [0.65, 0, 0.35, 1] } },
};

export default function App() {
  const location = useLocation();

  // The old standalone collection page now lives on the Furniture page. Redirect
  // here, outside the keyed page transition, which would swallow a route-level one.
  if (location.pathname === "/collection") return <Navigate to="/services/furniture" replace />;

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
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
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
      <SiteNotice />
    </>
  );
}
