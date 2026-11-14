import { useState } from "react";
import { motion } from "motion/react";
import { site, consultationPurposes } from "../data/site";
import { projects } from "../data/projects";
import Reveal from "../components/Reveal";
import HeroSlider from "../components/HeroSlider";
import TrustStrip from "../sections/TrustStrip";
import { sendLead, honeypot, readFile, MAX_UPLOAD_MB } from "../lib/leads";

const EMPTY = { name: "", email: "", phone: "", purpose: "", message: "", file: "" };

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null); // the picked design file itself
  const [sendError, setSendError] = useState("");

  const set = (k) => (e) => {
    if (e.target.type === "file") setFile(e.target.files?.[0] ?? null);
    const v = e.target.type === "file" ? (e.target.files?.[0]?.name ?? "") : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const found = {};
    if (!values.name.trim()) found.name = "Enter your name.";
    if (!/^[\d\s+()-]{8,}$/.test(values.phone.trim())) found.phone = "Enter a phone number we can reach you on.";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) found.email = "That email address looks incomplete.";
    if (file && file.size > MAX_UPLOAD_MB * 1024 * 1024) found.file = `Please choose a file under ${MAX_UPLOAD_MB} MB.`;
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    setSendError("");
    try {
      await sendLead("contact", {
        name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim(),
        purpose: values.purpose, message: values.message.trim(),
        file: file ? await readFile(file) : undefined,
        website: honeypot(formEl),
      });
      setStatus("sent");
      setValues(EMPTY);
      setFile(null);
    } catch (err) {
      setSendError(err.message);
      setStatus("idle");
    }
  };

  return (
    <>
      <header className="hg-phead">
        <div className="hg-phead__media" aria-hidden="true">
          <HeroSlider slides={projects} />
        </div>
        <div className="hg-shell hg-phead__copy">
          <Reveal delay={0.06}><span className="hg-eyebrow">Send your design, we will make it</span></Reveal>
          <Reveal delay={0.12}><h1 className="hg-phead__title">Talk to the team</h1></Reveal>
        </div>
      </header>

      <section className="hg-section hg-contact">
        <div className="hg-shell hg-contact__cols">
          <Reveal className="hg-contact__info">
            <h2 className="hg-h3">Studio</h2>
            <address className="hg-contact__address">
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>

            <dl className="hg-contact__list">
              <div>
                <dt className="hg-mono">Phone</dt>
                <dd><a href={`tel:${site.phonePrimary}`}>{site.phonePrimaryLabel}</a></dd>
              </div>
              <div>
                <dt className="hg-mono">Enquiries</dt>
                <dd><a href={`tel:${site.phoneSecondary}`}>{site.phoneSecondaryLabel}</a></dd>
              </div>
              <div>
                <dt className="hg-mono">Appointments</dt>
                <dd><a href={`tel:${site.appointment}`}>{site.appointment}</a></dd>
              </div>
              <div>
                <dt className="hg-mono">WhatsApp</dt>
                <dd>
                  <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer noopener">
                    Message us
                  </a>
                </dd>
              </div>
            </dl>

            <ul className="hg-contact__socials">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener">{s.label} ↗</a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="hg-contact__formWrap">
            <h2 className="hg-h3">Send your design</h2>
            <p className="hg-contact__lede">
              Share a reference, a floor plan, or just a photo of the room. We will come back within 24 hours.
            </p>

            {status === "sent" ? (
              <motion.div
                className="hg-contact__done"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
              >
                <h3 className="hg-h3">Sent</h3>
                <p>Thanks — our team will reach out within 24 hours.</p>
                <button className="hg-btn hg-btn--ghost" onClick={() => setStatus("idle")}>Send another</button>
              </motion.div>
            ) : (
              <form className="hg-form" onSubmit={submit} noValidate>
                <div className="hg-field">
                  <label htmlFor="c-name">Name <span className="hg-field__req" aria-hidden="true">*</span></label>
                  <input id="c-name" value={values.name} onChange={set("name")} autoComplete="name"
                         aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "c-name-e" : undefined} />
                  {errors.name && <p className="hg-field__err" id="c-name-e">{errors.name}</p>}
                </div>

                <div className="hg-field">
                  <label htmlFor="c-phone">Phone number <span className="hg-field__req" aria-hidden="true">*</span></label>
                  <input id="c-phone" type="tel" inputMode="tel" value={values.phone} onChange={set("phone")} autoComplete="tel"
                         aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "c-phone-e" : undefined} />
                  {errors.phone && <p className="hg-field__err" id="c-phone-e">{errors.phone}</p>}
                </div>

                <div className="hg-field">
                  <label htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" value={values.email} onChange={set("email")} autoComplete="email"
                         aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "c-email-e" : undefined} />
                  {errors.email && <p className="hg-field__err" id="c-email-e">{errors.email}</p>}
                </div>

                <div className="hg-field">
                  <label htmlFor="c-purpose">Select purpose</label>
                  <select id="c-purpose" value={values.purpose} onChange={set("purpose")}>
                    <option value="">Select</option>
                    {consultationPurposes.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="hg-field hg-field--wide">
                  <label htmlFor="c-message">Message</label>
                  <textarea id="c-message" rows="4" value={values.message} onChange={set("message")} />
                </div>

                <div className="hg-field hg-field--wide">
                  <label htmlFor="c-file">Upload your design</label>
                  <input id="c-file" type="file" onChange={set("file")} accept="image/*,.pdf" />
                  {values.file && <p className="hg-field__hint hg-mono">{values.file}</p>}
                  {errors.file && <p className="hg-field__err">{errors.file}</p>}
                </div>

                <input type="text" name="website" className="hg-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" />
                {sendError && <p className="hg-field__err hg-field--wide" role="alert">{sendError}</p>}
                <button className="hg-btn hg-field--wide" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Submit"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
