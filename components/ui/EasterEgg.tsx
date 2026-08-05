"use client";

import { useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Easter egg « tournée du barman » : un cocktail discret dans le footer.
 * Au clic : le shaker secoue l'écran, des gouttes menthe/corail giclent,
 * puis un toast « Santé ! » — clin d'œil au parcours bar manager.
 */
export default function EasterEgg() {
  const overlay = useRef<HTMLDivElement>(null);
  const shaker = useRef<HTMLDivElement>(null);
  const toast = useRef<HTMLParagraphElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  function shake() {
    if (playing || !overlay.current || !shaker.current || !toast.current) return;
    if (reduced) return; // pas d'animation forcée si reduced-motion
    setPlaying(true);

    const drops = Array.from(
      overlay.current.querySelectorAll<HTMLElement>("[data-drop]")
    );
    const tl = gsap.timeline({
      onComplete: () => setPlaying(false),
    });

    tl.set(overlay.current, { autoAlpha: 1 })
      .set(toast.current, { autoAlpha: 0, y: 20 })
      .set(drops, { x: 0, y: 0, autoAlpha: 0, scale: 1 })
      // Le shaker arrive et se secoue comme au bar
      .fromTo(
        shaker.current,
        { scale: 0, rotation: 0 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" }
      )
      .to(shaker.current, {
        keyframes: [
          { rotation: -22, x: -14, duration: 0.07 },
          { rotation: 22, x: 14, duration: 0.07 },
          { rotation: -18, x: -11, duration: 0.07 },
          { rotation: 18, x: 11, duration: 0.07 },
          { rotation: -22, x: -14, duration: 0.07 },
          { rotation: 22, x: 14, duration: 0.07 },
          { rotation: -12, x: -7, duration: 0.07 },
          { rotation: 12, x: 7, duration: 0.07 },
          { rotation: 0, x: 0, duration: 0.09 },
        ],
      })
      // Les gouttes giclent dans toutes les directions
      .to(
        drops,
        {
          autoAlpha: 1,
          duration: 0.05,
          x: () => gsap.utils.random(-190, 190),
          y: () => gsap.utils.random(-170, 110),
          stagger: 0.015,
        },
        "-=0.25"
      )
      .to(drops, { autoAlpha: 0, scale: 0.2, y: "+=70", duration: 0.7, ease: "power2.in" }, "<0.15")
      // Le toast
      .to(toast.current, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.5")
      .to(shaker.current, { y: -6, yoyo: true, repeat: 3, duration: 0.18, ease: "sine.inOut" }, "<")
      // Tout disparaît
      .to(overlay.current, { autoAlpha: 0, duration: 0.5, delay: 1.6 });
  }

  return (
    <>
      <button
        type="button"
        onClick={shake}
        aria-label="Easter egg : la tournée du barman"
        title="Psst… le barman offre une tournée"
        className="text-lg opacity-40 transition-all hover:scale-125 hover:opacity-100"
      >
        🍹
      </button>

      {/* Overlay de l'animation, invisible tant qu'on n'a pas cliqué */}
      <div
        ref={overlay}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-nuit/80 opacity-0 backdrop-blur-sm"
      >
        <div className="relative flex flex-col items-center gap-6">
          <div ref={shaker} className="text-8xl">
            🍸
          </div>
          {/* Gouttes projetées par le shaker */}
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              data-drop
              className={`absolute left-1/2 top-10 h-2.5 w-2.5 rounded-full opacity-0 ${
                i % 2 === 0 ? "bg-menthe" : "bg-corail"
              }`}
            />
          ))}
          <p ref={toast} className="font-display text-2xl font-bold text-brume opacity-0">
            Santé ! <span className="text-menthe">Tournée offerte par le barman.</span>
          </p>
        </div>
      </div>
    </>
  );
}
