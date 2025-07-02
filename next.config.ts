import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: [
      'i.pinimg.com',
      'unsplash.com',
      'images.unsplash.com',
      'imgur.com',
      'your-cdn.com',
      'another-image-host.com',
    ],
  },
};

export default nextConfig;
