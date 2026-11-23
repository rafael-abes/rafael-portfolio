import type { MetadataRoute } from "next";
import { indexableProjects, siteUrl } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...indexableProjects.map((p) => ({ url: `${siteUrl}/recipes/${p.id}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}