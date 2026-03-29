'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from './Button';
import { Check, ChevronDown, Search } from 'lucide-react';

export interface SelectOption {
  label: string;
  code: string;
  icon?: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Select({ label, options, value, onChange, placeholder = 'Select...' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.code === value);
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label className="text-sm font-bold" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
          className={cn(
            'w-full px-4 py-3 bg-white border-2 rounded-2xl text-left flex items-center justify-between transition-all duration-200',
            'font-semibold text-base',
            isOpen
              ? 'border-sage-500 ring-2 ring-sage-100'
              : 'border-warm-200 hover:border-sage-400'
          )}
          style={{ boxShadow: '0 1px 4px var(--shadow-warm)' }}
        >
          <span className={cn('flex items-center gap-2', !selectedOption && 'text-warm-200')}>
            {selectedOption ? (
              <>
                {selectedOption.icon && <span className="text-base leading-none">{selectedOption.icon}</span>}
                <span className="text-warm-900 font-bold">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-warm-700 opacity-50">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            className={cn('w-4 h-4 text-sage-500 transition-transform duration-200 shrink-0', isOpen && 'rotate-180')}
          />
        </button>

        {/* Dropdown */}
        <div
          className={cn(
            'absolute z-50 w-full mt-2 bg-white border-2 border-warm-100 rounded-2xl overflow-hidden transition-all duration-200 origin-top',
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto shadow-2xl'
              : 'opacity-0 scale-95 pointer-events-none shadow-none'
          )}
          style={{ boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,0.10)' : undefined }}
        >
          <div className="p-2 border-b border-warm-100 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-sage-400 ml-1 shrink-0" />
            <input
              autoFocus={isOpen}
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-1.5 text-base bg-transparent outline-none text-warm-900 placeholder:text-warm-200 font-medium"
            />
          </div>

          <div className="max-h-56 overflow-y-auto p-1.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    onChange(opt.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors duration-150 text-left text-base font-semibold',
                    value === opt.code
                      ? 'bg-sage-100 text-sage-700'
                      : 'text-warm-900 hover:bg-warm-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {opt.icon && <span className="text-base leading-none">{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </div>
                  {value === opt.code && <Check className="w-3.5 h-3.5 text-sage-600 shrink-0" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-warm-700 text-sm font-semibold italic opacity-50">
                Nothing found 🍃
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
