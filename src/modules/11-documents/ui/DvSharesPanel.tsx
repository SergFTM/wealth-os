"use client";

import { useState } from 'react';
import { Share2, Plus, Copy, XCircle, Clock, Users, CheckCircle } from 'lucide-react';

interface DocShare {
  id: string;
  name: string;
  audience: 'client' | 'advisor';
  status: 'active' | 'revoked' | 'expired';
  expiresAt: string | null;
  accessToken: string;
  createdAt: string;
  createdBy: string;
}

interface DvSharesPanelProps {
  shares: DocShare[];
  onCreateShare: () => void;
  onRevokeShare: (id: string) => void;
  onCopyLink: (share: DocShare) => void;
}

const statusConfig = {
  active: { label: 'Активный', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  revoked: { label: 'Отозван', color: 'bg-red-100 text-red-700', icon: XCircle },
  expired: { label: 'Истёк', color: 'bg-stone-100 text-stone-600', icon: Clock },
};

const audienceLabels = {
  client: 'Клиент',
  advisor: 'Advisor',
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Без срока';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export function DvSharesPanel({ shares, onCreateShare, onRevokeShare, onCopyLink }: DvSharesPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (share: DocShare) => {
    onCopyLink(share);
    setCopiedId(share.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeShares = shares.filter(s => s.status === 'active');
  const inactiveShares = shares.filter(s => s.status !== 'active');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700">
          Ссылки для шаринга ({shares.length})
        </h3>
        <button
          onClick={onCreateShare}
          className="
            inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
            bg-gradient-to-r from-emerald-500 to-emerald-600
            text-white text-sm font-medium
            hover:from-emerald-600 hover:to-emerald-700
            transition-all
          "
        >
          <Plus className="w-4 h-4" />
          Создать ссылку
        </button>
      </div>

      {shares.length === 0 ? (
        <div className="text-center py-8">
          <Share2 className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-500">Нет активных ссылок</p>
          <button
            onClick={onCreateShare}
            className="mt-3 text-sm text-emerald-600 hover:text-emerald-700"
          >
            Создать первую ссылку
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active shares */}
          {activeShares.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                Активные
              </h4>
              {activeShares.map((share) => {
                const StatusIcon = statusConfig[share.status].icon;
                return (
                  <div
                    key={share.id}
                    className="p-3 bg-white rounded-lg border border-stone-200 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-stone-800 truncate">
                            {share.name}
                          </p>
                          <span className={`
                            inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full
                            ${statusConfig[share.status].color}
                          `}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[share.status].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {audienceLabels[share.audience]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            до {formatDate(share.expiresAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(share)}
                          className={`
                            p-1.5 rounded transition-colors
                            ${copiedId === share.id
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'hover:bg-stone-100 text-stone-400'
                            }
                          `}
                          title="Копировать ссылку"
                        >
                          {copiedId === share.id ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onRevokeShare(share.id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors text-stone-400 hover:text-red-500"
                          title="Отозвать доступ"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Inactive shares */}
          {inactiveShares.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                Неактивные
              </h4>
              {inactiveShares.map((share) => {
                const StatusIcon = statusConfig[share.status].icon;
                return (
                  <div
                    key={share.id}
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200 opacity-60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-stone-600">{share.name}</p>
                        <p className="text-xs text-stone-400">{audienceLabels[share.audience]}</p>
                      </div>
                      <span className={`
                        inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full
                        ${statusConfig[share.status].color}
                      `}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[share.status].label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
