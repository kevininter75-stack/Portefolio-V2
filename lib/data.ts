/**
 * Toutes les données du portfolio centralisées ici :
 * un seul fichier à modifier pour mettre à jour le contenu du site.
 */

export const profile = {
  name: "Kévin Intertaglia",
  firstName: "Kévin",
  role: "Développeur web & IA en reconversion",
  location: "Saint-Gilles-les-Bains, La Réunion",
  phone: "+262692319616",
  phoneDisplay: "0692 31 96 16",
  email: "kevin.inter@hotmail.fr",
  github: "https://github.com/kevininter75-stack",
  githubHandle: "kevininter75-stack",
  linkedin: "https://www.linkedin.com/in/kévin-intertaglia-0a3aab221",
  // Photo de profil : déposer le fichier dans /public/images/profile.jpg
  photo: "/images/profile.jpg",
  // CV : déposer le fichier PDF dans /public/cv-kevin-intertaglia.pdf
  cvFile: "/cv-kevin-intertaglia.pdf",
  // Code source de ce portfolio (affiché dans le footer)
  siteRepo: "https://github.com/kevininter75-stack/portfolio",
};


/** Étapes numérotées du parcours, façon storytelling « Le Bichique » */
export const journey = [
  {
    number: "01",
    title: "L'hôtellerie de luxe",
    text: "Barman à l'Hôtel Boucan Canot 4★, après des débuts au service de l'Hôtel Le Lux 5★. Avant ça, le bâtiment et l'immobilier : un parcours varié qui a forgé rigueur, adaptabilité et sang-froid sous pression.",
  },
  {
    number: "02",
    title: "Le déclic",
    text: "La curiosité web ne date pas d'hier — première boutique en ligne montée sur Shopify dès 2016. Depuis : reconversion autodidacte vers le développement web et l'IA, avec Claude Code comme copilote, pour construire des produits complets de l'idée au déploiement.",
  },
  {
    number: "03",
    title: "La suite",
    text: "Aujourd'hui responsable de bar à Ti Mahi Mahi (Saint-Gilles-les-Bains), je continue d'apprendre en construisant : chaque nouveau projet monte d'un cran en complexité. La suite s'écrit ligne par ligne.",
  },
];

/** Langues parlées, affichées sous la photo dans la section À propos */
export const languages = [
  "Français — langue maternelle",
  "Créole — bilingue",
  "Anglais — intermédiaire",
];

