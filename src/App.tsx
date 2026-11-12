import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { ProfileCard } from './components/ProfileCard';
import { ProjectsCards } from './components/ProjectsCards';
import { SocialCards } from './components/SocialCards';
import { Footer } from './components/Footer';

// Lightweight animation configuration optimized for low-power and weak mobile GPUs
const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Initialize Telegram WebApp SDK & Safe Area insets
  useTelegramWebApp(theme);

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-zinc-900 transition-colors duration-150">
      {/* Header Bar */}
      <Header />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 pl-safe pr-safe pt-6 sm:pt-8 pb-12 space-y-6 sm:space-y-7">
        {/* Profile Card with smooth entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
        >
          <ProfileCard t={t} />
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={fadeVariants}
        >
          <ProjectsCards language={language} t={t} />
        </motion.div>

        {/* Social Network Cards (Telegram, Instagram, X) with scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={fadeVariants}
        >
          <SocialCards language={language} t={t} />
        </motion.div>
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
