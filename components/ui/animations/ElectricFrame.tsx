"use client";

import ElectricBorder from "./ElectricBorder";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Encadre un élément vedette d'une bordure « électrique » menthe (Originkit
 * « Electric Border »). Repli sans bordure animée si reduced-motion (le contenu
 * garde sa propre carte en verre). Rayon aligné sur rounded-2xl (16px).
 */
export default function ElectricFrame({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ElectricBorder
      color="#6effd8"
      glowColor="#4fe3c1"
      glowIntensity={3}
      bgColor="transparent"
      borderRadius={16}
      thickness={2}
      chaos={2.6}
      speed={1}
      className="h-full"
    >
      {children}
    </ElectricBorder>
  );
}
