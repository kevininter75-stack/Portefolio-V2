"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useFinePointer } from "@/lib/useFinePointer";

/**
 * Attire son enfant vers le curseur (effet aimant), desktop uniquement.
 * L'enfant unique est déplacé ; on remet à zéro à la sortie avec un ease élastique.
 */
export default function Magnetic({
  children,
  strength = 0.4,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const el = ref.current;
    if (reduced || !fine || !el) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;

    const xTo = gsap.quickTo(target, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf(target);
    };
  }, [reduced, fine, strength]);

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
