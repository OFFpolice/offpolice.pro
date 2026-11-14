export type Language = 'en' | 'ru' | 'uk';

export type Theme = 'light' | 'dark';

export interface SocialLink {
  id: 'telegram' | 'telegram-channel' | 'instagram' | 'x';
  name: string;
  handle: string;
  url: string;
  description: Record<Language, string>;
  badge: Record<Language, string>;
}

export interface ProjectItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  type: 'bot' | 'mini-app';
  typeLabel: string;
  extraBadge?: string;
  description: Record<Language, string>;
  icon: 'music' | 'shazam' | 'radio' | 'game' | 'search' | 'download' | 'letter-e';
}

export type AppTab = 'card' | 'feed';

export type FeedCategory = 'all' | 'vlog' | 'projects' | 'notes';

export interface FeedPost {
  id: string;
  category: Exclude<FeedCategory, 'all'>;
  date: string;
  title: Record<Language, string>;
  body: Record<Language, string>;
  linkLabel?: Record<Language, string>;
  linkUrl?: string;
}

export interface Translations {
  appTitle: string;
  role: string;
  statusOnline: string;
  shortBio: string;
  writeButton: string;
  projectsButton: string;
  copied: string;
  copyLink: string;
  copyHandle: string;
  visitProfile: string;
  projectsTitle: string;
  openProject: string;
  close: string;
  themeToggle: string;
  languageSelect: string;
  footerRights: string;
  footerHome: string;
  footerBlog: string;
  verifiedBadge: string;
  navLabel: string;
  navCard: string;
  navFeed: string;
  feedTitle: string;
  feedSubtitle: string;
  feedFilterAll: string;
  feedFilterVlog: string;
  feedFilterProjects: string;
  feedFilterNotes: string;
  feedReadMore: string;
  feedEmpty: string;
  feedFollowTitle: string;
  feedFollowAction: string;
}
