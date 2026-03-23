import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-bold" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 outline-none',
            'bg-white border-2 placeholder:font-normal',
            error
              ? 'border-blush-500 focus:border-blush-500 focus:ring-2 focus:ring-blush-100'
              : 'border-warm-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-100',
            'text-warm-900 placeholder:text-warm-200',
            className
          )}
          style={{ boxShadow: '0 1px 4px var(--shadow-warm)' }}
          {...props}
        />
        {error && <span className="text-xs font-semibold text-blush-600">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
