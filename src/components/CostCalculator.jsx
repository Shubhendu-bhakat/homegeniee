import { useEffect, useState } from "react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { estimators } from "../data/estimators";
import { sendLead } from "../lib/leads";

/**
 * Adapted from the client's calculator prototype: three quick questions,
 * an instant range, then a gate — sign in to see the itemised breakdown.
 * The questions, options and rates come from data/estimators.js per vertical
 * (`service` slug). Rates are illustrative placeholders, same caveat the
 * prototype carried, until Home Geniee provides real pricing.
 */
const fmtLakh = (n) => (n >= 100000 ? `₹${(n / 100000).toFixed(2).replace(/\.00$/, "")}L` : `₹${Math.round(n).toLocaleString("en-IN")}`);

// "Premium (Acrylic / Membrane)" -> bold title plus a quieter second line.
const splitLabel = (label) => {
  const m = label.match(/^(.*?)\s*\((.*)\)$/);
  return m ? [m[1], m[2]] : [label, null];
};

export default function CostCalculator({ service = "interior-design" }) {
  const cfg = estimators[service] ?? estimators["interior-design"];
  const { openModal } = useUI();
  const { isSignedIn, user } = useAuth();
  const { isSignedIn } = useAuth();
  const [layout, setLayout] = useState(cfg.layout?.initial ?? 0);
  const [size, setSize] = useState(cfg.size.initial);
  const [scope, setScope] = useState(cfg.scope?.initial ?? 0);
  const [tier, setTier] = useState(cfg.tier.initial);
  const [result, setResult] = useState(null);

  // Other sections (e.g. the kitchen layout picker) can pre-select an option.
  useEffect(() => {
    const onPreset = (e) => {
      const i = e.detail?.size;
      if (Number.isInteger(i) && cfg.size.options[i]) setSize(i);
      const l = e.detail?.layout;
      if (Number.isInteger(l) && cfg.layout?.options[l]) setLayout(l);
      const t = e.detail?.tier;
      if (Number.isInteger(t) && cfg.tier.options[t]) setTier(t);
    };
    window.addEventListener("hg:calc-preset", onPreset);
    return () => window.removeEventListener("hg:calc-preset", onPreset);
  }, [cfg]);

  const calculate = () => {
    const base = cfg.size.options[size].area * cfg.scope.options[scope].mult * cfg.tier.options[tier].rate;
    const low = base * 0.9, high = base * 1.15;
    // What gets saved in the "Cost estimates" sheet tab.
    const lead = {
      service: cfg.subject,
      size: cfg.size.options[size].label,
      scope: cfg.scope.options[scope].label,
      tier: cfg.tier.options[tier].label,
      low: Math.round(low),
      high: Math.round(high),
    };
    setResult({ low, high, base, lead });
    // Already signed in: the cost shows straight away, so record it now.
    if (isSignedIn) {
      sendLead("estimate", { name: user?.name || "Returning visitor", phone: user?.phone, estimate: lead }).catch(() => {});
    }
    // Kitchens price by running feet, which depend on layout and size together.
    const units = cfg.layout ? cfg.layout.feet[layout][size] : cfg.size.options[size].area;
    const base = units * (cfg.scope ? cfg.scope.options[scope].mult : 1) * cfg.tier.options[tier].rate;
    setResult({ low: base * 0.9, high: base * 1.15, base });
  };

  const questions = [
    cfg.layout && [cfg.layout, layout, setLayout],
    [cfg.size, size, setSize],
    cfg.scope && [cfg.scope, scope, setScope],
    [cfg.tier, tier, setTier],
  ].filter(Boolean);
  const count = ["zero", "one", "two", "three", "four", "five"][questions.length];

  return (
    <section className="hg-section hg-calc" id="calculate-cost">
      <div className="hg-shell">
        <div className="hg-heading">
          <span className="hg-eyebrow">New — instant estimate</span>
          <h2 className="hg-h2">What would your {cfg.subject} cost?</h2>
          <p className="hg-lede">Answer {count} quick questions for a real starting range — no obligation, no site visit needed yet.</p>
        </div>

        <div className="hg-calc__card">
          <div className="hg-calc__form">
            <h3>{cfg.formTitle}</h3>
            <p className="hg-calc__hint">Takes less than 30 seconds</p>

            {questions.map(([q, value, set], n) => (
              <div className="hg-field hg-calc__q" key={q.label} role="radiogroup" aria-label={q.label}>
                <label><span className="hg-calc__step">{n + 1}</span>{q.label}</label>
                <div className="hg-calc__seg">
                  {q.options.map((o, i) => {
                    const [title, sub] = splitLabel(o.label);
                    return (
                      <button key={o.label} type="button" role="radio" aria-checked={i === value} className={i === value ? "is-on" : ""} onClick={() => set(i)}>
                        <span className="hg-calc__optTitle">{title}</span>
                        {sub && <span className="hg-calc__optSub">{sub}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button className="hg-btn hg-calc__go" onClick={calculate}>Calculate my estimate</button>
          </div>

          <div className="hg-calc__result">
            {!result ? (
              <div className="hg-calc__empty">
                <svg className="hg-calc__icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M6 23 24 8l18 15M11 20v20h26V20M20 40V28h8v12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p>Your estimated range will appear here once you calculate.</p>
              </div>
            ) : !isSignedIn ? (
              <div className="hg-calc__lock hg-calc__lock--full">
                <svg className="hg-calc__icon" viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="21" width="28" height="19" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M16 21v-5a8 8 0 0 1 16 0v5M24 28v6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
                <p>Your estimate is ready. Sign in with your phone number to view the cost — no numbers are shown until then.</p>
                <button className="hg-btn hg-calc__signin" onClick={() => openModal("signin", result.lead)}>Please Sign in to view Cost</button>
              </div>
            ) : (
              <>
                <span className="hg-eyebrow">Your estimated range</span>
                <p className="hg-calc__range">{fmtLakh(result.low)} – {fmtLakh(result.high)}</p>
                <p className="hg-calc__sub">Standard Kolkata market rates · final quote after a free site visit</p>

                <div className="hg-calc__breakdown">
                  <dl>
                    {cfg.breakdown.map((b) => (
                      <div className="hg-calc__row" key={b.label}>
                        <dt>{b.label}</dt>
                        <dd>{fmtLakh(result.base * b.share)}</dd>
                      </div>
                    ))}
                  </dl>
                  <a
                    className="hg-calc__wa"
                    href={`https://wa.me/919831687191?text=${encodeURIComponent("Hi Home Geniee, I got an estimate of " + fmtLakh(result.low) + " – " + fmtLakh(result.high) + " for my " + cfg.subject + " — I'd like to talk next steps.")}`}
                    target="_blank" rel="noreferrer noopener"
                  >
                    Continue on WhatsApp →
                  </a>
                  <p className="hg-calc__note">Our design team will call you within 2 hours.</p>
                </div>
              </>
            )}
          </div>
        </div>
        <p className="hg-calc__caveat">Rates shown are illustrative placeholders — to be replaced with Home Geniee's actual pricing.</p>
      </div>
    </section>
  );
}
