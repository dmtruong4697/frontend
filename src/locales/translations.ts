import { SupportedLanguage } from '../stores/useLocaleStore';
import { TranslationDict } from './types';

import { en } from './en';
import { ja } from './ja';
import { ko } from './ko';
import { zh } from './zh';
import { vi } from './vi';
import { th } from './th';
import { ms } from './ms';
import { ru } from './ru';
import { hi } from './hi';

export const LANGUAGES: Record<SupportedLanguage, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  th: { name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  ms: { name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
};

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en, ja, ko, zh, vi, th, ms, ru, hi
};
