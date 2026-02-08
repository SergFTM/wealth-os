"use client";

import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Share2,
  Package,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Dictionaries                                                       */
/* ------------------------------------------------------------------ */
const CONFLICT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  overlap:              { label: 'Пересечение',          color: 'bg-blue-100 text-blue-700' },
  expired_access:       { label: 'Просроченный доступ',   color: 'bg-amber-100 text-amber-700' },
  policy_violation:     { label: 'Нарушение политики',    color: 'bg-red-100 text-red-700' },
  client_safe_mismatch: { label: 'Client-safe конфликт',  color: 'bg-violet-100 text-violet-700' },
};

const SEVERITY_STYLES: Record<string, string> = {
  ok:       'bg-emerald-100 text-emerald-700',
  warning:  'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
};

const SEVERITY_LABELS: Record<string, string> = {
  ok:       'OK',
  warning:  'Предупреждение',
  critical: 'Критический',
};

const STATUS_STYLES: Record<string, string> = {
  open:     'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface CoConflictDetailProps {
  conflict: any;
  onBack: () => void;
  onResolve: () => void;
  onShowAudit: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CoConflictDetail({
  conflict,
  onBack,
  onResolve,
  onShowAudit,
}: CoConflictDetailProps) {
  const typeInfo = CONFLICT_TYPE_LABELS[conflict.conflictTypeKey] ?? {
    label: conflict.conflictTypeKey,
    color: 'bg-stone-100 text-stone-600',
  };
  const severityStyle = SEVERITY_STYLES[conflict.severityKey] ?? SEVERITY_STYLES.warning;
  const severityLabel = SEVERITY_LABELS[conflict.severityKey] ?? conflict.severityKey;
  const statusStyle = STATUS_STYLES[conflict.statusKey] ?? STATUS_STYLES.open;

  const impacted = conflict.impactedJson ?? {};
  const consentIds: string[] = impacted.consentIdsJson ?? [];
  const shareIds: string[] = impacted.shareIdsJson ?? [];
  const docIds: string[] = impacted.docIdsJson ?? [];
  const packIds: string[] = impacted.packIdsJson ?? [];

  const suggestion = conflict.suggestedResolutionJson;

  const totalImpacted = consentIds.length + shareIds.length + docIds.length + packIds.length;

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Конфликт
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityStyle}`}>
                {severityLabel}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                {conflict.statusKey === 'open' ? 'Открыт' : 'Разрешён'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShowAudit}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Аудит
          </button>
        </div>
      </div>

      {/* ---- Critical alert banner ---- */}
      {conflict.severityKey === 'critical' && conflict.statusKey === 'open' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <div className="font-semibold text-red-800">Критический конфликт</div>
            <p className="text-sm text-red-700 mt-0.5">
              Обнаружен критический конфликт, затрагивающий {totalImpacted} объект(ов).
              Требуется немедленное вмешательство.
            </p>
          </div>
        </div>
      )}

      {/* ---- Impacted objects ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-4">Затронутые объекты</h3>

        <div className="space-y-4">
          {/* Consent IDs */}
          <ImpactSection
            label="Согласия"
            ids={consentIds}
            icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            badgeColor="bg-emerald-50 text-emerald-700"
          />

          {/* Share IDs */}
          <ImpactSection
            label="Шаринги"
            ids={shareIds}
            icon={<Share2 className="w-4 h-4 text-blue-600" />}
            badgeColor="bg-blue-50 text-blue-700"
          />

          {/* Doc IDs */}
          <ImpactSection
            label="Документы"
            ids={docIds}
            icon={<FileText className="w-4 h-4 text-amber-600" />}
            badgeColor="bg-amber-50 text-amber-700"
          />

          {/* Pack IDs */}
          <ImpactSection
            label="Пакеты"
            ids={packIds}
            icon={<Package className="w-4 h-4 text-violet-600" />}
            badgeColor="bg-violet-50 text-violet-700"
          />

          {totalImpacted === 0 && (
            <p className="text-sm text-stone-400">Нет затронутых объектов</p>
          )}
        </div>
      </div>

      {/* ---- Suggested resolution ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Рекомендуемое решение
        </h3>
        {suggestion ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {suggestion.action}
              </span>
            </div>
            <p className="text-sm text-stone-600">{suggestion.description}</p>
          </div>
        ) : (
          <p className="text-sm text-stone-400">Нет предложенного решения</p>
        )}
      </div>

      {/* ---- Timestamps ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-stone-400">Обнаружен</div>
            <div className="font-medium text-stone-700">
              {new Date(conflict.createdAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
          {conflict.resolvedAt && (
            <div>
              <div className="text-xs text-stone-400">Разрешён</div>
              <div className="font-medium text-stone-700">
                {new Date(conflict.resolvedAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
          {conflict.resolvedByUserId && (
            <div>
              <div className="text-xs text-stone-400">Разрешил</div>
              <div className="font-medium text-stone-700">{conflict.resolvedByUserId}</div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Resolve button ---- */}
      {conflict.statusKey === 'open' && (
        <div className="flex items-center">
          <button
            onClick={onResolve}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Разрешить конфликт
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Impact section helper                                              */
/* ------------------------------------------------------------------ */
function ImpactSection({
  label,
  ids,
  icon,
  badgeColor,
}: {
  label: string;
  ids: string[];
  icon: React.ReactNode;
  badgeColor: string;
}) {
  if (ids.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
          {ids.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 ml-6">
        {ids.map((id) => (
          <span
            key={id}
            className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 ${badgeColor}`}
          >
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}
