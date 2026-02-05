'use client';

import { OUTCOME_TYPES } from '../config';
import { getOutcomeColor, generateOutcomeSummary, type IdeaOutcome } from '../engine/outcomesEngine';

type Locale = 'ru' | 'en' | 'uk';

interface IdOutcomesPanelProps {
  outcomes: IdeaOutcome[];
  locale?: Locale;
  onAddOutcome?: () => void;
  onEditOutcome?: (id: string) => void;
}

export function IdOutcomesPanel({
  outcomes,
  locale = 'ru',
  onAddOutcome,
  onEditOutcome,
}: IdOutcomesPanelProps) {
  const labels = {
    ru: {
      title: 'Результаты',
      add: 'Добавить',
      empty: 'Нет результатов',
      entry: 'Вход',
      exit: 'Выход',
      return: 'Доход',
    },
    en: {
      title: 'Outcomes',
      add: 'Add',
      empty: 'No outcomes',
      entry: 'Entry',
      exit: 'Exit',
      return: 'Return',
    },
    uk: {
      title: 'Результати',
      add: 'Додати',
      empty: 'Немає результатів',
      entry: 'Вхід',
      exit: 'Вихід',
      return: 'Дохід',
    },
  };

  const t = labels[locale];

  const getTypeLabel = (type: string) => {
    const config = OUTCOME_TYPES[type as keyof typeof OUTCOME_TYPES];
    return config?.[locale] || config?.ru || type;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US',
      { day: '2-digit', month: 'short', year: '2-digit' }
    );
  };

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{t.title}</h3>
        {onAddOutcome && (
          <button
            onClick={onAddOutcome}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + {t.add}
          </button>
        )}
      </div>

      <div className="p-4">
        {outcomes.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            {t.empty}
          </div>
        ) : (
          <div className="space-y-3">
            {outcomes.map((outcome) => {
              const color = getOutcomeColor(outcome);
              const summary = generateOutcomeSummary(outcome, locale);

              return (
                <div
                  key={outcome.id}
                  onClick={() => onEditOutcome?.(outcome.id)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm
                    ${colorClasses[color]}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {getTypeLabel(outcome.outcomeType)}
                    </span>
                    <span className="text-xs">
                      {formatDate(outcome.startAt)}
                      {outcome.endAt && ` → ${formatDate(outcome.endAt)}`}
                    </span>
                  </div>

                  {/* Prices and Returns */}
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    {outcome.entryPrice && (
                      <div>
                        <div className="text-xs opacity-70">{t.entry}</div>
                        <div className="font-medium">${outcome.entryPrice.toLocaleString()}</div>
                      </div>
                    )}
                    {outcome.exitPrice && (
                      <div>
                        <div className="text-xs opacity-70">{t.exit}</div>
                        <div className="font-medium">${outcome.exitPrice.toLocaleString()}</div>
                      </div>
                    )}
                    {(outcome.realizedPct !== undefined || outcome.unrealizedPct !== undefined) && (
                      <div>
                        <div className="text-xs opacity-70">{t.return}</div>
                        <div className="font-bold">
                          {outcome.realizedPct !== undefined
                            ? `${outcome.realizedPct >= 0 ? '+' : ''}${outcome.realizedPct.toFixed(1)}%`
                            : `${outcome.unrealizedPct! >= 0 ? '+' : ''}${outcome.unrealizedPct!.toFixed(1)}%`
                          }
                        </div>
                      </div>
                    )}
                  </div>

                  {outcome.notes && (
                    <div className="text-xs opacity-80 line-clamp-2">
                      {outcome.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default IdOutcomesPanel;
