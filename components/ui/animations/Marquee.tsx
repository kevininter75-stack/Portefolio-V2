"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Bandeau défilant en boucle, qui RÉAGIT AU SCROLL : plus on défile vite, plus
 * il accélère et s'incline, puis il revient à son rythme de croisière. Le sens
 * s'inverse même selon la direction du scroll — un détail très « agence ».
 *
 * Le contenu est dupliqué pour une boucle sans couture. En reduced-motion, le
 * bandeau reste immobile et simplement lisible.
 */
export default function Marquee({
  children,
  duration = 28,
  reverse = false,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const trackEl = track.current;
    const wrapEl = wrapper.current;
    if (reduced || !trackEl || !wrapEl) return;

    // Le rail contient 2 copies : le décaler de 50 % boucle sans couture.
    const tl = gsap.timeline({ repeat: -1 }).fromTo(
      trackEl,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration, ease: "none" }
    );

    const setSkew = gsap.quickTo(trackEl, "skewX", { duration: 0.4, ease: "power3.out" });

    const st = ScrollTrigger.create({
      trigger: wrapEl,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        // Accélère proportionnellement à la vitesse, plafonné pour rester lisible.
        const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 900);
        gsap.to(tl, { timeScale: boost, duration: 0.35, overwrite: true });
        setSkew(gsap.utils.clamp(-10, 10, v / 220));
      },
      // Hors écran, le bandeau ne consomme rien.
      onLeave: () => tl.pause(),
      onLeaveBack: () => tl.pause(),
      onEnter: () => tl.play(),
      onEnterBack: () => tl.play(),
    });

    return () => {
      st.kill();
      tl.kill();
      gsap.killTweensOf(trackEl);
    };
  }, [reduced, duration, reverse]);

  return (
    <div ref={wrapper} className="overflow-hidden" aria-hidden="true">
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
