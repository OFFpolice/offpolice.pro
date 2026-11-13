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
      <div className="flex flex-row md:flex-col items-center gap-1 p-1.5 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.12)] dark:shadow-[0_14px_36px_-6px_rgba(0,0,0,0.65)] transition-colors duration-150">
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
              className={`relative w-16 h-11 md:w-11 md:h-14 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                isActive
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="floating-nav-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-zinc-900/[0.08] dark:bg-white/[0.12] border border-zinc-900/[0.08] dark:border-white/[0.08]"
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
