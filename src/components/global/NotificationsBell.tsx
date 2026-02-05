"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  severity: string;
  title: string;
  link?: string;
  createdAt: string;
  status: string;
}

export function NotificationsBell() {
  const { locale } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/collections/notifications?limit=10&status=unread")
        .then((res) => res.json())
        .then((data) => setNotifications(data.items || []))
        .catch(() => setNotifications([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const severityColors: Record<string, string> = {
    info: "bg-blue-100 text-blue-600",
    warning: "bg-amber-100 text-amber-600",
    critical: "bg-rose-100 text-rose-600",
    success: "bg-emerald-100 text-emerald-600",
  };

  const typeIcons: Record<string, string> = {
    alert: "⚠️",
    task: "📋",
    message: "💬",
    system: "⚙️",
    approval: "✅",
    sync: "🔄",
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return locale === "ru" ? `${minutes} мин назад` : `${minutes}m ago`;
    } else if (hours < 24) {
      return locale === "ru" ? `${hours} ч назад` : `${hours}h ago`;
    } else {
      return locale === "ru" ? `${days} д назад` : `${days}d ago`;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-all relative"
        data-tour="notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-stone-100 flex items-center justify-between">
              <span className="font-medium text-sm text-stone-800">
                {locale === "ru" ? "Уведомления" : "Notifications"}
              </span>
              {unreadCount > 0 && (
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
                  {unreadCount} {locale === "ru" ? "новых" : "new"}
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-stone-400">
                  {locale === "ru" ? "Загрузка..." : "Loading..."}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-stone-400">
                  {locale === "ru" ? "Нет уведомлений" : "No notifications"}
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.link || "#"}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block p-3 hover:bg-stone-50 border-b border-stone-50 last:border-0 transition-colors",
                      notification.status === "unread" && "bg-blue-50/30"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "w-6 h-6 rounded flex items-center justify-center text-xs",
                          severityColors[notification.severity] || "bg-stone-100 text-stone-600"
                        )}
                      >
                        {typeIcons[notification.type] || "📢"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 truncate">
                          {notification.title}
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5">
                          {formatTime(notification.createdAt)}
                        </div>
                      </div>
                      {notification.status === "unread" && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="p-2 border-t border-stone-100">
              <Link
                href="/m/platform/list?tab=notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-emerald-600 hover:text-emerald-700 py-2"
              >
                {locale === "ru" ? "Все уведомления" : "View all notifications"}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
