import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { sendLead, honeypot } from "../lib/leads";
import { nameError, phoneError, cleanName, cleanPhone } from "../lib/validate";

/**
 * Gates the calculator's cost reveal. There's no backend yet (phase 2 —
 * see plan.md), so this collects a name and phone number and calls it
 * signed in; it's a lead-capture step wearing a sign-in label, not real
 * authentication, and doesn't pretend otherwise.
 */
export default function SignInModal() {
  // modalPreset carries the estimate the visitor just calculated.
  const { modal, modalPreset, closeModal } = useUI();
  const { signIn } = useAuth();
  const open = modal === "signin";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const ne = nameError(name), pe = phoneError(phone);
    setNameError(ne);
    setError(pe);
    if (ne || pe) return;

    setSending(true);
    try {
      await sendLead("estimate", {
        name: cleanName(name), phone: cleanPhone(phone),
        estimate: typeof modalPreset === "object" ? modalPreset : undefined,
        website: honeypot(formEl),
      });
    } catch (err) {
      setError(err.message);
      setSending(false);
      return;
    }
    setSending(false);
    signIn({ name: cleanName(name), phone: cleanPhone(phone) });
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
                <label htmlFor="hg-signin-name">Name <span className="hg-field__req" aria-hidden="true">*</span></label>
                <input
                  id="hg-signin-name" value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(""); }}
                  autoComplete="name" required aria-required="true"
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "hg-signin-name-err" : undefined}
                />
                {nameError && <span className="hg-field__err" id="hg-signin-name-err">{nameError}</span>}
              </div>
              <div className="hg-field hg-field--wide">
                <label htmlFor="hg-signin-phone">Phone number <span className="hg-field__req" aria-hidden="true">*</span></label>
                <input
                  id="hg-signin-phone" type="tel" value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  required aria-required="true"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "hg-signin-phone-err" : undefined}
                  autoComplete="tel" inputMode="tel" maxLength={17} placeholder="+91 98XXX XXXXX"
                />
                {error && <span className="hg-field__err" id="hg-signin-phone-err">{error}</span>}
              </div>
              <input type="text" name="website" className="hg-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" />
              <button className="hg-btn hg-field--wide" type="submit" disabled={sending}>
                {sending ? "Sending…" : <>Sign in &amp; view cost</>}
              </button>
            </form>
            <p className="hg-signin__note">No password needed — we'll only use this to share your estimate.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
