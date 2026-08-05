"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const links = [
  { href: "#parcours", label: "Parcours" },
  { href: "#projets", label: "Projets" },
  { href: "#methode", label: "Méthode" },
  { href: "#contact", label: "Contact" },
];

/** Barre de navigation fixe, translucide, qui se densifie après le premier défilement. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-ligne bg-nuit/70 backdrop-blur-lg" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-bold tracking-tight" aria-label="Retour en haut">
          <span className="text-menthe">K</span>évin<span className="text-corail">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-medium text-brume-60 transition-colors hover:text-brume"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={profile.cvFile}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ligne px-5 py-2 text-sm font-semibold text-brume transition-colors hover:border-menthe hover:text-menthe"
        >
          CV ↗
        </a>
      </nav>
    </header>
  );
}
