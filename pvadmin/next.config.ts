import type { NextConfig } from "next";

// In Docker / production the browser can't reach the backend container by its
// internal hostname, so we proxy /api through Next.js itself.
// BACKEND_INTERNAL_URL is only read server-side (no NEXT_PUBLIC_ prefix) so it
// can safely point to the Docker service name (http://backend:8000).
const backendInternal =
  process.env.BACKEND_INTERNAL_URL?.trim() || "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendInternal}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendInternal}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
