import { useState, useEffect } from 'react';
import { Language } from '../types';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('offpolice_lang') as Language | null;
    if (saved === 'en' || saved === 'ru' || saved === 'uk') return saved;
    
    const browserLang = navigator.language?.toLowerCase() || '';
    if (browserLang.startsWith('uk')) return 'uk';
    if (browserLang.startsWith('ru')) return 'ru';
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('offpolice_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return { language, setLanguage };
}
