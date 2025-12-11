/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Configuração para garantir que o servidor rode na porta 3000
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;
