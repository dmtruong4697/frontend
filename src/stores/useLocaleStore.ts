import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedLanguage = 'en' | 'ja' | 'ko' | 'zh' | 'vi' | 'th' | 'ms' | 'ru' | 'hi';

interface LocaleState {
  locale: SupportedLanguage;
  setLocale: (rawLocale: SupportedLanguage) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (rawLocale) => set({ locale: rawLocale }),
    }),
    {
      name: 'raelo-locale', // unique name for localStorage
    }
  )
);
