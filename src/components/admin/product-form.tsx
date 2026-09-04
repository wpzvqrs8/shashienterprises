'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PriceTier } from '@/lib/types';
import { addProduct, updateProduct } from '@/lib/catalog-store';
import { CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ProductFormProps {
  initialProduct?: Product | null;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, isEdit = false }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    sku: initialProduct?.sku || '',
    category: initialProduct?.category || 'Action Figures',
    series: initialProduct?.series || 'Dragon Ball',
    retailRegPrice: initialProduct?.retailRegPrice || 1999,
    retailSalePrice: initialProduct?.retailSalePrice || 1200,
    wholesalePrice: initialProduct?.wholesalePrice || 750,
    stockQty: initialProduct?.stockQty || 100,
    moq: initialProduct?.moq || 5,
    status: initialProduct?.status || 'active',
    image: initialProduct?.image || 'https://placehold.co/800x800/1C1A21/E2632B?text=New+Product',
    heightCm: initialProduct?.heightCm || 25,
    material: initialProduct?.material || 'PVC/Resin',
    description: initialProduct?.description || '',
    shortDesc: initialProduct?.shortDesc || '',
    badges: initialProduct?.badges || ['new'],
    featured: initialProduct?.featured || false,
    wholesaleTiers: initialProduct?.wholesaleTiers || [
      { minQty: 5, maxQty: 19, pricePerPc: 750 },
      { minQty: 20, maxQty: 49, pricePerPc: 680 },
      { minQty: 50, pricePerPc: 620 },
    ],
  });

  const handleFieldChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Tier operations
  const handleTierChange = (index: number, field: keyof PriceTier, value: any) => {
    const updatedTiers = [...(formData.wholesaleTiers || [])];
    updatedTiers[index] = { ...updatedTiers[index], [field]: Number(value) };
    setFormData(prev => ({ ...prev, wholesaleTiers: updatedTiers }));
  };

  const addTierRow = () => {
    const current = formData.wholesaleTiers || [];
    const lastTier = current[current.length - 1];
    const newMin = lastTier ? (lastTier.maxQty ? lastTier.maxQty + 1 : lastTier.minQty + 20) : 5;
    const newPrice = lastTier ? Math.round(lastTier.pricePerPc * 0.9) : 700;

    setFormData(prev => ({
      ...prev,
      wholesaleTiers: [...current, { minQty: newMin, pricePerPc: newPrice }]
    }));
  };

  const removeTierRow = (index: number) => {
    const current = formData.wholesaleTiers || [];
    setFormData(prev => ({
      ...prev,
      wholesaleTiers: current.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.wholesalePrice) {
      alert('Please fill in required fields (Name, Category, Wholesale Price).');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && initialProduct) {
        await updateProduct(initialProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      router.push('/admin/catalog');
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-5xl mx-auto w-full max-w-full overflow-x-hidden">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-300 pb-4">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-ink-950">
              {isEdit ? `Edit Product: ${initialProduct?.name}` : 'Add New Wholesale Product'}
            </h1>
            <p className="text-xs text-muted">Configure product specifications, wholesale price tiers, and inventory.</p>
          </div>
        </div>

        <Button type="submit" variant="ember" size="md" disabled={submitting} className="gap-2 shadow-warm w-full sm:w-auto">
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving Product...' : 'Save Product'}</span>
        </Button>
      </div>

      {/* Section 1: Basic Information */}
      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-4 sm:p-6 space-y-4 shadow-sm">
        <h3 className="font-display text-lg sm:text-xl text-ink-950 border-b border-parchment-300 pb-2">
          1. Basic Product Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              placeholder="e.g. Ultra Instinct Goku 28cm"
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950 font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">SKU Code</label>
            <input
              type="text"
              value={formData.sku}
              onChange={e => handleFieldChange('sku', e.target.value)}
              placeholder="e.g. SE-DBZ-0142"
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Franchise / Series *</label>
            <select
              value={formData.series}
              onChange={e => handleFieldChange('series', e.target.value)}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 font-semibold"
            >
              {CATEGORIES.filter(c => c.type === 'series').map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Category Type *</label>
            <select
              value={formData.category}
              onChange={e => handleFieldChange('category', e.target.value)}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 font-semibold"
            >
              {CATEGORIES.filter(c => c.type === 'type').map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-ink-950">Short Description</label>
          <input
            type="text"
            value={formData.shortDesc}
            onChange={e => handleFieldChange('shortDesc', e.target.value)}
            placeholder="1-sentence summary for product cards..."
            className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-ink-950">Full Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={e => handleFieldChange('description', e.target.value)}
            placeholder="Detailed collectible features, dimensions, aura base details..."
            className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none focus:border-ember-500 text-ink-950"
          />
        </div>
      </div>

      {/* Section 2: Base Pricing & Stock Inventory */}
      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-4 sm:p-6 space-y-4 shadow-sm">
        <h3 className="font-display text-lg sm:text-xl text-ink-950 border-b border-parchment-300 pb-2">
          2. Base Pricing & Stock Inventory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Retail Reg. Price (₹)</label>
            <input
              type="number"
              value={formData.retailRegPrice}
              onChange={e => handleFieldChange('retailRegPrice', Number(e.target.value))}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none font-bold text-ink-950"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Retail Sale Ref (₹)</label>
            <input
              type="number"
              value={formData.retailSalePrice}
              onChange={e => handleFieldChange('retailSalePrice', Number(e.target.value))}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none font-bold text-ink-950"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Base Wholesale Rate (₹) *</label>
            <input
              type="number"
              required
              value={formData.wholesalePrice}
              onChange={e => handleFieldChange('wholesalePrice', Number(e.target.value))}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none font-bold text-ember-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Stock Quantity (pcs) *</label>
            <input
              type="number"
              required
              value={formData.stockQty}
              onChange={e => handleFieldChange('stockQty', Number(e.target.value))}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none font-bold text-ink-950"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Minimum Order Quantity (MOQ) *</label>
            <input
              type="number"
              required
              value={formData.moq}
              onChange={e => handleFieldChange('moq', Number(e.target.value))}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none font-bold text-ink-950"
            />
          </div>
        </div>

        {/* Show Strikethrough Old Price Toggle */}
        <div className="flex items-center gap-3 pt-2 bg-parchment-50 p-3 rounded border border-parchment-300">
          <input
            type="checkbox"
            id="showOldPriceToggle"
            checked={formData.showOldPrice !== false}
            onChange={e => handleFieldChange('showOldPrice', e.target.checked)}
            className="w-4 h-4 accent-ember-500 rounded cursor-pointer shrink-0"
          />
          <label htmlFor="showOldPriceToggle" className="text-xs font-bold uppercase text-ink-950 cursor-pointer">
            Show Strikethrough Old Price (₹{formData.retailSalePrice || 0}) on Storefront & Product Cards
          </label>
        </div>

      </div>

      {/* Section 3: Wholesale Tier Builder (Mobile Friendly Stacked/Flex Layout) */}
      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-row justify-between items-center border-b border-parchment-300 pb-2">
          <h3 className="font-display text-lg sm:text-xl text-ink-950">
            3. Wholesale Volume Pricing Tiers
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addTierRow} className="gap-1 text-xs shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tier</span>
          </Button>
        </div>

        <div className="space-y-3">
          {formData.wholesaleTiers?.map((tier, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-parchment-50 p-3 rounded-[6px] border border-parchment-300">
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 text-xs font-bold flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted text-[11px] shrink-0">Min Qty:</span>
                  <input
                    type="number"
                    value={tier.minQty}
                    onChange={e => handleTierChange(idx, 'minQty', e.target.value)}
                    className="w-full sm:w-20 bg-parchment-100 border border-parchment-300 p-1.5 rounded font-mono text-center"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-muted text-[11px] shrink-0">Max Qty:</span>
                  <input
                    type="number"
                    value={tier.maxQty || ''}
                    placeholder="∞"
                    onChange={e => handleTierChange(idx, 'maxQty', e.target.value)}
                    className="w-full sm:w-20 bg-parchment-100 border border-parchment-300 p-1.5 rounded font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-bold pt-1 sm:pt-0 border-t sm:border-0 border-parchment-300/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted text-[11px] shrink-0">Rate/pc (₹):</span>
                  <input
                    type="number"
                    value={tier.pricePerPc}
                    onChange={e => handleTierChange(idx, 'pricePerPc', e.target.value)}
                    className="w-28 bg-parchment-100 border border-parchment-300 p-1.5 rounded font-mono text-ember-600 font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeTierRow(idx)}
                  className="text-muted hover:text-danger p-1.5 rounded bg-parchment-200/60 sm:bg-transparent"
                  title="Remove tier row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Image Media & Status Badges */}
      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-4 sm:p-6 space-y-4 shadow-sm">
        <h3 className="font-display text-lg sm:text-xl text-ink-950 border-b border-parchment-300 pb-2">
          4. Image Media, Status & Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Primary Image URL *</label>
            <input
              type="text"
              required
              value={formData.image}
              onChange={e => handleFieldChange('image', e.target.value)}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Listing Status *</label>
            <select
              value={formData.status}
              onChange={e => handleFieldChange('status', e.target.value)}
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950 font-bold"
            >
              <option value="active">Active (Visible in Store)</option>
              <option value="draft">Draft (Admin Only)</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Device Image File Upload (PNG, JPG, JPEG Only) */}
        <div className="bg-parchment-50 p-3.5 sm:p-4 rounded-[8px] border border-parchment-300 space-y-3">
          <label className="text-xs font-bold uppercase text-ink-950 block">Upload Product Images From Device (PNG, JPG, JPEG Only)</label>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                // Filter strictly for PNG, JPG, JPEG formats
                const validFiles = files.filter(file => {
                  const type = file.type.toLowerCase();
                  const name = file.name.toLowerCase();
                  return (
                    type === 'image/png' ||
                    type === 'image/jpeg' ||
                    type === 'image/jpg' ||
                    name.endsWith('.png') ||
                    name.endsWith('.jpg') ||
                    name.endsWith('.jpeg')
                  );
                });

                if (validFiles.length < files.length) {
                  alert('Only PNG, JPG, and JPEG image formats are allowed.');
                }

                if (validFiles.length > 0) {
                  validFiles.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = (uploadEvent) => {
                      const result = uploadEvent.target?.result as string;
                      if (result) {
                        setFormData(prev => {
                          const currentGallery = prev.gallery || [];
                          const updatedGallery = [...currentGallery, result];
                          const primaryImg = (!prev.image || prev.image.includes('placehold.co')) && index === 0 ? result : prev.image;
                          return { ...prev, image: primaryImg, gallery: updatedGallery };
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }
              }
            }}
            className="w-full text-xs text-ink-950 file:mr-3 file:py-2 file:px-3 file:rounded-[6px] file:border-0 file:text-xs file:font-bold file:bg-ember-500 file:text-white hover:file:bg-ember-600 cursor-pointer"
          />
          <p className="text-[11px] text-muted">Accepts PNG, JPG, and JPEG files only. Uploaded images will populate the main product image and gallery.</p>

          {/* Gallery Previews */}
          {formData.gallery && formData.gallery.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-ink-950 uppercase block mb-2">Uploaded Gallery Images ({formData.gallery.length}):</span>
              <div className="flex flex-wrap gap-2.5">
                {formData.gallery.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded bg-parchment-100 border border-parchment-300 overflow-hidden group">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          gallery: (prev.gallery || []).filter((_, gIdx) => gIdx !== i)
                        }));
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Preview */}
        {formData.image && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-muted font-bold">Image Preview:</span>
            <div className="w-16 h-16 rounded bg-parchment-50 border border-parchment-300 relative overflow-hidden">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold uppercase text-ink-950">Special Badge Chips & Custom Tags</label>
          
          <div className="flex flex-wrap gap-2 items-center">
            {['new', 'bestseller', 'limited'].map(b => (
              <button
                type="button"
                key={b}
                onClick={() => {
                  const current = formData.badges || [];
                  const updated = current.includes(b as any)
                    ? current.filter(x => x !== b)
                    : [...current, b as any];
                  handleFieldChange('badges', updated);
                }}
                className={`text-xs px-3 py-1.5 rounded uppercase font-bold border transition-colors ${
                  formData.badges?.includes(b as any)
                    ? 'bg-amber-300 text-black font-extrabold border-black/20 shadow-sm'
                    : 'bg-parchment-50 text-ink-950 border-parchment-300'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Admin Custom Tag Builder with Color Picker (Mobile Responsive) */}
          <div className="bg-parchment-50 p-3 rounded-[6px] border border-parchment-300 space-y-2">
            <span className="text-xs font-bold text-ink-950 uppercase block">Add Custom Tag with Background Color:</span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                id="customTagInput"
                placeholder="Tag text (e.g. Exclusive, 2026 Import)"
                className="bg-parchment-100 border border-parchment-300 text-xs p-2 rounded focus:outline-none text-black font-bold flex-1"
              />
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted font-bold">Color:</span>
                  <input
                    type="color"
                    id="customTagColor"
                    defaultValue="#FBBF24"
                    className="w-8 h-8 rounded cursor-pointer border border-parchment-300 p-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const tagInput = (document.getElementById('customTagInput') as HTMLInputElement)?.value.trim();
                    if (tagInput) {
                      const current = formData.badges || [];
                      if (!current.includes(tagInput as any)) {
                        handleFieldChange('badges', [...current, tagInput]);
                      }
                      (document.getElementById('customTagInput') as HTMLInputElement).value = '';
                    }
                  }}
                  className="bg-black text-white text-xs font-bold px-3 py-2 rounded hover:bg-ink-900 transition-colors uppercase shrink-0"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <input
            type="checkbox"
            id="featuredToggle"
            checked={formData.featured}
            onChange={e => handleFieldChange('featured', e.target.checked)}
            className="w-4 h-4 accent-ember-500 rounded shrink-0"
          />
          <label htmlFor="featuredToggle" className="text-xs font-bold uppercase text-ink-950 cursor-pointer">
            Mark as Featured Homepage Highlight
          </label>
        </div>
      </div>

      {/* Form Submit Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-parchment-300">
        <Button type="button" variant="outline" size="md" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="ember" size="lg" disabled={submitting} className="gap-2 shadow-warm">
          <Save className="w-5 h-5" />
          <span>{submitting ? 'Saving Product...' : 'Save Product'}</span>
        </Button>
      </div>

    </form>
  );
};
