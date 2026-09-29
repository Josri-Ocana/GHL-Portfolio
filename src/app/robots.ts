import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(siteConfig.isConfigured ? { allow: "/" } : { disallow: "/" }) },
    ...(siteConfig.isConfigured ? { sitemap: `${siteConfig.url}/sitemap.xml` } : {}),
  };
}
