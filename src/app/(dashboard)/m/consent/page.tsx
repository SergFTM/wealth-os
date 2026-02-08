"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { CoKpiStrip } from '@/modules/54-consent/ui/CoKpiStrip';
import { CoActionsBar } from '@/modules/54-consent/ui/CoActionsBar';
import { CoConsentsTable } from '@/modules/54-consent/ui/CoConsentsTable';
import { CoConflictsTable } from '@/modules/54-consent/ui/CoConflictsTable';
import { CoAiPanel } from '@/modules/54-consent/ui/CoAiPanel';
import { AlertTriangle } from 'lucide-react';

export default function ConsentDashboardPage() {
  const router = useRouter();
  const [showAi, setShowAi] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: consents = [] } = useCollection('consents') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: requests = [] } = useCollection('consentRequests') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: policies = [] } = useCollection('privacyPolicies') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reviews = [] } = useCollection('accessReviews') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: conflicts = [] } = useCollection('consentConflicts') as { data: any[] };

  // KPI calculations
  const now = new Date();
  const in30Days = new Date(now);
  in30Days.setDate(in30Days.getDate() + 30);
  const ago30Days = new Date(now);
  ago30Days.setDate(ago30Days.getDate() - 30);

  const activeConsents = consents.filter((c: { statusKey: string }) => c.statusKey === 'active').length;

  const expiring30d = consents.filter((c: { statusKey: string; effectiveTo?: string }) => {
    if (c.statusKey !== 'active' || !c.effectiveTo) return false;
    const exp = new Date(c.effectiveTo);
    return exp >= now && exp <= in30Days;
  }).length;

  const requestsPending = requests.filter((r: { statusKey: string }) => r.statusKey === 'pending').length;
  const policiesActive = policies.filter((p: { statusKey: string }) => p.statusKey === 'active').length;

  const reviewsDue = reviews.filter((r: { statusKey: string; dueAt: string }) => {
    if (r.statusKey !== 'open') return false;
    return new Date(r.dueAt) <= in30Days;
  }).length;

  const conflictsOpen = conflicts.filter((c: { statusKey: string }) => c.statusKey === 'open').length;

  const clientSafeOverrides = consents.filter(
    (c: { statusKey: string; restrictionsJson?: { clientSafe?: boolean } }) =>
      c.statusKey === 'active' && c.restrictionsJson?.clientSafe
  ).length;

  const revocations30d = consents.filter((c: { statusKey: string; revokedAt?: string }) => {
    if (c.statusKey !== 'revoked' || !c.revokedAt) return false;
    return new Date(c.revokedAt) >= ago30Days;
  }).length;

  const kpiItems = [
    { id: 'activeConsents', label: 'Активные согласия', value: activeConsents, status: 'ok' as const, linkTo: '/m/consent/list?tab=consents&status=active' },
    { id: 'expiring30d', label: 'Истекают 30д', value: expiring30d, status: expiring30d > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/consent/list?tab=consents&filter=expiring_30d' },
    { id: 'requestsPending', label: 'Запросы ожидают', value: requestsPending, status: requestsPending > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/consent/list?tab=requests&status=pending' },
    { id: 'policiesActive', label: 'Политики активные', value: policiesActive, status: 'ok' as const, linkTo: '/m/consent/list?tab=policies&status=active' },
    { id: 'reviewsDue', label: 'Проверки доступа', value: reviewsDue, status: reviewsDue > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/consent/list?tab=access_reviews&filter=due' },
    { id: 'conflictsOpen', label: 'Конфликты', value: conflictsOpen, status: conflictsOpen > 0 ? 'critical' as const : 'ok' as const, linkTo: '/m/consent/list?tab=conflicts&status=open' },
    { id: 'clientSafeOverrides', label: 'Client-safe', value: clientSafeOverrides, status: 'info' as const, linkTo: '/m/consent/list?tab=consents&filter=client_safe' },
    { id: 'revocations30d', label: 'Отзывы 30д', value: revocations30d, status: 'info' as const, linkTo: '/m/consent/list?tab=consents&filter=revoked_30d' },
  ];

  // Preview: top 5 recent consents and open conflicts
  const recentConsents = consents
    .filter((c: { statusKey: string }) => c.statusKey === 'active')
    .slice(0, 5);

  const openConflicts = conflicts
    .filter((c: { statusKey: string }) => c.statusKey === 'open')
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Consent & Privacy Center</h1>
        <p className="text-sm text-stone-500 mt-1">
          Управление согласиями, приватностью данных и правами доступа
        </p>
      </div>

      {/* Disclaimer banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          Не является юридической консультацией. Политики и согласия требуют проверки юристом и compliance.
        </p>
      </div>

      <div className="space-y-6">
        {/* KPI Strip */}
        <CoKpiStrip kpis={kpiItems} />

        {/* Actions Bar */}
        <CoActionsBar
          onCreateConsent={() => router.push('/m/consent/consent/new')}
          onCreateRequest={() => router.push('/m/consent/request/new')}
          onCreatePolicy={() => router.push('/m/consent/policy/new')}
          onStartReview={() => router.push('/m/consent/review/new')}
          onGenerateDemo={() => console.log('Generate demo consent data')}
        />

        {/* Two-column layout: preview + AI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Consents preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
                <h2 className="font-semibold text-stone-700">Активные согласия</h2>
                <button
                  onClick={() => router.push('/m/consent/list?tab=consents')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Все →
                </button>
              </div>
              <CoConsentsTable
                consents={recentConsents}
                onOpen={(id) => router.push(`/m/consent/consent/${id}`)}
                compact
              />
            </div>

            {/* Conflicts preview */}
            {openConflicts.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
                  <h2 className="font-semibold text-stone-700">Открытые конфликты</h2>
                  <button
                    onClick={() => router.push('/m/consent/list?tab=conflicts')}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Все →
                  </button>
                </div>
                <CoConflictsTable
                  conflicts={openConflicts}
                  onOpen={(id) => router.push(`/m/consent/list?tab=conflicts&id=${id}`)}
                />
              </div>
            )}
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-1">
            {showAi && (
              <CoAiPanel
                consents={consents}
                policies={policies}
              />
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-stone-400 py-4">
          Не является юридической консультацией. Политики и согласия требуют проверки юристом и compliance.
        </div>
      </div>
    </div>
  );
}
