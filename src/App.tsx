import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { TRANSLATIONS } from './i18n/translations';
import { AppTab } from './types';
import { Header } from './components/Header';
import { FloatingNavbar } from './components/FloatingNavbar';
import { ProfileCard } from './components/ProfileCard';
import { ProjectsCards } from './components/ProjectsCards';
import { SocialCards } from './components/SocialCards';
import { FeedSection } from './components/FeedSection';
import { Footer } from './components/Footer';

// Lightweight animation configuration optimized for low-power and weak mobile GPUs
const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

function getInitialTab(): AppTab {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') === 'feed' ? 'feed' : 'card';
  } catch {
    return 'card';
  }
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>(getInitialTab);

  // Initialize Telegram WebApp SDK & Safe Area insets
  useTelegramWebApp(theme);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    try {
      const url = new URL(window.location.href);
      if (tab === 'feed') {
        url.searchParams.set('tab', 'feed');
      } else {
        url.searchParams.delete('tab');
      }
      window.history.replaceState(null, '', url.toString());
    } catch {
      // Ignore history API restrictions
    }
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-zinc-900 transition-colors duration-150">
      {/* Header Bar */}
      <Header />

      {/* Responsive Floating Navigation Bar (bottom on mobile, top-left vertical on desktop) */}
      <FloatingNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        t={t}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 md:pl-24 lg:pl-6 pl-safe pr-safe pt-6 sm:pt-8 pb-12 space-y-6 sm:space-y-7">
        {activeTab === 'card' ? (
          <>
            {/* Profile Card with smooth entrance */}
            <motion.div
              key="card-profile"
              initial="hidden"
              animate="visible"
              variants={fadeVariants}
            >
              <ProfileCard t={t} />
            </motion.div>

            {/* Projects Section */}
            <motion.div
              key="card-projects"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              variants={fadeVariants}
            >
              <ProjectsCards language={language} t={t} />
            </motion.div>

            {/* Social Network Cards (Telegram, Instagram, X) with scroll animation */}
            <motion.div
              key="card-social"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              variants={fadeVariants}
            >
              <SocialCards language={language} t={t} />
            </motion.div>
          </>
        ) : (
          <motion.div
            key="feed-view"
            initial="hidden"
            animate="visible"
            variants={fadeVariants}
          >
            <FeedSection language={language} t={t} />
          </motion.div>
        )}
      </main>

      {/* Footer with Theme & Language controls */}
      <Footer
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
        t={t}
      />
    </div>
  );
}
