import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  env: {
    APP_VERSION: process.env.npm_package_version || "0.0.0",
  },
};

export default nextConfig;
