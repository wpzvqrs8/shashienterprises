import React from 'react';

interface SkeletonProps {
  className?: string;
  dark?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', dark = false }) => {
  const bgClass = dark ? 'bg-ink-800' : 'bg-parchment-300';
  return (
    <div className={`animate-shimmer ${bgClass} rounded-[6px] ${className}`} />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-parchment-50 border border-parchment-300 rounded-[10px] p-3 space-y-3 flex flex-col h-full">
      <Skeleton className="w-full aspect-square rounded-[8px]" />
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-4/5 h-6" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-1/2 h-6" />
        <Skeleton className="w-1/4 h-5" />
      </div>
      <Skeleton className="w-full h-9 rounded-[6px] mt-auto" />
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="border-b border-parchment-300">
      <td className="p-3"><Skeleton className="w-4 h-4" /></td>
      <td className="p-3"><Skeleton className="w-12 h-12 rounded-[6px]" /></td>
      <td className="p-3 space-y-1"><Skeleton className="w-40 h-5" /><Skeleton className="w-20 h-3" /></td>
      <td className="p-3"><Skeleton className="w-24 h-5" /></td>
      <td className="p-3"><Skeleton className="w-16 h-5" /></td>
      <td className="p-3"><Skeleton className="w-16 h-5" /></td>
      <td className="p-3"><Skeleton className="w-20 h-6 rounded-full" /></td>
      <td className="p-3"><Skeleton className="w-24 h-4" /></td>
      <td className="p-3 flex space-x-2"><Skeleton className="w-8 h-8 rounded-[4px]" /><Skeleton className="w-8 h-8 rounded-[4px]" /></td>
    </tr>
  );
};
