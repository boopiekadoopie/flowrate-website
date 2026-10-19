import type { MetadataRoute } from "next";
import { industries } from "@/lib/industries";
import { posts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://flowrate.agency", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://flowrate.agency/work", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...industries.map((i) => ({ url: `https://flowrate.agency/for/${i.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: "https://flowrate.agency/spreadsheet", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://flowrate.agency/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((p) => ({ url: `https://flowrate.agency/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "yearly" as const, priority: 0.5 })),
    { url: "https://flowrate.agency/changelog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: "https://flowrate.agency/privacy", changeFrequency: "yearly", priority: 0.2 },
    { url: "https://flowrate.agency/terms", changeFrequency: "yearly", priority: 0.2 },
  ];
}
