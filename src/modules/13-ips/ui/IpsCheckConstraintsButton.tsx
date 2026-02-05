"use client";

import { useState } from 'react';
import { PlayCircle, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface CheckResult {
  constraintId: string;
  segment: string;
  limit: number;
  measured: number;
  breached: boolean;
  severity: 'ok' | 'warning' | 'critical';
}

interface IpsCheckConstraintsButtonProps {
  policyId?: string;
  onCheckComplete: (results: CheckResult[], breachesCreated: number) => void;
}

export function IpsCheckConstraintsButton({ policyId, onCheckComplete }: IpsCheckConstraintsButtonProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<{ time: string; breaches: number } | null>(null);

  const runCheck = async () => {
    setIsChecking(true);

    // Simulate constraint check - in real implementation this would:
    // 1. Fetch current portfolio positions
    // 2. Compare against constraint limits
    // 3. Create breach records for violations
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate simulated results
    const results: CheckResult[] = [
      { constraintId: 'c-001', segment: 'Equities', limit: 60, measured: 58, breached: false, severity: 'ok' },
      { constraintId: 'c-002', segment: 'Fixed Income', limit: 40, measured: 42, breached: true, severity: 'warning' },
      { constraintId: 'c-003', segment: 'US Exposure', limit: 50, measured: 55, breached: true, severity: 'warning' },
      { constraintId: 'c-004', segment: 'Single Position', limit: 5, measured: 8, breached: true, severity: 'critical' },
      { constraintId: 'c-005', segment: 'Cash', limit: 5, measured: 3, breached: false, severity: 'ok' },
    ];

    const breachesCreated = results.filter(r => r.breached).length;

    // Create audit event
    await fetch('/api/collections/auditEvents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'constraints_checked',
        collection: 'ipsConstraints',
        recordId: policyId || 'all',
        summary: `Проверка ограничений: ${results.length} проверено, ${breachesCreated} нарушений`,
        actorRole: 'system',
        ts: new Date().toISOString(),
        scope: 'ips',
        severity: breachesCreated > 0 ? 'warning' : 'info',
      }),
    });

    setLastCheck({
      time: new Date().toLocaleTimeString('ru-RU'),
      breaches: breachesCreated,
    });

    setIsChecking(false);
    onCheckComplete(results, breachesCreated);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={runCheck}
        disabled={isChecking}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
          ${isChecking
            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md'}
        `}
      >
        {isChecking ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Проверка...
          </>
        ) : (
          <>
            <PlayCircle className="w-4 h-4" />
            Проверить ограничения
          </>
        )}
      </button>

      {lastCheck && (
        <div className="flex items-center gap-2 text-sm">
          {lastCheck.breaches > 0 ? (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          )}
          <span className="text-stone-600">
            {lastCheck.time}: {lastCheck.breaches} нарушений
          </span>
        </div>
      )}
    </div>
  );
}
