export type Language = 'en' | 'ru' | 'uk';

export type Theme = 'light' | 'dark';

export interface SocialLink {
  id: 'telegram' | 'instagram' | 'x';
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
  verifiedBadge: string;
}
