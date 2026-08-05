"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useFinePointer } from "@/lib/useFinePointer";
import Magnetic from "@/components/ui/animations/Magnetic";
import Marquee from "@/components/ui/animations/Marquee";
import ShinyPill from "@/components/ui/animations/ShinyPill";
import HeroCanvas from "@/components/three/HeroCanvas";
import { marqueeWords, profile } from "@/lib/data";

/** Hero plein écran : scène 3D en fond, titre révélé ligne par ligne, CTA magnétiques. */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const el = root.current;
    if (reduced || !el) return;
    const title = el.querySelector("h1");
    if (!title) return;

    // Sur tactile : entrée légère, sans toucher à l'opacité du titre (élément LCP).
    if (!fine) {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(title, { y: 24, duration: 0.7, ease: "power3.out" }).from(
        el.querySelectorAll("[data-hero-fade]"),
        { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        "-=0.4"
      );
      return () => {
        tl.revert();
      };
    }

    const split = SplitText.create(title, { type: "lines", mask: "lines", autoSplit: true });
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(split.lines, {
      yPercent: 115,
      duration: 1.2,
      stagger: 0.12,
      ease: "power4.out",
    }).from(
      el.querySelectorAll("[data-hero-fade]"),
      { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" },
      "-=0.6"
    );
    return () => {
      tl.revert();
      split.revert();
    };
  }, [reduced, fine]);

  return (
    <section
      ref={root}
      className="halo grain relative flex min-h-svh flex-col justify-between overflow-hidden pt-24"
    >
      {/* Scène 3D (client-only, dégradée gracieusement si WebGL/reduced-motion absent) */}
      <HeroCanvas />

      <div className="mx-auto flex w-full max-w-6xl grow flex-col justify-center px-6">
        <div
          data-hero-fade
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-ligne bg-surface/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-menthe backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-menthe opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-menthe" />
          </span>
          <ShinyPill
            text={profile.location}
            textColor="#8a94a6"
            shineColor="#6effd8"
            speed={3.5}
            font={{ fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}
          />
        </div>

        <h1 className="font-display max-w-4xl text-[clamp(2.6rem,7vw,5.75rem)] font-bold leading-[1.02] tracking-tight">
          De l&apos;hôtellerie de luxe au{" "}
          <span className="text-gradient">développement web</span> assisté par{" "}
          <span className="text-corail">IA</span>.
        </h1>

        <p data-hero-fade className="mt-8 max-w-xl text-lg leading-relaxed text-brume-60">
          {profile.name} — {profile.role}. Je construis des produits complets, de l&apos;idée
          au déploiement, avec Claude Code comme copilote.
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href="#projets"
              className="inline-block rounded-full bg-menthe px-8 py-4 font-semibold text-nuit transition-colors hover:bg-menthe-vif"
            >
              Voir mes projets
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href="#contact"
              className="inline-block rounded-full border border-ligne bg-surface/40 px-8 py-4 font-semibold text-brume backdrop-blur transition-colors hover:border-menthe hover:text-menthe"
            >
              Me contacter
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Bandeau défilant en pied de hero */}
      <div data-hero-fade className="relative border-y border-ligne bg-surface/30 py-4 backdrop-blur">
        <Marquee duration={26}>
          {marqueeWords.map((word) => (
            <span key={word} className="flex items-center">
              <span className="font-display px-6 text-lg font-medium text-brume/80">{word}</span>
              <span aria-hidden className="text-menthe">
                ✶
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
