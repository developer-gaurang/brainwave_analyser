import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@mediapipe/tasks-vision"],
};

export default nextConfig;
