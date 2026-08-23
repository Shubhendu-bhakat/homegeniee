import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { journey } from "../data/site";
import SectionHeading from "../components/SectionHeading";
import { useUI } from "../context/UIContext";

/**
 * The five-step design journey, told as a room that decorates itself.
 *
 * The stage is a single SVG room pinned beside the step list. As the list
 * scrolls, the room walks the same five steps the copy describes: bare
 * blueprint -> paint -> louver panelling and the BOQ sheet -> furniture ->
 * lights on. Nothing leaves once it has landed, so the scroll reads as
 * accumulation, which is what a fit-out actually is.
 */

const W = 520;
const H = 380;
const WALL = { x: 62, y: 46, w: 396, h: 236 };
const FLOOR_Y = WALL.y + WALL.h; // 282

/* Where each build stage starts, on the same 0-1 track as the step list. */
const AT = { plan: -0.06, paint: 0.21, panel: 0.41, furnish: 0.6, live: 0.79 };

/**
 * One build stage. Fades and lifts in at `from`. `until` exists only for the
 * blueprint, the one layer that has to leave again once paint arrives.
 */
function Stage({ progress, from, until, lift = 16, reduce, children }) {
  const fadeIn = [from - 0.05, from + 0.05];
  const opacity = useTransform(
    progress,
    until == null ? fadeIn : [...fadeIn, until - 0.06, until],
    until == null ? [0, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, fadeIn, [lift, 0]);

  if (reduce) return until == null ? <g>{children}</g> : null;
  return <motion.g style={{ opacity, y }}>{children}</motion.g>;
}

/** Louver slats land one after another, left to right, like real panelling. */
function Slat({ i, count, progress, reduce }) {
  const start = AT.panel + (i / count) * 0.1;
  const opacity = useTransform(progress, [start, start + 0.03], [0, 1]);
  /* originY needs `transform-box: fill-box` (set in home.css) — without it the
     origin resolves against the viewBox, not the slat. */
  const scaleY = useTransform(progress, [start, start + 0.05], [0.2, 1]);

  return (
    <motion.rect
      x={WALL.x + 214 + i * 20}
      y={74}
      width={11}
      height={180}
      rx={3}
      fill="var(--sand-300)"
      style={reduce ? undefined : { opacity, scaleY, originY: 1 }}
    />
  );
}

function RoomStage({ progress, reduce }) {
  /* Paint climbs the wall rather than cross-fading, so it reads as a roller.
     Scaled from the bottom edge rather than animating the y/height attributes:
     motion treats `y` on an SVG element as a transform, not the attribute. */
  const paintScale = useTransform(progress, [AT.paint, AT.paint + 0.12], [0, 1]);
  /* The lamp does not switch on, it warms up. */
  const glow = useTransform(progress, [AT.live + 0.02, AT.live + 0.12], [0, 1]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A room being designed step by step">
      <defs>
        <linearGradient id="hg-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sand-300)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--sand-100)" />
        </linearGradient>
        <linearGradient id="hg-lamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hg-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6F1FC" />
          <stop offset="100%" stopColor="#F7FAFE" />
        </linearGradient>
      </defs>

      {/* --- shell: always present ----------------------------------- */}
      <rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.h} fill="var(--canvas)" />
      <rect x="30" y={FLOOR_Y} width={W - 60} height="62" fill="url(#hg-floor)" />
      <line x1="30" y1={FLOOR_Y} x2={W - 30} y2={FLOOR_Y} stroke="var(--edge-2)" strokeWidth="1.5" />

      {/* --- 01 blueprint -------------------------------------------- */}
      <Stage progress={progress} from={AT.plan} until={AT.paint + 0.09} reduce={reduce}>
        <g stroke="var(--accent)" strokeWidth="1" opacity="0.45">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line key={`v${i}`} x1={WALL.x + i * 49.5} y1={WALL.y} x2={WALL.x + i * 49.5} y2={FLOOR_Y} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`h${i}`} x1={WALL.x} y1={WALL.y + i * 59} x2={WALL.x + WALL.w} y2={WALL.y + i * 59} />
          ))}
        </g>
        <rect
          x={WALL.x}
          y={WALL.y}
          width={WALL.w}
          height={WALL.h}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="7 6"
        />
        <g stroke="var(--accent-soft)" strokeWidth="1.5">
          <line x1={WALL.x} y1="30" x2={WALL.x + WALL.w} y2="30" />
          <line x1={WALL.x} y1="24" x2={WALL.x} y2="36" />
          <line x1={WALL.x + WALL.w} y1="24" x2={WALL.x + WALL.w} y2="36" />
        </g>
        <text x={W / 2} y="22" textAnchor="middle" className="hg-journey__dim">3600 MM</text>
      </Stage>

      {/* --- 02 paint + palette -------------------------------------- */}
      <Stage progress={progress} from={AT.paint} lift={0} reduce={reduce}>
        <motion.rect
          x={WALL.x}
          y={WALL.y}
          width={WALL.w}
          height={WALL.h}
          fill="url(#hg-paint)"
          style={reduce ? undefined : { scaleY: paintScale, originY: 1 }}
        />
        <rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.h} fill="none" stroke="var(--edge)" />
        {["var(--accent-bright)", "var(--gold)", "var(--sand-300)"].map((c, i) => (
          <rect key={c} x={92 + i * 34} y={FLOOR_Y + 18} width={26} height={26} rx="5" fill={c} />
        ))}
      </Stage>

      {/* --- 03 louver panelling + the estimate ---------------------- */}
      <Stage progress={progress} from={AT.panel} reduce={reduce}>
        <rect x={WALL.x + 206} y="66" width="228" height="196" rx="6" fill="var(--sand-100)" stroke="var(--edge)" />
        {Array.from({ length: 10 }, (_, i) => (
          <Slat key={i} i={i} count={10} progress={progress} reduce={reduce} />
        ))}
        <rect x="96" y="92" width="96" height="118" rx="6" fill="var(--canvas)" stroke="var(--edge-2)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="110"
            y1={116 + i * 18}
            x2={i === 4 ? 150 : 178}
            y2={116 + i * 18}
            stroke="var(--edge-2)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        <text x="110" y="202" className="hg-journey__dim" fill="var(--accent-strong)">BOQ FIXED</text>
      </Stage>

      {/* --- 04 the furniture goes in -------------------------------- */}
      <Stage progress={progress} from={AT.furnish} lift={26} reduce={reduce}>
        <ellipse cx="250" cy={FLOOR_Y + 32} rx="150" ry="24" fill="var(--accent-bright)" opacity="0.18" />

        {/* sofa */}
        <rect x="96" y="216" width="132" height="24" rx="7" fill="var(--accent-bright)" />
        <rect x="96" y="188" width="132" height="30" rx="8" fill="var(--accent)" />
        <rect x="112" y="196" width="46" height="20" rx="5" fill="var(--gold)" opacity="0.85" />
        <rect x="100" y="240" width="8" height="14" rx="3" fill="var(--sand-300)" />
        <rect x="216" y="240" width="8" height="14" rx="3" fill="var(--sand-300)" />

        {/* counter run under the louvers */}
        <rect x="306" y="212" width="128" height="46" rx="5" fill="var(--canvas)" stroke="var(--edge-2)" />
        <rect x="302" y="206" width="136" height="8" rx="4" fill="var(--edge-2)" />
        <line x1="322" y1="234" x2="352" y2="234" stroke="var(--gold-deep)" strokeWidth="3" strokeLinecap="round" />
        <line x1="390" y1="234" x2="420" y2="234" stroke="var(--gold-deep)" strokeWidth="3" strokeLinecap="round" />

        {/* plant */}
        <path d="M262 214c-14-10-16-28-6-38 10 8 12 26 6 38z" fill="var(--accent-soft)" opacity="0.75" />
        <path d="M262 216c12-9 14-26 5-35-9 8-11 25-5 35z" fill="#4E8B5A" />
        <rect x="252" y="214" width="22" height="26" rx="4" fill="var(--sand-300)" />
      </Stage>

      {/* --- 05 lights on -------------------------------------------- */}
      <Stage progress={progress} from={AT.live} reduce={reduce}>
        <motion.path
          d={`M150 84 L108 ${FLOOR_Y} L192 ${FLOOR_Y} Z`}
          fill="url(#hg-lamp)"
          style={reduce ? undefined : { opacity: glow }}
        />
        <line x1="150" y1={WALL.y} x2="150" y2="72" stroke="var(--gold-deep)" strokeWidth="2" />
        <path d="M132 84h36l-8-14h-20z" fill="var(--gold-deep)" />
        <motion.circle cx="150" cy="88" r="6" fill="var(--gold)" style={reduce ? undefined : { opacity: glow }} />
        <rect x="330" y="96" width="54" height="66" rx="4" fill="var(--canvas)" stroke="var(--gold-deep)" strokeWidth="2" />
        <rect x="396" y="112" width="42" height="50" rx="4" fill="var(--canvas)" stroke="var(--gold-deep)" strokeWidth="2" />
      </Stage>
    </svg>
  );
}

