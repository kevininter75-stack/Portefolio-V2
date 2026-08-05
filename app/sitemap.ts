import type { MetadataRoute } from "next";
import { projects } from "@/lib/data";

const SITE_URL = "https://portefolio-v2-five.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Une entrée par étude de cas projet
    ...projects.map((project) => ({
      url: `${SITE_URL}/projets/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
