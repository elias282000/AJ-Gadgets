import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Next's built-in image optimizer proxies every image through its own
    // resize endpoint, which was timing out fetching from Supabase Storage
    // in some network conditions. Product photos are already reasonably
    // sized, so we skip that extra hop entirely rather than depend on it.
    unoptimized: true,
  },
  // Lets you open the dev server from another device on your local network
  // (e.g. testing on your phone via http://192.168.x.x:3000). Safe for
  // local development only — this file isn't used in production builds.
  allowedDevOrigins: ["192.168.0.104"],
};

export default nextConfig;
