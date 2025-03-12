/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ✅ Makes the app self-contained for Cloud Run
  env: {
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        search: "",
      },
    ],
  },
};

export default nextConfig;
