import type { NextConfig } from "next";
import * as os from "os";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let basePath = '';
let assetPrefix = '';

if (isGithubActions) {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'PS-3-Pages-Client-Only';
  basePath = `/${repoName}`;
  assetPrefix = `/${repoName}/`;
}

const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = ['localhost', '127.0.0.1'];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
};

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' as const } : {}),
  allowedDevOrigins: getLocalIPs(),
  env: {
    NEXT_PUBLIC_IS_DEPLOYED: process.env.NEXT_PUBLIC_IS_DEPLOYED || 'true',
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_BUILD_TIME: Date.now().toString(),
    NEXT_PUBLIC_GAS_URL: process.env.NEXT_PUBLIC_GAS_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  ...(isGithubActions && { basePath, assetPrefix }),
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
