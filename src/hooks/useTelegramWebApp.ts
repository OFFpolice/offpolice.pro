import { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';

interface TelegramSafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface TelegramWebApp {
  version?: string;
  platform?: string;
  isVersionAtLeast?: (version: string) => boolean;
  ready: () => void;
  expand: () => void;
  close?: () => void;
  isExpanded?: boolean;
  viewportHeight?: number;
  viewportStableHeight?: number;
  headerColor?: string;
  backgroundColor?: string;
  bottomBarColor?: string;
  isClosingConfirmationEnabled?: boolean;
  enableClosingConfirmation?: () => void;
  disableClosingConfirmation?: () => void;
  isVerticalSwipesEnabled?: boolean;
  enableVerticalSwipes?: () => void;
  disableVerticalSwipes?: () => void;
  lockOrientation?: (orientation?: 'portrait' | 'landscape') => void;
  unlockOrientation?: () => void;
  requestFullscreen?: () => void;
  exitFullscreen?: () => void;
  isFullscreen?: boolean;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  safeAreaInset?: TelegramSafeAreaInsets;
  contentSafeAreaInset?: TelegramSafeAreaInsets;
  onEvent?: (eventType: string, eventHandler: () => void) => void;
  offEvent?: (eventType: string, eventHandler: () => void) => void;
  initData?: string;
  initDataUnsafe?: {
    user?: {
      id?: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  colorScheme?: 'light' | 'dark';
  themeParams?: Record<string, string>;
  HapticFeedback?: {
    impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged?: () => void;
  };
  BackButton?: {
    isVisible?: boolean;
    show?: () => void;
    hide?: () => void;
    onClick?: (callback: () => void) => void;
    offClick?: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function checkIsTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false;
  const tg = window.Telegram?.WebApp;
  if (!tg) return false;
  const hasInitData = Boolean(tg.initData && tg.initData.length > 0);
  const isKnownPlatform = Boolean(tg.platform && tg.platform !== 'unknown');
  const hasTgHash = typeof window.location !== 'undefined' && window.location.hash.includes('tgWebAppData');
  return hasInitData || isKnownPlatform || hasTgHash;
}

export function useTelegramWebApp(theme: Theme): boolean {
  const [isTelegram, setIsTelegram] = useState<boolean>(() => checkIsTelegramWebApp());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const inTg = checkIsTelegramWebApp();
    setIsTelegram(inTg);
    document.documentElement.classList.toggle('is-telegram-app', inTg);

    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const isVersionAtLeast = (version: string): boolean => {
      try {
        if (typeof tg.isVersionAtLeast === 'function') {
          return tg.isVersionAtLeast(version);
        }
        return false;
      } catch {
        return false;
      }
    };

    // 1. Core Telegram WebApp Initialization & Configuration
    try {
      if (typeof tg.ready === 'function') {
        tg.ready();
      }
    } catch (e) {
      console.warn('Telegram WebApp ready error:', e);
    }

    try {
      if (typeof tg.expand === 'function') {
        tg.expand();
      }
    } catch (e) {
      console.warn('Telegram WebApp expand error:', e);
    }

    try {
      if (isVersionAtLeast('6.2') && typeof tg.enableClosingConfirmation === 'function') {
        tg.enableClosingConfirmation();
      }
    } catch (e) {
      console.warn('Telegram WebApp enableClosingConfirmation error:', e);
    }

    try {
      if (isVersionAtLeast('7.7') && typeof tg.disableVerticalSwipes === 'function') {
        tg.disableVerticalSwipes();
      }
    } catch (e) {
      console.warn('Telegram WebApp disableVerticalSwipes error:', e);
    }

    try {
      if (isVersionAtLeast('8.0') && typeof tg.lockOrientation === 'function') {
        tg.lockOrientation('portrait');
      }
    } catch (e) {
      console.warn('Telegram WebApp lockOrientation error:', e);
    }

    try {
      if (isVersionAtLeast('8.0') && typeof tg.requestFullscreen === 'function') {
        tg.requestFullscreen();
      }
    } catch (e) {
      console.warn('Telegram WebApp requestFullscreen error:', e);
    }

    // 2. Safe-Area Synchronization
    const updateSafeAreas = () => {
      const root = document.documentElement;
      
      const safeTop = tg.safeAreaInset?.top || 0;
      const safeBottom = tg.safeAreaInset?.bottom || 0;
      const safeLeft = tg.safeAreaInset?.left || 0;
      const safeRight = tg.safeAreaInset?.right || 0;

      const contentTop = tg.contentSafeAreaInset?.top || 0;
      const contentBottom = tg.contentSafeAreaInset?.bottom || 0;
      const contentLeft = tg.contentSafeAreaInset?.left || 0;
      const contentRight = tg.contentSafeAreaInset?.right || 0;

      root.style.setProperty('--tg-safe-area-inset-top', `${safeTop}px`);
      root.style.setProperty('--tg-safe-area-inset-bottom', `${safeBottom}px`);
      root.style.setProperty('--tg-safe-area-inset-left', `${safeLeft}px`);
      root.style.setProperty('--tg-safe-area-inset-right', `${safeRight}px`);

      root.style.setProperty('--tg-content-safe-area-inset-top', `${contentTop}px`);
      root.style.setProperty('--tg-content-safe-area-inset-bottom', `${contentBottom}px`);
      root.style.setProperty('--tg-content-safe-area-inset-left', `${contentLeft}px`);
      root.style.setProperty('--tg-content-safe-area-inset-right', `${contentRight}px`);

      // Authoritative Safe-Area for Telegram Mini App
      // In fullscreen: safeTop matches the status bar / notch (tg-safe-area from screenshot).
      // In standard sheet: safeTop is 0, eliminating any unwanted notch gap.
      root.style.setProperty('--safe-area-top', `${safeTop}px`);
      root.style.setProperty('--safe-area-bottom', `${Math.max(safeBottom, contentBottom)}px`);
      root.style.setProperty('--safe-area-left', `${Math.max(safeLeft, contentLeft)}px`);
      root.style.setProperty('--safe-area-right', `${Math.max(safeRight, contentRight)}px`);

      // Content Safe Area (tg-content-safe-area line from screenshot)
      root.style.setProperty('--content-safe-area-top', `${contentTop || safeTop}px`);
      root.style.setProperty('--content-safe-area-bottom', `${Math.max(safeBottom, contentBottom)}px`);
      root.style.setProperty('--content-safe-area-left', `${Math.max(safeLeft, contentLeft)}px`);
      root.style.setProperty('--content-safe-area-right', `${Math.max(safeRight, contentRight)}px`);

      // Symmetrical clearance so the header title stays physically centered relative to Telegram's buttons
      const isFullscreen = Boolean(tg.isFullscreen || safeTop > 0);
      const maxSideInset = Math.max(safeLeft, safeRight, contentLeft, contentRight, isFullscreen ? 72 : 16);
      root.style.setProperty('--header-side-clearance', `${maxSideInset}px`);
    };

    updateSafeAreas();

    // Event listeners for dynamic Safe-Area and Fullscreen changes
    if (typeof tg.onEvent === 'function') {
      tg.onEvent('safeAreaChanged', updateSafeAreas);
      tg.onEvent('contentSafeAreaChanged', updateSafeAreas);
      tg.onEvent('fullscreenChanged', updateSafeAreas);
      tg.onEvent('fullscreenFailed', updateSafeAreas);
      tg.onEvent('viewportChanged', updateSafeAreas);
    }

    window.addEventListener('resize', updateSafeAreas);

    return () => {
      if (typeof tg.offEvent === 'function') {
        tg.offEvent('safeAreaChanged', updateSafeAreas);
        tg.offEvent('contentSafeAreaChanged', updateSafeAreas);
        tg.offEvent('fullscreenChanged', updateSafeAreas);
        tg.offEvent('fullscreenFailed', updateSafeAreas);
        tg.offEvent('viewportChanged', updateSafeAreas);
      }
      window.removeEventListener('resize', updateSafeAreas);
    };
  }, []);

  // Synchronize Telegram WebApp Header and Background Colors with site theme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const isVersionAtLeast = (version: string): boolean => {
      try {
        if (typeof tg.isVersionAtLeast === 'function') {
          return tg.isVersionAtLeast(version);
        }
        return false;
      } catch {
        return false;
      }
    };

    const themeColor = theme === 'dark' ? '#09090b' : '#ffffff';
    try {
      if (isVersionAtLeast('6.1') && typeof tg.setHeaderColor === 'function') {
        tg.setHeaderColor(themeColor);
      }
      if (isVersionAtLeast('6.1') && typeof tg.setBackgroundColor === 'function') {
        tg.setBackgroundColor(themeColor);
      }
      if (isVersionAtLeast('7.10') && typeof tg.setBottomBarColor === 'function') {
        tg.setBottomBarColor(themeColor);
      }
    } catch (e) {
      console.warn('Telegram theme color sync error:', e);
    }
  }, [theme]);

  return isTelegram;
}

