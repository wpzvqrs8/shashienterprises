'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  stockQty?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max,
  stockQty,
  size = 'md',
  className = '',
  disabled = false,
}) => {
  // Determine effective max stock limit
  const maxLimit = max ?? (stockQty !== undefined && stockQty > 0 ? stockQty : 9999);
  const [inputValue, setInputValue] = useState<string>(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || value <= min) return;
    const next = Math.max(min, value - 1);
    onChange(next);
    setInputValue(String(next));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || value >= maxLimit) return;
    const next = Math.min(maxLimit, value + 1);
    onChange(next);
    setInputValue(String(next));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(raw);

    if (raw !== '') {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= min) {
        const clamped = Math.min(parsed, maxLimit);
        onChange(clamped);
      }
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < min) {
      onChange(min);
      setInputValue(String(min));
    } else if (parsed > maxLimit) {
      onChange(maxLimit);
      setInputValue(String(maxLimit));
    } else {
      onChange(parsed);
      setInputValue(String(parsed));
    }
  };

  const isMinDisabled = disabled || value <= min;
  const isMaxDisabled = disabled || value >= maxLimit;

  // Size specific styling with perfectly symmetric square buttons
  const sizeStyles = {
    sm: {
      box: 'p-0.5',
      btn: 'w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0 p-0',
      icon: 'w-3 h-3 sm:w-3.5 sm:h-3.5',
      input: 'w-7 sm:w-9 text-[11px] sm:text-xs py-0.5',
    },
    md: {
      box: 'p-0.5',
      btn: 'w-7 h-7 flex items-center justify-center shrink-0 p-0',
      icon: 'w-3.5 h-3.5',
      input: 'w-12 text-xs py-0.5',
    },
    lg: {
      box: 'p-0.5 sm:p-1',
      btn: 'w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 p-0',
      icon: 'w-4 h-4',
      input: 'w-14 sm:w-16 text-sm py-1',
    },
  }[size];

  return (
    <div
      className={`inline-flex items-center border border-parchment-300 rounded-[6px] bg-parchment-50 text-ink-950 select-none w-fit shrink-0 ${sizeStyles.box} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMinDisabled}
        className={`${sizeStyles.btn} text-ink-950 hover:text-ember-600 hover:bg-parchment-200/60 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors`}
        aria-label="Decrease quantity"
        title={`Minimum quantity is ${min}`}
      >
        <Minus className={sizeStyles.icon} />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleBlur();
        }}
        onClick={(e) => e.stopPropagation()}
        className={`${sizeStyles.input} text-center font-mono font-bold bg-transparent border-x border-parchment-300/80 text-ink-950 focus:outline-none focus:bg-white focus:ring-1 focus:ring-ember-500 rounded-none transition-colors`}
        aria-label="Quantity input"
        title={stockQty ? `Enter quantity (1 - ${stockQty} instock items)` : `Enter quantity`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMaxDisabled}
        className={`${sizeStyles.btn} text-ink-950 hover:text-ember-600 hover:bg-parchment-200/60 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors`}
        aria-label="Increase quantity"
        title={stockQty ? `Maximum available stock is ${stockQty}` : `Increase quantity`}
      >
        <Plus className={sizeStyles.icon} />
      </button>
    </div>
  );
};
