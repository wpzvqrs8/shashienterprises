'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { getProductById } from '@/lib/catalog-store';
import { ProductForm } from '@/components/admin/product-form';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-muted">Loading product for editing...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-danger">Product with ID "{id}" not found.</div>;
  }

  return <ProductForm initialProduct={product} isEdit={true} />;
}
