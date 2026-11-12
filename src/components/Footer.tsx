import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Globe, Check, ArrowUp } from 'lucide-react';
import { Language, Theme, Translations } from '../types';

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onToggleTheme: () => void;
  t: Translations;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
];

export const Footer: React.FC<FooterProps> = ({
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  t,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="app-footer"
      className="w-full mt-10 pt-6 pb-[max(1.5rem,calc(1.5rem+var(--safe-area-bottom)))] border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright & domain link */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-0.5">
          <p className="text-zinc-700 dark:text-zinc-300 font-medium">
            <a
              id="footer-domain-link"
              href="https://offpolice.pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
            >
              OFFpolice.pro
            </a>
            . {t.footerRights}
          </p>
          <span className="text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()}
          </span>
        </div>

        {/* Footer controls: Theme toggle, Language selector, and Scroll to top */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label={t.themeToggle}
            title={t.themeToggle}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-zinc-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-700" />
            )}
          </button>

          {/* Language selector dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              id="lang-dropdown-trigger"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label={t.languageSelect}
              title={t.languageSelect}
            >
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span className="uppercase font-mono font-semibold">{language}</span>
            </button>

            {langMenuOpen && (
              <div
                id="lang-dropdown-menu"
                className="absolute right-0 bottom-full mb-1.5 w-36 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-1 z-50 font-sans"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-select-${lang.code}`}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                      language === lang.code
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subtle separator */}
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Scroll to top */}
          <button
            id="scroll-to-top-btn"
            onClick={scrollToTop}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

