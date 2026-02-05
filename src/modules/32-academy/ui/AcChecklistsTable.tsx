'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AcStatusPill } from './AcStatusPill';

interface Checklist {
  id: string;
  nameRu: string;
  nameEn?: string;
  roleTarget: string;
  stepsJson?: { id: string }[];
  status: string;
  audience: string;
}

interface ChecklistRun {
  checklistId: string;
  status: string;
}

interface AcChecklistsTableProps {
  checklists: Checklist[];
  runs?: ChecklistRun[];
  onStartRun?: (id: string) => void;
}

export function AcChecklistsTable({ checklists, runs = [], onStartRun }: AcChecklistsTableProps) {
  const router = useRouter();
  const { locale } = useApp();

  const getActiveRunsCount = (checklistId: string) => {
    return runs.filter(r => r.checklistId === checklistId && r.status === 'in_progress').length;
  };

  const labels = {
    name: { ru: 'Чек-лист', en: 'Checklist', uk: 'Чек-лист' },
    role: { ru: 'Роль', en: 'Role', uk: 'Роль' },
    steps: { ru: 'Шагов', en: 'Steps', uk: 'Кроків' },
    activeRuns: { ru: 'Активных', en: 'Active Runs', uk: 'Активних' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    start: { ru: 'Начать', en: 'Start', uk: 'Почати' },
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

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.name[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.role[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.steps[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.activeRuns[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.status[locale]}
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.actions[locale]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {checklists.map((checklist) => {
              const activeRuns = getActiveRunsCount(checklist.id);
              return (
                <tr
                  key={checklist.id}
                  className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/m/academy/checklist/${checklist.id}`)}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-stone-800">
                      {locale === 'ru' ? checklist.nameRu : checklist.nameEn || checklist.nameRu}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">
                    {roleLabels[checklist.roleTarget]?.[locale] || checklist.roleTarget}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-600">
                    {checklist.stepsJson?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    {activeRuns > 0 ? (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {activeRuns}
                      </span>
                    ) : (
                      <span className="text-sm text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <AcStatusPill status={checklist.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                        onClick={() => router.push(`/m/academy/checklist/${checklist.id}`)}
                      >
                        {labels.open[locale]}
                      </button>
                      {checklist.status === 'active' && onStartRun && (
                        <button
                          className="text-xs text-blue-600 hover:text-blue-700"
                          onClick={() => onStartRun(checklist.id)}
                        >
                          {labels.start[locale]}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
