import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Bookmark, Send } from 'lucide-react';
import { FeedCategory, Language, Translations } from '../types';
import { FEED_POSTS } from '../data/feed';

interface FeedSectionProps {
  language: Language;
  t: Translations;
}

const BOOKMARKS_STORAGE_KEY = 'offpolice_feed_bookmarks';

export const FeedSection: React.FC<FeedSectionProps> = ({ language, t }) => {
  const [category, setCategory] = useState<FeedCategory>('all');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, [bookmarks]);

  const toggleBookmark = (id: string) => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light');
    } catch {}
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories: { id: FeedCategory; label: string }[] = [
    { id: 'all', label: t.feedFilterAll },
    { id: 'vlog', label: t.feedFilterVlog },
    { id: 'projects', label: t.feedFilterProjects },
    { id: 'notes', label: t.feedFilterNotes },
  ];

  const categoryLabels: Record<Exclude<FeedCategory, 'all'>, string> = {
    vlog: t.feedFilterVlog,
    projects: t.feedFilterProjects,
    notes: t.feedFilterNotes,
  };

  const formatDate = (isoDate: string) => {
    try {
      const locale = language === 'ru' ? 'ru-RU' : language === 'uk' ? 'uk-UA' : 'en-US';
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(isoDate));
    } catch {
      return isoDate;
    }
  };

  const filteredPosts =
    category === 'all'
      ? FEED_POSTS
      : FEED_POSTS.filter((post) => post.category === category);

  return (
    <section id="feed-section" className="w-full space-y-5">
      {/* Feed Header & Filter Controls */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 transition-colors">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t.feedTitle}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t.feedSubtitle}
          </p>
        </div>

        {/* Category filter segmented control */}
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-800"
          role="tablist"
          aria-label={t.feedTitle}
        >
          {categories.map((cat) => {
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                id={`feed-filter-${cat.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Entries */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-xl p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
          {t.feedEmpty}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const isBookmarked = bookmarks.includes(post.id);
            return (
              <article
                key={post.id}
                id={`feed-post-${post.id}`}
                className="rounded-xl p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-3"
              >
                {/* Unboxed Metadata Line */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {categoryLabels[post.category]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookmark(post.id)}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
                    aria-pressed={isBookmarked}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'
                    }`}
                  >
                    <Bookmark
                      className="w-3.5 h-3.5"
                      fill={isBookmarked ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                {/* Title & Body */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {post.title[language]}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {post.body[language]}
                  </p>
                </div>

                {/* Optional Action Link */}
                {post.linkUrl && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
                    <a
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>{post.linkLabel ? post.linkLabel[language] : t.feedReadMore}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Direct Channel CTA */}
      <div className="rounded-xl p-4 sm:p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t.feedFollowTitle}
        </span>
        <a
          href="https://telegram.me/OFFpolice"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t.feedFollowAction}</span>
        </a>
      </div>
    </section>
  );
};
