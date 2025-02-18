import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "mail0.io" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Optional: If you still have issues, you can use this instead of domains
  // images: {
  //   unoptimized: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/mail/settings",
        destination: "/mail/settings/general",
        permanent: true,
      },
      {
        source: "/mail",
        destination: "/mail/inbox",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
