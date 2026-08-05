import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/data";
import Reveal from "@/components/ui/animations/Reveal";

type Params = { slug: string };

/** Les 4 pages projet sont générées statiquement au build. */
export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Projet introuvable" };

  return {
    title: `${project.title} — Projet de Kévin Intertaglia`,
    description: project.pitch,
    openGraph: { title: project.title, description: project.pitch, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  // Projet suivant, en boucle : invite à continuer la visite plutôt qu'à repartir.
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="contenu" className="halo grain relative min-h-svh overflow-hidden pb-32 pt-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Retour : marqué « nav-back » pour que le contenu glisse dans le bon sens */}
        <Link
          href="/#projets"
          transitionTypes={["nav-back"]}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brume-60 transition-colors hover:text-menthe"
        >
          <span aria-hidden>←</span> Tous les projets
        </Link>

        <header className="mt-10">
          <p
            className="font-display text-5xl font-bold md:text-6xl"
            style={{ color: `${project.accent}55` }}
          >
            {String(index + 1).padStart(2, "0")}
          </p>

          {/* Le titre porte le même nom que sur la carte : il se déplace d'une page à l'autre */}
          <ViewTransition name={`titre-${project.slug}`}>
            <h1 className="font-display mt-3 text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
              {project.title}
            </h1>
          </ViewTransition>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brume-60">
            {project.pitch}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-menthe px-6 py-3 text-sm font-semibold text-nuit transition-colors hover:bg-menthe-vif"
            >
              Voir le site en ligne ↗
            </a>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-ligne px-6 py-3 text-sm font-semibold text-brume transition-colors hover:border-menthe hover:text-menthe"
              >
                Code sur GitHub
              </a>
            )}
          </div>
        </header>

        {/* Visuel principal : morphe depuis la carte de la page d'accueil */}
        <ViewTransition name={`visuel-${project.slug}`} share="morph">
          <div className="relative mt-16 rounded-2xl border border-ligne bg-surface/40 p-6 md:p-10">
            <div
              className="absolute inset-0 -z-10 rounded-2xl opacity-25"
              style={{
                background: `radial-gradient(600px circle at 50% 0%, ${project.accent}, transparent 70%)`,
              }}
              aria-hidden
            />
            <div className={`flex justify-center gap-6 ${project.mobile ? "" : "flex-col"}`}>
              {project.screenshots.map((shot, i) => (
                <Image
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  // Visuel principal : chargé en priorité (c'est la cible du morphing
                  // depuis la carte, et l'élément LCP de la page).
                  priority={i === 0}
                  width={project.mobile ? 400 : 1200}
                  height={project.mobile ? 860 : 750}
                  sizes={project.mobile ? "(min-width: 768px) 30vw, 45vw" : "(min-width: 768px) 80vw, 90vw"}
                  className={`rounded-xl border border-ligne shadow-2xl ${
                    project.mobile ? "w-[46%] max-w-[320px]" : "w-full"
                  }`}
                />
              ))}
            </div>
          </div>
        </ViewTransition>

        {/* Ce que le projet démontre */}
        <div className="mt-20 grid gap-12 md:grid-cols-[2fr_1fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Ce que ce projet démontre
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {project.highlights.map((fact) => (
                <li key={fact} className="flex items-start gap-3 leading-relaxed text-brume/85">
                  <span aria-hidden className="mt-1 font-bold text-menthe">
                    ✓
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-menthe">
              Stack technique
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-ligne bg-surface px-3.5 py-1.5 text-xs font-semibold text-brume/85"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Projet suivant */}
        <Reveal className="mt-28 border-t border-ligne pt-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brume-60">
            Projet suivant
          </p>
          <Link
            href={`/projets/${next.slug}`}
            transitionTypes={["nav-forward"]}
            data-cursor-label="Voir le projet"
            className="group mt-4 inline-flex items-baseline gap-4"
          >
            <span className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-tight transition-colors group-hover:text-menthe">
              {next.title}
            </span>
            <span aria-hidden className="text-2xl text-menthe transition-transform group-hover:translate-x-2">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
