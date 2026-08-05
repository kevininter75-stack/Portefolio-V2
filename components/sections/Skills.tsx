import Reveal from "@/components/ui/animations/Reveal";
import Marquee from "@/components/ui/animations/Marquee";
import { skills } from "@/lib/data";

// Deux rangées défilant en sens opposés pour un effet vivant.
const half = Math.ceil(skills.length / 2);
const rows = [skills.slice(0, half), skills.slice(half)];

function Pill({ label }: { label: string }) {
  return (
    <span className="mx-3 rounded-full border border-ligne bg-surface px-6 py-3 font-display text-lg font-medium text-brume/85">
      {label}
    </span>
  );
}

/** Compétences en deux bandeaux défilants opposés. */
export default function Skills() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-menthe">
            Boîte à outils
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight">
            Les technologies avec lesquelles je construis.
          </h2>
        </Reveal>
      </div>

      <div className="flex flex-col gap-5">
        {rows.map((row, i) => (
          <Marquee key={i} duration={30 + i * 6} reverse={i % 2 === 1}>
            {row.map((skill) => (
              <Pill key={skill} label={skill} />
            ))}
          </Marquee>
        ))}
      </div>

      {/* Fondus sur les bords pour un défilement propre */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-nuit to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-nuit to-transparent" />
    </section>
  );
}
