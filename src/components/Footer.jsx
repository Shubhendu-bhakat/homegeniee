import { Link } from "react-router-dom";
import { site, footerLinks } from "../data/site";
import Reveal from "./Reveal";
import LouverDivider from "./LouverDivider";

export default function Footer() {
  return (
    <footer className="hg-footer">
      <LouverDivider count={34} tone="rgba(255,255,255,.14)" />
      <div className="hg-shell hg-footer__grid">
        <Reveal className="hg-footer__brand">
          <Link to="/" aria-label={`${site.name} — home`}>
            <img src={site.logo} alt="" width="170" height="46" />
          </Link>
          <address className="hg-footer__address">
            {site.address.line1}
            <br />
            {site.address.line2}
          </address>
          <a href={`tel:${site.phonePrimary}`} className="hg-footer__tel hg-mono">
            {site.phonePrimaryLabel}
          </a>
        </Reveal>

        {Object.entries(footerLinks).map(([heading, links], i) => (
          <Reveal key={heading} delay={0.06 * (i + 1)} className="hg-footer__col">
            <h3 className="hg-footer__heading hg-mono">{heading}</h3>
            <ul>
              {links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hg-footer__link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={0.24} className="hg-footer__col">
          <h3 className="hg-footer__heading hg-mono">Subscribe us</h3>
          <ul>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="hg-footer__link" target="_blank" rel="noreferrer noopener">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="hg-shell hg-footer__base">
        <p className="hg-mono">
          <a href="http://homegeniee.com">Home Geniee</a> {new Date().getFullYear()} · All rights reserved
        </p>
        <p className="hg-mono hg-footer__since">Transforming spaces since {site.since} · Kolkata</p>
      </div>
    </footer>
  );
}
