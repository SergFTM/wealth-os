"use client";

import { Play, Settings, Pause, ExternalLink, Database, Building2, Briefcase, Calculator, CreditCard, TrendingUp } from 'lucide-react';
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
}

interface IhConnectorsTableProps {
  connectors: Connector[];
  onRowClick?: (connector: Connector) => void;
  onRunNow?: (connector: Connector) => void;
  onDisable?: (connector: Connector) => void;
  compact?: boolean;
}

const typeConfig: Record<string, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  bank: { label: 'Bank', Icon: Building2 },
  broker: { label: 'Broker', Icon: TrendingUp },
  custodian: { label: 'Custodian', Icon: Database },
  accounting: { label: 'Accounting', Icon: Calculator },
  bill: { label: 'BILL', Icon: CreditCard },
  arch: { label: 'Arch', Icon: Briefcase },
};

export function IhConnectorsTable({
  connectors,
  onRowClick,
  onRunNow,
  onDisable,
  compact = false,
}: IhConnectorsTableProps) {
  const displayConnectors = compact ? connectors.slice(0, 10) : connectors;

  const formatDate = (date: string | null): string => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Коннектор</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Тип</th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Провайдер</th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Health</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Последний запуск</th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayConnectors.map((connector) => {
              const typeInfo = typeConfig[connector.type] || typeConfig.bank;
              const TypeIcon = typeInfo.Icon;

              return (
                <tr
                  key={connector.id}
                  onClick={() => onRowClick?.(connector)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-stone-800">{connector.name}</div>
                    {compact && (
                      <div className="text-xs text-stone-500">{connector.provider}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded">
                      <TypeIcon className="w-3 h-3" />
                      {typeInfo.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-600">{connector.provider}</td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <IhStatusPill status={connector.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <IhStatusPill status={connector.health} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {formatDate(connector.lastRunAt)}
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRunNow?.(connector);
                          }}
                          disabled={connector.status === 'disabled'}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Play className="w-3 h-3" />
                          Run
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDisable?.(connector);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          {connector.status === 'active' ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
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

      {connectors.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет коннекторов для отображения
        </div>
      )}
    </div>
  );
}
