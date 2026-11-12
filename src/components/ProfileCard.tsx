import React, { useState } from 'react';
import {
  Check,
  Share2,
  BadgeCheck,
  Send,
  Layers,
} from 'lucide-react';
import { Translations } from '../types';
import avatarImg from '../assets/offpolice.webp';

interface ProfileCardProps {
  t: Translations;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  t,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(avatarImg);

  const handleCopyLink = () => {
    const targetUrl = 'https://offpolice.pro/';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(targetUrl).catch(() => {});
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = targetUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (e) {}
      document.body.removeChild(textArea);
    }

    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
    } catch (e) {}

    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleScrollToOfficialLinks = () => {
    const el = document.getElementById('social-links-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToProjects = () => {
    const el = document.getElementById('projects-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="profile-hero-card"
      className="w-full rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
        {/* Profile Avatar */}
        <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
          <div className="w-full h-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <img
              src={avatarSrc}
              alt="OFFpolice"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={() => {
                if (avatarSrc !== './offpolice.webp' && avatarSrc !== '/offpolice.webp') {
                  setAvatarSrc('./offpolice.webp');
                } else if (avatarSrc === './offpolice.webp') {
                  setAvatarSrc('/offpolice.webp');
                }
              }}
            />
          </div>
          <div
            className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 shadow-sm"
            title={t.statusOnline}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
              <span>OFFpolice</span>
              <BadgeCheck
                className="w-4 h-4 flex-shrink-0 [&>path:first-child]:fill-blue-500 [&>path:first-child]:stroke-blue-500 [&>path:last-child]:stroke-white"
                aria-label={t.verifiedBadge}
                title={t.verifiedBadge}
              />
            </h1>
          </div>

          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            {t.role}
          </p>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl mb-5">
            {t.shortBio}
          </p>

          {/* Direct Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Write / Send message -> scrolls to Official Links */}
            <button
              id="write-btn"
              onClick={handleScrollToOfficialLinks}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.writeButton}</span>
            </button>

            {/* Projects -> scrolls to Projects */}
            <button
              id="projects-btn"
              onClick={handleScrollToProjects}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
              <span>{t.projectsButton}</span>
            </button>

            {/* Copy Link / Share */}
            <button
              id="copy-card-link-btn"
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title={copiedLink ? t.copied : t.copyLink}
              aria-label={copiedLink ? t.copied : t.copyLink}
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
