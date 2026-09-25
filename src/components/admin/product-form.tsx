'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PriceTier } from '@/lib/types';
import { addProduct, updateProduct, generateNextMaterialCode } from '@/lib/catalog-store';
import { CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, ArrowLeft, Image as ImageIcon, Sparkles, UploadCloud } from 'lucide-react';

interface ProductFormProps {
  initialProduct?: Product | null;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, isEdit = false }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitStatusMsg, setSubmitStatusMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    sku: initialProduct?.sku || '',
    category: initialProduct?.category || 'Action Figures',
    series: initialProduct?.series || 'Dragon Ball',
    retailRegPrice: initialProduct?.retailRegPrice || 1999,
    retailSalePrice: initialProduct?.retailSalePrice || 1200,
    wholesalePrice: initialProduct?.wholesalePrice || 750,
    stockQty: initialProduct?.stockQty ?? 50,
    moq: initialProduct?.moq ?? 5,
    status: initialProduct?.status || 'active',
    image: initialProduct?.image || '',
    gallery: initialProduct?.gallery || [],
    heightCm: initialProduct?.heightCm || 25,
    material: initialProduct?.material || 'PVC/Resin',
    description: initialProduct?.description || '',
    shortDesc: initialProduct?.shortDesc || '',
    badges: initialProduct?.badges || ['new'],
    featured: initialProduct?.featured || false,
  });

  const handleFieldChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to read Files into Base64 Data URLs for instant local previews
  const processFilesToDataUrls = (files: File[]) => {
    const validFiles = files.filter(file => {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      return (
        type.startsWith('image/') ||
        name.endsWith('.png') ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.webp')
      );
    });

    if (validFiles.length < files.length) {
      alert('Only PNG, JPG, JPEG, and WEBP image formats are supported.');
    }

    if (validFiles.length === 0) return;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) return;

        setFormData(prev => {
          if (!prev.image || prev.image.trim() === '' || prev.image.includes('placehold.co')) {
            return { ...prev, image: result };
          } else {
            const currentGallery = prev.gallery || [];
            return { ...prev, gallery: [...currentGallery, result] };
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || formData.name.trim().length < 3) {
      alert('Product Title is required and must be at least 3 characters long.');
      return;
    }
    if (!formData.category) {
      alert('Please select a Category Type.');
      return;
    }
    if (!formData.wholesalePrice || Number(formData.wholesalePrice) <= 0) {
      alert('Base Wholesale Rate (₹) must be greater than 0.');
      return;
    }
    if (formData.stockQty === undefined || Number(formData.stockQty) < 0) {
      alert('Stock Quantity must be 0 or greater.');
      return;
    }

    setSubmitting(true);
    setSubmitStatusMsg('Preparing product data...');

    try {
      let finalFormData = { ...formData };

      // Generate or compute target SKU for filename assignment
      const targetSku = (finalFormData.sku && finalFormData.sku.trim() !== '' && !finalFormData.sku.includes('Auto-generated'))
        ? finalFormData.sku.trim()
        : await generateNextMaterialCode();
      
      finalFormData.sku = targetSku;

      // Upload image payload (Base64/File/Data URL) to GitHub API endpoint
      const uploadImageToGithub = async (imagePayload: string, sku: string, index: number): Promise<string> => {
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imagePayload, sku, index })
        });
        const json = await res.json();
        if (res.ok && json.url) {
          return json.url;
        }
        throw new Error(json.error || 'Failed to upload image to GitHub repository');
      };

      // 1. Process Primary Image if it's Base64 / Data URL / Raw Payload
      if (finalFormData.image && (finalFormData.image.startsWith('data:image/') || (finalFormData.image.length > 500 && !finalFormData.image.startsWith('http') && !finalFormData.image.startsWith('/')))) {
        setSubmitStatusMsg(`Committing primary image to GitHub catalog (${targetSku})...`);
        try {
          const committedUrl = await uploadImageToGithub(finalFormData.image, targetSku, 0);
          finalFormData.image = committedUrl;
        } catch (uploadErr: any) {
          alert(`Primary image upload to GitHub failed: ${uploadErr?.message || 'Server Error'}\n\nPlease verify GITHUB_PAT is set in Vercel environment variables.`);
          setSubmitting(false);
          return;
        }
      }

      // 2. Process Gallery Images if any are Base64 / Data URLs
      if (finalFormData.gallery && finalFormData.gallery.length > 0) {
        const updatedGallery: string[] = [];
        for (let i = 0; i < finalFormData.gallery.length; i++) {
          const gImg = finalFormData.gallery[i];
          if (gImg.startsWith('data:image/') || (gImg.length > 500 && !gImg.startsWith('http') && !gImg.startsWith('/'))) {
            setSubmitStatusMsg(`Committing gallery image ${i + 1} to GitHub catalog...`);
            try {
              const committedUrl = await uploadImageToGithub(gImg, targetSku, i + 1);
              updatedGallery.push(committedUrl);
            } catch (uploadErr: any) {
              alert(`Gallery image ${i + 1} upload to GitHub failed: ${uploadErr?.message || 'Server Error'}`);
              setSubmitting(false);
              return;
            }
          } else {
            updatedGallery.push(gImg);
          }
        }
        finalFormData.gallery = updatedGallery;
      }

      setSubmitStatusMsg('Saving product row to database...');

      if (isEdit && initialProduct) {
        await updateProduct(initialProduct.id, finalFormData);
      } else {
        await addProduct(finalFormData);
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
            <p className="text-xs text-muted">Configure product specifications, wholesale pricing, and inventory.</p>
          </div>
        </div>

        <Button type="submit" variant="ember" size="md" disabled={submitting} className="gap-2 shadow-warm w-full sm:w-auto">
          <Save className="w-4 h-4" />
          <span>{submitting ? (submitStatusMsg || 'Saving Product...') : 'Save Product'}</span>
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
            <label className="text-xs font-bold uppercase text-ink-950">Material / SKU Code (Auto-Generated)</label>
            <input
              type="text"
              readOnly
              value={formData.sku || 'Auto-generated: SE-ANM-101+'}
              className="w-full bg-parchment-200/70 border border-parchment-300 text-xs p-2.5 rounded-[6px] text-ink-950 font-mono font-bold cursor-not-allowed"
            />
            <span className="text-[10px] text-muted block">System automatically assigns non-clashing code (e.g. SE-ANM-101, SE-ANM-102)</span>
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

      {/* Section 3: Image Media & Status Badges */}
      <div className="bg-parchment-100 border border-parchment-300 rounded-[10px] p-4 sm:p-6 space-y-4 shadow-sm">
        <h3 className="font-display text-lg sm:text-xl text-ink-950 border-b border-parchment-300 pb-2">
          3. Image Media, Status & Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-ink-950">Primary Image URL / Base64</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => handleFieldChange('image', e.target.value)}
              placeholder="Paste image URL or Base64 string..."
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950"
            />
            <span className="text-[10px] text-muted block">Image will be previewed immediately below and committed to GitHub when you click "Save Product".</span>
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

        {/* Drag & Drop Image Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFiles = Array.from(e.dataTransfer.files || []);
            if (droppedFiles.length > 0) {
              processFilesToDataUrls(droppedFiles);
            }
          }}
          className={`p-6 rounded-[10px] border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
            isDragging
              ? 'border-ember-500 bg-ember-100/40 scale-[1.01]'
              : 'border-parchment-300 bg-parchment-50 hover:border-ember-500/60'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-ember-100 border border-ember-500/30 flex items-center justify-center text-ember-600">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-950">
              Drag & Drop product images here, or <span className="text-ember-600 underline">browse files</span>
            </p>
            <p className="text-[11px] text-muted">Supports PNG, JPG, JPEG, and WEBP. Uploads directly to GitHub catalog on Save.</p>
          </div>

          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) {
                processFilesToDataUrls(files);
              }
              e.target.value = '';
            }}
            className="absolute opacity-0 cursor-pointer w-full h-full inset-0"
          />
        </div>

        {/* Immediate Local Image Preview Box */}
        {formData.image && (
          <div className="bg-parchment-50 p-3 rounded-[8px] border border-parchment-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-ink-950">Primary Image Preview:</span>
              <button
                type="button"
                onClick={() => handleFieldChange('image', '')}
                className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Remove Primary Image
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded bg-parchment-100 border border-parchment-300 relative overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={formData.image}
                  alt="Primary Preview"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const rawFallback = formData.image?.startsWith('/catalog/')
                      ? `https://raw.githubusercontent.com/wpzvqrs8/shashienterprises/main/public${formData.image}`
                      : formData.image || '';
                    if (target.src !== rawFallback) {
                      target.src = rawFallback;
                    }
                  }}
                />
              </div>
              <div className="space-y-1 overflow-hidden">
                <p className="text-xs font-mono font-bold text-ink-950 truncate max-w-md">
                  {formData.image.startsWith('data:image/') ? '[Local Base64 / File Staged]' : formData.image}
                </p>
                <span className="text-[11px] text-muted block">
                  {formData.image.startsWith('data:image/')
                    ? '✨ Staged locally. Will be converted to JPEG/PNG & committed to GitHub when you click Save Product.'
                    : 'Static Path Ready.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Previews */}
        {formData.gallery && formData.gallery.length > 0 && (
          <div className="bg-parchment-50 p-3 rounded-[8px] border border-parchment-300 space-y-2">
            <span className="text-xs font-bold text-ink-950 uppercase block mb-1">
              Gallery Images ({formData.gallery.length}):
            </span>
            <div className="flex flex-wrap gap-2.5">
              {formData.gallery.map((img, i) => {
                const rawFallback = img.startsWith('/catalog/')
                  ? `https://raw.githubusercontent.com/wpzvqrs8/shashienterprises/main/public${img}`
                  : img;
                return (
                  <div key={i} className="relative w-20 h-20 rounded bg-parchment-100 border border-parchment-300 overflow-hidden group">
                    <img
                      src={img}
                      alt={`Gallery ${i}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== rawFallback) {
                          target.src = rawFallback;
                        }
                      }}
                    />
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
                );
              })}
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

          {/* Admin Custom Tag Builder */}
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
          <span>{submitting ? (submitStatusMsg || 'Saving Product...') : 'Save Product'}</span>
        </Button>
      </div>

    </form>
  );
};
