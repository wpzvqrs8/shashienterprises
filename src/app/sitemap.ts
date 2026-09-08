import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/constants';
import { getProducts } from '@/lib/catalog-store';
import { Product } from '@/lib/types';

import { BLOG_POSTS } from '@/lib/blog-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shashienterprises.store';

  // 1. Core Static & Landing Pages
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
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Blog Article Pages
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

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

  return [...staticPages, ...blogPages, ...categoryPages, ...productPages];
}
