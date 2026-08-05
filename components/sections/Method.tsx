import Reveal from "@/components/ui/animations/Reveal";
import SpotlightCard from "@/components/ui/animations/SpotlightCard";
import ElectricFrame from "@/components/ui/animations/ElectricFrame";
import { method } from "@/lib/data";

/** Section « Ma méthode » : comment je travaille avec l'IA, en 3 cartes en verre. */
export default function Method() {
  return (
    <section id="methode" className="relative scroll-mt-24 py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-menthe">
            Ma méthode
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight">
            L&apos;IA est un accélérateur, pas un pilote automatique.
          </h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {method.map((step, i) => {
            const card = (
              <SpotlightCard className="h-full p-8">
                <span className="font-display text-4xl font-bold text-gradient">{step.number}</span>
                <h3 className="font-display mt-5 text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-brume-60">{step.text}</p>
              </SpotlightCard>
            );
            return (
              <Reveal key={step.number} delay={i * 0.08}>
                {/* Carte centrale mise en avant par une bordure « électrique » Originkit */}
                {i === 1 ? <ElectricFrame>{card}</ElectricFrame> : card}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
