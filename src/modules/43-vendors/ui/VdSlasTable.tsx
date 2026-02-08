"use client";

import React from 'react';
import { VdStatusPill } from './VdStatusPill';

interface Sla {
  id: string;
  vendorId: string;
  vendorName?: string;
  serviceKey: string;
  serviceName?: string;
  kpisJson?: Array<{ name: string; target: number; unit: string }>;
  status: 'ok' | 'warning' | 'breached';
  lastMeasuredAt?: string;
  metricsJson?: {
    responseTimeAvg?: number;
    uptime?: number;
    breachCount?: number;
  };
}

interface VdSlasTableProps {
  slas: Sla[];
  onRowClick?: (sla: Sla) => void;
  emptyMessage?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
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

export function VdSlasTable({ slas, onRowClick, emptyMessage = 'Нет SLA' }: VdSlasTableProps) {
  if (slas.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50 text-left">
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Провайдер</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Сервис</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">KPI Target</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Uptime</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Response</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Измерено</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {slas.map((sla) => (
            <tr
              key={sla.id}
              onClick={() => onRowClick?.(sla)}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">
                  {sla.vendorName || sla.vendorId}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-600">
                  {sla.serviceName || sla.serviceKey}
                </span>
              </td>
              <td className="px-4 py-3">
                {sla.kpisJson && sla.kpisJson.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {sla.kpisJson.slice(0, 2).map((kpi, idx) => (
                      <span key={idx} className="text-xs px-1.5 py-0.5 bg-stone-100 rounded">
                        {kpi.name}: {kpi.target}{kpi.unit}
                      </span>
                    ))}
                    {sla.kpisJson.length > 2 && (
                      <span className="text-xs text-stone-400">+{sla.kpisJson.length - 2}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <VdStatusPill status={sla.status} />
              </td>
              <td className="px-4 py-3">
                {sla.metricsJson?.uptime !== undefined ? (
                  <span className={`text-sm font-medium ${
                    sla.metricsJson.uptime >= 99 ? 'text-emerald-600' :
                    sla.metricsJson.uptime >= 95 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {sla.metricsJson.uptime.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {sla.metricsJson?.responseTimeAvg !== undefined ? (
                  <span className="text-sm text-stone-600">
                    {sla.metricsJson.responseTimeAvg} мин
                  </span>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-500">
                  {formatDate(sla.lastMeasuredAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
