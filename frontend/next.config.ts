import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
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
