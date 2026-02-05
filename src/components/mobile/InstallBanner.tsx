'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const i18n = {
  ru: {
    title: 'Установите Wealth OS',
    description: 'Добавьте на главный экран для быстрого доступа',
    install: 'Установить',
    later: 'Позже',
    iosInstructions: 'Нажмите "Поделиться" → "На экран Домой"',
  },
  en: {
    title: 'Install Wealth OS',
    description: 'Add to home screen for quick access',
    install: 'Install',
    later: 'Later',
    iosInstructions: 'Tap "Share" → "Add to Home Screen"',
  },
  uk: {
    title: 'Встановіть Wealth OS',
    description: 'Додайте на головний екран для швидкого доступу',
    install: 'Встановити',
    later: 'Пізніше',
    iosInstructions: 'Натисніть "Поділитися" → "На екран Домашній"',
  },
};

interface InstallBannerProps {
  className?: string;
  forceShow?: boolean;
}

export function InstallBanner({ className, forceShow = false }: InstallBannerProps) {
  const { locale } = useApp();
  const t = i18n[locale];

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    // Check if dismissed recently
    const dismissed = localStorage.getItem('wealthos_install_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show banner if not dismissed in last 7 days and not installed
      if (!standalone && (daysSinceDismissed > 7 || forceShow)) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS banner after delay if not installed
    if (ios && !standalone && (daysSinceDismissed > 7 || forceShow)) {
      setTimeout(() => setShowBanner(true), 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [forceShow]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('wealthos_install_dismissed', Date.now().toString());
  };

  if (!showBanner || isStandalone) return null;

  return (
    <div
      className={cn(
        'fixed bottom-20 left-4 right-4 z-40',
        'bg-gradient-to-r from-emerald-500 to-emerald-600',
        'rounded-2xl shadow-xl shadow-emerald-500/25',
        'p-4 animate-in slide-in-from-bottom-5',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white mb-1">{t.title}</h3>
          <p className="text-sm text-white/80">
            {isIOS ? t.iosInstructions : t.description}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Actions */}
      {!isIOS && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleInstall}
            className="flex-1 px-4 py-2 bg-white text-emerald-600 font-medium rounded-xl hover:bg-white/90 transition-colors"
          >
            {t.install}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors"
          >
            {t.later}
          </button>
        </div>
      )}
    </div>
  );
}
