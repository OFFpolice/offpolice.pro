import React from 'react';
import { IdCard, Newspaper } from 'lucide-react';
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
      icon: <IdCard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'feed',
      label: t.navFeed,
      icon: <Newspaper className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <nav
      id="floating-navbar"
      aria-label={t.navLabel}
      className="fixed z-40 bottom-[max(1rem,calc(0.75rem+var(--safe-area-bottom)))] left-1/2 -translate-x-1/2 md:bottom-auto md:top-[calc(3.5rem+var(--safe-area-top)+1.75rem)] md:left-4 lg:left-6 xl:left-8 md:translate-x-0"
    >
      <div className="flex flex-row md:flex-col items-center md:items-stretch gap-1 p-1.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-lg shadow-zinc-900/10 dark:shadow-black/40 transition-colors duration-150">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[40px] md:min-h-[42px] px-4 md:px-3.5 py-2 flex items-center justify-center md:justify-start gap-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
