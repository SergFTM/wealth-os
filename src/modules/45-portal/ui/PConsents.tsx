'use client';

import React, { useState } from 'react';
import { PortalConsent, ConsentScopeKey, ConsentScopeLabels, Locale } from '../types';
import { PCard, PCardHeader, PCardBody } from './PCard';
import { PStatusPill, PBadge } from './PStatusPill';

interface PConsentsProps {
  consents: PortalConsent[];
  locale?: Locale;
  onRevoke?: (consentId: string) => void;
}

export function PConsents({ consents, locale = 'ru', onRevoke }: PConsentsProps) {
  const [selectedConsent, setSelectedConsent] = useState<PortalConsent | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  const labels: Record<string, Record<string, string>> = {
    title: { ru: 'Управление доступами', en: 'Access Management', uk: 'Управління доступами' },
    advisors: { ru: 'Консультанты с доступом', en: 'Advisors with Access', uk: 'Консультанти з доступом' },
    noConsents: { ru: 'Нет активных доступов', en: 'No active consents', uk: 'Немає активних доступів' },
    scopes: { ru: 'Права доступа', en: 'Access Scopes', uk: 'Права доступу' },
    grantedAt: { ru: 'Предоставлен', en: 'Granted', uk: 'Наданий' },
    expiresAt: { ru: 'Истекает', en: 'Expires', uk: 'Спливає' },
    revoke: { ru: 'Отозвать доступ', en: 'Revoke Access', uk: 'Відкликати доступ' },
    revokeConfirm: { ru: 'Вы уверены, что хотите отозвать доступ?', en: 'Are you sure you want to revoke access?', uk: 'Ви впевнені, що хочете відкликати доступ?' },
    revokeWarning: { ru: 'Консультант потеряет доступ к вашим данным.', en: 'The advisor will lose access to your data.', uk: 'Консультант втратить доступ до ваших даних.' },
    cancel: { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' },
    confirm: { ru: 'Подтвердить', en: 'Confirm', uk: 'Підтвердити' },
    close: { ru: 'Закрыть', en: 'Close', uk: 'Закрити' },
    active: { ru: 'Активен', en: 'Active', uk: 'Активний' },
    revoked: { ru: 'Отозван', en: 'Revoked', uk: 'Відкликаний' },
    expired: { ru: 'Истёк', en: 'Expired', uk: 'Спливсь' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const activeConsents = consents.filter(c => c.status === 'active');
  const inactiveConsents = consents.filter(c => c.status !== 'active');

  const handleRevoke = () => {
    if (selectedConsent) {
      onRevoke?.(selectedConsent.id);
      setShowRevokeConfirm(false);
      setSelectedConsent(null);
    }
  };

  const getScopeLabel = (scope: ConsentScopeKey) => {
    return ConsentScopeLabels[scope]?.[locale] || scope;
  };

  const getStatusVariant = (status: string): 'success' | 'error' | 'default' => {
    if (status === 'active') return 'success';
    if (status === 'revoked') return 'error';
    return 'default';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'active') return labels.active[locale];
    if (status === 'revoked') return labels.revoked[locale];
    return labels.expired[locale];
  };

  return (
    <div className="space-y-6">
      {/* Active Consents */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{labels.advisors[locale]}</h2>
        {activeConsents.length === 0 ? (
          <PCard>
            <PCardBody>
              <div className="py-12 text-center">
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-slate-400">{labels.noConsents[locale]}</p>
              </div>
            </PCardBody>
          </PCard>
        ) : (
          <div className="space-y-3">
            {activeConsents.map(consent => (
              <PCard key={consent.id} hover onClick={() => setSelectedConsent(consent)}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                        {consent.advisorName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{consent.advisorName}</h3>
                        <p className="text-sm text-slate-500">{consent.advisorOrg}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {consent.scopes.slice(0, 3).map(scope => (
                            <PBadge key={scope} variant="default" size="sm">
                              {getScopeLabel(scope)}
                            </PBadge>
                          ))}
                          {consent.scopes.length > 3 && (
                            <span className="text-xs text-slate-400">+{consent.scopes.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <PBadge variant={getStatusVariant(consent.status)} size="sm">
                      {getStatusLabel(consent.status)}
                    </PBadge>
                  </div>
                </div>
              </PCard>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Consents */}
      {inactiveConsents.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {locale === 'ru' ? 'История' : locale === 'en' ? 'History' : 'Історія'}
          </h3>
          <div className="space-y-2 opacity-60">
            {inactiveConsents.map(consent => (
              <PCard key={consent.id}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                      {consent.advisorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-600">{consent.advisorName}</p>
                      <p className="text-xs text-slate-400">{consent.advisorOrg}</p>
                    </div>
                  </div>
                  <PBadge variant={getStatusVariant(consent.status)} size="sm">
                    {getStatusLabel(consent.status)}
                  </PBadge>
                </div>
              </PCard>
            ))}
          </div>
        </div>
      )}

      {/* Consent Detail Modal */}
      {selectedConsent && !showRevokeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedConsent(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedConsent.advisorName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{selectedConsent.advisorName}</h2>
                  <p className="text-sm text-slate-500">{selectedConsent.advisorOrg}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConsent(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{labels.grantedAt[locale]}</p>
                  <p className="text-sm font-medium text-slate-700">{formatDate(selectedConsent.grantedAt)}</p>
                </div>
                {selectedConsent.expiresAt && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">{labels.expiresAt[locale]}</p>
                    <p className="text-sm font-medium text-slate-700">{formatDate(selectedConsent.expiresAt)}</p>
                  </div>
                )}
              </div>

              {/* Scopes */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">{labels.scopes[locale]}</p>
                <div className="space-y-2">
                  {selectedConsent.scopes.map(scope => (
                    <div key={scope} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-700">{getScopeLabel(scope)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revoke Button */}
              {selectedConsent.status === 'active' && (
                <button
                  onClick={() => setShowRevokeConfirm(true)}
                  className="w-full py-3 mt-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
                >
                  {labels.revoke[locale]}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {showRevokeConfirm && selectedConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowRevokeConfirm(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{labels.revokeConfirm[locale]}</h3>
              <p className="text-sm text-slate-500">{labels.revokeWarning[locale]}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRevokeConfirm(false)}
                className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
              >
                {labels.cancel[locale]}
              </button>
              <button
                onClick={handleRevoke}
                className="flex-1 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-xl font-medium transition-colors"
              >
                {labels.confirm[locale]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
