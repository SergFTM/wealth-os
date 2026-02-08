"use client";

import { ENTITY_TYPE_KEYS } from '../config';

interface Officer {
  name: string;
  role: string;
  email?: string;
  signatory?: boolean;
}

interface BankRef {
  bankName: string;
  accountMasked: string;
  accountType?: string;
}

interface PolicyLink {
  policyId: string;
  policyName: string;
}

interface PhilEntity {
  id: string;
  clientId: string;
  name: string;
  entityTypeKey: keyof typeof ENTITY_TYPE_KEYS;
  jurisdiction?: string;
  einTaxId?: string;
  status: 'active' | 'inactive';
  foundedDate?: string;
  annualBudget?: number;
  currency?: string;
  officersJson?: Officer[];
  bankRefsJson?: BankRef[];
  policyLinksJson?: PolicyLink[];
  descriptionMd?: string;
  createdAt: string;
  updatedAt: string;
}

interface PhEntityDetailProps {
  entity: PhilEntity;
  grantsCount?: number;
  totalGranted?: number;
  onEdit?: () => void;
  onViewGrants?: () => void;
  onViewBudgets?: () => void;
}

export function PhEntityDetail({
  entity,
  grantsCount = 0,
  totalGranted = 0,
  onEdit,
  onViewGrants,
  onViewBudgets,
}: PhEntityDetailProps) {
  const typeConfig = ENTITY_TYPE_KEYS[entity.entityTypeKey];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${typeConfig?.color || 'stone'}-100 text-${typeConfig?.color || 'stone'}-700`}>
                {typeConfig?.ru || entity.entityTypeKey}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                entity.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
              }`}>
                {entity.status === 'active' ? 'Активна' : 'Неактивна'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">{entity.name}</h1>
            {entity.jurisdiction && (
              <p className="text-stone-500 mt-1">Юрисдикция: {entity.jurisdiction}</p>
            )}
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
            >
              Редактировать
            </button>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Годовой бюджет</div>
            <div className="text-xl font-semibold text-stone-900 mt-1">
              {entity.annualBudget ? formatCurrency(entity.annualBudget, entity.currency) : '—'}
            </div>
          </div>
          <button
            onClick={onViewGrants}
            className="bg-stone-50 rounded-lg p-4 text-left hover:bg-stone-100 transition-colors"
          >
            <div className="text-xs text-stone-500 uppercase tracking-wider">Грантов</div>
            <div className="text-xl font-semibold text-stone-900 mt-1">{grantsCount}</div>
          </button>
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Всего выдано</div>
            <div className="text-xl font-semibold text-emerald-600 mt-1">
              {formatCurrency(totalGranted, entity.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Officers */}
      {entity.officersJson && entity.officersJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Должностные лица</h2>
          <div className="space-y-3">
            {entity.officersJson.map((officer, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                <div>
                  <div className="font-medium text-stone-900">{officer.name}</div>
                  <div className="text-sm text-stone-500">{officer.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  {officer.signatory && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                      Подписант
                    </span>
                  )}
                  {officer.email && (
                    <a href={`mailto:${officer.email}`} className="text-sm text-emerald-600 hover:underline">
                      {officer.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bank accounts */}
      {entity.bankRefsJson && entity.bankRefsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Банковские счета</h2>
          <div className="space-y-2">
            {entity.bankRefsJson.map((bank, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                <div className="font-medium text-stone-900">{bank.bankName}</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone-500">{bank.accountType}</span>
                  <code className="text-sm font-mono bg-stone-100 px-2 py-0.5 rounded">{bank.accountMasked}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policies */}
      {entity.policyLinksJson && entity.policyLinksJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Связанные политики</h2>
          <div className="flex flex-wrap gap-2">
            {entity.policyLinksJson.map((policy, idx) => (
              <a
                key={idx}
                href={`/m/policies/policy/${policy.policyId}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm text-stone-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {policy.policyName}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {entity.descriptionMd && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Описание</h2>
          <div className="prose prose-sm max-w-none text-stone-700">
            {entity.descriptionMd}
          </div>
        </div>
      )}
    </div>
  );
}
