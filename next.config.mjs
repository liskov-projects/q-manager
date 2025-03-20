/** @type {import('next').NextConfig} */

const port = process.env.PORT || 3000;
console.log(`✅ Next.js running on port ${port}`);

const nextConfig = {
  output: "standalone", // ✅ Makes the app self-contained for Cloud Run
  env: {
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "",
    MONGO_URI: process.env.NEXT_PUBLIC_MONGO_URI || "", // ✅ Add this
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
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
