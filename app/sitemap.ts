import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://flowrate.agency", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://flowrate.agency/privacy", changeFrequency: "yearly", priority: 0.2 },
    { url: "https://flowrate.agency/terms", changeFrequency: "yearly", priority: 0.2 },
  ];
}
