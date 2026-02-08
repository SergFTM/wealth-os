"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RhTierBadge } from './RhTierBadge';

export interface VipHouseholdView {
  id: string;
  name: string;
  tierKey: 'A' | 'B' | 'C';
  primaryRmName?: string;
  openItems: number;
  openInitiatives: number;
  overdueFollowups: number;
  pendingApprovals: number;
  nextMeeting?: string;
  nextMeetingTitle?: string;
  alerts: Array<{ level: string; message: string }>;
  clientSafePublished: boolean;
}

interface RhVipCockpitProps {
  households: VipHouseholdView[];
  onRefresh?: (householdId: string) => void;
  onPublish?: (householdId: string) => void;
  onCreateThread?: (householdId: string) => void;
  onCreateRequest?: (householdId: string) => void;
  onCreateInitiative?: (householdId: string) => void;
}

export function RhVipCockpit({
  households,
  onRefresh,
  onPublish,
  onCreateThread,
  onCreateRequest,
  onCreateInitiative,
}: RhVipCockpitProps) {
  const router = useRouter();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (households.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">👑</span>
        <p>Нет VIP домохозяйств</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {households.map((household) => (
        <div
          key={household.id}
          className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RhTierBadge tier={household.tierKey} size="md" showLabel={false} />
              <div>
                <h3
                  className="font-semibold text-gray-900 cursor-pointer hover:text-emerald-600 transition-colors"
                  onClick={() => router.push(`/m/relationships/household/${household.id}`)}
                >
                  {household.name}
                </h3>
                {household.primaryRmName && (
                  <p className="text-xs text-gray-500">RM: {household.primaryRmName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {household.clientSafePublished && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  Client-safe ✓
                </span>
              )}
              <button
                onClick={() => onRefresh?.(household.id)}
                className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                title="Обновить"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-lg bg-white/50">
              <p className="text-2xl font-bold text-gray-900">{household.openItems}</p>
              <p className="text-xs text-gray-500">Открытые</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/50">
              <p className="text-2xl font-bold text-blue-600">{household.openInitiatives}</p>
              <p className="text-xs text-gray-500">Инициативы</p>
            </div>
            <div className={`text-center p-2 rounded-lg ${household.overdueFollowups > 0 ? 'bg-red-50' : 'bg-white/50'}`}>
              <p className={`text-2xl font-bold ${household.overdueFollowups > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {household.overdueFollowups}
              </p>
              <p className="text-xs text-gray-500">Просрочено</p>
            </div>
            <div className={`text-center p-2 rounded-lg ${household.pendingApprovals > 0 ? 'bg-amber-50' : 'bg-white/50'}`}>
              <p className={`text-2xl font-bold ${household.pendingApprovals > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                {household.pendingApprovals}
              </p>
              <p className="text-xs text-gray-500">Согласования</p>
            </div>
          </div>

          {/* Next meeting */}
          {household.nextMeeting && (
            <div className="px-4 py-2 border-t border-gray-100 bg-blue-50/30">
              <div className="flex items-center gap-2 text-sm">
                <span>📅</span>
                <span className="font-medium text-gray-700">
                  {formatDate(household.nextMeeting)}
                </span>
                {household.nextMeetingTitle && (
                  <span className="text-gray-500">— {household.nextMeetingTitle}</span>
                )}
              </div>
            </div>
          )}

          {/* Alerts */}
          {household.alerts.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 space-y-1">
              {household.alerts.slice(0, 2).map((alert, index) => (
                <div
                  key={index}
                  className={`text-xs px-2 py-1 rounded border ${getAlertColor(alert.level)}`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-2">
            <button
              onClick={() => onCreateThread?.(household.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              💬 Сообщение
            </button>
            <button
              onClick={() => onCreateRequest?.(household.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              📋 Запрос
            </button>
            <button
              onClick={() => onCreateInitiative?.(household.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🚀 Инициатива
            </button>
            {!household.clientSafePublished && (
              <button
                onClick={() => onPublish?.(household.id)}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                📤 Опубликовать
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RhVipCockpit;
