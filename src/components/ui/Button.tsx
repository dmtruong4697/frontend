import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'px-4 py-2 rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent',
          {
            'bg-matcha-500 text-white hover:bg-matcha-600 disabled:bg-matcha-500/50 shadow-sm': variant === 'primary',
            'bg-matcha-100 text-forest-700 hover:bg-matcha-300 disabled:bg-matcha-100/50': variant === 'secondary',
            'bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-200': variant === 'danger',
            'bg-transparent hover:bg-matcha-100/50 text-forest-700': variant === 'ghost',
            'opacity-70 cursor-not-allowed': isLoading || props.disabled,
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
