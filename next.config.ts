import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bordo/ui", "@bordo/ad-insights"],
  serverExternalPackages: ["@resvg/resvg-js"],
};

export default nextConfig;
