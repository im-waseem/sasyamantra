/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  webpack: (config) => {
    // Suppress @supabase/realtime-js critical dependency warnings
    config.ignoreWarnings = [
      { module: /@supabase\/realtime-js/ },
    ];
    return config;
  },
};

module.exports = nextConfig;
