'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  titleRu: string;
  titleEn: string;
  titleUk: string;
  bodyRu?: string;
  bodyEn?: string;
  bodyUk?: string;
  severity: 'info' | 'warning' | 'maintenance' | 'feature';
  dismissible: boolean;
  actionUrl?: string;
  actionLabelRu?: string;
  actionLabelEn?: string;
  actionLabelUk?: string;
}

const severityStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  maintenance: 'bg-purple-50 border-purple-200 text-purple-800',
  feature: 'bg-emerald-50 border-emerald-200 text-emerald-800',
};

const severityIcons = {
  info: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  warning: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  maintenance: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  feature: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
};

export function PtAnnouncementBanner() {
  const { locale } = useApp();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/collections/portalAnnouncements')
      .then(res => res.json())
      .then(data => {
        const active = (data || []).filter((a: Announcement & { status: string }) => a.status === 'active');
        setAnnouncements(active);
      })
      .catch(() => setAnnouncements([]));
  }, []);

  const handleDismiss = (id: string) => {
    setDismissed(prev => [...prev, id]);
  };

  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => {
        const title = locale === 'ru' ? announcement.titleRu : locale === 'uk' ? announcement.titleUk : announcement.titleEn;
        const body = locale === 'ru' ? announcement.bodyRu : locale === 'uk' ? announcement.bodyUk : announcement.bodyEn;
        const actionLabel = locale === 'ru' ? announcement.actionLabelRu : locale === 'uk' ? announcement.actionLabelUk : announcement.actionLabelEn;

        return (
          <div
            key={announcement.id}
            className={cn(
              'rounded-xl border p-4 flex items-start gap-3',
              severityStyles[announcement.severity]
            )}
          >
            <span className="flex-shrink-0 mt-0.5">
              {severityIcons[announcement.severity]}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{title}</div>
              {body && <div className="text-sm mt-1 opacity-80">{body}</div>}
              {announcement.actionUrl && actionLabel && (
                <a href={announcement.actionUrl} className="text-sm font-medium underline mt-2 inline-block">
                  {actionLabel}
                </a>
              )}
            </div>
            {announcement.dismissible && (
              <button
                onClick={() => handleDismiss(announcement.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
