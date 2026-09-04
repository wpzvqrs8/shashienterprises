import React from 'react';
import { PriceTier } from '@/lib/types';

interface PriceTierTableProps {
  retailPrice: number;
  wholesalePrice: number;
  tiers: PriceTier[];
  currentQty?: number;
  showOldPrice?: boolean;
}

export const PriceTierTable: React.FC<PriceTierTableProps> = ({
  retailPrice,
  wholesalePrice,
  tiers,
  currentQty = 0,
  showOldPrice = true,
}) => {
  const displayTiers = tiers && tiers.length > 0 ? tiers : [
    { minQty: 5, maxQty: 19, pricePerPc: wholesalePrice },
    { minQty: 20, maxQty: 49, pricePerPc: Math.round(wholesalePrice * 0.92) },
    { minQty: 50, pricePerPc: Math.round(wholesalePrice * 0.85) },
  ];

  return (
    <div className="space-y-2 my-4">
      <div className="text-xs text-muted font-medium">
        {showOldPrice && (
          <span>Retail Price: <span className="line-through text-ink-950 font-bold">₹{retailPrice.toLocaleString('en-IN')}</span> — </span>
        )}
        <span className="text-ember-600 font-semibold">Your Wholesale Tier Pricing:</span>
      </div>


      <div className="border border-parchment-300 rounded-[8px] overflow-hidden bg-parchment-50 shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-parchment-100 border-b border-parchment-300 text-ink-950 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Order Quantity</th>
              <th className="py-2.5 px-3 text-right">Wholesale Rate / pc</th>
              <th className="py-2.5 px-3 text-right hidden sm:table-cell">Savings vs Retail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-parchment-300">
            {displayTiers.map((tier, idx) => {
              const isCurrentActive = currentQty >= tier.minQty && (!tier.maxQty || currentQty <= tier.maxQty);
              const qtyLabel = tier.maxQty ? `${tier.minQty}–${tier.maxQty} pcs` : `${tier.minQty}+ pcs`;
              const discount = Math.round(((retailPrice - tier.pricePerPc) / retailPrice) * 100);

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${isCurrentActive ? 'bg-ember-100/60 font-semibold border-l-4 border-l-ember-500' : 'hover:bg-parchment-100/50'}`}
                >
                  <td className="py-2.5 px-3 text-ink-text flex items-center gap-2">
                    {qtyLabel}
                    {isCurrentActive && (
                      <span className="text-[10px] bg-ember-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Active Tier</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-ember-600 font-bold">
                    ₹{tier.pricePerPc.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-jade-600 font-medium hidden sm:table-cell">
                    {discount}% OFF
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
