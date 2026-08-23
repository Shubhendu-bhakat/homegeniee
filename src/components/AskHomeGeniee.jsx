import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUI } from "../context/UIContext";
import { site } from "../data/site";
import { aiSuggestions, matchAiAnswer } from "../data/aiDemo";

const GREETING =
  "Hi, I'm the HomeGeniee assistant — a demo preview. Ask about services, pricing, timelines or coverage, or pick a question below.";

/**
 * A static, keyword-matched Q&A panel — not a live model. It exists to show
 * the shape of the feature; the "demo" label stays visible in the header and
 * the intro line so nobody mistakes it for the real thing.
 */
export default function AskHomeGeniee() {
  const { modal, closeModal, openModal } = useUI();
  const open = modal === "ai";

  const [messages, setMessages] = useState([{ from: "ai", text: GREETING }]);
  const [input, setInput] = useState("");
  const [asked, setAsked] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, open]);

  const ask = (text) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }, { from: "ai", text: matchAiAnswer(q) }]);
    setInput("");
    setAsked(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="hg-modal-root">
          <motion.div
            className="hg-scrim"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            className="hg-ai"
            role="dialog" aria-modal="true" aria-label="Ask HomeGeniee, demo assistant"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hg-ai__head">
              <span className="hg-ai__logo"><img src={site.logo} alt="" /></span>
              <div className="hg-ai__title">
                <strong>Ask HomeGeniee</strong>
                <span className="hg-ai__badge">Demo preview · not a live AI</span>
              </div>
              <button className="hg-modal__close hg-ai__close" onClick={closeModal} aria-label="Close">✕</button>
            </div>

            <div className="hg-ai__body">
              <div className="hg-ai__log">
                {messages.map((m, i) => (
                  <p key={i} className={`hg-ai__msg hg-ai__msg--${m.from}`}>{m.text}</p>
                ))}
                <div ref={endRef} />
              </div>

              <form
                className="hg-ai__form"
                onSubmit={(e) => { e.preventDefault(); ask(input); }}
              >
                <label htmlFor="hg-ai-input" className="hg-ai__formLabel">Or type your own question</label>
                <div className="hg-ai__formRow">
                  <input
                    id="hg-ai-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Do you work outside Kolkata?"
                    aria-label="Ask HomeGeniee a question"
                  />
                  <button className="hg-btn hg-btn--sm" type="submit">Send</button>
                </div>
              </form>

              {!asked && (
                <div className="hg-ai__suggest">
                  {aiSuggestions.map((s) => (
                    <button key={s.q} className="hg-ai__chip" onClick={() => ask(s.q)}>{s.q}</button>
                  ))}
                </div>
              )}

              <button className="hg-ai__cta" onClick={() => openModal("consultation")}>
                Skip the demo — book a real consultation →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
