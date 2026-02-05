"use client";

import { Calculator, AlertTriangle, TrendingUp, TrendingDown, Leaf, Calendar, FileText, ArrowRight } from 'lucide-react';
import { TxKpiStrip } from './TxKpiStrip';

interface TaxLot {
  id: string;
  symbol: string;
  assetName: string;
  unrealizedPL: number;
  term: 'short' | 'long';
  holdingDays: number;
  currency: string;
}

interface TaxGain {
  id: string;
  symbol: string;
  realizedPL: number;
  eventDate: string;
  term: 'short' | 'long';
  currency: string;
}

interface TaxDeadline {
  id: string;
  title: string;
  dueDate: string;
  status: 'overdue' | 'pending' | 'in_progress' | 'completed';
  type: 'filing' | 'payment';
  jurisdiction: string;
}

interface HarvestingOpportunity {
  id: string;
  symbol: string;
  unrealizedLoss: number;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
  status: string;
}

interface TxDashboardPageProps {
  lots: TaxLot[];
  gains: TaxGain[];
  deadlines: TaxDeadline[];
  harvesting: HarvestingOpportunity[];
  onNavigate: (path: string) => void;
}

export function TxDashboardPage({ lots, gains, deadlines, harvesting, onNavigate }: TxDashboardPageProps) {
  const formatCurrency = (value: number, currency: string = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate KPIs
  const totalUnrealizedGains = lots.reduce((sum, l) => sum + (l.unrealizedPL > 0 ? l.unrealizedPL : 0), 0);
  const totalUnrealizedLosses = lots.reduce((sum, l) => sum + (l.unrealizedPL < 0 ? Math.abs(l.unrealizedPL) : 0), 0);
  const totalRealizedGains = gains.reduce((sum, g) => sum + (g.realizedPL > 0 ? g.realizedPL : 0), 0);
  const shortTermGains = gains.filter(g => g.term === 'short').reduce((sum, g) => sum + (g.realizedPL > 0 ? g.realizedPL : 0), 0);
  const longTermGains = gains.filter(g => g.term === 'long').reduce((sum, g) => sum + (g.realizedPL > 0 ? g.realizedPL : 0), 0);
  const harvestingPotential = harvesting.filter(h => h.status === 'new' || h.status === 'reviewing').reduce((sum, h) => sum + h.potentialSavings, 0);
  const overdueDeadlines = deadlines.filter(d => d.status === 'overdue').length;
  const upcomingDeadlines = deadlines.filter(d => d.status !== 'completed' && d.status !== 'overdue').length;

  const kpis = [
    { id: 'realizedGains', label: 'Реализованная прибыль YTD', value: formatCurrency(totalRealizedGains), trend: 'up' as const, trendValue: '+12%', color: 'emerald' as const },
    { id: 'unrealizedGains', label: 'Нереализованная прибыль', value: formatCurrency(totalUnrealizedGains), trend: 'up' as const, trendValue: '+8%', color: 'default' as const },
    { id: 'harvestingPotential', label: 'Потенциал харвестинга', value: formatCurrency(harvestingPotential), trend: 'neutral' as const, color: 'amber' as const },
    { id: 'pendingDeadlines', label: 'Ближайших дедлайнов', value: String(upcomingDeadlines), trend: overdueDeadlines > 0 ? 'up' as const : 'neutral' as const, trendValue: overdueDeadlines > 0 ? `${overdueDeadlines} просрочено` : undefined, color: overdueDeadlines > 0 ? 'red' as const : 'default' as const },
    { id: 'shortTermGains', label: 'Краткосрочная прибыль', value: formatCurrency(shortTermGains), trend: 'down' as const, trendValue: '-5%', color: 'default' as const },
    { id: 'longTermGains', label: 'Долгосрочная прибыль', value: formatCurrency(longTermGains), trend: 'up' as const, trendValue: '+15%', color: 'emerald' as const },
    { id: 'unrealizedLosses', label: 'Нереализованные убытки', value: formatCurrency(totalUnrealizedLosses), trend: 'neutral' as const, color: 'default' as const },
    { id: 'activeLots', label: 'Активных лотов', value: String(lots.length), trend: 'neutral' as const, color: 'default' as const },
  ];

  // Get top loss lots for harvesting preview
  const topLossLots = [...lots]
    .filter(l => l.unrealizedPL < 0)
    .sort((a, b) => a.unrealizedPL - b.unrealizedPL)
    .slice(0, 5);

  // Get upcoming deadlines
  const upcomingDeadlinesList = [...deadlines]
    .filter(d => d.status !== 'completed')
    .sort((a, b) => {
      const statusOrder = { overdue: 0, pending: 1, in_progress: 1 };
      return (statusOrder[a.status as keyof typeof statusOrder] || 1) - (statusOrder[b.status as keyof typeof statusOrder] || 1);
    })
    .slice(0, 5);

  // Get high priority harvesting
  const highPriorityHarvesting = harvesting
    .filter(h => h.priority === 'high' && (h.status === 'new' || h.status === 'reviewing'))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Налоговый центр</h1>
          <p className="text-sm text-stone-500 mt-1">Управление налоговыми лотами и отчётностью</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/m/tax/list?tab=lots')}
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Все лоты
          </button>
          <button
            onClick={() => onNavigate('/m/tax/list?tab=harvesting')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <Leaf className="w-4 h-4 inline mr-2" />
            Tax Harvesting
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Не является налоговой консультацией.</strong> Информация носит справочный характер.
          Проконсультируйтесь с налоговым консультантом перед принятием решений.
        </div>
      </div>

      {/* KPIs */}
      <TxKpiStrip items={kpis} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Loss Positions */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Позиции с убытками
            </h3>
            <button
              onClick={() => onNavigate('/m/tax/list?tab=lots')}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Все лоты <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {topLossLots.length > 0 ? (
            <div className="space-y-3">
              {topLossLots.map((lot) => (
                <div
                  key={lot.id}
                  onClick={() => onNavigate(`/m/tax/item/${lot.id}?type=lot`)}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="font-semibold text-stone-800">{lot.symbol}</div>
                      <div className="text-xs text-stone-500">
                        {lot.term === 'short' ? 'Краткосрочн.' : 'Долгосрочн.'} • {lot.holdingDays} дн.
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">{formatCurrency(lot.unrealizedPL, lot.currency)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500">
              Нет позиций с нереализованными убытками
            </div>
          )}
        </div>

        {/* High Priority Harvesting */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              Рекомендации по харвестингу
            </h3>
            <button
              onClick={() => onNavigate('/m/tax/list?tab=harvesting')}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Все возможности <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {highPriorityHarvesting.length > 0 ? (
            <div className="space-y-3">
              {highPriorityHarvesting.map((h) => (
                <div
                  key={h.id}
                  onClick={() => onNavigate(`/m/tax/list?tab=harvesting`)}
                  className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-stone-800">{h.symbol}</div>
                      <div className="text-xs text-stone-500">
                        Убыток: {formatCurrency(Math.abs(h.unrealizedLoss))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-600">+{formatCurrency(h.potentialSavings)}</div>
                    <div className="text-xs text-emerald-500">экономия</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500">
              Нет рекомендаций высокого приоритета
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Ближайшие дедлайны
            </h3>
            <button
              onClick={() => onNavigate('/m/tax/list?tab=deadlines')}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Все дедлайны <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {upcomingDeadlinesList.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlinesList.map((deadline) => {
                const isOverdue = deadline.status === 'overdue';
                const dueDate = new Date(deadline.dueDate);
                const now = new Date();
                const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={deadline.id}
                    onClick={() => onNavigate(`/m/tax/item/${deadline.id}?type=deadline`)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isOverdue ? 'bg-red-50 hover:bg-red-100' : 'bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isOverdue ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Calendar className="w-4 h-4 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium text-stone-800">{deadline.title}</div>
                        <div className="text-xs text-stone-500">
                          {deadline.type === 'filing' ? 'Подача' : 'Оплата'} • {deadline.jurisdiction}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-stone-700'}`}>
                        {dueDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className={`text-xs ${isOverdue ? 'text-red-500' : 'text-stone-500'}`}>
                        {isOverdue ? `${Math.abs(daysUntil)} дн. назад` : `через ${daysUntil} дн.`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500">
              Нет предстоящих дедлайнов
            </div>
          )}
        </div>

        {/* Recent Realized Gains */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Последние реализации
            </h3>
            <button
              onClick={() => onNavigate('/m/tax/list?tab=gains')}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Все события <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {gains.slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {[...gains]
                .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
                .slice(0, 5)
                .map((gain) => {
                  const isProfit = gain.realizedPL >= 0;
                  return (
                    <div
                      key={gain.id}
                      onClick={() => onNavigate(`/m/tax/list?tab=gains`)}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isProfit ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <div>
                          <div className="font-semibold text-stone-800">{gain.symbol}</div>
                          <div className="text-xs text-stone-500">
                            {new Date(gain.eventDate).toLocaleDateString('ru-RU')} • {gain.term === 'short' ? 'КС' : 'ДС'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isProfit ? '+' : ''}{formatCurrency(gain.realizedPL, gain.currency)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-6 text-center text-stone-500">
              Нет реализованных событий
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('/m/tax/list?tab=lots')}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
        >
          <Calculator className="w-6 h-6 text-stone-500" />
          <div className="text-left">
            <div className="font-medium text-stone-800">Налоговые лоты</div>
            <div className="text-xs text-stone-500">{lots.length} позиций</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/m/tax/list?tab=gains')}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
        >
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          <div className="text-left">
            <div className="font-medium text-stone-800">Реализации</div>
            <div className="text-xs text-stone-500">{gains.length} событий</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/m/tax/list?tab=deadlines')}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
        >
          <Calendar className="w-6 h-6 text-blue-500" />
          <div className="text-left">
            <div className="font-medium text-stone-800">Дедлайны</div>
            <div className="text-xs text-stone-500">{upcomingDeadlines + overdueDeadlines} активных</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/m/tax/list?tab=advisorPacks')}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all"
        >
          <FileText className="w-6 h-6 text-purple-500" />
          <div className="text-left">
            <div className="font-medium text-stone-800">Пакеты для консультанта</div>
            <div className="text-xs text-stone-500">Создать пакет</div>
          </div>
        </button>
      </div>
    </div>
  );
}
