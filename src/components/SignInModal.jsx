import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

/**
 * Gates the calculator's cost reveal. There's no backend yet (phase 2 —
 * see plan.md), so this collects a name and phone number and calls it
 * signed in; it's a lead-capture step wearing a sign-in label, not real
 * authentication, and doesn't pretend otherwise.
 */
export default function SignInModal() {
  const { modal, closeModal } = useUI();
  const { signIn } = useAuth();
  const open = modal === "signin";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!/^[\d\s+()-]{8,}$/.test(phone.trim())) {
      setError("Enter a phone number we can reach you on.");
      return;
    }
    signIn({ name: name.trim(), phone: phone.trim() });
    closeModal();
    setName("");
    setPhone("");
    setError("");
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
            className="hg-modal hg-signin"
            role="dialog" aria-modal="true" aria-labelledby="hg-signin-title"
            initial={{ opacity: 0, y: 32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
          >
            <button className="hg-modal__close hg-signin__close" onClick={closeModal} aria-label="Close">✕</button>
            <span className="hg-eyebrow">Sign in</span>
            <h2 id="hg-signin-title" className="hg-h3">See your exact cost estimate</h2>
            <p className="hg-modal__lede">
              Sign in with your phone number to view the price breakdown for what you configured — we'll also send it to you directly.
            </p>

            <form className="hg-form" onSubmit={submit} noValidate>
              <div className="hg-field hg-field--wide">
                <label htmlFor="hg-signin-name">Name (optional)</label>
                <input id="hg-signin-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="hg-field hg-field--wide">
                <label htmlFor="hg-signin-phone">Phone number</label>
                <input
                  id="hg-signin-phone" type="tel" value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  aria-invalid={Boolean(error)} autoComplete="tel" placeholder="+91 98XXX XXXXX"
                />
                {error && <span className="hg-field__err">{error}</span>}
              </div>
              <button className="hg-btn hg-field--wide" type="submit">Sign in &amp; view cost</button>
            </form>
            <p className="hg-signin__note">No password needed — we'll only use this to share your estimate.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
