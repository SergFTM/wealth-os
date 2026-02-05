"use client";

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { RkAlertDetail } from '@/modules/14-risk/ui/RkAlertDetail';
import { RkStressRunDetail } from '@/modules/14-risk/ui/RkStressRunDetail';

interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface RiskAlert extends BaseRecord {
  portfolioId: string;
  title: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'resolved';
  triggeredAt: string;
  description: string;
  currentValue: number | null;
  threshold: number | null;
  unit: string | null;
  source: string;
  assignedTo: string | null;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

interface StressRunResult {
  equityImpact: number;
  fixedIncomeImpact: number;
  alternativesImpact: number;
  cashImpact: number;
  totalPnL: number;
  worstPosition: string;
  worstPositionLoss: number;
}

interface StressRun extends BaseRecord {
  scenarioId: string;
  scenarioName: string;
  portfolioId: string;
  runDate: string;
  status: 'completed' | 'running' | 'failed';
  portfolioImpact: number | null;
  portfolioImpactValue: number | null;
  varBreached: boolean | null;
  results: StressRunResult | null;
  runBy: string;
  notes: string | null;
}

interface RiskAction extends BaseRecord {
  portfolioId: string;
  alertId: string;
  title: string;
  type: 'rebalance' | 'hedge' | 'escalation' | 'reporting';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  targetValue: number | null;
  currentValue: number | null;
  unit: string | null;
  dueDate: string;
  assignedTo: string;
  approvedBy: string | null;
  approvedAt: string | null;
  notes: string | null;
}

interface Exposure extends BaseRecord {
  portfolioId: string;
  dimension: string;
  segment: string;
  exposure: number;
  benchmark: number;
  deviation: number;
  marketValue: number;
  asOfDate: string;
}

interface Concentration extends BaseRecord {
  portfolioId: string;
  type: string;
  name: string;
  identifier: string;
  weight: number;
  limit: number;
  status: 'ok' | 'warning' | 'breached';
  marketValue: number;
  asOfDate: string;
}

interface RiskMetric extends BaseRecord {
  portfolioId: string;
  metric: string;
  label: string;
  value: number;
  unit: string;
  period: string;
  benchmark: number;
  benchmarkLabel: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  asOfDate: string;
}

interface StressScenario extends BaseRecord {
  name: string;
  type: 'historical' | 'hypothetical';
  description: string;
  severity: 'moderate' | 'severe';
  status: 'active' | 'draft';
  parameters: Record<string, number>;
  assumptions: string;
  lastRunDate: string | null;
  frequency: string;
}

const typeCollections: Record<string, string> = {
  alert: 'riskAlerts',
  stressRun: 'stressRuns',
  action: 'riskActions',
  exposure: 'riskExposures',
  concentration: 'riskConcentrations',
  metric: 'riskMetrics',
  scenario: 'stressScenarios',
};

const typeLabels: Record<string, string> = {
  alert: 'Алерт',
  stressRun: 'Стресс-тест',
  action: 'Действие',
  exposure: 'Экспозиция',
  concentration: 'Концентрация',
  metric: 'Метрика',
  scenario: 'Сценарий',
};

export default function RiskItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'alert';

  const [item, setItem] = useState<
    RiskAlert | StressRun | RiskAction | Exposure | Concentration | RiskMetric | StressScenario | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const collection = typeCollections[type];
        if (!collection) {
          throw new Error('Unknown type');
        }

        const res = await fetch(`/api/collections/${collection}/${id}`);
        if (!res.ok) throw new Error('Item not found');

        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error('Failed to fetch item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, type]);

  const handleBack = () => {
    router.push(`/m/risk/list?tab=${type === 'stressRun' || type === 'scenario' ? 'stress' : type + 's'}`);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="h-64 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
          <Shield className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Запись не найдена</h2>
          <p className="text-stone-500 mb-4">Запрашиваемая запись не существует или была удалена</p>
          <button
            onClick={() => router.push('/m/risk')}
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Вернуться к дашборду
          </button>
        </div>
      </div>
    );
  }

  // Render based on type
  if (type === 'alert') {
    return (
      <div className="p-6">
        <RkAlertDetail
          alert={item as RiskAlert}
          onBack={handleBack}
          onAcknowledge={() => console.log('Acknowledge')}
          onResolve={() => console.log('Resolve')}
          onCreateAction={() => router.push('/m/risk/list?tab=actions')}
        />
      </div>
    );
  }

  if (type === 'stressRun') {
    return (
      <div className="p-6">
        <RkStressRunDetail
          run={item as StressRun}
          onBack={handleBack}
          onExport={() => console.log('Export')}
        />
      </div>
    );
  }

  // Generic detail view for other types
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-500" />
        </button>
        <div>
          <div className="text-xs text-stone-500 uppercase">{typeLabels[type]}</div>
          <h1 className="text-2xl font-bold text-stone-800">
            {'name' in item ? (item as { name: string }).name :
             'title' in item ? (item as { title: string }).title :
             'label' in item ? (item as { label: string }).label :
             'segment' in item ? (item as { segment: string }).segment :
             id}
          </h1>
        </div>
      </div>

      {/* Detail Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(item).map(([key, value]) => {
            if (['id', 'createdAt', 'updatedAt'].includes(key)) return null;
            if (typeof value === 'object' && value !== null) return null;

            return (
              <div key={key} className="p-3 bg-stone-50 rounded-xl">
                <div className="text-xs text-stone-500 uppercase mb-1">{key}</div>
                <div className="text-sm font-medium text-stone-800">
                  {value === null ? '—' :
                   typeof value === 'boolean' ? (value ? 'Да' : 'Нет') :
                   typeof value === 'number' ? value.toLocaleString() :
                   String(value)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timestamps */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-500">
          <div>Создано: {new Date(item.createdAt).toLocaleString('ru-RU')}</div>
          <div>Обновлено: {new Date(item.updatedAt).toLocaleString('ru-RU')}</div>
        </div>
      </div>
    </div>
  );
}
