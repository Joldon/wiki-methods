/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "https://sustainabilitymethods.org/images/:path*",
      },
    ];
  },
};

export default nextConfig;
