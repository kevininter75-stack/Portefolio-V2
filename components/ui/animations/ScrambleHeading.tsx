"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Titre à effet de déchiffrement (Originkit « Scramble Text »).
 *
 * Le composant Scramble (~55 Ko) est chargé en IMPORT DYNAMIQUE : il ne fait
 * pas partie du bundle initial. En attendant (ou si reduced-motion), on rend le
 * titre en texte simple — donc toujours présent pour le SEO et sans trou visuel.
 */
export default function ScrambleHeading({
  text,
  className,
  fontSize = "clamp(2rem,5vw,3.5rem)",
}: {
  text: string;
  className?: string;
  fontSize?: string;
}) {
  const reduced = useReducedMotion();
  const [Scramble, setScramble] = useState<ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    if (reduced) return;
    let mounted = true;
    import("./ScrambleText").then((mod) => {
      if (mounted) setScramble(() => mod.default as ComponentType<Record<string, unknown>>);
    });
    return () => {
      mounted = false;
    };
  }, [reduced]);

  // Base : titre en texte simple (SSR, reduced-motion, ou pendant le chargement du chunk).
  if (reduced || !Scramble) {
    return (
      <h2 className={className} style={{ fontSize }}>
        {text}
      </h2>
    );
  }

  return (
    <div className={className} role="heading" aria-level={2}>
      <Scramble
        words={text}
        tag="div"
        color="#eaf0f8"
        enterAnimation={{
          // « random » brouille toutes les lettres sans jamais les retirer du flux
          // (oneLine/multiLine les passent en display:none → hauteur du titre qui
          // s'effondre → défilement saccadé + ScrollTrigger désynchronisé).
          mode: "random",
          replay: false,
          position: "above",
          restState: "solid",
          scrambleIntensity: 55,
          ease: { type: "tween", duration: 1.3, ease: "easeOut" },
          flickerEnabled: false,
        }}
        hoverAnimation={{
          type: "diffusion",
          lines: "oneLine",
          radius: 2,
          glitchChars: "01",
          glitchShuffle: true,
        }}
        font={{
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 700,
          fontSize,
          lineHeight: "1.1",
          letterSpacing: "-0.01em",
          textAlign: "left",
        }}
      />
    </div>
  );
}
