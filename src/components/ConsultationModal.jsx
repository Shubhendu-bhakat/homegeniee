import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUI } from "../context/UIContext";
import { consultationInterests, site } from "../data/site";

const EMPTY = { name: "", phone: "", email: "", location: "", interest: "", message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Enter your name so we know who to ask for.";
  if (!/^[\d\s+()-]{8,}$/.test(values.phone.trim())) errors.phone = "Enter a phone number we can reach you on.";
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "That email address looks incomplete.";
  if (!values.location.trim()) errors.location = "Enter your location so we know where to send the team.";
  if (!values.interest) errors.interest = "Pick the service closest to what you need.";
  return errors;
}

export default function ConsultationModal() {
  const { modal, modalPreset, closeModal } = useUI();
  const open = modal === "consultation";

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const firstField = useRef(null);

  useEffect(() => {
    if (!open) return;
    setValues({ ...EMPTY, interest: modalPreset || "" });
    setErrors({});
    setStatus("idle");
    const t = setTimeout(() => firstField.current?.focus(), 240);
    return () => clearTimeout(t);
  }, [open, modalPreset]);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    // ponytail: no backend in this phase. Swap for POST /api/enquiry in phase 2 —
    // the payload shape below is already what the endpoint should accept.
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="hg-modal-root">
          <motion.div
            className="hg-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            className="hg-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hg-modal-title"
            initial={{ opacity: 0, y: 40, rotateX: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="hg-modal__close" onClick={closeModal} aria-label="Close">✕</button>

            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="done"
                  className="hg-modal__done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.svg
                    width="56" height="56" viewBox="0 0 56 56" fill="none"
                    initial={{ scale: 0.6, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                    aria-hidden="true"
                  >
                    <circle cx="28" cy="28" r="26" stroke="var(--accent)" strokeWidth="2" />
                    <motion.path
                      d="M17 29l8 8 15-17" stroke="var(--accent)" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    />
                  </motion.svg>
                  <h2 id="hg-modal-title" className="hg-h3">Request received</h2>
                  <p className="hg-lede">
                    Our team will reach out within 24 hours. If it is urgent, call {site.phonePrimaryLabel} and
                    quote your name — we will pull the request up.
                  </p>
                  <button className="hg-btn" onClick={closeModal}>Close</button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 id="hg-modal-title" className="hg-h3">Get your free consultation today</h2>
                  <p className="hg-modal__lede">
                    Fill out the form below and our team will reach out within 24 hours. No spam — just real value.
                  </p>

                  <form className="hg-form" onSubmit={submit} noValidate>
                    <p className="hg-form__legend">Fields marked <span className="hg-field__req">*</span> are required.</p>

                    <div className="hg-field">
                      <label htmlFor="hg-name">Name <span className="hg-field__req" aria-hidden="true">*</span></label>
                      <input
                        id="hg-name" ref={firstField} value={values.name} onChange={set("name")}
                        autoComplete="name" required aria-required="true"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "hg-name-err" : undefined}
                      />
                      {errors.name && <p className="hg-field__err" id="hg-name-err">{errors.name}</p>}
                    </div>

                    <div className="hg-field">
                      <label htmlFor="hg-phone">Phone <span className="hg-field__req" aria-hidden="true">*</span></label>
                      <input
                        id="hg-phone" type="tel" inputMode="tel" value={values.phone} onChange={set("phone")}
                        autoComplete="tel" required aria-required="true"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "hg-phone-err" : undefined}
                      />
                      {errors.phone && <p className="hg-field__err" id="hg-phone-err">{errors.phone}</p>}
                    </div>

                    <div className="hg-field hg-field--wide">
                      <label htmlFor="hg-location">Location <span className="hg-field__req" aria-hidden="true">*</span></label>
                      <input
                        id="hg-location" value={values.location} onChange={set("location")}
                        autoComplete="address-level2"
                        placeholder="e.g. Salt Lake, Kolkata"
                        required aria-required="true"
                        aria-invalid={Boolean(errors.location)}
                        aria-describedby={errors.location ? "hg-location-err" : undefined}
                      />
                      {errors.location && <p className="hg-field__err" id="hg-location-err">{errors.location}</p>}
                    </div>

                    <div className="hg-field">
                      <label htmlFor="hg-email">Email</label>
                      <input
                        id="hg-email" type="email" value={values.email} onChange={set("email")}
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "hg-email-err" : undefined}
                      />
                      {errors.email && <p className="hg-field__err" id="hg-email-err">{errors.email}</p>}
                    </div>

                    <div className="hg-field">
                      <label htmlFor="hg-interest">Interested in <span className="hg-field__req" aria-hidden="true">*</span></label>
                      <select
                        id="hg-interest" value={values.interest} onChange={set("interest")}
                        required aria-required="true"
                        aria-invalid={Boolean(errors.interest)}
                        aria-describedby={errors.interest ? "hg-interest-err" : undefined}
                      >
                        <option value="">Select</option>
                        {consultationInterests.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {errors.interest && <p className="hg-field__err" id="hg-interest-err">{errors.interest}</p>}
                    </div>

                    <div className="hg-field hg-field--wide">
                      <label htmlFor="hg-message">Message</label>
                      <textarea id="hg-message" rows="3" value={values.message} onChange={set("message")} />
                    </div>

                    <button className="hg-btn hg-field--wide" type="submit" disabled={status === "sending"}>
                      {status === "sending" ? "Sending…" : "Book free consultation"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
