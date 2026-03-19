import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/floorplans",
        destination: "/availability",
        permanent: true,
      },
      {
        source: "/floorplans/:path*",
        destination: "/availability",
        permanent: true,
      },
      {
        source: "/p/theheights",
        destination: "/residences",
        permanent: true,
      },
      {
        source: "/p/theheights/:path*",
        destination: "/residences",
        permanent: true,
      },
      {
        source: "/gallery",
        destination: "/residences",
        permanent: true,
      },
      {
        source: "/gallery/:path*",
        destination: "/residences",
        permanent: true,
      },
      {
        source: "/virtual-tours",
        destination: "/availability",
        permanent: true,
      },
      {
        source: "/virtual-tours/:path*",
        destination: "/availability",
        permanent: true,
      },
      {
        source: "/faqs",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/faqs/:path*",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/schedule-a-tour",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/schedule-a-tour/:path*",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
