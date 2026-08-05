"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useFinePointer } from "@/lib/useFinePointer";

/**
 * Curseur décoratif du portfolio :
 *  - un halo lumineux menthe qui suit avec inertie — effet projecteur ;
 *  - un point précis en mode « difference » qui s'agrandit sur les éléments
 *    interactifs (liens, boutons, [data-cursor]) et inverse ce qu'il recouvre ;
 *  - une pastille contextuelle : tout élément portant `data-cursor-label="…"`
 *    fait apparaître ce libellé dans le curseur (ex. « Voir le projet »).
 * Purement décoratif : le curseur natif reste affiché. Desktop uniquement.
 */
export default function Cursor() {
  const halo = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled || !halo.current || !dot.current || !label.current) return;
    const dotEl = dot.current;
    const haloEl = halo.current;
    const labelEl = label.current;

    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.09, ease: "power2.out" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.09, ease: "power2.out" });
    const haloX = gsap.quickTo(haloEl, "x", { duration: 0.6, ease: "power3.out" });
    const haloY = gsap.quickTo(haloEl, "y", { duration: 0.6, ease: "power3.out" });
    const labX = gsap.quickTo(labelEl, "x", { duration: 0.25, ease: "power3.out" });
    const labY = gsap.quickTo(labelEl, "y", { duration: 0.25, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      haloX(e.clientX);
      haloY(e.clientY);
      labX(e.clientX);
      labY(e.clientY);
    };

    const interactiveOf = (t: EventTarget | null) =>
      t instanceof Element ? t.closest("a, button, [data-cursor]") : null;
    const labelledOf = (t: EventTarget | null) =>
      t instanceof Element ? t.closest<HTMLElement>("[data-cursor-label]") : null;

    const onOver = (e: MouseEvent) => {
      const labelled = labelledOf(e.target);
      if (labelled) {
        // Pastille de texte : le point s'efface au profit du libellé.
        labelEl.textContent = labelled.dataset.cursorLabel ?? "";
        gsap.to(labelEl, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)" });
        gsap.to(dotEl, { scale: 0, duration: 0.25, ease: "power3.out" });
        gsap.to(haloEl, { scale: 1.6, opacity: 0.5, duration: 0.4 });
        return;
      }
      if (interactiveOf(e.target)) {
        gsap.to(dotEl, {
          scale: 5,
          backgroundColor: "#eaf0f8",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(haloEl, { scale: 1.4, opacity: 0.6, duration: 0.4 });
      }
    };

    const onOut = (e: MouseEvent) => {
      if (labelledOf(e.target)) {
        gsap.to(labelEl, { scale: 0.6, autoAlpha: 0, duration: 0.25, ease: "power3.out" });
        gsap.to(dotEl, { scale: 1, duration: 0.3, ease: "power3.out" });
        gsap.to(haloEl, { scale: 1, opacity: 1, duration: 0.4 });
        return;
      }
      if (interactiveOf(e.target)) {
        gsap.to(dotEl, {
          scale: 1,
          backgroundColor: "#4fe3c1",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(haloEl, { scale: 1, opacity: 1, duration: 0.4 });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      gsap.killTweensOf([dotEl, haloEl, labelEl]);
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
      {/* Point précis */}
      <div
        ref={dot}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-menthe mix-blend-difference"
      />
      {/* Pastille contextuelle (« Voir le projet »…) */}
      <div
        ref={label}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 scale-50 whitespace-nowrap rounded-full bg-menthe px-4 py-2 text-xs font-semibold uppercase tracking-wider text-nuit opacity-0"
      />
    </div>
  );
}
