import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { serviceProjects } from "../data/projects";

// three.js is ~600 KB — only fetched when this section actually renders.
const Kitchen3D = lazy(() => import("./Kitchen3D"));

const LAYOUTS = [
  {
    id: "u",
    title: "U-Shape Kitchen",
    tag: "3 walls · max storage",
    // Plan glyph: cabinet runs drawn as thick strokes inside the room outline.
    plan: "M8 40V8h32v32",
    scope: "U-shaped kitchen",
    calcIndex: 2, // index in the calculator's "Kitchen layout" options
    // Reference colours per area, shown on the "As shown" swatch.
    shown: { base: "#93a6ba", wall: "#f4f4f2", counter: "#f3f2ef", splash: "#eeedea" },
    body: "Cabinets on three walls give the most counter space and storage, with the cook standing at the centre of everything.",
    best: ["Larger kitchens (8 ft wide and up)", "Families who cook every day", "Maximum storage"],
  },
  {
    id: "l",
    title: "L-Shape Kitchen",
    tag: "2 walls · open corner",
    plan: "M8 40V8h32",
    scope: "L-shaped kitchen",
    calcIndex: 1,
    shown: { base: "#8b8a86", wall: "#8b8a86", counter: "#cfcdc8", splash: "#e3d6c6" },
    body: "Two walls meeting at a corner — an efficient work triangle that leaves the rest of the room open for a table or movement.",
    best: ["Medium kitchens and open plans", "Corner rooms", "A good balance of space and storage"],
  },
  {
    id: "straight",
    title: "Straight Kitchen",
    tag: "1 wall · compact",
    plan: "M8 8h32",
    scope: "Straight kitchen",
    calcIndex: 0,
    shown: { base: "#5a5754", wall: "#a77a52", counter: "#d9d5cf", splash: "#c2bcb5" },
    body: "Everything on a single wall — hob, sink and storage in one line. Compact, quick to install and the easiest on the budget.",
    best: ["Compact flats and studios", "Narrow or galley rooms", "Lowest cost per running foot"],
  },
];

const SHOTS = [
  { id: "overview", label: "Overview" },
  { id: "front", label: "Front" },
  { id: "detail", label: "Close-up" },
];

// Areas a visitor can recolour, each with finishes that suit it.
const AREAS = [
  {
    id: "base", label: "Base cabinets",
    options: [
      { label: "Graphite", color: "#5f6b73" }, { label: "Teal", color: "#2f8a83" },
      { label: "Olive", color: "#a39a55" }, { label: "Powder blue", color: "#6f97b8" },
      { label: "Blush", color: "#c58d8d" }, { label: "Ivory", color: "#e9e3d6" },
      { label: "Navy", color: "#2c3e5c" }, { label: "Walnut brown", color: "#7a5236" },
    ],
  },
  {
    id: "wall", label: "Wall cabinets",
    options: [
      { label: "Frost white", color: "#f2f1ee" }, { label: "Ivory", color: "#e9e3d6" },
      { label: "Light oak", color: "#d2b48a" }, { label: "Walnut", color: "#8f6544" },
      { label: "Graphite", color: "#5f6b73" }, { label: "Sage", color: "#a9b7a0" },
      { label: "Powder blue", color: "#a9c1d6" }, { label: "Black", color: "#26272a" },
    ],
  },
  {
    id: "counter", label: "Countertop",
    options: [
      { label: "White quartz", color: "#f1f0ec" }, { label: "Grey stone", color: "#a19f9a" },
      { label: "Beige granite", color: "#d6c7ae" }, { label: "Black granite", color: "#2b2b2d" },
      { label: "Butcher block", color: "#b98a5a" },
    ],
  },
  {
    id: "splash", label: "Backsplash",
    options: [
      { label: "White", color: "#f2f1ee" }, { label: "Warm grey", color: "#b3aea7" },
      { label: "Sage", color: "#b7c4ae" }, { label: "Terracotta", color: "#c98763" },
      { label: "Navy", color: "#34486a" }, { label: "Charcoal", color: "#4a4a4c" },
    ],
  },
];

/**
 * Modular Kitchen sub-module: pick U / L / Straight and the demo panel below
 * switches to that layout — an interactive 3D model (with shutter colours)
 * and the real kitchens Home Geniee has designed in that layout.
 */
