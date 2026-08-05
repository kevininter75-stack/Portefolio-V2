"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 768px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * true à partir de 768px de large. Sert à ne PAS monter les effets coûteux
 * (scène 3D, fonds animés) sur téléphone : batterie et fluidité préservées.
 * false au SSR — on n'active l'effet qu'après hydratation, jamais avant.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
