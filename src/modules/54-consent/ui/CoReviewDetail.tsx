"use client";

import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Lock,
  ClipboardList,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Dictionaries                                                       */
/* ------------------------------------------------------------------ */
const STATUS_STYLES: Record<string, string> = {
  open:   'bg-amber-100 text-amber-700',
  closed: 'bg-stone-200 text-stone-600',
};

const ACTION_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  confirm:  { label: 'Подтвердить', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  revoke:   { label: 'Отозвать',    color: 'bg-red-100 text-red-700',         icon: <XCircle className="w-3.5 h-3.5" /> },
  restrict: { label: 'Ограничить',  color: 'bg-amber-100 text-amber-700',     icon: <Lock className="w-3.5 h-3.5" /> },
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface CoReviewDetailProps {
  review: any;
  onBack: () => void;
  onDecide: (granteeId: string, action: string, notes: string) => void;
  onClose: () => void;
  onShowAudit: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CoReviewDetail({
  review,
  onBack,
  onDecide,
  onClose,
  onShowAudit,
}: CoReviewDetailProps) {
  const statusStyle = STATUS_STYLES[review.statusKey] ?? STATUS_STYLES.open;
  const grantees: any[] = review.snapshotJson?.grantees ?? [];
  const decisions: any[] = review.decisionsJson ?? [];

  /* Per-row state for selecting action + notes */
  const [rowActions, setRowActions] = useState<Record<string, string>>({});
  const [rowNotes, setRowNotes] = useState<Record<string, string>>({});

  const daysUntilDue = Math.floor(
    (new Date(review.dueAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000),
  );

  /* Look up existing decision for a grantee */
  const getDecision = (granteeId: string) =>
    decisions.find((d: any) => d.granteeId === granteeId);

  const handleSubmitDecision = (granteeId: string) => {
    const action = rowActions[granteeId];
    const notes = rowNotes[granteeId] ?? '';
    if (action) {
      onDecide(granteeId, action, notes);
    }
  };

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
            <h2 className="text-xl font-bold text-stone-800">{review.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                {review.statusKey === 'open' ? 'Открыт' : 'Закрыт'}
              </span>
              <span className="flex items-center gap-1 text-xs text-stone-500">
                <Calendar className="w-3.5 h-3.5" />
                до {new Date(review.dueAt).toLocaleDateString('ru-RU')}
                {review.statusKey === 'open' && daysUntilDue >= 0 && (
                  <span className={`ml-1 ${daysUntilDue <= 7 ? 'text-red-500 font-medium' : ''}`}>
                    ({daysUntilDue} дн.)
                  </span>
                )}
                {review.statusKey === 'open' && daysUntilDue < 0 && (
                  <span className="ml-1 text-red-500 font-medium">Просрочен</span>
                )}
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

      {/* ---- Due date warning ---- */}
      {review.statusKey === 'open' && daysUntilDue <= 7 && daysUntilDue >= 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-800">Скоро срок</div>
            <p className="text-sm text-amber-700 mt-0.5">
              Осталось {daysUntilDue} дн. до крайнего срока ревью. Примите решение по всем получателям.
            </p>
          </div>
        </div>
      )}

      {/* ---- Grantees table ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-400" />
            Получатели доступа ({grantees.length})
          </h3>
        </div>

        {grantees.length === 0 ? (
          <div className="p-6 text-center text-stone-400">Нет получателей</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-2 font-medium text-stone-600">Получатель</th>
                  <th className="text-left px-4 py-2 font-medium text-stone-600">Тип</th>
                  <th className="text-left px-4 py-2 font-medium text-stone-600">Разрешения</th>
                  <th className="text-left px-4 py-2 font-medium text-stone-600">Решение</th>
                  {review.statusKey === 'open' && (
                    <th className="text-left px-4 py-2 font-medium text-stone-600">Действие</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {grantees.map((g: any) => {
                  const existing = getDecision(g.granteeId);
                  return (
                    <tr
                      key={g.granteeId}
                      className="border-b border-stone-50 hover:bg-stone-50/50"
                    >
                      <td className="px-4 py-2.5 font-medium text-stone-800">
                        {g.granteeLabel}
                      </td>
                      <td className="px-4 py-2.5 text-stone-500 capitalize">
                        {g.granteeType}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(g.permissions ?? []).map((p: string) => (
                            <span
                              key={p}
                              className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        {existing ? (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                              ACTION_LABELS[existing.action]?.color ?? 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {ACTION_LABELS[existing.action]?.icon}
                            {ACTION_LABELS[existing.action]?.label ?? existing.action}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400">Не принято</span>
                        )}
                      </td>
                      {review.statusKey === 'open' && (
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <select
                              value={rowActions[g.granteeId] ?? ''}
                              onChange={(e) =>
                                setRowActions((prev) => ({
                                  ...prev,
                                  [g.granteeId]: e.target.value,
                                }))
                              }
                              className="text-xs px-2 py-1 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              <option value="">Выбрать...</option>
                              <option value="confirm">Подтвердить</option>
                              <option value="revoke">Отозвать</option>
                              <option value="restrict">Ограничить</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Заметка"
                              value={rowNotes[g.granteeId] ?? ''}
                              onChange={(e) =>
                                setRowNotes((prev) => ({
                                  ...prev,
                                  [g.granteeId]: e.target.value,
                                }))
                              }
                              className="text-xs px-2 py-1 border border-stone-300 rounded-lg w-28 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                            <button
                              onClick={() => handleSubmitDecision(g.granteeId)}
                              disabled={!rowActions[g.granteeId]}
                              className="text-xs px-2 py-1 font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              OK
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Decisions summary ---- */}
      {decisions.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-stone-400" />
            Принятые решения ({decisions.length}/{grantees.length})
          </h3>
          <div className="space-y-2">
            {decisions.map((d: any, idx: number) => {
              const grantee = grantees.find((g: any) => g.granteeId === d.granteeId);
              const actionMeta = ACTION_LABELS[d.action];
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-stone-50 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-700">
                      {grantee?.granteeLabel ?? d.granteeId}
                    </span>
                    {actionMeta && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${actionMeta.color}`}
                      >
                        {actionMeta.icon}
                        {actionMeta.label}
                      </span>
                    )}
                  </div>
                  {d.notes && (
                    <span className="text-xs text-stone-400 italic max-w-[40%] truncate">
                      {d.notes}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Timestamps ---- */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-stone-400">Начат</div>
            <div className="font-medium text-stone-700">
              {new Date(review.startedAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-400">Создано</div>
            <div className="font-medium text-stone-700">
              {new Date(review.createdAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
          {review.closedAt && (
            <div>
              <div className="text-xs text-stone-400">Закрыт</div>
              <div className="font-medium text-stone-700">
                {new Date(review.closedAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---- Close review ---- */}
      {review.statusKey === 'open' && (
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
          >
            Закрыть ревью
          </button>
        </div>
      )}
    </div>
  );
}
