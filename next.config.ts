import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Active <ViewTransition> (React) : morphing de la carte projet vers sa page.
    viewTransition: true,
  },
};

export default nextConfig;
