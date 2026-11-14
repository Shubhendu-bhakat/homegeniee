import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WALL_CATS, getFinish, finishesIn } from "../data/wallFinishes";

// three.js is ~600 KB, so it is only fetched when this section renders.
const Wall3D = lazy(() => import("./Wall3D"));

const SHOTS = [
  { id: "overview", label: "Overview" },
  { id: "front", label: "Front" },
  { id: "detail", label: "Close-up" },
];
const TARGETS = [
  { id: "feature", label: "Feature wall" },
  { id: "all", label: "All 3 walls" },
];

/**
 * Wall Decor sub-module, same shape as the Modular Kitchen layout picker:
 * pick a category (paint, wallpaper, panels), then a finish inside it and a
 * colour, and watch the three-wall 3D room change. Deep links such as #3d or
 * #louver open that finish directly.
 */
export default function WallTreatments() {
  const { hash } = useLocation();
  const fromHash = getFinish(hash.slice(1));
  const [cat, setCat] = useState(fromHash?.cat ?? "paint");
  // Chosen finish per category, so switching tabs remembers each one.
  const [chosen, setChosen] = useState(() => ({
    paint: "wall-paint", wallpaper: "wallpaper-normal", panel: "pop",
    ...(fromHash ? { [fromHash.cat]: fromHash.id } : {}),
  }));
  const [colorIdx, setColorIdx] = useState({}); // per finish id
  const [target, setTarget] = useState("feature");
  const [shot, setShot] = useState("overview");

  useEffect(() => {
    if (!fromHash) return;
    setCat(fromHash.cat);
    setChosen((c) => ({ ...c, [fromHash.cat]: fromHash.id }));
  }, [fromHash]);

  const catDef = WALL_CATS.find((c) => c.id === cat);
  const finishes = finishesIn(cat);
  const finish = getFinish(chosen[cat]);
  const idx = colorIdx[finish.id] ?? 0;
  const option = finish.options[idx];

  return (
    <section className="hg-section hg-klay hg-wall" id="wall-finishes" aria-labelledby="hg-wall-title">
      <div className="hg-shell">
        <div className="hg-heading">
          <span className="hg-eyebrow">Choose your finish</span>
          <h2 className="hg-h2" id="hg-wall-title">Which wall finish suits your home?</h2>
          <p className="hg-lede">Pick a category, then try every finish and colour on the 3D room.</p>
        </div>

        <div className="hg-klay__picker" role="tablist" aria-label="Wall category">
          {WALL_CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={c.id === cat}
              aria-controls="hg-wall-demo"
              className={`hg-klay__opt${c.id === cat ? " is-on" : ""}`}
              onClick={() => setCat(c.id)}
            >
              <svg className="hg-klay__plan" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="4" y="4" width="40" height="40" rx="3" className="hg-klay__planRoom" />
                <path d={c.plan} className="hg-klay__planRun" />
              </svg>
              <span className="hg-klay__optText">
                <span className="hg-klay__optTitle">{c.title}</span>
                <span className="hg-klay__optTag">{c.tag}</span>
              </span>
              <span className="hg-klay__optCheck" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="hg-klay__demo" id="hg-wall-demo" role="tabpanel">
          <div className="hg-klay__stage">
            <div className="hg-klay__views hg-wall__target" role="group" aria-label="Apply finish to">
              {TARGETS.map((t) => (
                <button key={t.id} type="button" className={target === t.id ? "is-on" : ""} aria-pressed={target === t.id} onClick={() => setTarget(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <Suspense fallback={<div className="hg-k3d hg-k3d--loading">Loading 3D model…</div>}>
              <Wall3D finish={finish.id} color={option.color} target={target} shot={shot} />
            </Suspense>
            <div className="hg-klay__shots" role="group" aria-label="Camera">
              {SHOTS.map((s) => (
                <button key={s.id} type="button" className={shot === s.id ? "is-on" : ""} aria-pressed={shot === s.id} onClick={() => setShot(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="hg-klay__hint hg-mono">Drag to rotate · click, then scroll or pinch to zoom</p>
          </div>

          <aside className="hg-klay__info">
            <h3 className="hg-klay__name">{finish.label}</h3>
            <p className="hg-klay__body">{finish.body}</p>

            <p className="hg-sheet">{catDef.title} finishes</p>
            <div className="hg-klay__areas hg-wall__finishes" role="tablist" aria-label={`${catDef.title} finish`}>
              {finishes.map((f) => (
                <button
                  key={f.id}
                  id={f.id}
                  type="button"
                  role="tab"
                  aria-selected={f.id === finish.id}
                  className={`hg-klay__area${f.id === finish.id ? " is-on" : ""}`}
                  onClick={() => setChosen((c) => ({ ...c, [cat]: f.id }))}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <p className="hg-sheet">{finish.colorLabel}</p>
            <div className="hg-klay__swatches" role="group" aria-label={finish.colorLabel}>
              {finish.options.map((o, i) => (
                <button
                  key={o.label}
                  type="button"
                  className={`hg-klay__swatch${i === idx ? " is-on" : ""}`}
                  style={{ "--sw": o.color }}
                  aria-label={`${finish.colorLabel}: ${o.label}`}
                  aria-pressed={i === idx}
                  title={o.label}
                  onClick={() => setColorIdx((m) => ({ ...m, [finish.id]: i }))}
                />
              ))}
            </div>
            <p className="hg-klay__swatchName">
              {finish.colorLabel}: <strong>{option.label}</strong>
            </p>

            <p className="hg-sheet">Best for</p>
            <ul className="hg-klay__best">
              {finish.best.map((b) => <li key={b}>{b}</li>)}
            </ul>

            <a
              href="#calculate-cost"
              className="hg-btn hg-klay__cta"
              onClick={() => window.dispatchEvent(new CustomEvent("hg:calc-preset", { detail: { tier: catDef.calcTier } }))}
            >
              Get estimate for this finish ↓
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
