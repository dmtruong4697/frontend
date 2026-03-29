import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: false,
  allowedDevOrigins: ['192.168.1.89'],
};

export default nextConfig;
