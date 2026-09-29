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
  },
  async redirects() {
    return [
      // Project renamed in the database — keep the old case-study URL alive.
      {
        source: "/work/prestige-properties-real-estate-platform",
        destination: "/work/bienvenidos-apartments",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
