/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headers de segurança — permitem crawlers
  async headers() {
    return [
      {
        // Aplica a todas as rotas
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      {
        // Rotas legais — headers abertos para crawlers
        source: "/legal/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
