"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const SEEN_KEY = "portfolio-intro-vue";

/**
 * Écran d'intro : un compteur 000 → 100 pendant que la page se prépare, puis le
 * rideau se lève sur le héros.
 *
 * Garde-fous :
 *  - joué UNE SEULE FOIS par session (sessionStorage) — un visiteur qui revient
 *    ou navigue vers une page projet n'attend pas une deuxième fois ;
 *  - ignoré si l'utilisateur a demandé à réduire les animations ;
 *  - le contenu de la page est déjà dans le DOM derrière (aucun impact SEO),
 *    l'overlay est simplement retiré à la fin.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  // On décide au montage : rien n'est rendu au SSR pour éviter un flash.
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(SEEN_KEY) === "1";
    // Onglet ouvert en arrière-plan : requestAnimationFrame y est suspendu, donc
    // l'animation ne se jouerait pas et le visiteur retrouverait un écran figé.
    // Dans ce cas on saute l'intro purement et simplement.
    setShow(!reduced && !seen && !document.hidden);
  }, []);

  useEffect(() => {
    if (!show || !root.current) return;

    sessionStorage.setItem(SEEN_KEY, "1");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const finish = () => {
      document.body.style.overflow = "";
      setShow(false);
      window.dispatchEvent(new Event("intro:done"));
    };

    // Filet de sécurité : si l'animation ne peut pas se jouer (onglet masqué en
    // cours de route, rAF suspendu, GSAP en échec…), on lève le rideau quand même.
    // Sans ça, le site resterait bloqué derrière l'overlay, scroll verrouillé.
    const failsafe = window.setTimeout(finish, 4000);

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(failsafe);
        finish();
      },
    });

    // 1. Le compteur monte, la barre se remplit en parallèle
    tl.to(counter, {
      v: 100,
      duration: 1.25,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        }
      },
    })
      .to(barRef.current, { scaleX: 1, duration: 1.25, ease: "power2.inOut" }, 0)
      // 2. Le compteur s'efface
      .to("[data-intro-fade]", { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" })
      // 3. Le rideau se lève
      .to(root.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
      });

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-nuit"
    >
      <div data-intro-fade className="flex flex-col items-center gap-8 px-6">
        <p className="font-display text-[clamp(4rem,16vw,11rem)] font-bold leading-none tracking-tight">
          <span ref={countRef}>000</span>
        </p>
        <div className="h-px w-56 max-w-[70vw] overflow-hidden bg-ligne">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-menthe to-corail"
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brume-60">
          Kévin Intertaglia
        </p>
      </div>
    </div>
  );
}
