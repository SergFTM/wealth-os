"use client";

import { FileCheck, Target, Clock, Shield, Gauge, AlertTriangle, History, FileText } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  scopeType: 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  status: 'draft' | 'active' | 'archived';
  currentVersionId?: string;
  objectivesJson?: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  liquidityNeeds?: string;
  timeHorizon?: string;
  createdAt: string;
  updatedAt: string;
}

interface Version {
  id: string;
  versionNumber: number;
  status: 'draft' | 'submitted' | 'approved';
  approvedAt?: string;
  approvedBy?: string;
  summaryNotes?: string;
}

interface IpsPolicyDetailProps {
  policy: Policy;
  versions: Version[];
  constraintsCount: number;
  breachesCount: number;
  onEditPolicy: () => void;
  onCreateVersion: () => void;
  onViewConstraints: () => void;
  onViewBreaches: () => void;
  onOpenVersion: (id: string) => void;
}

const scopeLabels: Record<string, string> = {
  household: 'Хозяйство',
  entity: 'Юридическое лицо',
  portfolio: 'Портфель',
};

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  active: 'Активна',
  archived: 'Архив',
};

const statusColors: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-600',
  active: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-stone-100 text-stone-500',
};

const riskLabels: Record<string, string> = {
  conservative: 'Консервативный',
  moderate: 'Умеренный',
  aggressive: 'Агрессивный',
};

const riskColors: Record<string, string> = {
  conservative: 'bg-blue-100 text-blue-700',
  moderate: 'bg-amber-100 text-amber-700',
  aggressive: 'bg-red-100 text-red-700',
};

const versionStatusLabels: Record<string, string> = {
  draft: 'Черновик',
  submitted: 'На согласовании',
  approved: 'Утверждена',
};

const versionStatusColors: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-600',
  submitted: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export function IpsPolicyDetail({
  policy,
  versions,
  constraintsCount,
  breachesCount,
  onEditPolicy,
  onCreateVersion,
  onViewConstraints,
  onViewBreaches,
  onOpenVersion,
}: IpsPolicyDetailProps) {
  const objectives = policy.objectivesJson ? JSON.parse(policy.objectivesJson) : {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">{policy.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-stone-500">{scopeLabels[policy.scopeType]}</span>
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[policy.status]}`}>
                  {statusLabels[policy.status]}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onEditPolicy}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Редактировать
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <Shield className="w-5 h-5 text-stone-500" />
            <div>
              <div className="text-xs text-stone-500">Риск-профиль</div>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-0.5 ${riskColors[policy.riskTolerance]}`}>
                {riskLabels[policy.riskTolerance]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
            <Clock className="w-5 h-5 text-stone-500" />
            <div>
              <div className="text-xs text-stone-500">Горизонт</div>
              <div className="text-sm font-medium text-stone-800">{policy.timeHorizon || '—'}</div>
            </div>
          </div>
          <button
            onClick={onViewConstraints}
            className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <Gauge className="w-5 h-5 text-emerald-600" />
            <div className="text-left">
              <div className="text-xs text-stone-500">Ограничения</div>
              <div className="text-sm font-medium text-stone-800">{constraintsCount}</div>
            </div>
          </button>
          <button
            onClick={onViewBreaches}
            className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <AlertTriangle className={`w-5 h-5 ${breachesCount > 0 ? 'text-red-500' : 'text-stone-400'}`} />
            <div className="text-left">
              <div className="text-xs text-stone-500">Нарушения</div>
              <div className={`text-sm font-medium ${breachesCount > 0 ? 'text-red-600' : 'text-stone-800'}`}>
                {breachesCount}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Objectives */}
      {Object.keys(objectives).length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-stone-800">Инвестиционные цели</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectives.returnTarget && (
              <div className="p-3 bg-stone-50 rounded-xl">
                <div className="text-xs text-stone-500 mb-1">Целевая доходность</div>
                <div className="text-sm font-medium text-stone-800">{objectives.returnTarget}</div>
              </div>
            )}
            {objectives.incomeNeeds && (
              <div className="p-3 bg-stone-50 rounded-xl">
                <div className="text-xs text-stone-500 mb-1">Потребность в доходе</div>
                <div className="text-sm font-medium text-stone-800">{objectives.incomeNeeds}</div>
              </div>
            )}
            {objectives.capitalPreservation && (
              <div className="p-3 bg-stone-50 rounded-xl">
                <div className="text-xs text-stone-500 mb-1">Сохранение капитала</div>
                <div className="text-sm font-medium text-stone-800">{objectives.capitalPreservation}</div>
              </div>
            )}
            {policy.liquidityNeeds && (
              <div className="p-3 bg-stone-50 rounded-xl">
                <div className="text-xs text-stone-500 mb-1">Ликвидность</div>
                <div className="text-sm font-medium text-stone-800">{policy.liquidityNeeds}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Versions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-stone-800">Версии политики</h2>
          </div>
          <button
            onClick={onCreateVersion}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            + Новая версия
          </button>
        </div>

        {versions.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm text-stone-500">Нет версий</p>
          </div>
        ) : (
          <div className="space-y-2">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => onOpenVersion(version.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-sm font-bold text-emerald-700">
                    v{version.versionNumber}
                  </div>
                  <div className="text-left">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${versionStatusColors[version.status]}`}>
                      {versionStatusLabels[version.status]}
                    </span>
                    {version.summaryNotes && (
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{version.summaryNotes}</p>
                    )}
                  </div>
                </div>
                {version.approvedAt && (
                  <div className="text-xs text-stone-500">
                    {formatDate(version.approvedAt)}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
