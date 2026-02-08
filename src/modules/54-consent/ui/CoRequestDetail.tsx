"use client";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  PackageCheck,
  FileText,
  Layers,
  User,
  MessageSquare,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Dictionaries                                                       */
/* ------------------------------------------------------------------ */
const REQUEST_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  export:     { label: 'Экспорт',        color: 'bg-blue-100 text-blue-700' },
  correct:    { label: 'Корректировка',   color: 'bg-amber-100 text-amber-700' },
  delete:     { label: 'Удаление',        color: 'bg-red-100 text-red-700' },
  new_access: { label: 'Новый доступ',    color: 'bg-emerald-100 text-emerald-700' },
};

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700',
  approved:  'bg-emerald-100 text-emerald-700',
  rejected:  'bg-red-100 text-red-700',
  fulfilled: 'bg-blue-100 text-blue-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending:   'Ожидает',
  approved:  'Одобрено',
  rejected:  'Отклонено',
  fulfilled: 'Исполнено',
};

/* ------------------------------------------------------------------ */
/*  Workflow steps                                                     */
/* ------------------------------------------------------------------ */
const WORKFLOW_STEPS = ['pending', 'approved', 'fulfilled'] as const;
const WORKFLOW_LABELS: Record<string, string> = {
  pending:   'Ожидание',
  approved:  'Одобрение',
  fulfilled: 'Исполнение',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface CoRequestDetailProps {
  request: any;
  onBack: () => void;
  onApprove: () => void;
  onReject: () => void;
  onFulfill: () => void;
  onShowAudit: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CoRequestDetail({
  request,
  onBack,
  onApprove,
  onReject,
  onFulfill,
  onShowAudit,
}: CoRequestDetailProps) {
  const requester = request.requesterRefJson;
  const typeInfo = REQUEST_TYPE_LABELS[request.requestTypeKey] ?? REQUEST_TYPE_LABELS.export;
  const statusStyle = STATUS_STYLES[request.statusKey] ?? STATUS_STYLES.pending;
  const scope = request.scopeJson ?? {};

  /* Determine active workflow step index */
  const activeStepIdx = WORKFLOW_STEPS.indexOf(
    request.statusKey === 'rejected' ? 'pending' : request.statusKey,
  );

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
              <User className="w-5 h-5 text-stone-400" />
              {requester?.label ?? requester?.id ?? 'Заявитель'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                {STATUS_LABELS[request.statusKey] ?? request.statusKey}
              </span>
              {request.dueAt && (
                <span className="text-xs text-stone-400">
                  до {new Date(request.dueAt).toLocaleDateString('ru-RU')}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onShowAudit}
          className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
        >
          Аудит
        </button>
      </div>

      {/* ---- Workflow timeline ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">Статус обработки</h3>
        <div className="flex items-center gap-0">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isComplete = idx < activeStepIdx || request.statusKey === 'fulfilled';
            const isCurrent = idx === activeStepIdx && request.statusKey !== 'rejected' && request.statusKey !== 'fulfilled';
            const isRejectedHere = request.statusKey === 'rejected' && idx === 0;

            return (
              <div key={step} className="flex items-center flex-1">
                {/* Step circle + label */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isRejectedHere
                        ? 'bg-red-500 text-white'
                        : isComplete
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-amber-400 text-white'
                            : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    {isRejectedHere ? (
                      <XCircle className="w-4 h-4" />
                    ) : isComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="text-xs text-stone-500 mt-1.5">
                    {WORKFLOW_LABELS[step]}
                  </span>
                </div>

                {/* Connector line */}
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 -mt-5 ${
                      isComplete ? 'bg-emerald-400' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Scope ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-stone-400" />
          Запрашиваемые данные
        </h3>

        {scope.description && (
          <p className="text-sm text-stone-600 mb-3">{scope.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scope.modulesJson && scope.modulesJson.length > 0 && (
            <div>
              <div className="text-xs text-stone-400 mb-1">Модули</div>
              <div className="flex flex-wrap gap-1">
                {scope.modulesJson.map((m: string) => (
                  <span
                    key={m}
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
          {scope.entityIdsJson && scope.entityIdsJson.length > 0 && (
            <div>
              <div className="text-xs text-stone-400 mb-1">Юр. лица</div>
              <div className="flex flex-wrap gap-1">
                {scope.entityIdsJson.map((e: string) => (
                  <span
                    key={e}
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
          {scope.docIdsJson && scope.docIdsJson.length > 0 && (
            <div>
              <div className="text-xs text-stone-400 mb-1">Документы</div>
              <div className="flex flex-wrap gap-1">
                {scope.docIdsJson.map((d: string) => (
                  <span
                    key={d}
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {(!scope.modulesJson || scope.modulesJson.length === 0) &&
         (!scope.entityIdsJson || scope.entityIdsJson.length === 0) &&
         (!scope.docIdsJson || scope.docIdsJson.length === 0) &&
         !scope.description && (
          <p className="text-sm text-stone-400">Scope не указан</p>
        )}
      </div>

      {/* ---- Decision notes ---- */}
      {request.decisionNotes && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-stone-400" />
            Комментарий решения
          </h3>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{request.decisionNotes}</p>
        </div>
      )}

      {/* ---- Linked consent ---- */}
      {request.linkedConsentId && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-400" />
            Связанное согласие
          </h3>
          <span className="text-sm text-emerald-700 font-medium">{request.linkedConsentId}</span>
        </div>
      )}

      {/* ---- Timestamps ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-stone-400">Создано</div>
            <div className="font-medium text-stone-700">
              {new Date(request.createdAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Обновлено</div>
            <div className="font-medium text-stone-700">
              {new Date(request.updatedAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
          {request.fulfilledAt && (
            <div>
              <div className="text-xs text-stone-400">Исполнено</div>
              <div className="font-medium text-stone-700">
                {new Date(request.fulfilledAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Action buttons ---- */}
      <div className="flex items-center gap-3">
        {request.statusKey === 'pending' && (
          <>
            <button
              onClick={onApprove}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Одобрить
            </button>
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Отклонить
            </button>
          </>
        )}
        {request.statusKey === 'approved' && (
          <button
            onClick={onFulfill}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PackageCheck className="w-4 h-4" />
            Исполнить
          </button>
        )}
      </div>
    </div>
  );
}
