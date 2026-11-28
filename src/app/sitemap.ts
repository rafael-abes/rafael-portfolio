import type { MetadataRoute } from "next";
import { indexableProjects, siteUrl } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...["pantry", "recipes", "experience", "contact"].map((path) => ({
      url: `${siteUrl}/${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...indexableProjects.map((p) => ({ url: `${siteUrl}/recipes/${p.id}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}