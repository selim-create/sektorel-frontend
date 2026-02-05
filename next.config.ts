import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Canlı API Sunucusu (HTTP ve HTTPS)
      {
        protocol: 'http',
        hostname: 'api.sektorelajanda.com',
      },
      {
        protocol: 'https',
        hostname: 'api.sektorelajanda.com',
      },
      
      // Lokal Geliştirme Ortamı
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      
      // Projede Kullandığımız Dış Kaynaklar (Placeholder vb.)
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
      }
    ],
  },
};

export default nextConfig;