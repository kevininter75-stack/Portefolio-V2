"use client";

import RisingLines from "./RisingLines";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Fond décoratif Originkit « Rising Lines » aux couleurs lagon (étincelles menthe
 * montant d'un horizon corail). Désactivé si l'utilisateur a demandé à réduire
 * les animations. Placé en couche de fond, sous le contenu.
 */
export default function RisingLinesBackdrop() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="absolute inset-0 -z-10 opacity-70" aria-hidden="true">
      <RisingLines
        particles={170}
        color="#4fe3c1"
        horizonColor="#ff6b5e"
        horizonOpacity={70}
        opacity={85}
        riseSpeed={22}
        scale={7}
        style={{ background: "transparent" }}
      />
    </div>
  );
}
