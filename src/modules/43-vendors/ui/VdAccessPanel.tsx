"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

interface AccessGrant {
  id: string;
  vendorId: string;
  vendorName?: string;
  grantedTo: string;
  grantedToEmail?: string;
  scope: string;
  status: 'active' | 'expired' | 'revoked';
  grantedAt: string;
  expiresAt?: string;
  consentId?: string;
}

interface VdAccessPanelProps {
  grants: AccessGrant[];
  onRevoke?: (grantId: string) => void;
  onRequestAccess?: () => void;
  emptyMessage?: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function isExpiringSoon(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  const daysUntil = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysUntil <= 30 && daysUntil > 0;
}

function isExpired(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-stone-50 text-stone-600 border-stone-200',
  revoked: 'bg-red-50 text-red-600 border-red-200',
};

const statusLabels: Record<string, string> = {
  active: 'Активен',
  expired: 'Истек',
  revoked: 'Отозван',
};

export function VdAccessPanel({ grants, onRevoke, onRequestAccess, emptyMessage = 'Нет активных доступов' }: VdAccessPanelProps) {
  const activeGrants = grants.filter(g => g.status === 'active' && !isExpired(g.expiresAt));
  const expiredGrants = grants.filter(g => g.status !== 'active' || isExpired(g.expiresAt));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Доступы к данным</h3>
        {onRequestAccess && (
          <Button variant="secondary" onClick={onRequestAccess}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Запросить доступ
          </Button>
        )}
      </div>

      {/* Active Grants */}
      {activeGrants.length > 0 ? (
        <div className="space-y-3">
          {activeGrants.map((grant) => (
            <div
              key={grant.id}
              className="bg-white border border-stone-200/50 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-800">{grant.grantedTo}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColors[grant.status]}`}>
                      {statusLabels[grant.status]}
                    </span>
                    {isExpiringSoon(grant.expiresAt) && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Истекает скоро
                      </span>
                    )}
                  </div>
                  {grant.grantedToEmail && (
                    <div className="text-sm text-stone-500 mt-0.5">{grant.grantedToEmail}</div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                    <span>Scope: {grant.scope}</span>
                    <span>·</span>
                    <span>Выдан: {formatDate(grant.grantedAt)}</span>
                    {grant.expiresAt && (
                      <>
                        <span>·</span>
                        <span>Истекает: {formatDate(grant.expiresAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                {onRevoke && grant.status === 'active' && (
                  <Button
                    variant="ghost"
                    onClick={() => onRevoke(grant.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Отозвать
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-stone-500 bg-stone-50/50 rounded-lg">
          {emptyMessage}
        </div>
      )}

      {/* Expired/Revoked Grants */}
      {expiredGrants.length > 0 && (
        <details className="mt-4">
          <summary className="text-sm text-stone-500 cursor-pointer hover:text-stone-700">
            История доступов ({expiredGrants.length})
          </summary>
          <div className="mt-3 space-y-2">
            {expiredGrants.map((grant) => (
              <div
                key={grant.id}
                className="bg-stone-50 border border-stone-100 rounded-lg p-3 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-stone-700">{grant.grantedTo}</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full border ${statusColors[grant.status]}`}>
                      {statusLabels[grant.status]}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">{formatDate(grant.grantedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Info */}
      <div className="text-xs text-stone-400 mt-4">
        Управление доступами через модуль Consents. Все изменения логируются в Audit.
      </div>
    </div>
  );
}
