"use client";

import { ArrowLeft, Play, Pause, Settings, RefreshCw, Calendar, Database, Building2, Briefcase, Calculator, CreditCard, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { IhStatusPill } from './IhStatusPill';

interface Connector {
  id: string;
  clientId: string;
  name: string;
  type: 'bank' | 'broker' | 'custodian' | 'accounting' | 'bill' | 'arch';
  provider: string;
  status: 'active' | 'disabled';
  health: 'ok' | 'warning' | 'critical';
  lastRunId: string | null;
  lastRunAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ConnectorCredential {
  id: string;
  connectorId: string;
  type: 'api_key' | 'oauth' | 'sftp' | 'basic';
  secretRef: string;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'revoked';
}

interface IhConnectorDetailProps {
  connector: Connector;
  credentials?: ConnectorCredential[];
  recentRuns?: Array<{
    id: string;
    status: string;
    startedAt: string;
    recordsIngested: number;
    errorsCount: number;
  }>;
  onRunNow?: () => void;
  onToggleStatus?: () => void;
  onConfigure?: () => void;
  onBack?: () => void;
}

const typeConfig: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  bank: { label: 'Bank', Icon: Building2 },
  broker: { label: 'Broker', Icon: TrendingUp },
  custodian: { label: 'Custodian', Icon: Database },
  accounting: { label: 'Accounting', Icon: Calculator },
  bill: { label: 'BILL', Icon: CreditCard },
  arch: { label: 'Arch', Icon: Briefcase },
};

const credentialTypeLabels: Record<string, string> = {
  api_key: 'API Key',
  oauth: 'OAuth 2.0',
  sftp: 'SFTP',
  basic: 'Basic Auth',
};

export function IhConnectorDetail({
  connector,
  credentials = [],
  recentRuns = [],
  onRunNow,
  onToggleStatus,
  onConfigure,
  onBack,
}: IhConnectorDetailProps) {
  const typeInfo = typeConfig[connector.type] || typeConfig.bank;
  const TypeIcon = typeInfo.Icon;

  const formatDate = (date: string | null): string => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center">
              <TypeIcon className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">{connector.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-stone-500">{connector.provider}</span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-stone-600 bg-stone-100 rounded">
                  {typeInfo.label}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IhStatusPill status={connector.status} />
          <IhStatusPill status={connector.health} />
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRunNow}
          disabled={connector.status === 'disabled'}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Run Now
        </button>
        <button
          onClick={onToggleStatus}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
        >
          {connector.status === 'active' ? (
            <>
              <Pause className="w-4 h-4" />
              Disable
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Enable
            </>
          )}
        </button>
        <button
          onClick={onConfigure}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
          Configure
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-sm font-semibold text-stone-600 uppercase mb-4">Детали коннектора</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-stone-500">ID</dt>
                <dd className="font-mono text-sm text-stone-800">{connector.id}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Client ID</dt>
                <dd className="font-mono text-sm text-stone-800">{connector.clientId}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Последний запуск</dt>
                <dd className="text-sm text-stone-800">{formatDate(connector.lastRunAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Создан</dt>
                <dd className="text-sm text-stone-800">{formatDate(connector.createdAt)}</dd>
              </div>
              {connector.notes && (
                <div className="col-span-2">
                  <dt className="text-xs text-stone-500">Заметки</dt>
                  <dd className="text-sm text-stone-800">{connector.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Recent runs */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-sm font-semibold text-stone-600 uppercase mb-4">Последние запуски</h2>
            {recentRuns.length === 0 ? (
              <p className="text-stone-500 text-sm">Нет запусков</p>
            ) : (
              <div className="space-y-2">
                {recentRuns.slice(0, 5).map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <IhStatusPill status={run.status} size="sm" />
                      <span className="text-sm text-stone-600">
                        {formatDate(run.startedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {run.recordsIngested}
                      </span>
                      {run.errorsCount > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-3.5 h-3.5" />
                          {run.errorsCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Credentials */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-sm font-semibold text-stone-600 uppercase mb-4">Credentials</h2>
            {credentials.length === 0 ? (
              <p className="text-stone-500 text-sm">Нет credentials</p>
            ) : (
              <div className="space-y-3">
                {credentials.map((cred) => (
                  <div key={cred.id} className="p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-stone-800">
                        {credentialTypeLabels[cred.type]}
                      </span>
                      <IhStatusPill status={cred.status} size="sm" />
                    </div>
                    <div className="font-mono text-xs text-stone-500">
                      {cred.secretRef}
                    </div>
                    {cred.expiresAt && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-stone-500">
                        <Clock className="w-3 h-3" />
                        Expires: {formatDate(cred.expiresAt)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700">
              Интеграции в MVP демонстрационные, реальные подключения требуют настройки и проверки.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
