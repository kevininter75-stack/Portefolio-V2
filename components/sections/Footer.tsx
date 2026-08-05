import { profile } from "@/lib/data";
import EasterEgg from "@/components/ui/EasterEgg";

/** Pied de page : mentions, lien code source, easter egg barman. */
export default function Footer() {
  return (
    <footer className="border-t border-ligne">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-brume-60 md:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name} — Saint-Gilles-les-Bains, La Réunion.
        </p>
        <div className="flex items-center gap-5">
          <a
            href={profile.siteRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-menthe"
          >
            Code source
          </a>
          <EasterEgg />
        </div>
      </div>
    </footer>
  );
}
