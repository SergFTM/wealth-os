"use client";

import React, { useState } from 'react';
import { CsStatusPill } from './CsStatusPill';
import { CsScopeBadge } from './CsScopeBadge';
import { CsPermissionMatrix } from './CsPermissionMatrix';
import { ArrowLeft, Calendar, XCircle, User, Clock, FileText } from 'lucide-react';

interface Consent {
  id: string;
  clientId: string;
  subjectType: string;
  subjectId: string;
  subjectName?: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafe: boolean;
  validFrom: string;
  validUntil?: string;
  status: string;
  grantedByUserId?: string;
  grantedByName?: string;
  reason?: string;
  requestId?: string;
  watermarkRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CsConsentDetailProps {
  consent: Consent;
  onBack: () => void;
  onExtend?: (newDate: string) => void;
  onRevoke?: (reason: string) => void;
}

export function CsConsentDetail({ consent, onBack, onExtend, onRevoke }: CsConsentDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'permissions' | 'activity' | 'audit'>('overview');
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [extendDate, setExtendDate] = useState('');
  const [revokeReason, setRevokeReason] = useState('');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const tabs = [
    { key: 'overview', label: 'Обзор' },
    { key: 'permissions', label: 'Разрешения' },
    { key: 'activity', label: 'Активность' },
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
              {consent.subjectName || consent.subjectId}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <CsStatusPill status={consent.status} size="md" />
              <CsScopeBadge scopeType={consent.scopeType} scopeName={consent.scopeName} size="md" />
            </div>
          </div>
        </div>
        {consent.status === 'active' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowExtendModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              Продлить
            </button>
            <button
              onClick={() => setShowRevokeModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-sm font-medium"
            >
              <XCircle className="w-4 h-4" />
              Отозвать
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
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800">Информация о субъекте</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-sm text-stone-500">Субъект</div>
                  <div className="font-medium">{consent.subjectName || consent.subjectId}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-sm text-stone-500">Тип</div>
                  <div className="font-medium">{consent.subjectType}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5 space-y-4">
            <h3 className="font-semibold text-stone-800">Срок действия</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-sm text-stone-500">Действует с</div>
                  <div className="font-medium">{formatDate(consent.validFrom)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="text-sm text-stone-500">Действует до</div>
                  <div className="font-medium">{formatDate(consent.validUntil)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5 space-y-4 lg:col-span-2">
            <h3 className="font-semibold text-stone-800">Детали</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-stone-500">Выдал</div>
                <div className="font-medium">{consent.grantedByName || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-stone-500">Причина</div>
                <div className="font-medium">{consent.reason || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-stone-500">Создан</div>
                <div className="font-medium">{formatDate(consent.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm text-stone-500">Request ID</div>
                <div className="font-medium">{consent.requestId || '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Матрица разрешений</h3>
          <CsPermissionMatrix
            permissions={consent.permissions}
            clientSafe={consent.clientSafe}
            watermarkRequired={consent.watermarkRequired}
          />
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">История активности</h3>
          <p className="text-stone-500 text-sm">MVP: Синтетические данные активности</p>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="text-sm">Просмотр документа #{i}</div>
                <div className="text-xs text-stone-500 ml-auto">{formatDate(consent.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Audit Trail</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="text-sm">Согласие создано</div>
              <div className="text-xs text-stone-500 ml-auto">{formatDate(consent.createdAt)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowExtendModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Продлить согласие</h3>
            <input
              type="date"
              value={extendDate}
              onChange={(e) => setExtendDate(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowExtendModal(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onExtend?.(extendDate);
                  setShowExtendModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Продлить
              </button>
            </div>
          </div>
        </>
      )}

      {/* Revoke Modal */}
      {showRevokeModal && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowRevokeModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 p-6 w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Отозвать согласие</h3>
            <textarea
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="Причина отзыва..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg mb-4 h-24"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onRevoke?.(revokeReason);
                  setShowRevokeModal(false);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Отозвать
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
