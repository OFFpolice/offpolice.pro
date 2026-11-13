import React from 'react';
import { motion } from 'motion/react';
import { House, Rss } from 'lucide-react';
import { AppTab, Translations } from '../types';

interface FloatingNavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  t: Translations;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  activeTab,
  onTabChange,
  t,
}) => {
  const handleSelect = (tab: AppTab) => {
    if (tab !== activeTab) {
      try {
        window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
      } catch (e) {}
      onTabChange(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const items: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'card',
      label: t.navCard,
      icon: <House className="w-[22px] h-[22px] shrink-0" strokeWidth={2} />,
    },
    {
      id: 'feed',
      label: t.navFeed,
      icon: <Rss className="w-[22px] h-[22px] shrink-0" strokeWidth={2} />,
    },
  ];

  return (
    <nav
      id="floating-navbar"
      aria-label={t.navLabel}
      className="fixed z-40 bottom-[max(1rem,calc(0.75rem+var(--safe-area-bottom)))] left-1/2 -translate-x-1/2 md:bottom-auto md:top-[calc(3.5rem+var(--safe-area-top)+1.75rem)] md:left-4 lg:left-6 xl:left-8 md:translate-x-0"
    >
      <div className="flex flex-row md:flex-col items-center gap-1 p-1.5 rounded-full bg-white/88 dark:bg-[#101823]/90 backdrop-blur-xl border border-zinc-200/90 dark:border-white/10 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.16)] dark:shadow-[0_14px_36px_-6px_rgba(0,0,0,0.65)] transition-colors duration-150">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-label={item.label}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative w-16 h-11 md:w-11 md:h-14 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isActive
                  ? 'text-sky-500 dark:text-[#38bdf8]'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="floating-nav-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-sky-500/12 dark:bg-white/12 border border-sky-500/20 dark:border-white/10"
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 flex items-center justify-center">
                {item.icon}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
