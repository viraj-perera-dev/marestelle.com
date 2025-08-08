// 2. Update next.config.js to work better with the middleware:

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove conflicting trailing slash settings
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,
  
  output: 'standalone',
  
  // Add explicit redirects for SEO
  async redirects() {
    return [
      // Handle old URLs without locale
      {
        source: '/chi-siamo',
        destination: '/it/chi-siamo',
        permanent: true,
      },
      {
        source: '/contatti', 
        destination: '/it/contatti',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/it/faq', 
        permanent: true,
      }
    ];
  }
};

export default withNextIntl(nextConfig);