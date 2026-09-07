import React from 'react';
import { Product, StoreSettings } from '@/lib/types';
import { DEFAULT_STORE_SETTINGS } from '@/lib/constants';

interface OrganizationJsonLdProps {
  settings?: StoreSettings;
}

export const OrganizationJsonLd: React.FC<OrganizationJsonLdProps> = ({ settings = DEFAULT_STORE_SETTINGS }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shashienterprises.store';

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['WholesaleStore', 'Organization', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: settings.storeName,
    legalName: settings.legalName,
    url: siteUrl,
    logo: `${siteUrl}${settings.logoUrl}`,
    image: `${siteUrl}/hero-banner-fast.png`,
    description: settings.tagline,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Delhi',
      addressRegion: 'Delhi NCR',
      addressCountry: 'IN',
    },
    telephone: settings.whatsapp,
    email: settings.email,
    priceRange: '₹₹₹',
    sameAs: [
      settings.facebook,
      settings.instagram,
    ].filter(Boolean),
    knowsAbout: [
      'Wholesale Anime Figures',
      'Anime Resin Statues Importer',
      'Dragon Ball Z Collectibles Bulk',
      'One Piece Statues Wholesale India',
      'Pop Culture Action Figures',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface ProductJsonLdProps {
  product: Product;
}

export const ProductJsonLd: React.FC<ProductJsonLdProps> = ({ product }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shashienterprises.store';
  const productUrl = `${siteUrl}/product/${product.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}/#product`,
    name: product.name,
    image: [product.image, ...(product.gallery || [])].map((img) =>
      img.startsWith('http') ? img : `${siteUrl}${img}`
    ),
    description: product.description || product.shortDesc || product.name,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.series || 'Shashi Enterprises Wholesale',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.wholesalePrice || product.retailSalePrice,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stockQty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Shashi Enterprises',
      },
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        minValue: product.moq || 5,
        unitCode: 'C62', // Pcs
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbJsonLd: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shashienterprises.store';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqJsonLd: React.FC<{ faqs: FaqItem[] }> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
