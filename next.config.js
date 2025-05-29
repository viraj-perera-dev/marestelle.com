import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  compilerOptions: {
    module: 'ESNext',
    target: 'ESNext',
    moduleResolution: 'Bundler'
  },
  generateBuildId: async () => 'build',
  skipTrailingSlashRedirect: true,
};

export default withNextIntl(nextConfig);
