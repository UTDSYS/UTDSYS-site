import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /projects was split into the two research sections.
  async redirects() {
    return [
      {
        source: "/projects",
        destination: "/quantitative-research",
        permanent: true,
      },
      // The blog was retired; send old links home.
      { source: "/blog", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
