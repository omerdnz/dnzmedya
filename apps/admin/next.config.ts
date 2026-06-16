import type { NextConfig } from 'next';
import { existsSync } from 'fs';
import path from 'path';

function loadMonorepoEnv() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadEnvConfig } = require('@next/env');
    const candidates = [
      process.cwd(),
      path.resolve(process.cwd(), '..'),
      path.resolve(process.cwd(), '../..'),
    ];

    for (const dir of candidates) {
      if (existsSync(path.join(dir, '.env')) || existsSync(path.join(dir, '.env.local'))) {
        loadEnvConfig(dir);
      }
    }
  } catch {
    // optional
  }
}

loadMonorepoEnv();

const apiHost = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).hostname
  : 'localhost';

const nextConfig: NextConfig = {
  ...(process.env.NEXT_STANDALONE === 'true' ? { output: 'standalone' as const } : {}),
  transpilePackages: ['@dnzmedya/ui', '@dnzmedya/types'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '4000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: apiHost, pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
