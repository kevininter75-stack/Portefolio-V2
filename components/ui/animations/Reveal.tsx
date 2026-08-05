"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Décalage vertical de départ, en px (défaut 40) */
  y?: number;
  /** Retard avant l'animation, en s */
  delay?: number;
  /** Balise HTML de l'enveloppe (défaut div) */
  as?: React.ElementType;
};

/**
 * Révèle son contenu (fondu + montée) quand il entre dans le viewport.
 * Progressive enhancement : si reduced-motion, le contenu est visible d'emblée.
 */
export default function Reveal({ children, className, y = 40, delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (reduced || !el) return;

    const anim = gsap.from(el, {
      y,
      autoAlpha: 0,
      duration: 0.9,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
      ScrollTrigger.refresh();
    };
  }, [reduced, y, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
