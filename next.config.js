/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // standalone build for Docker
  output: "standalone",
};

module.exports = nextConfig;
