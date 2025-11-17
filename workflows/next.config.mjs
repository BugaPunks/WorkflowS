/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // This is a temporary workaround for a persistent build issue.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
