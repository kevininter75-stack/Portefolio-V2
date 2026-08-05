import Reveal from "@/components/ui/animations/Reveal";
import Magnetic from "@/components/ui/animations/Magnetic";
import RisingLinesBackdrop from "@/components/ui/animations/RisingLinesBackdrop";
import { profile } from "@/lib/data";

/** Section contact : grande accroche + coordonnées réelles, sur fond animé Originkit. */
export default function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden py-28 md:py-40"
    >
      {/* Fond animé Originkit « Rising Lines » (étincelles menthe / horizon corail) */}
      <RisingLinesBackdrop />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-menthe">
            Contact
          </p>
          <h2 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
            Construisons quelque chose <span className="text-gradient">ensemble</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-brume-60">
            Un projet, une idée, ou simplement l&apos;envie d&apos;échanger sur le
            développement assisté par IA ? Ma boîte mail est ouverte.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="inline-block rounded-full bg-menthe px-8 py-4 font-semibold text-nuit transition-colors hover:bg-menthe-vif"
            >
              {profile.email}
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href={`tel:${profile.phone}`}
              className="inline-block rounded-full border border-ligne bg-surface/40 px-8 py-4 font-semibold text-brume backdrop-blur transition-colors hover:border-menthe hover:text-menthe"
            >
              {profile.phoneDisplay}
            </a>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex items-center justify-center gap-6 text-sm font-semibold text-brume-60">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors hover:text-menthe hover:underline"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors hover:text-menthe hover:underline"
          >
            LinkedIn
          </a>
          <a
            href={profile.cvFile}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors hover:text-menthe hover:underline"
          >
            CV (PDF)
          </a>
        </Reveal>
      </div>
    </section>
  );
}
