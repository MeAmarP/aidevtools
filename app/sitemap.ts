import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base) return [];
  return [
    "/",
    "/about",
    "/privacy",
    ...tools.map((t) => `/tools/${t.slug}`),
  ].map((path) => ({ url: new URL(path, base).href }));
}
