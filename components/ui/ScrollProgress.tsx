"use client";

import { useEffect, useRef } from "react";

/**
 * Fine barre de progression de lecture en haut de page (dégradé menthe→corail).
 * Pur scroll natif + rAF, aucune dépendance. Masquée si reduced-motion via CSS global.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = bar.current;
      if (!el) return;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
      <div
        ref={bar}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-menthe to-corail"
      />
    </div>
  );
}
