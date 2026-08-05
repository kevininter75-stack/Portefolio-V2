"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useFinePointer } from "@/lib/useFinePointer";

/**
 * Curseur décoratif du portfolio :
 *  - un halo lumineux menthe qui suit avec inertie — effet projecteur sur fond sombre ;
 *  - un point précis en mode « difference » qui, au survol des éléments interactifs
 *    (liens, boutons, [data-cursor]), s'agrandit en cercle et inverse ce qu'il recouvre.
 * Purement décoratif : le curseur natif reste affiché. Desktop uniquement.
 */
export default function Cursor() {
  const halo = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled || !halo.current || !dot.current) return;

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.09, ease: "power2.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.09, ease: "power2.out" });
    const haloX = gsap.quickTo(halo.current, "x", { duration: 0.6, ease: "power3.out" });
    const haloY = gsap.quickTo(halo.current, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      haloX(e.clientX);
      haloY(e.clientY);
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest("a, button, [data-cursor]");

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target) && dot.current && halo.current) {
        gsap.to(dot.current, {
          scale: 5,
          backgroundColor: "#e8edf5",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(halo.current, { scale: 1.4, opacity: 0.6, duration: 0.4 });
      }
    };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target) && dot.current && halo.current) {
        gsap.to(dot.current, {
          scale: 1,
          backgroundColor: "#4fe3c1",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(halo.current, { scale: 1, opacity: 1, duration: 0.4 });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      {/* Halo projecteur, fondu en mode écran pour éclairer le fond sombre */}
      <div
        ref={halo}
        className="absolute -ml-24 -mt-24 h-48 w-48 rounded-full mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(79,227,193,0.14) 0%, transparent 65%)",
        }}
      />
      {/* Point précis : s'agrandit et inverse les couleurs sur les éléments cliquables */}
      <div
        ref={dot}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-menthe mix-blend-difference"
      />
    </div>
  );
}
