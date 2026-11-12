import React, { useState } from 'react';
import {
  Send,
  Instagram,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { Language, Translations } from '../types';
import { SOCIAL_LINKS } from '../i18n/translations';

interface SocialCardsProps {
  language: Language;
  t: Translations;
}

export const SocialCards: React.FC<SocialCardsProps> = ({ language, t }) => {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleCopy = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(handle);
    setCopiedHandle(handle);
    setTimeout(() => {
      setCopiedHandle(null);
    }, 1800);
  };

  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'telegram':
        return <Send className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'x':
        return (
          <span
            className="w-4 h-4 flex items-center justify-center font-bold text-sm leading-none text-zinc-900 dark:text-zinc-100 select-none"
            aria-label="X"
          >
            𝕏
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="social-links-section" className="w-full space-y-3">
      <div className="px-1">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Official Links
        </h2>
      </div>

      <div className="space-y-2.5">
        {SOCIAL_LINKS.map((link) => (
          <div
            key={link.id}
            id={`social-card-${link.id}`}
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            {/* Left side: Icon, Name, Handle, Description */}
            <div className="flex items-start gap-3.5 mb-3 sm:mb-0">
              <div className="mt-0.5 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                {getSocialIcon(link.id)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {link.name}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {link.handle}
                  </span>
                  <button
                    onClick={(e) => handleCopy(link.handle, e)}
                    className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    title={copiedHandle === link.handle ? t.copied : t.copyHandle}
                    aria-label={t.copyHandle}
                  >
                    {copiedHandle === link.handle ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-md">
                  {link.description[language]}
                </p>
              </div>
            </div>

            {/* Right side: Badge and Direct Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800">
                {link.badge[language]}
              </span>

              <a
                id={`link-open-${link.id}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
              >
                <span>{t.visitProfile}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
