import { useState } from "react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

/**
 * Adapted from the client's calculator prototype: three quick questions,
 * an instant range, then a gate — sign in to see the itemised breakdown.
 * Rates are illustrative placeholders, same caveat the prototype carried,
 * until Home Geniee provides real pricing.
 */
const BHK = [
  { label: "1 BHK", sqft: 600 },
  { label: "2 BHK", sqft: 900 },
  { label: "3 BHK", sqft: 1300 },
  { label: "4 BHK", sqft: 1800 },
];
const SCOPE = [
  { label: "Partial (2–3 rooms)", mult: 0.55 },
  { label: "Full home", mult: 1 },
];
const TIER = [
  { label: "Standard", rate: 950 },
  { label: "Premium", rate: 1400 },
  { label: "Luxury", rate: 2100 },
];
const BREAKDOWN = [
  { label: "Design & space planning", share: 0.28 },
  { label: "Furniture & furnishing", share: 0.34 },
  { label: "Ceiling, walls & finishes", share: 0.2 },
  { label: "Execution & project management", share: 0.18 },
];

const fmtLakh = (n) => (n >= 100000 ? `₹${(n / 100000).toFixed(2).replace(/\.00$/, "")}L` : `₹${Math.round(n).toLocaleString("en-IN")}`);

export default function CostCalculator() {
  const { openModal } = useUI();
  const { isSignedIn } = useAuth();
  const [bhk, setBhk] = useState(1);
  const [scope, setScope] = useState(1);
  const [tier, setTier] = useState(0);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const base = BHK[bhk].sqft * SCOPE[scope].mult * TIER[tier].rate;
    setResult({ low: base * 0.9, high: base * 1.15, base });
  };

  return (
    <section className="hg-section hg-calc" id="calculate-cost">
      <div className="hg-shell">
        <div className="hg-heading hg-heading--center">
          <span className="hg-eyebrow">New — instant estimate</span>
          <h2 className="hg-h2">What would your interior cost?</h2>
          <p className="hg-lede">Answer three quick questions for a real starting range — no obligation, no site visit needed yet.</p>
        </div>

        <div className="hg-calc__card">
          <div className="hg-calc__form">
            <h3>Tell us about your space</h3>
            <p className="hg-calc__hint">Takes less than 30 seconds</p>

            <div className="hg-field">
              <label>Flat / home size</label>
              <div className="hg-calc__seg">
                {BHK.map((b, i) => (
                  <button key={b.label} type="button" className={i === bhk ? "is-on" : ""} onClick={() => setBhk(i)}>{b.label}</button>
                ))}
              </div>
            </div>

            <div className="hg-field">
              <label>Scope of work</label>
              <div className="hg-calc__seg">
                {SCOPE.map((s, i) => (
                  <button key={s.label} type="button" className={i === scope ? "is-on" : ""} onClick={() => setScope(i)}>{s.label}</button>
                ))}
              </div>
            </div>

            <div className="hg-field">
              <label>Finish tier</label>
              <div className="hg-calc__seg">
                {TIER.map((t, i) => (
                  <button key={t.label} type="button" className={i === tier ? "is-on" : ""} onClick={() => setTier(i)}>{t.label}</button>
                ))}
              </div>
            </div>

            <button className="hg-btn hg-calc__go" onClick={calculate}>Calculate my estimate</button>
          </div>

          <div className="hg-calc__result">
            {!result ? (
              <div className="hg-calc__empty">
                <span aria-hidden="true">🏠</span>
                <p>Your estimated range will appear here once you calculate.</p>
              </div>
            ) : !isSignedIn ? (
              <div className="hg-calc__lock hg-calc__lock--full">
                <span aria-hidden="true">🔒</span>
                <p>Your estimate is ready. Sign in with your phone number to view the cost — no numbers are shown until then.</p>
                <button className="hg-btn hg-calc__signin" onClick={() => openModal("signin")}>Please Sign in to view Cost</button>
              </div>
            ) : (
              <>
                <span className="hg-eyebrow">Your estimated range</span>
                <p className="hg-calc__range">{fmtLakh(result.low)} – {fmtLakh(result.high)}</p>
                <p className="hg-calc__sub">Standard Kolkata market rates · final quote after a free site visit</p>

                <div className="hg-calc__breakdown">
                  <dl>
                    {BREAKDOWN.map((b) => (
                      <div className="hg-calc__row" key={b.label}>
                        <dt>{b.label}</dt>
                        <dd>{fmtLakh(result.base * b.share)}</dd>
                      </div>
                    ))}
                  </dl>
                  <a
                    className="hg-calc__wa"
                    href={`https://wa.me/919831687191?text=${encodeURIComponent("Hi Home Geniee, I got an estimate of " + fmtLakh(result.low) + " – " + fmtLakh(result.high) + " for my interior — I'd like to talk next steps.")}`}
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
