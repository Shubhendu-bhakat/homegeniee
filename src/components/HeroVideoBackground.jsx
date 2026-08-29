import { useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Real footage now, not photos — three interior walkthroughs, compressed
 * from the client's own source files via scripts/optimize-videos.mjs
 * (one-time, not part of the build). Each clip plays through once, muted
 * and inline, then hands off to the next; `key` on the <video> forces a
 * clean remount per clip instead of juggling imperative play() calls.
 */
const clips = [
  { src: "/videos/hero-1.mp4", poster: "/videos/hero-1-poster.jpg" },
  { src: "/videos/hero-2.mp4", poster: "/videos/hero-2-poster.jpg" },
  { src: "/videos/hero-3.mp4", poster: "/videos/hero-3-poster.jpg" },
];

export default function HeroVideoBackground() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const clip = clips[i];

  return (
    <div className="hg-hero__slider">
      <video
        key={clip.src}
        className="hg-hero__slide hg-hero__video"
        autoPlay={!reduce}
        muted
        playsInline
        preload="metadata"
        poster={clip.poster}
        onEnded={() => setI((n) => (n + 1) % clips.length)}
      >
        <source src={clip.src} type="video/mp4" />
      </video>

      <div className="hg-hero__dots" role="tablist" aria-label="Featured interiors">
        {clips.map((c, n) => (
          <button
            key={c.src}
            role="tab"
            aria-selected={n === i}
            aria-label={`Clip ${n + 1}`}
            className={`hg-hero__dot ${n === i ? "is-on" : ""}`}
            onClick={() => setI(n)}
          />
        ))}
      </div>
    </div>
  );
}
