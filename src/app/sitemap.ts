import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { indexableProjects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isConfigured) return [];
  return [
    { url: siteConfig.url, priority: 1 },
    { url: `${siteConfig.url}/work`, priority: 0.9 },
    ...indexableProjects.map((project) => ({
      url: `${siteConfig.url}/work/${project.slug}`,
      priority: 0.8,
    })),
  ];
}
