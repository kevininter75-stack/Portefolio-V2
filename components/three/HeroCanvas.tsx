"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsDesktop } from "@/lib/useIsDesktop";

// Résultat mémoïsé : on ne teste qu'une seule fois par page pour ne pas
// créer (et fuiter) un contexte WebGL supplémentaire à chaque montage.
let webglSupport: boolean | null = null;

/** Vrai si le navigateur sait créer un contexte WebGL. Libère le contexte de test. */
function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && "getExtension" in gl) {
      // Rend le contexte de test au navigateur sans attendre le GC.
      (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    }
    webglSupport = !!gl;
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * Monte la scène 3D Three.js dans un conteneur plein cadre, uniquement si WebGL
 * est dispo ET que l'utilisateur n'a pas demandé à réduire les animations.
 * Sinon, le fond en dégradé du héros (parent) reste seul : zéro régression.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const [webgl, setWebgl] = useState(false);
  // Sur téléphone on ne monte pas la 3D du tout : le dégradé du héros suffit,
  // et on épargne batterie + CPU des appareils modestes.
  const ok = webgl && desktop;

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  useEffect(() => {
    if (reduced || !ok || !ref.current) return;
    const el = ref.current;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // On diffère l'init 3D après le premier affichage ET on charge Three.js en
    // import DYNAMIQUE : le gros bundle Three.js n'est donc plus dans le paquet
    // initial de la page — il n'est téléchargé/parsé qu'ici, une fois la page prête.
    const ric =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = ric(() => {
      import("./heroScene").then(({ createHeroScene }) => {
        if (!cancelled && ref.current) cleanup = createHeroScene(el);
      });
    });

    return () => {
      cancelled = true;
      cic(handle as number);
      cleanup?.();
    };
  }, [reduced, ok]);

  if (reduced || !ok) return null;

  return <div ref={ref} className="absolute inset-0 -z-10" aria-hidden="true" />;
}