export type Project = {
  slug: string;
  title: string;
  pitch: string;
  /** Faits concrets et vérifiables mis en avant sur la carte (2-3 max) */
  highlights: string[];
  stack: string[];
  url: string;
  github?: string;
  /** Captures d'écran réelles prises sur le site en ligne */
  screenshots: { src: string; alt: string }[];
  /** true → captures au format téléphone (app mobile) */
  mobile: boolean;
  /** Couleur d'accent de la carte projet */
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "serene",
    title: "Sérène",
    pitch:
      "PWA de bien-être et de méditation : respirer, se recentrer, suivre sa pratique. Prototypée sur Emergent.sh puis entièrement finalisée avec Claude Code.",
    highlights: [
      "Prototype repris et finalisé de A à Z avec Claude Code",
      "Gamification complète : série, XP, badges, check-in d'humeur",
      "Installable sur téléphone (PWA)",
    ],
    stack: ["PWA", "React", "FastAPI", "Emergent.sh", "Claude Code", "Vercel"],
    url: "https://mindfull-topaz.vercel.app/auth",
    github: "https://github.com/kevininter75-stack/mindfull",
    screenshots: [
      {
        src: "/images/projects/serene-1.png",
        alt: "Accueil de Sérène : suivi de série, progression XP et check-in d'humeur",
      },
      {
        src: "/images/projects/serene-2.png",
        alt: "Parcours guidés de Sérène : programmes TCC gestion du stress et sommeil",
      },
    ],
    mobile: true,
    accent: "#8B9FE8",
  },
  {
    slug: "declic",
    title: "Déclic",
    pitch:
      "Application de pratique du français conversationnel pour expatriés : des situations réelles, des dialogues guidés, une progression mesurable.",
    highlights: [
      "Scénarios de mise en situation + mode « Ta situation » personnalisé",
      "Comptes utilisateurs et données sur Supabase",
      "Automatisations back-office avec n8n",
    ],
    stack: ["Next.js", "Supabase", "n8n", "Vercel"],
    url: "https://declic-liart.vercel.app/",
    github: "https://github.com/kevininter75-stack/declic",
    screenshots: [
      { src: "/images/projects/declic-1.png", alt: "Page d'accueil de Déclic" },
      { src: "/images/projects/declic-2.png", alt: "Interface de conversation de Déclic" },
    ],
    mobile: false,
    accent: "#F2B950",
  },
  {
    slug: "fruit-ninja-reunion",
    title: "Fruit Ninja Réunion",
    pitch:
      "Jeu mobile façon fruit-slicer aux couleurs de La Réunion : letchis, mangues et ananas Victoria à trancher, packagé en PWA et en app native.",
    highlights: [
      "Développé en 4 phases, du prototype au packaging natif Android",
      "Physique, combos, effets de coupe et sons codés sur mesure",
      "Deux modes de jeu (Classique 3 vies / Chrono 60 s)",
    ],
    stack: ["Phaser 3", "TypeScript", "Vite", "Capacitor", "PWA"],
    url: "https://kevininter75-stack.github.io/fruit-ninja-reunion/",
    github: "https://github.com/kevininter75-stack/fruit-ninja-reunion",
    screenshots: [
      { src: "/images/projects/fruit-ninja-1.png", alt: "Écran titre de Fruit Ninja Réunion" },
      { src: "/images/projects/fruit-ninja-2.png", alt: "Partie en cours de Fruit Ninja Réunion" },
    ],
    mobile: true,
    accent: "#7ED957",
  },
  {
    slug: "le-bichique",
    title: "Le Bichique",
    pitch:
      "Site vitrine d'un restaurant fictif au port de Saint-Gilles : un exercice de storytelling en scroll, de motion design et de design system soigné.",
    highlights: [
      "Conçu à partir d'un cahier des charges complet, comme pour un vrai client",
      "Design system, animations GSAP et smooth scroll sur mesure",
      "Le socle technique qui a servi de base à ce portfolio",
    ],
    stack: ["Next.js", "GSAP", "Lenis", "Tailwind CSS"],
    url: "https://le-bichique.vercel.app/",
    github: "https://github.com/kevininter75-stack/le-bichique",
    screenshots: [
      { src: "/images/projects/bichique-1.jpg", alt: "Hero du site Le Bichique" },
      { src: "/images/projects/bichique-2.jpg", alt: "Section storytelling du Bichique" },
    ],
    mobile: false,
    accent: "#FF6B5E",
  },
];

/** Compétences affichées dans la grille */
export const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "Phaser 3",
  "Three.js",
  "n8n",
  "Vite",
  "Capacitor",
  "Git / GitHub",
  "Claude Code",
];

/** Étapes de la section « Ma méthode » : comment je travaille avec l'IA */
export const method = [
  {
    number: "01",
    title: "Je cadre",
    text: "L'idée, le besoin, le cahier des charges : je définis quoi construire et pourquoi, je découpe le projet en étapes concrètes. C'est le même réflexe qu'au bar — la mise en place avant le service.",
  },
  {
    number: "02",
    title: "Je construis avec l'IA",
    text: "Claude Code écrit vite ; moi je pilote. Choix techniques, revue de chaque fonctionnalité, tests sur de vrais appareils, itérations jusqu'à ce que ce soit propre. L'IA est un accélérateur, pas un pilote automatique.",
  },
  {
    number: "03",
    title: "Je mets en ligne",
    text: "Déploiement en production (Vercel, PWA, stores), corrections après retours, et amélioration continue. Un projet n'est terminé que quand quelqu'un peut s'en servir.",
  },
];

/** Mots du bandeau défilant du hero */
export const marqueeWords = [
  "Next.js",
  "TypeScript",
  "Claude Code",
  "La Réunion",
  "Idée → Code → Déploiement",
  "Dev assisté par IA",
];
