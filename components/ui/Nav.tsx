"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const links = [
  { href: "#parcours", label: "Parcours" },
  { href: "#projets", label: "Projets" },
  { href: "#methode", label: "Méthode" },
  { href: "#contact", label: "Contact" },
];

/**
 * Navigation fixe translucide qui se densifie au scroll.
 * Desktop : liens en ligne, avec soulignement de la section courante.
 * Mobile : bouton menu → panneau plein écran (les liens étaient auparavant
 * simplement masqués, laissant le téléphone sans aucune navigation).
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Surligne le lien de la section visible à l'écran.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Menu ouvert : on bloque le scroll de fond et on ferme avec Échap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-ligne bg-nuit/70 backdrop-blur-lg"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-display relative z-50 text-lg font-bold tracking-tight"
          aria-label="Retour en haut"
        >
          <span className="text-menthe">K</span>évin<span className="text-corail">.</span>
        </a>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative text-sm font-medium transition-colors ${
                  active === l.href ? "text-brume" : "text-brume-60 hover:text-brume"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-menthe transition-all duration-300 ${
                    active === l.href ? "w-full" : "w-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={profile.cvFile}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-50 rounded-full border border-ligne px-5 py-2 text-sm font-semibold text-brume transition-colors hover:border-menthe hover:text-menthe"
          >
            CV ↗
          </a>

          {/* Bouton menu (mobile) : deux barres qui se croisent en X */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-ligne md:hidden"
          >
            <span
              className={`block h-px w-4 bg-brume transition-transform duration-300 ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-4 bg-brume transition-transform duration-300 ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Panneau plein écran (mobile) */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 bg-nuit/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex h-full flex-col items-start justify-center gap-2 px-8">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display block py-3 text-4xl font-bold tracking-tight transition-transform duration-500"
                style={{
                  transform: open ? "translateY(0)" : "translateY(100%)",
                  transitionDelay: open ? `${80 + i * 60}ms` : "0ms",
                }}
              >
                <span className="mr-3 align-middle text-sm font-medium text-menthe">
                  0{i + 1}
                </span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
