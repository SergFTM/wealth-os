"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { VdStatusPill } from './VdStatusPill';
import { VdSeverityPill } from './VdSeverityPill';

interface TimelineEntry {
  timestamp: string;
  action: string;
  actor: string;
  notes?: string;
}

interface Incident {
  id: string;
  vendorId: string;
  vendorName?: string;
  contractId?: string;
  slaId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category?: string;
  linkedCaseId?: string;
  linkedSecurityIncidentId?: string;
  impactJson?: {
    financialImpact?: number;
    affectedServices?: string[];
    downtimeMinutes?: number;
    reputationalRisk?: string;
  };
  timelineJson?: TimelineEntry[];
  rootCause?: string;
  resolution?: string;
  preventiveMeasures?: string;
  reportedAt?: string;
  resolvedAt?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface VdIncidentDetailProps {
  incident: Incident;
  onEdit?: () => void;
  onResolve?: () => void;
  onLinkCase?: () => void;
  onBack?: () => void;
}

const categoryLabels: Record<string, string> = {
  service_outage: 'Сбой сервиса',
  data_breach: 'Утечка данных',
  sla_breach: 'Нарушение SLA',
  billing_error: 'Ошибка биллинга',
  communication: 'Коммуникация',
  quality: 'Качество',
  compliance: 'Compliance',
  other: 'Другое',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function VdIncidentDetail({
  incident,
  onEdit,
  onResolve,
  onLinkCase,
  onBack,
}: VdIncidentDetailProps) {
  const [showTimeline, setShowTimeline] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            <div>
              <div className="flex items-center gap-3">
                <VdSeverityPill severity={incident.severity} size="md" />
                <h1 className="text-2xl font-bold text-stone-800">{incident.title}</h1>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                <span>Провайдер: {incident.vendorName || incident.vendorId}</span>
                <span>·</span>
                <VdStatusPill status={incident.status} />
                {incident.category && (
                  <>
                    <span>·</span>
                    <span>{categoryLabels[incident.category] || incident.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {onLinkCase && !incident.linkedCaseId && (
              <Button variant="secondary" onClick={onLinkCase}>
                Связать с Case
              </Button>
            )}
            {onResolve && (incident.status === 'open' || incident.status === 'in_progress') && (
              <Button variant="secondary" onClick={onResolve}>
                Решить
              </Button>
            )}
            {onEdit && (
              <Button variant="primary" onClick={onEdit}>
                Редактировать
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {incident.description && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h2 className="font-semibold text-stone-800 mb-3">Описание</h2>
              <p className="text-sm text-stone-600 whitespace-pre-wrap">{incident.description}</p>
            </div>
          )}

          {/* Impact */}
          {incident.impactJson && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h2 className="font-semibold text-stone-800 mb-3">Влияние</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {incident.impactJson.financialImpact !== undefined && (
                  <div>
                    <span className="text-stone-500">Финансовый импакт</span>
                    <div className="font-medium text-stone-800">
                      ${incident.impactJson.financialImpact.toLocaleString()}
                    </div>
                  </div>
                )}
                {incident.impactJson.downtimeMinutes !== undefined && (
                  <div>
                    <span className="text-stone-500">Downtime</span>
                    <div className="font-medium text-stone-800">
                      {incident.impactJson.downtimeMinutes} мин
                    </div>
                  </div>
                )}
                {incident.impactJson.reputationalRisk && (
                  <div>
                    <span className="text-stone-500">Репутационный риск</span>
                    <div className="font-medium text-stone-800 capitalize">
                      {incident.impactJson.reputationalRisk === 'high' ? 'Высокий' :
                       incident.impactJson.reputationalRisk === 'medium' ? 'Средний' : 'Низкий'}
                    </div>
                  </div>
                )}
                {incident.impactJson.affectedServices && incident.impactJson.affectedServices.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-stone-500">Затронутые сервисы</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {incident.impactJson.affectedServices.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 bg-stone-100 rounded text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resolution */}
          {(incident.rootCause || incident.resolution || incident.preventiveMeasures) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <h2 className="font-semibold text-stone-800 mb-3">Анализ и решение</h2>
              <div className="space-y-4 text-sm">
                {incident.rootCause && (
                  <div>
                    <span className="font-medium text-stone-700">Root Cause</span>
                    <p className="mt-1 text-stone-600">{incident.rootCause}</p>
                  </div>
                )}
                {incident.resolution && (
                  <div>
                    <span className="font-medium text-stone-700">Решение</span>
                    <p className="mt-1 text-stone-600">{incident.resolution}</p>
                  </div>
                )}
                {incident.preventiveMeasures && (
                  <div>
                    <span className="font-medium text-stone-700">Превентивные меры</span>
                    <p className="mt-1 text-stone-600">{incident.preventiveMeasures}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <h2 className="font-semibold text-stone-800 mb-3">Информация</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Зарегистрирован</span>
                <span className="text-stone-700">{formatDate(incident.reportedAt)}</span>
              </div>
              {incident.resolvedAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Решен</span>
                  <span className="text-stone-700">{formatDate(incident.resolvedAt)}</span>
                </div>
              )}
              {incident.assignedTo && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Назначен</span>
                  <span className="text-stone-700">{incident.assignedTo}</span>
                </div>
              )}
              {incident.linkedCaseId && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Case</span>
                  <a href={`/m/cases/case/${incident.linkedCaseId}`} className="text-blue-600 hover:underline">
                    #{incident.linkedCaseId.slice(0, 8)}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          {incident.timelineJson && incident.timelineJson.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="w-full flex items-center justify-between"
              >
                <h2 className="font-semibold text-stone-800">Timeline</h2>
                <svg
                  className={`w-5 h-5 text-stone-400 transition-transform ${showTimeline ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTimeline && (
                <div className="mt-4 space-y-4">
                  {incident.timelineJson.map((entry, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-stone-200">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-stone-300" />
                      <div className="text-xs text-stone-400">{formatDate(entry.timestamp)}</div>
                      <div className="text-sm font-medium text-stone-700">{entry.action}</div>
                      <div className="text-xs text-stone-500">{entry.actor}</div>
                      {entry.notes && (
                        <div className="mt-1 text-xs text-stone-500">{entry.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
