import { motion } from "motion/react";
import { site } from "../data/site";
import { useUI } from "../context/UIContext";

/**
 * Down to one float: the AI assistant. WhatsApp/call/book now live in the
 * header and the assistant panel itself, so the corner stays to one action
 * instead of three competing ones.
 */
export default function FloatingActions() {
  const { openModal } = useUI();

  return (
    <div className="hg-floats">
      <motion.button
        className="hg-float hg-float--ai"
        onClick={() => openModal("ai")}
        aria-label="Ask HomeGeniee, AI assistant demo"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="hg-float--ai__mark"><img src={site.logo} alt="" /></span>
        <span className="hg-float--ai__label">Ask HomeGeniee</span>
      </motion.button>
    </div>
  );
}
