import type { NextConfig } from "next";

// Allow external avatar images (Google profile avatars) used by next/image
const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
