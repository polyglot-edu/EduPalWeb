/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;

const DEPLOY_URL = process.env.DEPLOY_URL ?? 'http://localhost:3000';
const BACK_URL = process.env.BACK_URL || 'http://localhost:5000';

module.exports = {
  env: {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_SCOPE: process.env.AUTH0_SCOPE,
    DEPLOY_URL: DEPLOY_URL,
    BACK_URL: BACK_URL,
    TEST_MODE: process.env.TEST_MODE,
    APIKEY: process.env.APIKEY,
    SETUPMODEL: process.env.SETUPMODEL,
    AIGENERATION: process.env.AIGENERATION_URL,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/flows',
        permanent: true,
      },
    ];
  },
};
