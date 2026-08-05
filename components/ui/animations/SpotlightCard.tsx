"use client";

import { useRef } from "react";

/**
 * Carte en verre dépoli avec un halo lumineux qui suit le curseur (spotlight).
 * Le halo est piloté par variables CSS mises à jour au mousemove — pas de re-render React.
 */
export default function SpotlightCard({
  children,
  className = "",
  glow = "rgba(79,227,193,0.14)",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group glass relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* Halo qui suit le curseur */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
