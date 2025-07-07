import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // generateBuildId: async () => 'build', // 🚫 Try disabling this
  output: 'standalone' // ✅ helps with Vercel production deployment
};

export default withNextIntl(nextConfig);
