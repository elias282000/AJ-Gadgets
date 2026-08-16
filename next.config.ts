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
  },
  // Lets you open the dev server from another device on your local network
  // (e.g. testing on your phone via http://192.168.x.x:3000). Safe for
  // local development only — this file isn't used in production builds.
  allowedDevOrigins: ["192.168.0.104"],
};

export default nextConfig;
