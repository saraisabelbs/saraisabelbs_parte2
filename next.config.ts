const nextConfig = {
  reactStrictMode: true, // Mantém o modo estrito do React
  images: {
    domains: ['upload.wikimedia.org', 'deisishop.pythonanywhere.com'], // Adicione os domínios permitidos
  },
};
module.exports = {
  images: {
    domains: ['deisishop.pythonanywhere.com'], // Adicione o domínio da API externa, se necessário
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

module.exports = nextConfig;