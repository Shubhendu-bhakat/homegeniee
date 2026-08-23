import { motion, AnimatePresence } from "motion/react";
import { useUI } from "../context/UIContext";

export default function CookieBar() {
  const { cookiesAccepted, acceptCookies } = useUI();

  return (
    <AnimatePresence>
      {!cookiesAccepted && (
        <motion.div
          className="hg-cookie"
          role="region"
          aria-label="Cookie notice"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>We use cookies to improve your experience on our website. By browsing this website, you agree to our use of cookies.</p>
          <button className="hg-btn hg-btn--sm" onClick={acceptCookies}>Accept</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
