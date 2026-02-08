"use client";

import React, { useState } from 'react';
import { RhTierBadge } from './RhTierBadge';
import { RhRolePill } from './RhRolePill';
import { RhTimeline, TimelineItem } from './RhTimeline';

export interface HouseholdDetailData {
  id: string;
  name: string;
  tierKey: 'A' | 'B' | 'C';
  primaryRmUserId: string;
  primaryRmName?: string;
  members: Array<{
    id: string;
    name: string;
    roleKey?: string;
  }>;
  notesInternal?: string;
  clientSafeSummary?: string;
  clientSafePublished: boolean;
  publishedAt?: string;
}

interface RhHouseholdDetailProps {
  household: HouseholdDetailData;
  openCases: Array<{ id: string; title: string; status: string }>;
  openInitiatives: Array<{ id: string; title: string; stageKey: string }>;
  upcomingMeetings: Array<{ id: string; title: string; startAt: string }>;
  timeline: TimelineItem[];
  onMemberClick?: (memberId: string) => void;
  onCaseClick?: (caseId: string) => void;
  onInitiativeClick?: (initiativeId: string) => void;
  onMeetingClick?: (meetingId: string) => void;
  onPublishClientSafe?: () => void;
  onUnpublish?: () => void;
}

type TabKey = 'overview' | 'members' | 'cases' | 'initiatives' | 'meetings' | 'timeline' | 'client_safe';

export function RhHouseholdDetail({
  household,
  openCases,
  openInitiatives,
  upcomingMeetings,
  timeline,
  onMemberClick,
  onCaseClick,
  onInitiativeClick,
  onMeetingClick,
  onPublishClientSafe,
  onUnpublish,
}: RhHouseholdDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'members', label: `Участники (${household.members.length})` },
    { key: 'cases', label: `Кейсы (${openCases.length})` },
    { key: 'initiatives', label: `Инициативы (${openInitiatives.length})` },
    { key: 'meetings', label: 'Встречи' },
    { key: 'timeline', label: 'История' },
    { key: 'client_safe', label: 'Client-safe' },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stageLabels: Record<string, string> = {
    idea: 'Идея',
    in_analysis: 'В анализе',
    in_progress: 'В работе',
    done: 'Завершено',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center text-2xl">
            🏠
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{household.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <RhTierBadge tier={household.tierKey} size="md" />
              {household.primaryRmName && (
                <span className="text-sm text-gray-500">RM: {household.primaryRmName}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          {household.clientSafePublished ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
              ✓ Client-safe опубликовано
            </span>
          ) : (
            <button
              onClick={onPublishClientSafe}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Опубликовать карточку
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-64">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Members preview */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Участники</h3>
              <div className="space-y-2">
                {household.members.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onMemberClick?.(member.id)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span>👤</span>
                    <span className="text-sm font-medium text-gray-700">{member.name}</span>
                    {member.roleKey && <RhRolePill role={member.roleKey} size="sm" />}
                  </div>
                ))}
                {household.members.length > 4 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{household.members.length - 4} ещё
                  </p>
                )}
              </div>
            </div>

            {/* Open items */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Открытые элементы</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Кейсы</span>
                  <span className="font-semibold text-gray-900">{openCases.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Инициативы</span>
                  <span className="font-semibold text-gray-900">{openInitiatives.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Встречи (7д)</span>
                  <span className="font-semibold text-gray-900">{upcomingMeetings.length}</span>
                </div>
              </div>
            </div>

            {/* Upcoming meetings */}
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Ближайшие встречи</h3>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-2">
                  {upcomingMeetings.slice(0, 3).map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={() => onMeetingClick?.(meeting.id)}
                      className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(meeting.startAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Нет запланированных встреч</p>
              )}
            </div>

            {/* Internal notes */}
            {household.notesInternal && (
              <div className="md:col-span-3 rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Внутренние заметки</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{household.notesInternal}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-3">
            {household.members.map((member) => (
              <div
                key={member.id}
                onClick={() => onMemberClick?.(member.id)}
                className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{member.name}</p>
                </div>
                {member.roleKey && <RhRolePill role={member.roleKey} />}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-3">
            {openCases.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет открытых кейсов</p>
            ) : (
              openCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onCaseClick?.(c.id)}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{c.title}</p>
                    <span className="text-xs text-gray-500">{c.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'initiatives' && (
          <div className="space-y-3">
            {openInitiatives.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет инициатив</p>
            ) : (
              openInitiatives.map((init) => (
                <div
                  key={init.id}
                  onClick={() => onInitiativeClick?.(init.id)}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{init.title}</p>
                    <span className="text-xs text-gray-500">{stageLabels[init.stageKey]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-3">
            {upcomingMeetings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет запланированных встреч</p>
            ) : (
              upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => onMeetingClick?.(meeting.id)}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <p className="font-medium text-gray-900">{meeting.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(meeting.startAt)}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <RhTimeline items={timeline} />
        )}

        {activeTab === 'client_safe' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Client-safe карточка</h3>
              {household.clientSafeSummary ? (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{household.clientSafeSummary}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Карточка не создана</p>
              )}
            </div>

            {household.clientSafePublished ? (
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <div>
                  <p className="text-sm font-medium text-emerald-700">Опубликовано в Client Portal</p>
                  {household.publishedAt && (
                    <p className="text-xs text-emerald-600">
                      {formatDate(household.publishedAt)}
                    </p>
                  )}
                </div>
                <button
                  onClick={onUnpublish}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Отозвать
                </button>
              </div>
            ) : (
              <button
                onClick={onPublishClientSafe}
                className="w-full px-4 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
              >
                Опубликовать в Client Portal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RhHouseholdDetail;
