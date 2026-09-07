import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/constants';
import { getProducts } from '@/lib/catalog-store';
import { Product } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shashienterprises.store';

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/become-a-dealer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Category Pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/shop/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Product Pages
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (e) {
    console.error('Sitemap product fetch error:', e);
  }

  const productPages: MetadataRoute.Sitemap = products.map((prod: Product) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.updatedAt || prod.createdAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
