const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org', 'deisishop.pythonanywhere.com'], // Adicione os domínios permitidos
  },
  async rewrites() {
    return [
      {
        source: '/api/deisishop/:path*',
        destination: 'http://deisishop.pythonanywhere.com/:path*', // Redireciona as requisições para a API externa
      },
    ];
  },
};

export default nextConfig;