export function useTelegramBackButton(visible: boolean, onBack: () => void): void {
  const onBackRef = useRef(onBack);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tg = window.Telegram?.WebApp;
    const backButton = tg?.BackButton;
    if (!tg || !backButton) return;

    const supportsBackButton = (() => {
      try {
        return typeof tg.isVersionAtLeast !== 'function' || tg.isVersionAtLeast('6.1');
      } catch {
        return true;
      }
    })();

    if (!supportsBackButton) return;

    const handleBackClick = () => {
      try {
        tg.HapticFeedback?.selectionChanged?.();
      } catch {
        // Ignore haptic errors
      }
      onBackRef.current();
    };

    try {
      if (visible) {
        if (typeof backButton.onClick === 'function') {
          backButton.onClick(handleBackClick);
        } else if (typeof tg.onEvent === 'function') {
          tg.onEvent('backButtonClicked', handleBackClick);
        }
        if (typeof backButton.show === 'function') {
          backButton.show();
        }
      } else {
        if (typeof backButton.hide === 'function') {
          backButton.hide();
        }
      }
    } catch (e) {
      console.warn('Telegram BackButton sync error:', e);
    }

    return () => {
      try {
        if (typeof backButton.offClick === 'function') {
          backButton.offClick(handleBackClick);
        } else if (typeof tg.offEvent === 'function') {
          tg.offEvent('backButtonClicked', handleBackClick);
        }
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [visible]);
}
