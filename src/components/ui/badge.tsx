import React from 'react';

interface BadgeProps {
  variant?: 'new' | 'bestseller' | 'limited' | 'stock' | 'draft' | 'out' | 'moq' | string;
  bgColor?: string;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'new',
  bgColor,
  children,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 text-xs font-black uppercase tracking-wider rounded-[4px] border border-black/20 text-black shadow-sm';

  const variantStyles: Record<string, string> = {
    new: 'bg-amber-300 text-black',
    bestseller: 'bg-amber-400 text-black',
    limited: 'bg-orange-400 text-black',
    stock: 'bg-emerald-300 text-black',
    draft: 'bg-gray-300 text-black',
    out: 'bg-red-300 text-black',
    moq: 'bg-yellow-200 text-black',
  };

  const customBgStyle = bgColor ? { backgroundColor: bgColor } : {};
  const badgeClasses = variantStyles[variant] || 'bg-amber-300 text-black';

  return (
    <span
      style={customBgStyle}
      className={`${baseStyles} ${!bgColor ? badgeClasses : 'text-black'} ${className}`}
    >
      {children}
    </span>
  );
};
