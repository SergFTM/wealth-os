"use client";

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calculator, AlertTriangle } from 'lucide-react';
import { TxLotDetail } from '@/modules/15-tax/ui/TxLotDetail';
import { TxDeadlineDetail } from '@/modules/15-tax/ui/TxDeadlineDetail';
import { TxAdvisorPackBuilder } from '@/modules/15-tax/ui/TxAdvisorPackBuilder';

interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface TaxLot extends BaseRecord {
  portfolioId: string;
  symbol: string;
  assetName: string;
  assetClass: string;
  quantity: number;
  costBasis: number;
  costBasisPerShare: number;
  currentValue: number;
  currentPrice: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  term: 'short' | 'long';
  holdingDays: number;
  acquisitionDate: string;
  taxRate: number;
  estimatedTax: number;
  lotStatus: 'active' | 'partial' | 'closed';
  currency: string;
}

interface TaxDeadline extends BaseRecord {
  profileId: string;
  title: string;
  type: 'filing' | 'payment';
  jurisdiction: string;
  dueDate: string;
  status: 'overdue' | 'pending' | 'in_progress' | 'completed';
  amount: number | null;
  currency: string;
  description: string;
  penaltyRate: number | null;
  reminderDays: number[];
  assignedTo: string;
  completedAt: string | null;
  notes: string | null;
  linkedDocuments: string[];
}

interface PackDocument {
  documentId: string;
  name: string;
  type: string;
  addedAt: string;
}

interface AdvisorPack extends BaseRecord {
  profileId: string;
  title: string;
  year: number;
  jurisdiction: string;
  status: 'draft' | 'locked' | 'shared' | 'completed';
  createdBy: string;
  advisorEmail: string | null;
  advisorName: string | null;
  documents: PackDocument[];
  notes: string | null;
  sharedAt: string | null;
  expiresAt: string | null;
  lockedAt: string | null;
}

interface TaxGain extends BaseRecord {
  lotId: string;
  portfolioId: string;
  symbol: string;
  assetName: string;
  eventType: 'sell' | 'dividend' | 'coupon' | 'distribution';
  eventDate: string;
  quantity: number;
  proceeds: number;
  costBasis: number;
  realizedPL: number;
  term: 'short' | 'long';
  holdingDays: number;
  taxRate: number;
  taxAmount: number;
  currency: string;
  settlementDate: string;
  reportedToIrs: boolean;
}

const typeCollections: Record<string, string> = {
  lot: 'taxLots',
  gain: 'taxGains',
  deadline: 'taxDeadlines',
  advisorPack: 'taxAdvisorPacks',
  profile: 'taxProfiles',
};

const typeLabels: Record<string, string> = {
  lot: 'Налоговый лот',
  gain: 'Реализация',
  deadline: 'Дедлайн',
  advisorPack: 'Пакет консультанта',
  profile: 'Налоговый профиль',
};

export default function TaxItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'lot';

  const [item, setItem] = useState<TaxLot | TaxGain | TaxDeadline | AdvisorPack | null>(null);
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
    const tabMap: Record<string, string> = {
      lot: 'lots',
      gain: 'gains',
      deadline: 'deadlines',
      advisorPack: 'advisorPacks',
      profile: 'profiles',
    };
    router.push(`/m/tax/list?tab=${tabMap[type] || 'lots'}`);
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
          <Calculator className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Запись не найдена</h2>
          <p className="text-stone-500 mb-4">Запрашиваемая запись не существует или была удалена</p>
          <button
            onClick={() => router.push('/m/tax')}
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Вернуться к дашборду
          </button>
        </div>
      </div>
    );
  }

  // Render based on type
  if (type === 'lot') {
    return (
      <div className="p-6">
        <TxLotDetail
          lot={item as TaxLot}
          onBack={handleBack}
          onSell={() => console.log('Simulate sell')}
        />
      </div>
    );
  }

  if (type === 'deadline') {
    return (
      <div className="p-6">
        <TxDeadlineDetail
          deadline={item as TaxDeadline}
          onBack={handleBack}
          onComplete={() => console.log('Complete')}
          onStartWork={() => console.log('Start work')}
        />
      </div>
    );
  }

  if (type === 'advisorPack') {
    return (
      <div className="p-6">
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </button>
        </div>
        <TxAdvisorPackBuilder
          pack={item as AdvisorPack}
          onAddDocument={(docId) => console.log('Add document:', docId)}
          onRemoveDocument={(docId) => console.log('Remove document:', docId)}
          onLock={() => console.log('Lock pack')}
          onShare={(email) => console.log('Share to:', email)}
          onUpdateNotes={(notes) => console.log('Update notes:', notes)}
        />
      </div>
    );
  }

  // Generic detail view for gain type
  if (type === 'gain') {
    const gain = item as TaxGain;
    const isProfit = gain.realizedPL >= 0;

    const formatCurrency = (value: number, currency: string = 'RUB') => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

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
            <div className="text-xs text-stone-500 uppercase">Реализованное событие</div>
            <h1 className="text-2xl font-bold text-stone-800">{gain.symbol}</h1>
            <div className="text-stone-500">{gain.assetName}</div>
          </div>
        </div>

        {/* Detail Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 uppercase mb-1">Тип события</div>
              <div className="text-sm font-medium text-stone-800">
                {gain.eventType === 'sell' ? 'Продажа' :
                 gain.eventType === 'dividend' ? 'Дивиденд' :
                 gain.eventType === 'coupon' ? 'Купон' : 'Распределение'}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 uppercase mb-1">Дата события</div>
              <div className="text-sm font-medium text-stone-800">
                {new Date(gain.eventDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 uppercase mb-1">Количество</div>
              <div className="text-sm font-medium text-stone-800">{gain.quantity.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 uppercase mb-1">Выручка</div>
              <div className="text-sm font-medium text-stone-800">{formatCurrency(gain.proceeds, gain.currency)}</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 uppercase mb-1">Базис</div>
              <div className="text-sm font-medium text-stone-800">{formatCurrency(gain.costBasis, gain.currency)}</div>
            </div>
            <div className={`p-3 rounded-xl ${isProfit ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className={`text-xs uppercase mb-1 ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                Результат
              </div>
              <div className={`text-sm font-semibold ${isProfit ? 'text-emerald-700' : 'text-red-700'}`}>
                {isProfit ? '+' : ''}{formatCurrency(gain.realizedPL, gain.currency)}
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 uppercase mb-1">Срок владения</div>
              <div className="text-sm font-medium text-stone-800">
                {gain.term === 'short' ? 'Краткосрочный' : 'Долгосрочный'} ({gain.holdingDays} дн.)
              </div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 uppercase mb-1">Налоговая ставка</div>
              <div className="text-sm font-medium text-stone-800">{(gain.taxRate * 100).toFixed(0)}%</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <div className="text-xs text-amber-600 uppercase mb-1">Сумма налога</div>
              <div className="text-sm font-semibold text-amber-700">{formatCurrency(gain.taxAmount, gain.currency)}</div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-500">
            <div>Дата расчёта: {new Date(gain.settlementDate).toLocaleDateString('ru-RU')}</div>
            <div>Создано: {new Date(gain.createdAt).toLocaleString('ru-RU')}</div>
          </div>
        </div>
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
          <h1 className="text-2xl font-bold text-stone-800">{id}</h1>
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
