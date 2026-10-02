import type { NextConfig } from "next";
const config: NextConfig = {
	poweredByHeader: false,
	async redirects() {
		return [
			{
				source: "/tools/quantization-calculator",
				destination: "/tools/gguf-size-calculator",
				permanent: true,
			},
		];
	},
};
export default config;
