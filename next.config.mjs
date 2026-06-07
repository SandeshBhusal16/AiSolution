/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is an academic prototype: do not let lint warnings block `next build`.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
