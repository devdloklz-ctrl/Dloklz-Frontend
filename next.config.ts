import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dloklz.com",
      },
      {
        protocol: "https",
        hostname: "www.dloklz.com", // optional fallback
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
