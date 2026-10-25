import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: { agentFeedback: true },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
  webpack: (config: any) => {
    config.cache = false;
    config.watchOptions = { ignored: ["**/.next/**", "**/node_modules/**", "/data/**"] };
    return config;
  }
};
export default nextConfig;
