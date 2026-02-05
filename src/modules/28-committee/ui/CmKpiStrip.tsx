'use client';

/**
 * Committee KPI Strip Component
 * 8 KPI cards for committee dashboard
 */

import Link from 'next/link';
import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CommitteeAgendaItem } from '../schema/committeeAgendaItem';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CommitteeVote } from '../schema/committeeVote';
import { CommitteeFollowUp, isFollowUpOverdue } from '../schema/committeeFollowUp';

interface CmKpiStripProps {
  meetings: CommitteeMeeting[];
  agendaItems: CommitteeAgendaItem[];
  decisions: CommitteeDecision[];
  votes: CommitteeVote[];
  followUps: CommitteeFollowUp[];
  lang?: 'ru' | 'en' | 'uk';
}

interface KpiCard {
  key: string;
  label: { ru: string; en: string; uk: string };
  value: number;
  link: string;
  color: 'emerald' | 'blue' | 'amber' | 'red' | 'gray';
  icon: string;
}

export function CmKpiStrip({ meetings, agendaItems, decisions, votes, followUps, lang = 'ru' }: CmKpiStripProps) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate KPIs
  const nextMeeting = meetings
    .filter(m => m.status === 'scheduled' && new Date(m.scheduledAt) > now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  const pendingAgendaItems = agendaItems.filter(i => i.status === 'pending');
  const recentDecisions = decisions.filter(d => new Date(d.createdAt) > thirtyDaysAgo);
  const openVotes = votes.filter(v => v.status === 'open');
  const overdueFollowUps = followUps.filter(isFollowUpOverdue);
  const missingMaterials = agendaItems.filter(i => i.materialsDocIds.length === 0 && i.status !== 'draft');
  const unpublishedMinutes = meetings.filter(m => m.status === 'closed' && m.minutesStatus === 'draft');
  const linkedPacks = meetings.filter(m => m.linkedPackId);

  const kpis: KpiCard[] = [
    {
      key: 'next_meeting',
      label: { ru: 'След. заседание', en: 'Next Meeting', uk: 'Наст. засідання' },
      value: nextMeeting ? 1 : 0,
      link: '/m/committee/list?tab=meetings&filter=next',
      color: nextMeeting ? 'emerald' : 'gray',
      icon: '📅',
    },
    {
      key: 'pending_agenda',
      label: { ru: 'Пункты ожидают', en: 'Pending Items', uk: 'Пункти очікують' },
      value: pendingAgendaItems.length,
      link: '/m/committee/list?tab=agenda&status=pending',
      color: pendingAgendaItems.length > 0 ? 'amber' : 'emerald',
      icon: '📋',
    },
    {
      key: 'decisions_30d',
      label: { ru: 'Решения 30д', en: 'Decisions 30d', uk: 'Рішення 30д' },
      value: recentDecisions.length,
      link: '/m/committee/list?tab=decisions&period=30d',
      color: 'blue',
      icon: '✅',
    },
    {
      key: 'open_votes',
      label: { ru: 'Голоса открыты', en: 'Open Votes', uk: 'Голоси відкриті' },
      value: openVotes.length,
      link: '/m/committee/list?tab=votes&status=open',
      color: openVotes.length > 0 ? 'blue' : 'gray',
      icon: '🗳️',
    },
    {
      key: 'overdue_followups',
      label: { ru: 'Просроченные', en: 'Overdue', uk: 'Прострочені' },
      value: overdueFollowUps.length,
      link: '/m/committee/list?tab=followups&filter=overdue',
      color: overdueFollowUps.length > 0 ? 'red' : 'emerald',
      icon: '⚠️',
    },
    {
      key: 'missing_materials',
      label: { ru: 'Нет материалов', en: 'Missing Materials', uk: 'Немає матеріалів' },
      value: missingMaterials.length,
      link: '/m/committee/list?tab=agenda&filter=missing_docs',
      color: missingMaterials.length > 0 ? 'amber' : 'emerald',
      icon: '📎',
    },
    {
      key: 'unpublished_minutes',
      label: { ru: 'Протоколы черн.', en: 'Draft Minutes', uk: 'Чернетки' },
      value: unpublishedMinutes.length,
      link: '/m/committee/list?tab=meetings&filter=minutes_unpublished',
      color: unpublishedMinutes.length > 0 ? 'amber' : 'emerald',
      icon: '📝',
    },
    {
      key: 'linked_packs',
      label: { ru: 'Пакеты', en: 'Committee Packs', uk: 'Пакети' },
      value: linkedPacks.length,
      link: '/m/committee/list?tab=meetings&filter=packs',
      color: 'blue',
      icon: '📦',
    },
  ];

  const colorClasses: Record<string, string> = {
    emerald: 'border-emerald-200 bg-emerald-50/50',
    blue: 'border-blue-200 bg-blue-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    red: 'border-red-200 bg-red-50/50',
    gray: 'border-gray-200 bg-gray-50/50',
  };

  const textClasses: Record<string, string> = {
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
    gray: 'text-gray-500',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map(kpi => (
        <Link
          key={kpi.key}
          href={kpi.link}
          className={`p-3 rounded-xl border ${colorClasses[kpi.color]} hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{kpi.icon}</span>
            <span className={`text-2xl font-bold ${textClasses[kpi.color]}`}>{kpi.value}</span>
          </div>
          <div className="text-xs text-gray-600 truncate">{kpi.label[lang]}</div>
        </Link>
      ))}
    </div>
  );
}
