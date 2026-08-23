import { useEffect, useState } from "react";

/**
 * True on a mouse-driven laptop/desktop, false on a touch device. A `tel:`
 * link is dead weight on the former — there's no dialer — so "Call now"
 * CTAs use this to route to WhatsApp instead on desktop.
 */
export default function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setDesktop(mq.matches);
    const onChange = (e) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return desktop;
}
