import { useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Clicking a project opens the whole set as a full-screen, scroll-snapped
 * feed rather than one boxed image — scroll and the next project's photo
 * and details come up, the way a lookbook or a stories view works. No
 * scroll-position tracking needed: each panel already carries its own
 * caption, so CSS scroll-snap does all the work.
 */
export default function ProjectLightbox({ projects, index, onClose }) {
  const open = index != null;
  const trackRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("hg-locked");
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("hg-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Jump straight to the clicked project, no animation — the fade-in of the
  // whole overlay is the transition, the scroll position should just be right.
  useLayoutEffect(() => {
    if (!open || !trackRef.current) return;
    trackRef.current.scrollTop = index * trackRef.current.clientHeight;
  }, [open, index]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="hg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Project gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="hg-lightbox__close" onClick={onClose} aria-label="Close">✕</button>
          <p className="hg-lightbox__hint hg-mono">Scroll for the next project ↓</p>

          <div className="hg-lightbox__track" ref={trackRef}>
            {projects.map((p) => (
              <figure className="hg-lightbox__panel" key={p.slug}>
                <img src={p.image} alt={p.title} className="hg-lightbox__bg" loading="lazy" />
                <div className="hg-lightbox__veil" aria-hidden="true" />
                <figcaption className="hg-lightbox__cap">
                  <strong>{p.title}</strong>
                  <span className="hg-mono">{p.scope}</span>
                </figcaption>
              </figure>
            ))}
            <div className="hg-lightbox__end">
              <p className="hg-lede">Like what you see?</p>
              <button className="hg-btn" onClick={onClose}>Close and get in touch</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
