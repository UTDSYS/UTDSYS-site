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
      // Contact merged into Get involved; old links land on its channels.
      { source: "/contact", destination: "/get-involved#contact", permanent: true },
      // The blog was retired; send old links home.
      { source: "/blog", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
