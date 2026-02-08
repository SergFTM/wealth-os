"use client";

import React, { useState } from 'react';
import { RhKpiStrip, RhKpiData } from './RhKpiStrip';
import { RhActionsBar } from './RhActionsBar';
import { RhVipCockpit, VipHouseholdView } from './RhVipCockpit';
import { RhInteractionsTable, InteractionRow } from './RhInteractionsTable';
import { RhAiPanel, AiSuggestion } from './RhAiPanel';

interface RhDashboardPageProps {
  kpis: RhKpiData;
  vipHouseholds: VipHouseholdView[];
  overdueFollowups: InteractionRow[];
  onCreateInteraction?: () => void;
  onCreateInitiative?: () => void;
  onAssignCoverage?: () => void;
  onPublishClientSafe?: () => void;
  onGenerateDemo?: () => void;
  onRefreshVip?: (householdId: string) => void;
  onPublishVip?: (householdId: string) => void;
  onCreateThread?: (householdId: string) => void;
  onCreateRequest?: (householdId: string) => void;
  onCreateVipInitiative?: (householdId: string) => void;
}

export function RhDashboardPage({
  kpis,
  vipHouseholds,
  overdueFollowups,
  onCreateInteraction,
  onCreateInitiative,
  onAssignCoverage,
  onPublishClientSafe,
  onGenerateDemo,
  onRefreshVip,
  onPublishVip,
  onCreateThread,
  onCreateRequest,
  onCreateVipInitiative,
}: RhDashboardPageProps) {
  const [, setAiResult] = useState<AiSuggestion | null>(null);

  const actions = [
    { key: 'createInteraction', label: 'Создать взаимодействие', variant: 'primary' as const },
    { key: 'createInitiative', label: 'Создать инициативу', variant: 'secondary' as const },
    { key: 'assignCoverage', label: 'Назначить RM', variant: 'secondary' as const },
    { key: 'publishClientSafe', label: 'Опубликовать карточку', variant: 'ghost' as const },
    { key: 'generateDemo', label: 'Сгенерировать demo', variant: 'ghost' as const },
  ];

  const handleAction = (key: string) => {
    switch (key) {
      case 'createInteraction': onCreateInteraction?.(); break;
      case 'createInitiative': onCreateInitiative?.(); break;
      case 'assignCoverage': onAssignCoverage?.(); break;
      case 'publishClientSafe': onPublishClientSafe?.(); break;
      case 'generateDemo': onGenerateDemo?.(); break;
    }
  };

  const DISCLAIMER = 'Рекомендации AI носят информационный характер и требуют проверки человеком';

  const handleSummarize = async (): Promise<AiSuggestion> => {
    const names = vipHouseholds.slice(0, 3).map(h => h.name).join(', ');
    const result: AiSuggestion = {
      type: 'summary',
      content: `## Сводка Relationship Hub\n\n**VIP домохозяйства:** ${vipHouseholds.length}\n**Открытые инициативы:** ${kpis.openInitiatives}\n**Просроченные follow-up:** ${overdueFollowups.length}\n**Gaps в покрытии:** ${kpis.coverageGaps}\n\n### Ключевые домохозяйства\n${names}\n\nВзаимодействий за 7 дней: ${kpis.interactions7d}. Client-safe карточек опубликовано: ${kpis.clientSafeCards}.`,
      confidence: vipHouseholds.length > 5 ? 'high' : 'medium',
      sources: [`${vipHouseholds.length} VIP домохозяйств`, `${overdueFollowups.length} follow-up`],
      assumptions: ['Анализ основан на текущих данных модуля'],
      disclaimer: DISCLAIMER,
    };
    setAiResult(result);
    return result;
  };

  const handleDraftFollowUp = async (): Promise<AiSuggestion> => {
    const topHousehold = vipHouseholds[0];
    const name = topHousehold?.name || 'VIP клиент';
    const result: AiSuggestion = {
      type: 'draft',
      content: `Уважаемый клиент,\n\nБлагодарим вас за сотрудничество. Хотел(а) бы обсудить с вами текущий статус по домохозяйству ${name}:\n\n1. Обзор открытых инициатив (${kpis.openInitiatives})\n2. Статус follow-up задач\n3. Планирование встречи\n\nБуду рад(а) связаться в удобное для вас время.\n\nС уважением,\n[Ваш RM]`,
      confidence: topHousehold ? 'medium' : 'low',
      sources: topHousehold ? [`Домохозяйство: ${name}`] : [],
      assumptions: ['Черновик требует персонализации перед отправкой'],
      disclaimer: DISCLAIMER,
    };
    setAiResult(result);
    return result;
  };

  const handleSuggestNext = async (): Promise<AiSuggestion> => {
    const suggestions: string[] = [];
    if (overdueFollowups.length > 0) {
      suggestions.push(`**Срочно:** ${overdueFollowups.length} просроченных follow-up. Рекомендуется связаться с клиентами.`);
    }
    if (kpis.coverageGaps > 0) {
      suggestions.push(`**Внимание:** ${kpis.coverageGaps} gaps в покрытии. Назначьте RM.`);
    }
    if (kpis.openInitiatives > 10) {
      suggestions.push(`**Рекомендация:** ${kpis.openInitiatives} открытых инициатив. Проведите ревью приоритетов.`);
    }
    if (suggestions.length === 0) {
      suggestions.push('Нет срочных действий. Продолжайте текущую работу.');
    }
    const result: AiSuggestion = {
      type: 'next_action',
      content: suggestions.join('\n\n'),
      confidence: overdueFollowups.length > 0 ? 'high' : 'medium',
      sources: ['Просроченные follow-up', 'Coverage gaps', 'Открытые инициативы'],
      assumptions: ['VIP клиенты требуют более частого контакта'],
      disclaimer: DISCLAIMER,
    };
    setAiResult(result);
    return result;
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-700 flex items-center gap-2">
          <span>⚠️</span>
          Рекомендации AI носят информационный характер и требуют проверки человеком
        </p>
      </div>

      {/* KPI Strip */}
      <RhKpiStrip kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* VIP Cockpit Preview */}
          <div>
            <h2 className="text-lg font-semibold text-stone-800 mb-3">VIP Cockpit</h2>
            <RhVipCockpit
              households={vipHouseholds.slice(0, 4)}
              onRefresh={onRefreshVip}
              onPublish={onPublishVip}
              onCreateThread={onCreateThread}
              onCreateRequest={onCreateRequest}
              onCreateInitiative={onCreateVipInitiative}
            />
          </div>

          {/* Overdue Follow-ups */}
          {overdueFollowups.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-stone-800 mb-3">
                Просроченные follow-up
                <span className="ml-2 text-sm font-normal text-red-600">
                  ({overdueFollowups.length})
                </span>
              </h2>
              <RhInteractionsTable interactions={overdueFollowups.slice(0, 10)} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Panel */}
          <RhAiPanel
            householdName={vipHouseholds[0]?.name}
            onSummarize={handleSummarize}
            onDraftFollowUp={handleDraftFollowUp}
            onSuggestNextAction={handleSuggestNext}
          />

          {/* Actions Bar */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Действия</h3>
            <RhActionsBar actions={actions} onAction={handleAction} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RhDashboardPage;