export default function KitchenLayouts() {
  const [active, setActive] = useState("u");
  const [view, setView] = useState("3d");
  const [shot, setShot] = useState("overview");
  // Chosen colour per area; a missing key means "as shown".
  const [colors, setColors] = useState({});
  const [area, setArea] = useState("base");
  const layout = LAYOUTS.find((l) => l.id === active);
  const areaDef = AREAS.find((a) => a.id === area);
  const setColor = (id, color) => setColors((c) => {
    const next = { ...c };
    if (color) next[id] = color; else delete next[id];
    return next;
  });
  const pick = (id) => { setActive(id); setColors({}); setShot("overview"); };
  const photos = serviceProjects
    .filter((p) => p.scope === layout.scope)
    .flatMap((p) => (p.gallery ?? [p.image]).map((src) => ({ src, p })))
    // Never show the same file twice.
    .filter((x, i, all) => all.findIndex((y) => y.src === x.src) === i);

  return (
    <section className="hg-section hg-klay" id="kitchen-layouts" aria-labelledby="hg-klay-title">
      <div className="hg-shell">
        <div className="hg-heading">
          <span className="hg-eyebrow">Choose your layout</span>
          <h2 className="hg-h2" id="hg-klay-title">Which kitchen shape suits your home?</h2>
          <p className="hg-lede">Tap a layout to see it in 3D and in kitchens we have designed.</p>
        </div>

        <div className="hg-klay__picker" role="tablist" aria-label="Kitchen layout">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={l.id === active}
              aria-controls="hg-klay-demo"
              className={`hg-klay__opt hg-klay__opt--${l.id}${l.id === active ? " is-on" : ""}`}
              onClick={() => pick(l.id)}
            >
              <svg className="hg-klay__plan" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="4" y="4" width="40" height="40" rx="3" className="hg-klay__planRoom" />
                <path d={l.plan} className="hg-klay__planRun" />
              </svg>
              <span className="hg-klay__optText">
                <span className="hg-klay__optTitle">{l.title}</span>
                <span className="hg-klay__optTag">{l.tag}</span>
              </span>
              <span className="hg-klay__optCheck" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="hg-klay__demo" id="hg-klay-demo" role="tabpanel">
          <div className="hg-klay__stage">
            <div className="hg-klay__views" role="group" aria-label="Demo view">
              <button type="button" className={view === "3d" ? "is-on" : ""} aria-pressed={view === "3d"} onClick={() => setView("3d")}>3D model</button>
              <button type="button" className={view === "photos" ? "is-on" : ""} aria-pressed={view === "photos"} onClick={() => setView("photos")}>Photos ({photos.length})</button>
            </div>

            {view === "3d" ? (
              <>
                <Suspense fallback={<div className="hg-k3d hg-k3d--loading">Loading 3D model…</div>}>
                  <Kitchen3D layout={active} colors={colors} shot={shot} />
                </Suspense>
                <div className="hg-klay__shots" role="group" aria-label="Camera">
                  {SHOTS.map((s) => (
                    <button key={s.id} type="button" className={shot === s.id ? "is-on" : ""} aria-pressed={shot === s.id} onClick={() => setShot(s.id)}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <p className="hg-klay__hint hg-mono">Drag to rotate · click, then scroll or pinch to zoom</p>
              </>
            ) : (
              <div className="hg-klay__photos">
                {photos.map(({ src, p }) => (
                  <Link key={src} to={`/projects/${p.slug}`} className="hg-klay__photo" aria-label={`View ${p.title}`}>
                    <img src={src} alt={p.title} loading="lazy" decoding="async" />
                    <span>{p.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="hg-klay__info">
            <h3 className="hg-klay__name">{layout.title}</h3>
            <p className="hg-klay__body">{layout.body}</p>
            <p className="hg-sheet">Best for</p>
            <ul className="hg-klay__best">
              {layout.best.map((b) => <li key={b}>{b}</li>)}
            </ul>

            {view === "3d" && (
              <>
                <p className="hg-sheet">Customise colours</p>
                <div className="hg-klay__areas" role="tablist" aria-label="Area to recolour">
                  {AREAS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      role="tab"
                      aria-selected={area === a.id}
                      className={`hg-klay__area${area === a.id ? " is-on" : ""}`}
                      onClick={() => setArea(a.id)}
                    >
                      <span className="hg-klay__areaDot" style={{ "--sw": colors[a.id] ?? layout.shown[a.id] }} aria-hidden="true" />
                      {a.label}
                    </button>
                  ))}
                </div>
                <div className="hg-klay__swatches" role="group" aria-label={`${areaDef.label} colour`}>
                  {[{ label: "As shown", color: null }, ...areaDef.options].map((f) => {
                    const on = (colors[area] ?? null) === f.color;
                    return (
                      <button
                        key={f.label}
                        type="button"
                        className={`hg-klay__swatch${on ? " is-on" : ""}${f.color ? "" : " hg-klay__swatch--orig"}`}
                        style={{ "--sw": f.color ?? layout.shown[area] }}
                        aria-label={`${areaDef.label}: ${f.label}`}
                        aria-pressed={on}
                        title={f.label}
                        onClick={() => setColor(area, f.color)}
                      />
                    );
                  })}
                </div>
                <p className="hg-klay__swatchName">
                  {areaDef.label}: <strong>{areaDef.options.find((o) => o.color === colors[area])?.label ?? "As shown"}</strong>
                  {Object.keys(colors).length > 0 && (
                    <button type="button" className="hg-klay__reset" onClick={() => setColors({})}>Reset all</button>
                  )}
                </p>
              </>
            )}

            <a
              href="#calculate-cost"
              className="hg-btn hg-klay__cta"
              onClick={() => window.dispatchEvent(new CustomEvent("hg:calc-preset", { detail: { layout: layout.calcIndex } }))}
            >
              Get estimate for this layout ↓
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
