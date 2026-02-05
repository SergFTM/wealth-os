"use client";

import React, { useState } from 'react';
import { CsStatusPill } from './CsStatusPill';
import { CsScopeBadge } from './CsScopeBadge';
import { CsPermissionMatrix } from './CsPermissionMatrix';
import { ArrowLeft, CheckCircle, XCircle, User, Clock, FileText, AlertTriangle } from 'lucide-react';

interface AccessRequest {
  id: string;
  clientId: string;
  requestedBySubjectType: string;
  requestedById: string;
  requestedByName?: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafeRequested: boolean;
  reason: string;
  status: string;
  slaDueAt?: string;
  decidedByUserId?: string;
  decidedByName?: string;
  decidedAt?: string;
  decisionNotes?: string;
  consentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CsRequestDetailProps {
  request: AccessRequest;
  onBack: () => void;
  onApprove?: (validUntil: string, notes: string) => void;
  onReject?: (notes: string) => void;
}

export function CsRequestDetail({ request, onBack, onApprove, onReject }: CsRequestDetailProps) {
  const [activeTab, setActiveTab] = useState<'request' | 'decision' | 'audit'>('request');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approveDate, setApproveDate] = useState('');
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isOverdue = request.slaDueAt && new Date(request.slaDueAt) < new Date() && request.status === 'pending';

  const tabs = [
    { key: 'request', label: 'Запрос' },
    { key: 'decision', label: 'Решение' },
    { key: 'audit', label: 'Аудит' },
  ];

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
            <h1 className="text-xl font-bold text-stone-800">
              Запрос от {request.requestedByName || request.requestedById}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <CsStatusPill status={request.status} size="md" />
              <CsScopeBadge scopeType={request.scopeType} scopeName={request.scopeName} size="md" />
              {isOverdue && (
                <span className="flex items-center gap-1 text-rose-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  SLA просрочен
                </span>
              )}
            </div>
          </div>
        </div>
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowApproveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Одобрить
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-sm font-medium"
            >
              <XCircle className="w-4 h-4" />
              Отклонить
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'request' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800">Запрашивающий</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-sm text-stone-500">Субъект</div>
                  <div className="font-medium">{request.requestedByName || request.requestedById}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-sm text-stone-500">Тип</div>
                  <div className="font-medium">{request.requestedBySubjectType}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800">Сроки</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-sm text-stone-500">Создан</div>
                  <div className="font-medium">{formatDate(request.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className={`w-4 h-4 ${isOverdue ? 'text-rose-500' : 'text-stone-400'}`} />
                <div>
                  <div className="text-sm text-stone-500">SLA до</div>
                  <div className={`font-medium ${isOverdue ? 'text-rose-600' : ''}`}>
                    {formatDate(request.slaDueAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5 space-y-4 lg:col-span-2">
            <h3 className="font-semibold text-stone-800">Причина запроса</h3>
            <p className="text-stone-700">{request.reason}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5 space-y-4 lg:col-span-2">
            <h3 className="font-semibold text-stone-800">Запрашиваемые разрешения</h3>
            <CsPermissionMatrix
              permissions={request.permissions}
              clientSafe={request.clientSafeRequested}
            />
          </div>
        </div>
      )}

      {activeTab === 'decision' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          {request.status === 'pending' ? (
            <p className="text-stone-500">Решение ещё не принято</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {request.status === 'approved' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
                <span className="font-semibold">
                  {request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-stone-500">Решение принял</div>
                  <div className="font-medium">{request.decidedByName || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-stone-500">Дата решения</div>
                  <div className="font-medium">{formatDate(request.decidedAt)}</div>
                </div>
              </div>
              {request.decisionNotes && (
                <div>
                  <div className="text-sm text-stone-500">Комментарий</div>
                  <div className="font-medium mt-1">{request.decisionNotes}</div>
                </div>
              )}
              {request.consentId && (
                <div>
                  <div className="text-sm text-stone-500">Создан consent</div>
                  <code className="text-sm bg-stone-100 px-2 py-1 rounded">{request.consentId}</code>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Audit Trail</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="text-sm">Запрос создан</div>
              <div className="text-xs text-stone-500 ml-auto">{formatDate(request.createdAt)}</div>
            </div>
            {request.decidedAt && (
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                request.status === 'approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${request.status === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div className="text-sm">{request.status === 'approved' ? 'Одобрено' : 'Отклонено'}</div>
                <div className="text-xs text-stone-500 ml-auto">{formatDate(request.decidedAt)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowApproveModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Одобрить запрос</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Срок действия</label>
                <input
                  type="date"
                  value={approveDate}
                  onChange={(e) => setApproveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Комментарий</label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg h-20"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onApprove?.(approveDate, approveNotes);
                  setShowApproveModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Одобрить
              </button>
            </div>
          </div>
        </>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowRejectModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Отклонить запрос</h3>
            <textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Причина отклонения..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg h-24"
            />
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onReject?.(rejectNotes);
                  setShowRejectModal(false);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Отклонить
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
