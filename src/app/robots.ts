import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/terms', '/privacy'],
      disallow: ['/home', '/chat', '/api/'],
    },
    sitemap: 'https://www.raelo.me/sitemap.xml',
  };
}
