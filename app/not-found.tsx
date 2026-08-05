import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — Kévin Intertaglia",
};

/** Page 404 aux couleurs du site, avec un clin d'œil au parcours barman. */
export default function NotFound() {
  return (
    <main className="halo grain relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[clamp(5rem,18vw,12rem)] font-bold leading-none text-gradient">
        404
      </p>
      <h1 className="font-display mt-4 text-[clamp(1.5rem,4vw,2.5rem)] font-bold tracking-tight">
        Cette page n&apos;est plus au menu.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-brume-60">
        Le lien est peut-être périmé, ou l&apos;adresse comporte une coquille.
        Retour au bar principal ?
      </p>
      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-menthe px-8 py-4 font-semibold text-nuit transition-colors hover:bg-menthe-vif"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
