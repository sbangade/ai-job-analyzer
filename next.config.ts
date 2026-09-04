import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CommonJS packages that must stay external to the server bundle.
  serverExternalPackages: ["mammoth"],
};

export default nextConfig;
