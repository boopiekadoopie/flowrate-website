import type { MetadataRoute } from "next";
import { industries } from "@/lib/industries";
import { posts } from "@/lib/posts";
import { CHANGELOG } from "@/lib/changelog";

/*
 * lastModified only where we know a real date. Stamping every page with the build date taught search engines to
 * ignore it, so: guides use their own date, /blog its newest guide, and the site pages the newest What's new entry
 * (that list only records changes a visitor can see).
 */
const newestPost = posts.reduce((a, p) => (p.date > a ? p.date : a), posts[0]?.date ?? "2026-10-19");
const siteUpdated = new Date(CHANGELOG[0]?.date ?? newestPost);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://flowrate.agency", lastModified: siteUpdated, changeFrequency: "monthly", priority: 1 },
    { url: "https://flowrate.agency/work", lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.8 },
    ...industries.map((i) => ({ url: `https://flowrate.agency/for/${i.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: "https://flowrate.agency/sketch", lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://flowrate.agency/blog", lastModified: new Date(newestPost), changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((p) => ({ url: `https://flowrate.agency/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "yearly" as const, priority: 0.5 })),
    { url: "https://flowrate.agency/changelog", lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.4 },
    { url: "https://flowrate.agency/privacy", changeFrequency: "yearly", priority: 0.2 },
    { url: "https://flowrate.agency/terms", changeFrequency: "yearly", priority: 0.2 },
  ];
}
