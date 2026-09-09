/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Disable all telemetry and external calls at build time
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
