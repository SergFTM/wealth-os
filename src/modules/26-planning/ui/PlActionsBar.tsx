'use client';

/**
 * Planning Actions Bar Component
 * Action buttons for planning module
 */

import { useI18n } from '@/lib/i18n';

interface PlActionsBarProps {
  lang?: 'ru' | 'en' | 'uk';
  onAddGoal?: () => void;
  onAddScenario?: () => void;
  onAddCashflow?: () => void;
  onAddEvent?: () => void;
  onRunScenario?: () => void;
  onExportReport?: () => void;
  showScenarioRun?: boolean;
}

export function PlActionsBar({
  lang: propLang,
  onAddGoal,
  onAddScenario,
  onAddCashflow,
  onAddEvent,
  onRunScenario,
  onExportReport,
  showScenarioRun = true,
}: PlActionsBarProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const actions = {
    addGoal: { ru: 'Добавить цель', en: 'Add Goal', uk: 'Додати ціль', icon: '🎯' },
    addScenario: { ru: 'Новый сценарий', en: 'New Scenario', uk: 'Новий сценарій', icon: '📊' },
    addCashflow: { ru: 'Добавить поток', en: 'Add Cashflow', uk: 'Додати потік', icon: '💰' },
    addEvent: { ru: 'Добавить событие', en: 'Add Event', uk: 'Додати подію', icon: '📅' },
    runScenario: { ru: 'Запустить расчёт', en: 'Run Calculation', uk: 'Запустити розрахунок', icon: '▶️' },
    exportReport: { ru: 'Экспорт отчёта', en: 'Export Report', uk: 'Експорт звіту', icon: '📥' },
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {onAddGoal && (
        <button
          onClick={onAddGoal}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>{actions.addGoal.icon}</span>
          <span>{actions.addGoal[lang]}</span>
        </button>
      )}

      {onAddScenario && (
        <button
          onClick={onAddScenario}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>{actions.addScenario.icon}</span>
          <span>{actions.addScenario[lang]}</span>
        </button>
      )}

      {onAddCashflow && (
        <button
          onClick={onAddCashflow}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>{actions.addCashflow.icon}</span>
          <span>{actions.addCashflow[lang]}</span>
        </button>
      )}

      {onAddEvent && (
        <button
          onClick={onAddEvent}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>{actions.addEvent.icon}</span>
          <span>{actions.addEvent[lang]}</span>
        </button>
      )}

      {showScenarioRun && onRunScenario && (
        <button
          onClick={onRunScenario}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <span>{actions.runScenario.icon}</span>
          <span>{actions.runScenario[lang]}</span>
        </button>
      )}

      {onExportReport && (
        <button
          onClick={onExportReport}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
        >
          <span>{actions.exportReport.icon}</span>
          <span>{actions.exportReport[lang]}</span>
        </button>
      )}
    </div>
  );
}

// Tab bar for switching between sections
interface PlTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang?: 'ru' | 'en' | 'uk';
}

export function PlTabBar({ activeTab, onTabChange, lang: propLang }: PlTabBarProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const tabs = [
    { key: 'goals', label: { ru: 'Цели', en: 'Goals', uk: 'Цілі' }, icon: '🎯' },
    { key: 'scenarios', label: { ru: 'Сценарии', en: 'Scenarios', uk: 'Сценарії' }, icon: '📊' },
    { key: 'cashflow', label: { ru: 'Денежные потоки', en: 'Cashflows', uk: 'Грошові потоки' }, icon: '💰' },
    { key: 'planvsactual', label: { ru: 'План/Факт', en: 'Plan/Actual', uk: 'План/Факт' }, icon: '📈' },
    { key: 'events', label: { ru: 'События', en: 'Events', uk: 'Події' }, icon: '📅' },
    { key: 'assumptions', label: { ru: 'Допущения', en: 'Assumptions', uk: 'Припущення' }, icon: '⚙️' },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label[lang]}</span>
        </button>
      ))}
    </div>
  );
}
