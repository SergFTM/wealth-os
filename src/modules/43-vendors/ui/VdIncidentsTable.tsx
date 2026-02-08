"use client";

import React from 'react';
import { VdStatusPill } from './VdStatusPill';
import { VdSeverityPill } from './VdSeverityPill';

interface Incident {
  id: string;
  vendorId: string;
  vendorName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  linkedCaseId?: string;
  reportedAt?: string;
}

interface VdIncidentsTableProps {
  incidents: Incident[];
  onRowClick?: (incident: Incident) => void;
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

export function VdIncidentsTable({ incidents, onRowClick, emptyMessage = 'Нет инцидентов' }: VdIncidentsTableProps) {
  if (incidents.length === 0) {
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
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Severity</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Заголовок</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Case</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">Дата</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {incidents.map((incident) => (
            <tr
              key={incident.id}
              onClick={() => onRowClick?.(incident)}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">
                  {incident.vendorName || incident.vendorId}
                </div>
              </td>
              <td className="px-4 py-3">
                <VdSeverityPill severity={incident.severity} />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-700 line-clamp-1">
                  {incident.title}
                </span>
              </td>
              <td className="px-4 py-3">
                <VdStatusPill status={incident.status} />
              </td>
              <td className="px-4 py-3">
                {incident.linkedCaseId ? (
                  <span className="text-sm text-blue-600 hover:underline">
                    #{incident.linkedCaseId.slice(0, 8)}
                  </span>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-500">
                  {formatDate(incident.reportedAt)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
