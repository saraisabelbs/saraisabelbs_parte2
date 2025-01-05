import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org', 'deisishop.pythonanywhere.com'], // Domínios permitidos
  },
  async rewrites() {
    return [
      {
        source: '/api/deisishop/:path*',
        destination: 'http://127.0.0.1:8000/:path*', // Redirecione para a API local
      },
    ];
  },
};

export default nextConfig;
