import { ImageResponse } from "next/og";

/**
 * Image Open Graph générée au build : c'est la carte de prévisualisation
 * affichée quand le lien du site est partagé (LinkedIn, WhatsApp, mail…).
 */
export const alt =
  "Kévin Intertaglia — De l'hôtellerie de luxe au développement web assisté par IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#070a10",
          backgroundImage:
            "radial-gradient(700px circle at 8% 0%, rgba(79,227,193,0.18), transparent 60%), radial-gradient(700px circle at 95% 100%, rgba(255,107,94,0.14), transparent 60%)",
          color: "#eaf0f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#4fe3c1",
              color: "#070a10",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            KI
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>Kévin Intertaglia</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Satori impose un mot par span dans un conteneur flex-wrap */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 1000,
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            {(
              [
                ["De l'hôtellerie de luxe au", "#eaf0f8"],
                ["développement web", "#4fe3c1"],
                ["assisté par", "#eaf0f8"],
                ["IA.", "#ff6b5e"],
              ] as const
            ).flatMap(([fragment, color]) =>
              fragment.split(" ").map((word, i) => (
                <span key={`${fragment}-${i}`} style={{ color, marginRight: 16 }}>
                  {word}
                </span>
              ))
            )}
          </div>
          <div style={{ fontSize: 28, color: "#8a94a6" }}>
            4 projets déployés · Next.js · TypeScript · Claude Code — La Réunion
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