export default function ProcessJourney() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { openModal } = useUI();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setActive(Math.min(journey.length - 1, Math.max(0, Math.floor(v * journey.length))))
  );

  return (
    <section className="hg-section hg-journey" aria-labelledby="hg-journey-title">
      <div className="hg-shell">
        <SectionHeading
          eyebrow="Modern Design Process"
          title={<span id="hg-journey-title">New home? Experience our seamless design journey</span>}
          lede="Discover the ease and elegance of Home Geniee's design magic. A smooth, joyful journey that transforms your space beautifully — all delivered within the promised timeline."
        />

        <div className="hg-journey__track" ref={ref}>
          <div className="hg-journey__stage">
            <div className="hg-journey__room">
              <RoomStage progress={scrollYProgress} reduce={reduce} />
              <p className="hg-journey__stageFoot hg-mono">
                <span>
                  Step {journey[active].step} · {journey[active].title}
                </span>
                <span className="hg-journey__ticks" aria-hidden="true">
                  {journey.map((s, i) => (
                    <i key={s.step} className={`hg-journey__tick${i <= active ? " is-on" : ""}`} />
                  ))}
                </span>
              </p>
            </div>
          </div>

          <ol className="hg-journey__list">
            {journey.map((item, i) => (
              <li key={item.step} className={`hg-journey__step${i === active ? " is-on" : ""}`}>
                <span className="hg-journey__index hg-mono" aria-hidden="true">{item.step}</span>
                <div className="hg-journey__body">
                  <h3 className="hg-journey__title">{item.title}</h3>
                  <p className="hg-journey__note">{item.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="hg-journey__cta">
          <button className="hg-btn" onClick={() => openModal("consultation")}>Book free consultation</button>
        </div>
      </div>
    </section>
  );
}
