"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsDesktop } from "@/lib/useIsDesktop";
import Reveal from "@/components/ui/animations/Reveal";
import SpotlightCard from "@/components/ui/animations/SpotlightCard";
import ElectricFrame from "@/components/ui/animations/ElectricFrame";
import { method } from "@/lib/data";

/**
 * Section « Ma méthode ».
 *
 * Desktop : la section se fige (pin) et les 3 étapes s'allument l'une après
 * l'autre au fil du scroll — la barre de progression suit. On pilote les cartes
 * directement via GSAP (pas d'état React) pour éviter de re-rendre à chaque
 * pixel de défilement.
 *
 * Mobile / reduced-motion : pas d'épinglage, les 3 cartes sont simplement
 * empilées et pleinement lisibles.
 */
export default function Method() {
  const section = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();

  useEffect(() => {
    const el = section.current;
    if (reduced || !desktop || !el) return;

    const items = cards.current.filter((c): c is HTMLDivElement => c !== null);
    if (items.length === 0) return;

    // État de départ : seule la première étape est mise en avant.
    // 0.45 et non 0.3 : l'étape inactive reste lisible si le visiteur défile vite.
    gsap.set(items, { opacity: 0.45, scale: 0.96 });
    gsap.set(items[0], { opacity: 1, scale: 1 });
    gsap.set(progress.current, { scaleX: 0 });

    let current = 0;
    const activate = (index: number) => {
      if (index === current) return;
      current = index;
      items.forEach((card, i) => {
        gsap.to(card, {
          opacity: i === index ? 1 : 0.45,
          scale: i === index ? 1 : 0.96,
          duration: 0.45,
          ease: "power2.out",
        });
      });
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      // 2 hauteurs d'écran de défilement pour parcourir les 3 étapes
      end: () => `+=${window.innerHeight * 2}`,
      pin: true,
      pinSpacing: true,
      // anticipatePin évite le sursaut d'une frame au moment où le pin s'accroche
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(progress.current, { scaleX: self.progress });
        activate(Math.min(items.length - 1, Math.floor(self.progress * items.length)));
      },
    });

    return () => {
      st.kill();
      gsap.killTweensOf(items);
      gsap.set(items, { clearProps: "opacity,scale" });
    };
  }, [reduced, desktop]);

  return (
    <section
      id="methode"
      ref={section}
      className="relative scroll-mt-24 py-28 md:flex md:min-h-svh md:items-center md:py-0"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal className="mb-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-menthe">
            Ma méthode
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight">
            L&apos;IA est un accélérateur, pas un pilote automatique.
          </h2>
        </Reveal>

        {/* Barre de progression des étapes (desktop uniquement) */}
        <div className="mb-10 hidden h-px w-full bg-ligne md:block">
          <div
            ref={progress}
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-menthe to-corail"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {method.map((step, i) => {
            const card = (
              <SpotlightCard className="h-full p-8">
                <span className="font-display text-4xl font-bold text-gradient">{step.number}</span>
                <h3 className="font-display mt-5 text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-brume-60">{step.text}</p>
              </SpotlightCard>
            );
            return (
              <div
                key={step.number}
                ref={(node) => {
                  cards.current[i] = node;
                }}
              >
                {/* Carte centrale soulignée par une bordure « électrique » Originkit */}
                {i === 1 ? <ElectricFrame>{card}</ElectricFrame> : card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
