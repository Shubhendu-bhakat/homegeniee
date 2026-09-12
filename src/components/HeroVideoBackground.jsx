import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Real footage now, not photos — interior walkthroughs, compressed from the
 * client's own source files via scripts/optimize-videos.mjs (one-time, not
 * part of the build). One persistent <video> element throughout — swapping
 * `key`/remounting between clips left a gap where nothing was buffered yet,
 * which read as the hero going blank; now we just re-point the same element
 * and explicitly load()+play() the next clip. A single-clip page (e.g. the
 * Interior Design header) loops natively instead of round-tripping through
 * React state at all.
 */
const defaultClips = [
  { src: "/videos/hero-3.mp4", poster: "/videos/hero-3-poster.jpg" },
  { src: "/videos/hero-1.mp4", poster: "/videos/hero-1-poster.jpg" },
];

export default function HeroVideoBackground({ clips = defaultClips }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const videoRef = useRef(null);
  const loadedSrc = useRef(null);
  const clip = clips[i % clips.length];
  const single = clips.length <= 1;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduce) return;
    // Only reload when actually switching clips — the browser's own
    // `autoplay` already loads and plays the first one, and calling
    // load() again right on mount interrupts that and leaves it paused.
    if (loadedSrc.current !== null && loadedSrc.current !== clip.src) v.load();
    loadedSrc.current = clip.src;
    v.play().catch(() => {});
  }, [clip.src, reduce]);

  return (
    <div className="hg-hero__slider">
      <video
        ref={videoRef}
        className="hg-hero__slide hg-hero__video"
        autoPlay={!reduce}
        loop={single}
        muted
        playsInline
        preload="auto"
        poster={clip.poster}
        onEnded={single ? undefined : () => setI((n) => (n + 1) % clips.length)}
      >
        <source src={clip.src} type="video/mp4" />
      </video>

      {clips.length > 1 && (
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
      )}
    </div>
  );
}
