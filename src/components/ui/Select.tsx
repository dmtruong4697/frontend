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
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
      {label && <label className="text-sm font-bold text-forest-700 ml-1">{label}</label>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-4 py-3 bg-white border-2 border-matcha-100 rounded-2xl text-left flex items-center justify-between transition-all focus:border-matcha-500 shadow-sm',
            isOpen && 'border-matcha-500 ring-2 ring-matcha-100'
          )}
        >
          <span className={cn('flex items-center gap-2', !selectedOption && 'text-matcha-300')}>
            {selectedOption ? (
              <>
                <span className="text-lg">{selectedOption.icon}</span>
                <span className="font-bold text-forest-900">{selectedOption.label}</span>
              </>
            ) : placeholder}
          </span>
          <ChevronDown className={cn('w-4 h-4 text-matcha-400 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-matcha-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 border-b border-matcha-100 flex items-center gap-2 bg-matcha-50/30">
              <Search className="w-4 h-4 text-matcha-400 ml-2" />
              <input
                autoFocus
                type="text"
                placeholder="Search language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 text-sm bg-transparent outline-none text-forest-900 placeholder:text-matcha-300 font-medium"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
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
                      'w-full px-4 py-2.5 rounded-xl flex items-center justify-between transition-colors hover:bg-matcha-50 text-left',
                      value === opt.code ? 'bg-matcha-100 text-matcha-700' : 'text-forest-700'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{opt.icon}</span>
                      <span className="font-bold">{opt.label}</span>
                    </div>
                    {value === opt.code && <Check className="w-4 h-4 text-matcha-600" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-matcha-400 text-sm font-bold italic">
                  No language found... 🍵
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
