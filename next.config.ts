import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    contentDispositionType: "inline",
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
