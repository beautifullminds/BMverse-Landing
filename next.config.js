
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/BMverse-Landing' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
