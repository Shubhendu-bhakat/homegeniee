import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, lede, align = "left", children }) {
  return (
    <header className={`hg-heading hg-heading--${align}`}>
      {eyebrow && (
        <Reveal delay={0.05}>
          <span className="hg-eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <h2 className="hg-h2">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.16}>
          <p className="hg-lede">{lede}</p>
        </Reveal>
      )}
      {children}
    </header>
  );
}
