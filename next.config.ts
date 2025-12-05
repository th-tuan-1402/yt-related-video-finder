import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remove console logs in production build (similar to Nuxt.js)
  // This will automatically strip console.log, console.info, console.debug in production
  // but keep console.error and console.warn for important error tracking
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? {
          exclude: ['error', 'warn'], // Keep error and warn logs for production debugging
        }
      : false,
  },
  // Turbopack config (Next.js 16 uses Turbopack by default)
  turbopack: {},
};

export default nextConfig;
