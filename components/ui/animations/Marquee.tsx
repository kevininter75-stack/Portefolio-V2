"use client";

/**
 * Bandeau défilant en boucle, 100 % CSS (aucun JS runtime, respecte reduced-motion
 * via la règle globale). Le contenu est dupliqué pour une boucle sans couture.
 */
export default function Marquee({
  children,
  duration = 28,
  reverse = false,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
}) {
  return (
    <div className="group flex overflow-hidden" aria-hidden="true">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex shrink-0 items-center will-change-transform"
          style={{
            animation: `marquee-scroll ${duration}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .group:hover > div { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
