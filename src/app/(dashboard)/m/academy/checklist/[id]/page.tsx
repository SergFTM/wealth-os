"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AcStatusPill, AcChecklistRunPanel } from '@/modules/32-academy/ui';
import { startChecklistRun, toggleStep, Checklist, ChecklistRun } from '@/modules/32-academy/engine/checklistEngine';
import seedData from '@/modules/32-academy/seed.json';

export default function ChecklistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useApp();
  const id = params.id as string;

  const checklistData = seedData.kbChecklists.find(c => c.id === id);

  // Find existing run for current user (demo: user-1)
  const existingRun = seedData.kbChecklistRuns.find(
    r => r.checklistId === id && r.userId === 'user-1' && r.status === 'in_progress'
  );

  const [run, setRun] = useState<ChecklistRun | null>(existingRun as ChecklistRun | null);

  const labels = {
    notFound: { ru: 'Чек-лист не найден', en: 'Checklist not found', uk: 'Чек-лист не знайдено' },
    back: { ru: '← К списку чек-листов', en: '← Back to checklists', uk: '← До списку чек-листів' },
    steps: { ru: 'шагов', en: 'steps', uk: 'кроків' },
    role: { ru: 'Роль', en: 'Role', uk: 'Роль' },
    startRun: { ru: 'Начать выполнение', en: 'Start Run', uk: 'Почати виконання' },
    yourProgress: { ru: 'Ваш прогресс', en: 'Your Progress', uk: 'Ваш прогрес' },
    description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
    activeRuns: { ru: 'Активных выполнений', en: 'Active Runs', uk: 'Активних виконань' },
  };

  const roleLabels: Record<string, Record<string, string>> = {
    admin: { ru: 'Админ', en: 'Admin', uk: 'Адмін' },
    operations: { ru: 'Operations', en: 'Operations', uk: 'Operations' },
    compliance: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' },
    rm: { ru: 'RM', en: 'RM', uk: 'RM' },
    advisor: { ru: 'Advisor', en: 'Advisor', uk: 'Advisor' },
    client: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' },
    any: { ru: 'Любая', en: 'Any', uk: 'Будь-яка' },
  };

  if (!checklistData) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-stone-800 mb-2">{labels.notFound[locale]}</h1>
        <Button variant="primary" onClick={() => router.push('/m/academy/list?tab=checklists')}>
          {labels.back[locale]}
        </Button>
      </div>
    );
  }

  // Convert to Checklist type
  const checklist: Checklist = {
    id: checklistData.id,
    nameRu: checklistData.nameRu,
    nameEn: checklistData.nameEn,
    stepsJson: (checklistData.stepsJson || []).map(s => ({
      id: s.id,
      titleRu: s.titleRu,
      required: s.required,
    })),
    enforceOrder: checklistData.enforceOrder,
  };

  const activeRunsCount = seedData.kbChecklistRuns.filter(
    r => r.checklistId === id && r.status === 'in_progress'
  ).length;

  const handleStartRun = () => {
    const newRun = startChecklistRun(checklist, 'user-1');
    setRun({
      id: `run-new-${Date.now()}`,
      ...newRun,
    });
  };

  const handleToggleStep = (stepId: string) => {
    if (!run) return;
    const updatedRun = toggleStep(run, checklist, stepId);
    setRun(updatedRun);
  };

  const handleAbandon = () => {
    setRun(null);
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => router.push('/m/academy')} className="text-stone-500 hover:text-stone-700">
          {locale === 'ru' ? 'Академия' : 'Academy'}
        </button>
        <span className="text-stone-300">/</span>
        <button onClick={() => router.push('/m/academy/list?tab=checklists')} className="text-stone-500 hover:text-stone-700">
          {locale === 'ru' ? 'Чек-листы' : 'Checklists'}
        </button>
        <span className="text-stone-300">/</span>
        <span className="text-stone-800 font-medium truncate max-w-xs">
          {locale === 'ru' ? checklistData.nameRu : checklistData.nameEn || checklistData.nameRu}
        </span>
      </div>

      {/* Checklist Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">
              {locale === 'ru' ? checklistData.nameRu : checklistData.nameEn || checklistData.nameRu}
            </h1>
            {checklistData.descriptionRu && (
              <p className="text-stone-600 mb-4">
                {locale === 'ru' ? checklistData.descriptionRu : ((checklistData as unknown as Record<string, string>).descriptionEn || checklistData.descriptionRu)}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>{checklistData.stepsJson?.length || 0} {labels.steps[locale]}</span>
              <span>•</span>
              <span>{labels.role[locale]}: {roleLabels[checklistData.roleTarget]?.[locale] || checklistData.roleTarget}</span>
              <span>•</span>
              <span>{labels.activeRuns[locale]}: {activeRunsCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AcStatusPill status={checklistData.status} />
            <AcStatusPill status={checklistData.audience} />
          </div>
        </div>

        {/* Start button if no active run */}
        {!run && checklistData.status === 'active' && (
          <div className="mt-4 pt-4 border-t border-stone-200/50">
            <Button variant="primary" onClick={handleStartRun}>
              {labels.startRun[locale]}
            </Button>
          </div>
        )}
      </div>

      {/* Run Panel */}
      {run && (
        <div>
          <h2 className="font-semibold text-stone-800 mb-4">{labels.yourProgress[locale]}</h2>
          <AcChecklistRunPanel
            checklist={checklist}
            run={run}
            onToggleStep={handleToggleStep}
            onAbandon={handleAbandon}
          />
        </div>
      )}

      {/* Description */}
      {checklistData.descriptionRu && !run && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">{labels.description[locale]}</h2>
          <p className="text-stone-600">
            {locale === 'ru' ? checklistData.descriptionRu : ((checklistData as unknown as Record<string, string>).descriptionEn || checklistData.descriptionRu)}
          </p>
        </div>
      )}
    </div>
  );
}
