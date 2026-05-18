import type { NextConfig } from "next";

// In Docker / production the browser can't reach the backend container by its
// internal hostname, so we proxy /api and /uploads through Next.js itself.
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
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "randomuser.me", pathname: "/**" },
			{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
				pathname: "/**",
			},
			{ protocol: "http", hostname: "localhost", pathname: "/**" },
			{ protocol: "https", hostname: "localhost", pathname: "/**" },
			{ protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
			{ protocol: "https", hostname: "127.0.0.1", pathname: "/**" },
			{ protocol: "http", hostname: "pashuvaani.com", pathname: "/**" },
			{ protocol: "https", hostname: "pashuvaani.com", pathname: "/**" },
		],
	},
	experimental: {
		optimizePackageImports: ["@radix-ui/react-icons"],
	},
};

export default nextConfig;
