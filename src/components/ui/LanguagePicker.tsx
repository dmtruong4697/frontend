'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocaleStore, SupportedLanguage } from '@/stores/useLocaleStore';
import { LANGUAGES } from '@/locales/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { cn } from './Button'; // Re-use the existing utility if possible or provide simple cn

export default function LanguagePicker({ className }: { className?: string }) {
  const { locale, setLocale } = useLocaleStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES[locale] || LANGUAGES.en;

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative inline-block text-left z-[100]", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-warm-800 bg-white/70 backdrop-blur-md border border-white/60 hover:bg-white/90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <Globe className="w-4 h-4 text-raelo-500" />
        <span className="hidden sm:inline-block">{currentLang.name}</span>
        <span className="sm:hidden">{currentLang.flag}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-warm-500 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-3xl bg-white/95 backdrop-blur-xl border border-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] ring-1 ring-black/5 focus:outline-none overflow-hidden animate-fade-in-up"
          role="menu"
        >
          <div className="py-1.5 max-h-64 overflow-y-auto custom-scrollbar">
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => {
                  setLocale(key as SupportedLanguage);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm font-bold flex items-center justify-between group transition-colors",
                  locale === key 
                    ? "bg-raelo-50 text-raelo-700" 
                    : "text-warm-800 hover:bg-warm-50"
                )}
                role="menuitem"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className={cn(locale === key ? "text-raelo-700" : "group-hover:text-raelo-600")}>
                    {lang.nativeName}
                  </span>
                </div>
                {locale === key && <Check className="w-4 h-4 text-raelo-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
