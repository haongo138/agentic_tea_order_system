import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lamtra/ui"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
