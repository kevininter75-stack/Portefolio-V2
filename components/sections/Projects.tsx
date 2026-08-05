import Reveal from "@/components/ui/animations/Reveal";
import ScrambleHeading from "@/components/ui/animations/ScrambleHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/data";

/** Section projets : liste de cartes alternées avec captures réelles. */
export default function Projects() {
  return (
    <section id="projets" className="relative scroll-mt-24 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-20 md:mb-28">
          <Reveal>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-menthe">
              Réalisations
            </p>
          </Reveal>
          <ScrambleHeading
            className="max-w-3xl"
            text="Quatre projets construits de A à Z, en ligne et utilisables."
          />
        </div>

        <div className="flex flex-col gap-28 md:gap-40">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
