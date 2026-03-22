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
          <label className="text-sm font-semibold text-forest-700 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'px-4 py-2.5 bg-white border-2 border-matcha-100 rounded-2xl text-forest-900 outline-none focus:border-matcha-500 transition-all placeholder:text-gray-400 shadow-sm',
            error && 'border-rose-400 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
