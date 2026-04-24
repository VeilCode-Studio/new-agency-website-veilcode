import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      hostname: "www.facebook.com"
    },
      {
        hostname: "res.cloudinary.com"
    }]
  }
};

export default nextConfig;
