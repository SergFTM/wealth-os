"use client";

import { PhSeverityPill } from './PhSeverityPill';
import { COMPLIANCE_CHECK_TYPE_KEYS, COMPLIANCE_STATUS_KEYS } from '../config';

interface ComplianceCheck {
  id: string;
  grantId: string;
  checkTypeKey: keyof typeof COMPLIANCE_CHECK_TYPE_KEYS;
  statusKey: keyof typeof COMPLIANCE_STATUS_KEYS;
  notes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface PhCompliancePanelProps {
  checks: ComplianceCheck[];
  grantId?: string;
  onCheckClick?: (check: ComplianceCheck) => void;
  onRunCheck?: (checkType: keyof typeof COMPLIANCE_CHECK_TYPE_KEYS) => void;
  showActions?: boolean;
}

export function PhCompliancePanel({
  checks,
  grantId,
  onCheckClick,
  onRunCheck,
  showActions = true,
}: PhCompliancePanelProps) {
  const filteredChecks = grantId ? checks.filter(c => c.grantId === grantId) : checks;

  const openCount = filteredChecks.filter(c => c.statusKey === 'open').length;
  const clearedCount = filteredChecks.filter(c => c.statusKey === 'cleared').length;
  const flaggedCount = filteredChecks.filter(c => c.statusKey === 'flagged').length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
      <div className="px-4 py-3 border-b border-stone-200/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Комплаенс проверки</h3>
          <div className="flex items-center gap-2 text-xs">
            {openCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                {openCount} открыто
              </span>
            )}
            {clearedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                {clearedCount} ✓
              </span>
            )}
            {flaggedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {flaggedCount} ⚠
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {filteredChecks.length === 0 ? (
          <div className="p-4 text-center text-stone-500 text-sm">
            Нет проверок
          </div>
        ) : (
          filteredChecks.map((check) => {
            const typeConfig = COMPLIANCE_CHECK_TYPE_KEYS[check.checkTypeKey];
            return (
              <div
                key={check.id}
                onClick={() => onCheckClick?.(check)}
                className="px-4 py-3 flex items-center justify-between hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    check.statusKey === 'cleared' ? 'bg-green-100 text-green-600' :
                    check.statusKey === 'flagged' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {check.statusKey === 'cleared' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : check.statusKey === 'flagged' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">{typeConfig?.ru || check.checkTypeKey}</div>
                    {check.notes && (
                      <div className="text-xs text-stone-500 truncate max-w-xs">{check.notes}</div>
                    )}
                  </div>
                </div>
                <PhSeverityPill status={check.statusKey} />
              </div>
            );
          })
        )}
      </div>

      {showActions && (
        <div className="px-4 py-3 border-t border-stone-200/50 bg-stone-50/50">
          <div className="flex flex-wrap gap-2">
            {Object.keys(COMPLIANCE_CHECK_TYPE_KEYS).map((typeKey) => {
              const type = typeKey as keyof typeof COMPLIANCE_CHECK_TYPE_KEYS;
              const exists = filteredChecks.some(c => c.checkTypeKey === type);
              const config = COMPLIANCE_CHECK_TYPE_KEYS[type];
              return (
                <button
                  key={type}
                  onClick={() => onRunCheck?.(type)}
                  disabled={exists}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    exists
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  + {config.ru}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
