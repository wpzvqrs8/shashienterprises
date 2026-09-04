import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ember' | 'outline' | 'ghost' | 'dark' | 'jade' | 'danger' | 'default' | 'secondary' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'default' | 'xs' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'ember',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-ember-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider select-none shrink-0';

  const variantStyles = {
    ember: 'bg-ember-500 text-white hover:bg-ember-600 hover:-translate-y-[1px] shadow-warm',
    default: 'bg-ember-500 text-white hover:bg-ember-600 hover:-translate-y-[1px] shadow-warm',
    outline: 'border border-parchment-300 text-ink-text bg-transparent hover:bg-parchment-100 hover:border-ink-800',
    secondary: 'border border-parchment-300 text-ink-text bg-parchment-100 hover:bg-parchment-300',
    dark: 'bg-ink-950 text-parchment-text hover:bg-ink-900 border border-ink-800 hover:-translate-y-[1px]',
    ghost: 'text-ink-text hover:bg-parchment-100 bg-transparent',
    jade: 'bg-jade-600 text-white hover:bg-opacity-90 hover:-translate-y-[1px]',
    danger: 'bg-danger text-white hover:bg-opacity-90 hover:-translate-y-[1px]',
    destructive: 'bg-danger text-white hover:bg-opacity-90 hover:-translate-y-[1px]',
    link: 'text-ember-600 underline-offset-4 hover:underline bg-transparent border-0',
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-[11px]',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    default: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base font-bold',
    icon: 'w-8 h-8 p-0 flex items-center justify-center',
    'icon-xs': 'w-6 h-6 p-0 flex items-center justify-center',
    'icon-sm': 'w-7 h-7 p-0 flex items-center justify-center',
    'icon-lg': 'w-10 h-10 p-0 flex items-center justify-center',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.ember} ${sizeStyles[size] || sizeStyles.md} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
