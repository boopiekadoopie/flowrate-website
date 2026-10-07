import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/demo/", "/api/", "/social/"] },
    sitemap: "https://flowrate.agency/sitemap.xml",
  };
}
