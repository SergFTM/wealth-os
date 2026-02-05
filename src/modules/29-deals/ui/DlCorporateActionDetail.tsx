'use client';

import { ArrowLeft, Calendar, TrendingUp, AlertCircle, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DlStatusPill } from './DlStatusPill';

interface CorporateAction {
  id: string;
  effectiveAt: string;
  exDate?: string;
  recordDate?: string;
  paymentDate?: string;
  assetKey: string;
  assetName: string;
  actionType: string;
  termsJson: string;
  status: string;
  impactedRefsJson?: string;
  notes?: string;
  createdAt: string;
}

interface DlCorporateActionDetailProps {
  action: CorporateAction;
  onApply?: () => void;
}

const actionTypeLabels: Record<string, string> = {
  dividend: 'Дивиденд',
  split: 'Сплит',
  merger: 'Слияние',
  'spin-off': 'Спин-офф',
  'rights-issue': 'Права',
  tender: 'Тендер'
};

export function DlCorporateActionDetail({ action, onApply }: DlCorporateActionDetailProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const parseTerms = (termsJson: string) => {
    try {
      return JSON.parse(termsJson);
    } catch {
      return {};
    }
  };

  const terms = parseTerms(action.termsJson);

  const renderTerms = () => {
    switch (action.actionType) {
      case 'dividend':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">Сумма на акцию</div>
              <div className="text-lg font-semibold text-slate-900">${terms.amountPerShare || 0}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Валюта</div>
              <div className="text-lg font-semibold text-slate-900">{terms.currency || 'USD'}</div>
            </div>
          </div>
        );
      case 'split':
        return (
          <div>
            <div className="text-xs text-slate-500">Коэффициент</div>
            <div className="text-lg font-semibold text-slate-900">{terms.ratio || 1}:1</div>
          </div>
        );
      case 'merger':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">Коэффициент обмена</div>
              <div className="text-lg font-semibold text-slate-900">{terms.exchangeRatio || 1}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Новый актив</div>
              <div className="text-lg font-semibold text-slate-900">{terms.newAssetKey || '—'}</div>
            </div>
            {terms.cashPerShare && (
              <div>
                <div className="text-xs text-slate-500">Денежная составляющая</div>
                <div className="text-lg font-semibold text-slate-900">${terms.cashPerShare}/акция</div>
              </div>
            )}
          </div>
        );
      case 'spin-off':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">Коэффициент</div>
              <div className="text-lg font-semibold text-slate-900">{(terms.ratio || 0) * 100}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Новый актив</div>
              <div className="text-lg font-semibold text-slate-900">{terms.newAssetKey || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Аллокация себестоимости</div>
              <div className="text-lg font-semibold text-slate-900">{(terms.costBasisAllocation || 0) * 100}%</div>
            </div>
          </div>
        );
      default:
        return (
          <pre className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg overflow-auto">
            {JSON.stringify(terms, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/m/deals/list?tab=actions')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к списку
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {actionTypeLabels[action.actionType] || action.actionType}
            </h1>
            <DlStatusPill status={action.status} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <span className="font-mono font-medium text-slate-700">{action.assetKey}</span>
            <span>—</span>
            <span>{action.assetName}</span>
          </div>
        </div>
        {(action.status === 'planned' || action.status === 'announced') && onApply && (
          <button
            onClick={onApply}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all"
          >
            <Play className="h-4 w-4" />
            Применить
          </button>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-500">Дата вступления</span>
          </div>
          <div className="text-sm font-medium text-slate-900">{formatDate(action.effectiveAt)}</div>
        </div>
        {action.exDate && (
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-500">Ex-дата</span>
            </div>
            <div className="text-sm font-medium text-slate-900">{formatDate(action.exDate)}</div>
          </div>
        )}
        {action.recordDate && (
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-500">Дата записи</span>
            </div>
            <div className="text-sm font-medium text-slate-900">{formatDate(action.recordDate)}</div>
          </div>
        )}
        {action.paymentDate && (
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-500">Дата выплаты</span>
            </div>
            <div className="text-sm font-medium text-slate-900">{formatDate(action.paymentDate)}</div>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
        <h3 className="text-sm font-medium text-slate-700 mb-4">Условия</h3>
        {renderTerms()}
      </div>

      {/* Notes */}
      {action.notes && (
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Примечания</h3>
          <p className="text-sm text-slate-600">{action.notes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm text-amber-700">
            <strong>Важно:</strong> Применение корпоративного действия изменит позиции в портфеле.
            Убедитесь, что все данные корректны перед применением.
          </div>
        </div>
      </div>
    </div>
  );
}
