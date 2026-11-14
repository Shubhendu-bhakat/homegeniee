import { useEffect, useState } from "react";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { estimators } from "../data/estimators";

/**
 * Adapted from the client's calculator prototype: three quick questions,
 * an instant range, then a gate — sign in to see the itemised breakdown.
 * The questions, options and rates come from data/estimators.js per vertical
 * (`service` slug). Rates are illustrative placeholders, same caveat the
 * prototype carried, until Home Geniee provides real pricing.
 */
const fmtLakh = (n) => (n >= 100000 ? `₹${(n / 100000).toFixed(2).replace(/\.00$/, "")}L` : `₹${Math.round(n).toLocaleString("en-IN")}`);

export default function CostCalculator({ service = "interior-design" }) {
  const cfg = estimators[service] ?? estimators["interior-design"];
  const { openModal } = useUI();
  const { isSignedIn } = useAuth();
  const [size, setSize] = useState(cfg.size.initial);
  const [scope, setScope] = useState(cfg.scope.initial);
  const [tier, setTier] = useState(cfg.tier.initial);
  const [result, setResult] = useState(null);

  // Other sections (e.g. the kitchen layout picker) can pre-select an option.
  useEffect(() => {
    const onPreset = (e) => {
      const i = e.detail?.size;
      if (Number.isInteger(i) && cfg.size.options[i]) setSize(i);
    };
    window.addEventListener("hg:calc-preset", onPreset);
    return () => window.removeEventListener("hg:calc-preset", onPreset);
  }, [cfg]);

  const calculate = () => {
    const base = cfg.size.options[size].area * cfg.scope.options[scope].mult * cfg.tier.options[tier].rate;
    setResult({ low: base * 0.9, high: base * 1.15, base });
  };

  const questions = [
    [cfg.size, size, setSize],
    [cfg.scope, scope, setScope],
    [cfg.tier, tier, setTier],
  ];

  return (
    <section className="hg-section hg-calc" id="calculate-cost">
      <div className="hg-shell">
        <div className="hg-heading">
          <span className="hg-eyebrow">New — instant estimate</span>
          <h2 className="hg-h2">What would your {cfg.subject} cost?</h2>
          <p className="hg-lede">Answer three quick questions for a real starting range — no obligation, no site visit needed yet.</p>
        </div>

        <div className="hg-calc__card">
          <div className="hg-calc__form">
            <h3>{cfg.formTitle}</h3>
            <p className="hg-calc__hint">Takes less than 30 seconds</p>

            {questions.map(([q, value, set]) => (
              <div className="hg-field" key={q.label}>
                <label>{q.label}</label>
                <div className="hg-calc__seg">
                  {q.options.map((o, i) => (
                    <button key={o.label} type="button" className={i === value ? "is-on" : ""} onClick={() => set(i)}>{o.label}</button>
                  ))}
                </div>
              </div>
            ))}

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
