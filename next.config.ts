import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  poweredByHeader: false,
  images: {
    contentDispositionType: "inline",
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Baseline security headers. A full Content-Security-Policy is left for later: the inline theme
  // script and Cloudflare's injected scripts need hashes first.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // unlisted client preview: keep it out of search results
        source: "/dr-wucher/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/dr-wucher",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // One canonical host: send www to the bare domain so search engines
  // don't treat the two as duplicate copies of the site.
  // Unlisted client concept pages (noindex in the page itself, not linked from the site)
  async rewrites() {
    return [
      { source: "/kaia", destination: "/kaia.html" },
      { source: "/carsen", destination: "/carsen/index.html" },
      { source: "/trophy", destination: "/trophy/index.html" },
      { source: "/dr-wucher", destination: "/dr-wucher/index.html" },
      { source: "/dr-wucher/treatments", destination: "/dr-wucher/treatments.html" },
      { source: "/dr-wucher/dentists", destination: "/dr-wucher/dentists.html" },
      { source: "/dr-wucher/book", destination: "/dr-wucher/book.html" },
      { source: "/dr-wucher/puzzle-of-health", destination: "/dr-wucher/puzzle-of-health.html" },
    ];
  },
  async redirects() {
    return [
      // the spreadsheet tool grew into Sketch my app (a spreadsheet's top row still works there)
      { source: "/spreadsheet", destination: "/sketch", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.flowrate.agency" }],
        destination: "https://flowrate.agency/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
