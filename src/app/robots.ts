import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://shashienterprises.store';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*', '/account', '/checkout', '/cart', '/auth/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
