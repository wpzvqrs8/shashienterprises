'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { getProducts, deleteProduct, bulkDeleteProducts, addProduct } from '@/lib/catalog-store';
import { CATEGORIES } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableRowSkeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AdminCatalogPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusTab, setStatusTab] = useState<string>('all');

  // Multi-select Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isBulkDeleteModal, setIsBulkDeleteModal] = useState(false);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchCatalog = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();

    let matchesStatus = true;
    if (statusTab === 'active') matchesStatus = p.status === 'active';
    else if (statusTab === 'draft') matchesStatus = p.status === 'draft';
    else if (statusTab === 'out-of-stock') matchesStatus = p.status === 'out-of-stock' || p.stockQty === 0;
    else if (statusTab === 'archived') matchesStatus = p.status === 'archived';

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Single Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const targetName = deleteTarget.name;
    
    // Optimistic UI Update
    setProducts(prev => prev.filter(p => p.id !== targetId));
    setDeleteTarget(null);

    await deleteProduct(targetId);
    showToast(`Product "${targetName}" deleted successfully.`);
  };

  // Bulk Delete Handler
  const handleBulkDeleteConfirm = async () => {
    const count = selectedIds.length;
    // Optimistic UI Update
    setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setIsBulkDeleteModal(false);

    await bulkDeleteProducts(selectedIds);
    showToast(`Bulk deleted ${count} products.`);
  };

  // Duplicate Product Handler
  const handleDuplicate = async (p: Product) => {
    const dup = await addProduct({
      ...p,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-COPY`,
      slug: `${p.slug}-copy-${Date.now()}`
    });
    setProducts(prev => [dup, ...prev]);
    showToast(`Duplicated product "${p.name}".`);
  };

  // Toggle All Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink-950 text-parchment-text border border-ember-500 p-4 rounded-[8px] shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-jade-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Title & Add Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink-950">Wholesale Catalog Manager</h1>
          <p className="text-xs text-muted">Manage product prices, MOQ tiers, inventory stock, and status badges.</p>
        </div>

        <Link href="/admin/catalog/new">
          <Button variant="ember" size="md" className="gap-2 shadow-warm">
            <Plus className="w-4 h-4" />
            <span> Add Product</span>
          </Button>
        </Link>
      </div>

      {/* Control Bar: Search + Category Filter + Status Segmented Control */}
      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-4 space-y-4">
        
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950 pl-9"
            />
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase shrink-0">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-parchment-50 border border-parchment-300 text-ink-950 text-xs px-3 py-2 rounded-[6px] focus:outline-none font-semibold"
            >
              <option value="">All Categories & Series</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Status Segmented Tabs */}
        <div className="flex items-center space-x-1 border-t border-parchment-300/80 pt-3 text-xs font-bold">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'active', label: 'Active' },
            { id: 'draft', label: 'Drafts' },
            { id: 'out-of-stock', label: 'Out of Stock' },
            { id: 'archived', label: 'Archived' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-[6px] uppercase tracking-wider transition-colors cursor-pointer ${
                statusTab === tab.id
                  ? 'bg-ink-950 text-parchment-text'
                  : 'text-muted hover:bg-parchment-50 hover:text-ink-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-16 z-30 bg-ink-950 text-parchment-text p-3 rounded-[8px] border border-ink-800 flex items-center justify-between shadow-warm animate-fade-in">
          <div className="text-xs font-bold">
            <span className="text-ember-500 font-mono text-sm mr-2">{selectedIds.length}</span>
            items selected for bulk action
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsBulkDeleteModal(true)}
              className="gap-1 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="text-xs text-white bg-white border-white/30 hover:bg-ink-900 hover:text-white font-bold"
            >
              Deselect All
            </Button>

          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-parchment-300/60 border-b border-parchment-300 text-ink-950 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="accent-ember-500 rounded"
                  />
                </th>
                <th className="py-3 px-3 w-16">Image</th>
                <th className="py-3 px-3">Product Name & SKU</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Wholesale Rate</th>
                <th className="py-3 px-3 text-center">Stock Qty</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Updated</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-300">
              {loading ? (
                [...Array(6)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted">
                    No products matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-ember-100/50' : 'hover:bg-parchment-50/80'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          className="accent-ember-500 rounded"
                        />
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-3">
                        <div className="w-12 h-12 bg-parchment-50 rounded-[6px] relative overflow-hidden border border-parchment-300">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                      </td>

                      {/* Name & SKU */}
                      <td className="py-3 px-3 font-medium">
                        <Link href={`/product/${product.slug}`} target="_blank" className="font-display text-sm text-ink-950 hover:text-ember-600 block line-clamp-1">
                          {product.name}
                        </Link>
                        <div className="text-[11px] font-mono text-muted">
                          SKU: {product.sku} • MOQ: {product.moq} pcs
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-muted">
                        <span className="font-semibold text-ink-950">{product.series}</span>
                        <div className="text-[11px]">{product.category}</div>
                      </td>

                      {/* Wholesale Price */}
                      <td className="py-3 px-3 text-right font-display text-sm font-bold text-ember-600">
                        ₹{product.wholesalePrice.toLocaleString('en-IN')}
                      </td>

                      {/* Stock Qty */}
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        <span className={product.stockQty === 0 ? 'text-danger font-bold' : product.stockQty < 50 ? 'text-gold-500' : 'text-ink-950'}>
                          {product.stockQty} pcs
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            product.status === 'active' ? 'stock' :
                            product.status === 'draft' ? 'draft' :
                            product.status === 'out-of-stock' ? 'out' : 'draft'
                          }
                        >
                          {product.status}
                        </Badge>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3 px-3 text-muted text-[11px]">
                        {new Date(product.createdAt).toLocaleDateString('en-IN')}
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Link href={`/admin/catalog/${product.id}/edit`}>
                            <button
                              className="p-1.5 text-muted hover:text-ink-950 hover:bg-parchment-300 rounded"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Link>

                          <button
                            onClick={() => handleDuplicate(product)}
                            className="p-1.5 text-muted hover:text-ink-950 hover:bg-parchment-300 rounded"
                            title="Duplicate product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 text-muted hover:text-danger hover:bg-parchment-300 rounded"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Single Product Confirm Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This action will remove the product from both the public storefront catalog and admin records. This cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk Delete Confirm Modal */}
      <ConfirmDialog
        isOpen={isBulkDeleteModal}
        title={`Delete ${selectedIds.length} Selected Products?`}
        message="Are you sure you want to delete all selected products? This action cannot be undone."
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setIsBulkDeleteModal(false)}
      />

    </div>
  );
}
