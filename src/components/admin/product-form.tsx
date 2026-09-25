'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PriceTier } from '@/lib/types';
import { addProduct, updateProduct } from '@/lib/catalog-store';
import { CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ProductFormProps {
  initialProduct?: Product | null;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, isEdit = false }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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
    image: initialProduct?.image || 'https://placehold.co/800x800/1C1A21/E2632B?text=New+Product',
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
    try {
      let finalFormData = { ...formData };

      // Helper function to process any base64 image string to JPEG + GitHub upload
      const convertAndUploadBase64 = async (base64Str: string, sku?: string, isGallery = false): Promise<string> => {
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Str, sku, isGallery })
        });
        const json = await res.json();
        if (res.ok && json.url) {
          return json.url;
        }
        throw new Error(json.error || 'Failed to upload image to GitHub');
      };

      // 1. Convert Primary Image if it's base64 or raw data
      if (finalFormData.image && (finalFormData.image.startsWith('data:image/') || (finalFormData.image.length > 500 && !finalFormData.image.startsWith('http') && !finalFormData.image.startsWith('/')))) {
        try {
          const uploadedUrl = await convertAndUploadBase64(finalFormData.image, finalFormData.sku);
          finalFormData.image = uploadedUrl;
        } catch (uploadErr: any) {
          alert(`Image upload to GitHub failed: ${uploadErr?.message || 'Server Error'}\n\nPlease check that GITHUB_PAT is set in Vercel Environment Variables.`);
          setSubmitting(false);
          return;
        }
      }

      // 2. Convert Gallery Images if any are base64
      if (finalFormData.gallery && finalFormData.gallery.length > 0) {
        const updatedGallery: string[] = [];
        for (const gImg of finalFormData.gallery) {
          if (gImg.startsWith('data:image/') || (gImg.length > 500 && !gImg.startsWith('http') && !gImg.startsWith('/'))) {
            try {
              const uploadedUrl = await convertAndUploadBase64(gImg, finalFormData.sku, true);
              updatedGallery.push(uploadedUrl);
            } catch (uploadErr: any) {
              alert(`Gallery image upload to GitHub failed: ${uploadErr?.message || 'Server Error'}`);
              setSubmitting(false);
              return;
            }
          } else {
            updatedGallery.push(gImg);
          }
        }
        finalFormData.gallery = updatedGallery;
      }

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
            <label className="text-xs font-bold uppercase text-ink-950">Primary Image URL *</label>
            <input
              type="text"
              required
              value={formData.image}
              onChange={async (e) => {
                const val = e.target.value;
                if (val.startsWith('data:image/') || (val.length > 500 && !val.startsWith('http') && !val.startsWith('/'))) {
                  setUploadingImages(true);
                  try {
                    const res = await fetch('/api/admin/upload-image', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ image: val, sku: formData.sku })
                    });
                    const json = await res.json();
                    if (res.ok && json.url) {
                      handleFieldChange('image', json.url);
                    } else {
                      handleFieldChange('image', val);
                    }
                  } catch (err) {
                    handleFieldChange('image', val);
                  } finally {
                    setUploadingImages(false);
                  }
                } else {
                  handleFieldChange('image', val);
                }
              }}
              placeholder="/catalog/product-142.jpeg or paste base64 image..."
              className="w-full bg-parchment-50 border border-parchment-300 text-xs p-2.5 rounded-[6px] focus:outline-none text-ink-950"
            />
            {uploadingImages && (
              <span className="text-[11px] font-bold text-ember-600 animate-pulse block">
                ⚡ Converting Base64 image to JPEG & committing to GitHub...
              </span>
            )}
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-ink-950 block">Upload Product Images From Device (PNG, JPG, JPEG Only)</label>
            {uploadingImages && (
              <span className="text-xs font-bold text-ember-600 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ember-500 animate-ping"></span>
                Committing to GitHub Catalog...
              </span>
            )}
          </div>
          <input
            type="file"
            multiple
            disabled={uploadingImages}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;

              const validFiles = files.filter(file => {
                const type = file.type.toLowerCase();
                const name = file.name.toLowerCase();
                return (
                  type === 'image/png' ||
                  type === 'image/jpeg' ||
                  type === 'image/jpg' ||
                  type === 'image/webp' ||
                  name.endsWith('.png') ||
                  name.endsWith('.jpg') ||
                  name.endsWith('.jpeg') ||
                  name.endsWith('.webp')
                );
              });

              if (validFiles.length < files.length) {
                alert('Only PNG, JPG, JPEG, and WEBP image formats are allowed.');
              }

              if (validFiles.length > 0) {
                setUploadingImages(true);
                try {
                  const currentGallery = [...(formData.gallery || [])];
                  let updatedPrimary = formData.image;

                  for (let i = 0; i < validFiles.length; i++) {
                    const file = validFiles[i];
                    const uploadData = new FormData();
                    uploadData.append('file', file);
                    if (formData.sku) uploadData.append('sku', formData.sku);

                    // Determine image index: if no primary image set, 0 is primary, rest are gallery
                    const isFirstPrimary = (!formData.image || formData.image.includes('placehold.co')) && i === 0;
                    const imageIndex = isFirstPrimary ? 0 : (i + currentGallery.length + (updatedPrimary && !updatedPrimary.includes('placehold.co') ? 1 : 0));
                    
                    uploadData.append('index', imageIndex.toString());

                    const res = await fetch('/api/admin/upload-image', {
                      method: 'POST',
                      body: uploadData
                    });

                    const resJson = await res.json();

                    if (res.ok && resJson.url) {
                      const finalUrl = resJson.url;
                      if (i === 0 && (!updatedPrimary || updatedPrimary.includes('placehold.co'))) {
                        updatedPrimary = finalUrl;
                      } else {
                        currentGallery.push(finalUrl);
                      }
                    } else {
                      alert(`Upload failed for ${file.name}: ${resJson.error || 'Server error'}`);
                    }
                  }

                  setFormData(prev => ({
                    ...prev,
                    image: updatedPrimary,
                    gallery: currentGallery
                  }));

                } catch (err: any) {
                  console.error('Image Upload Exception:', err);
                  alert(`Image upload failed: ${err?.message || 'Server error'}`);
                } finally {
                  setUploadingImages(false);
                  e.target.value = '';
                }
              }
            }}
            className="w-full text-xs text-ink-950 file:mr-3 file:py-2 file:px-3 file:rounded-[6px] file:border-0 file:text-xs file:font-bold file:bg-ember-500 file:text-white hover:file:bg-ember-600 cursor-pointer disabled:opacity-50"
          />
          <p className="text-[11px] text-muted">Uploads image files directly to GitHub Catalog (`public/catalog/`) & assigns clean static URLs. 0 base64 strings stored in DB.</p>

          {/* Gallery Previews */}
          {formData.gallery && formData.gallery.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-ink-950 uppercase block mb-2">Uploaded Gallery Images ({formData.gallery.length}):</span>
              <div className="flex flex-wrap gap-2.5">
                {formData.gallery.map((img, i) => {
                  const rawFallback = img.startsWith('/catalog/') 
                    ? `https://raw.githubusercontent.com/wpzvqrs8/shashienterprises/main/public${img}`
                    : img;
                  return (
                    <div key={i} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded bg-parchment-100 border border-parchment-300 overflow-hidden group">
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
        </div>

        {/* Thumbnail Preview */}
        {formData.image && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-muted font-bold">Image Preview:</span>
            <div className="w-20 h-20 rounded bg-parchment-50 border border-parchment-300 relative overflow-hidden flex items-center justify-center p-1">
              <img 
                src={formData.image} 
                alt="Preview" 
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
            <span className="text-[11px] font-mono text-muted overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
              {formData.image}
            </span>
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
