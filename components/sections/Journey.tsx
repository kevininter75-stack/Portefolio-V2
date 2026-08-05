"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import Reveal from "@/components/ui/animations/Reveal";
import { journey, languages } from "@/lib/data";

/**
 * Section « Parcours » en storytelling vertical : une ligne de progression se remplit
 * au fil du scroll (scrubbée), et chaque étape apparaît à son entrée dans le viewport.
 */
export default function Journey() {
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const line = lineRef.current;
    if (reduced || !track || !line) return;

    gsap.set(line, { transformOrigin: "top", scaleY: 0 });
    const st = gsap.to(line, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: "top 60%",
        end: "bottom 80%",
        scrub: 0.6,
      },
    });

    return () => {
      st.scrollTrigger?.kill();
      st.kill();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  return (
    <section id="parcours" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 md:py-36">
      <Reveal className="mb-16 md:mb-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-menthe">
          À propos
        </p>
        <h2 className="font-display max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight">
          Un parcours qui ne ressemble à aucun autre — et c&apos;est une force.
        </h2>
      </Reveal>

      <div ref={trackRef} className="relative grid gap-14 md:pl-10">
        {/* Rail + ligne de progression (desktop) */}
        <div className="absolute left-0 top-2 hidden h-full w-px bg-ligne md:block" aria-hidden>
          <div ref={lineRef} className="h-full w-px bg-gradient-to-b from-menthe to-corail" />
        </div>

        {journey.map((step) => (
          <Reveal
            key={step.number}
            className="relative grid gap-4 md:grid-cols-[auto_1fr] md:gap-10"
          >
            {/* Puce sur le rail */}
            <div className="flex items-baseline gap-4 md:block">
              <span className="absolute -left-[46px] hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-menthe bg-nuit md:block" aria-hidden />
              <span className="font-display text-5xl font-bold text-surface-2 md:text-6xl">
                {step.number}
              </span>
            </div>
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-4 leading-relaxed text-brume-60">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Langues */}
      <Reveal className="mt-16 flex flex-wrap gap-3">
        {languages.map((lang) => (
          <span
            key={lang}
            className="rounded-full border border-ligne bg-surface px-4 py-2 text-sm text-brume/85"
          >
            {lang}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
