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
    ];
  },
  // One canonical host: send www to the bare domain so search engines
  // don't treat the two as duplicate copies of the site.
  async redirects() {
    return [
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
