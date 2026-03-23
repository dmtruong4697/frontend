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
    const base =
      'inline-flex items-center justify-center gap-2 font-bold rounded-full px-5 py-2.5 transition-all duration-200 active:scale-95 select-none cursor-pointer disabled:cursor-not-allowed border-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variants: Record<string, string> = {
      primary:
        'bg-sage-500 text-white hover:bg-sage-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-md focus-visible:ring-sage-400',
      secondary:
        'bg-peach-100 text-warm-900 hover:bg-peach-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 focus-visible:ring-peach-400',
      danger:
        'bg-blush-100 text-blush-600 hover:bg-blush-500 hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 focus-visible:ring-blush-500',
      ghost:
        'bg-transparent text-warm-700 hover:bg-sage-50 disabled:opacity-50 focus-visible:ring-sage-400',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(base, variants[variant] ?? variants.primary, className)}
        {...props}
      >
        {isLoading && (
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-current"
                style={{
                  animation: 'bounceDot 1.1s ease-in-out infinite',
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </span>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
