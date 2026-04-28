import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  assetPrefix: '/move-system/phd-dashboard/out',
  /* config options here */
};

export default nextConfig;
