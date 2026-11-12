import { useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

export function syncBrowserThemeState(theme: Theme) {
  if (typeof document === 'undefined') return;

  const isDark = theme === 'dark';
  const themeColor = isDark ? '#09090b' : '#ffffff';
  const root = document.documentElement;

  // 1. Toggle dark class and native CSS color-scheme
  if (isDark) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  // Explicitly assign root & body background so Safari / WebKit color sampler sees identical color
  root.style.backgroundColor = themeColor;
  if (document.body) {
    document.body.style.backgroundColor = themeColor;
  }

  // 2. Refresh all theme-color meta tags
  const themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  if (themeMetas.length > 0) {
    themeMetas.forEach((meta) => {
      meta.setAttribute('content', themeColor);
    });
  } else {
    const newMeta = document.createElement('meta');
    newMeta.name = 'theme-color';
    newMeta.content = themeColor;
    newMeta.id = 'meta-theme-color';
    document.head.appendChild(newMeta);
  }

  // 3. Microsoft Windows / Edge titlebar and navigation color
  let msNavMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
  if (!msNavMeta) {
    msNavMeta = document.createElement('meta');
    msNavMeta.setAttribute('name', 'msapplication-navbutton-color');
    document.head.appendChild(msNavMeta);
  }
  msNavMeta.setAttribute('content', themeColor);

  // 4. Apple iOS Mobile Web App Status Bar
  let appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (!appleStatusBarMeta) {
    appleStatusBarMeta = document.createElement('meta');
    appleStatusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    document.head.appendChild(appleStatusBarMeta);
  }
  appleStatusBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');

  // 5. Telegram WebApp Header & Background synchronization
  try {
    const tg = (window as unknown as { Telegram?: { WebApp?: { isVersionAtLeast?: (v: string) => boolean; setHeaderColor?: (c: string) => void; setBackgroundColor?: (c: string) => void } } }).Telegram?.WebApp;
    const canSetColor = tg && (typeof tg.isVersionAtLeast === 'function' ? tg.isVersionAtLeast('6.1') : true);
    if (canSetColor && tg?.setHeaderColor) {
      tg.setHeaderColor(themeColor);
    }
    if (canSetColor && tg?.setBackgroundColor) {
      tg.setBackgroundColor(themeColor);
    }
  } catch (_) {}
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('offpolice_theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Keep browser toolbar and status bar strictly synced on theme changes
  useEffect(() => {
    localStorage.setItem('offpolice_theme', theme);
    syncBrowserThemeState(theme);
  }, [theme]);

  // Synchronize with system theme if user has not explicitly chosen a preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('offpolice_theme');
      if (!saved) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}

