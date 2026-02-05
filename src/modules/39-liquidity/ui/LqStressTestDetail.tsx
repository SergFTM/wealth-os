"use client";

import { ArrowLeft, Play, RefreshCw } from 'lucide-react';
import { LqChartPanel } from './LqChartPanel';

interface CashStressTest {
  id: string;
  forecastId: string;
  name: string;
  stressType: string;
  paramsJson?: {
    severity?: string;
    drawdownPercent?: number;
    delayDays?: number;
    taxIncreasePercent?: number;
    rateShockBps?: number;
    accelerationDays?: number;
    duration?: number;
  };
  resultsJson?: {
    minCashReached?: number;
    breachesCount?: number;
    recoveryDate?: string;
    dailyBalances?: Array<{
      date: string;
      closingBalance: number;
      inflows: number;
      outflows: number;
    }>;
  };
  runAt?: string;
  createdAt: string;
}

interface LqStressTestDetailProps {
  test: CashStressTest;
  onBack: () => void;
  onRerun?: () => void;
}

const stressTypeLabels: Record<string, string> = {
  market_drawdown: 'Рыночный спад',
  delayed_distributions: 'Задержка дистрибуций',
  tax_spike: 'Скачок налогов',
  debt_rate_shock: 'Шок ставок',
  capital_call_acceleration: 'Ускорение capital calls',
};

const severityLabels: Record<string, { label: string; className: string }> = {
  mild: { label: 'Мягкий', className: 'bg-green-100 text-green-700' },
  moderate: { label: 'Умеренный', className: 'bg-amber-100 text-amber-700' },
  severe: { label: 'Жёсткий', className: 'bg-red-100 text-red-700' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LqStressTestDetail({
  test,
  onBack,
  onRerun,
}: LqStressTestDetailProps) {
  const params = test.paramsJson || {};
  const results = test.resultsJson;
  const severity = params.severity || 'moderate';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-stone-800">{test.name}</h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                  severityLabels[severity]?.className || 'bg-stone-100 text-stone-600'
                }`}
              >
                {severityLabels[severity]?.label || severity}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1">
              {stressTypeLabels[test.stressType] || test.stressType}
              {test.runAt && ` · Запущен: ${formatDateTime(test.runAt)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRerun && (
            <button
              onClick={onRerun}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Перезапустить</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {results ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <div className="text-xs text-stone-500 mb-1">Минимальный баланс</div>
              <div className={`text-lg font-bold ${(results.minCashReached || 0) < 0 ? 'text-red-600' : 'text-stone-800'}`}>
                {formatCurrency(results.minCashReached || 0)}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <div className="text-xs text-stone-500 mb-1">Нарушения порога</div>
              <div className={`text-lg font-bold ${(results.breachesCount || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {results.breachesCount || 0}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <div className="text-xs text-stone-500 mb-1">Дата восстановления</div>
              <div className="text-lg font-bold text-stone-800">
                {results.recoveryDate ? formatDate(results.recoveryDate) : '-'}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <div className="text-xs text-stone-500 mb-1">Статус</div>
              <div className={`text-lg font-bold ${(results.breachesCount || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {(results.breachesCount || 0) > 0 ? 'Дефицит' : 'Без дефицита'}
              </div>
            </div>
          </div>

          {/* Chart */}
          {results.dailyBalances && results.dailyBalances.length > 0 && (
            <LqChartPanel
              title="Стресс-тест: прогноз баланса"
              dailyBalances={results.dailyBalances}
              minCashThreshold={0}
            />
          )}
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <Play className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-700">
            Стресс-тест ещё не запускался. Нажмите "Перезапустить" для выполнения теста.
          </p>
        </div>
      )}

      {/* Parameters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-4">Параметры стресс-теста</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xs text-stone-500 mb-1">Тип стресса</div>
            <div className="font-medium text-stone-800">
              {stressTypeLabels[test.stressType] || test.stressType}
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xs text-stone-500 mb-1">Severity</div>
            <div className="font-medium text-stone-800">
              {severityLabels[severity]?.label || severity}
            </div>
          </div>
          {params.drawdownPercent !== undefined && (
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">Drawdown</div>
              <div className="font-medium text-red-600">
                -{params.drawdownPercent}%
              </div>
            </div>
          )}
          {params.delayDays !== undefined && (
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">Задержка</div>
              <div className="font-medium text-amber-600">
                {params.delayDays} дней
              </div>
            </div>
          )}
          {params.taxIncreasePercent !== undefined && (
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">Рост налогов</div>
              <div className="font-medium text-red-600">
                +{params.taxIncreasePercent}%
              </div>
            </div>
          )}
          {params.rateShockBps !== undefined && (
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">Шок ставок</div>
              <div className="font-medium text-red-600">
                +{params.rateShockBps} bp
              </div>
            </div>
          )}
          {params.accelerationDays !== undefined && (
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">Ускорение</div>
              <div className="font-medium text-red-600">
                -{params.accelerationDays} дней
              </div>
            </div>
          )}
          {params.duration !== undefined && (
            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 mb-1">Длительность</div>
              <div className="font-medium text-stone-800">
                {params.duration} дней
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-2">Метаданные</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-stone-500">ID:</span>{' '}
            <span className="font-mono text-stone-600">{test.id}</span>
          </div>
          <div>
            <span className="text-stone-500">Forecast ID:</span>{' '}
            <span className="font-mono text-stone-600">{test.forecastId}</span>
          </div>
          <div>
            <span className="text-stone-500">Создан:</span>{' '}
            <span className="text-stone-600">{formatDateTime(test.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {results && (results.breachesCount || 0) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="font-semibold text-red-800 mb-2">Внимание: обнаружен дефицит</div>
          <p className="text-sm text-red-700">
            При данном сценарии стресс-теста прогнозируется {results.breachesCount} дней с дефицитом ликвидности.
            Рекомендуется рассмотреть меры по обеспечению дополнительной ликвидности.
          </p>
        </div>
      )}
    </div>
  );
}
