/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_TELEMETRY_DISABLED: "1",
  },
};

export default nextConfig;
