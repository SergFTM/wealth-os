'use client';

/**
 * Committee Sources Card Component
 * Shows linked sources for agenda items
 */

import Link from 'next/link';
import { SourceRef } from '../schema/committeeAgendaItem';

interface CmSourcesCardProps {
  sources: SourceRef[];
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    title: 'Источники данных',
    noSources: 'Нет связанных источников',
    asOf: 'на',
    types: {
      portfolio: 'Портфель',
      risk_alert: 'Риск алерт',
      ips_policy: 'IPS политика',
      ips_breach: 'IPS нарушение',
      ai_narrative: 'AI нарратив',
      report: 'Отчет',
      document: 'Документ',
    },
    icons: {
      portfolio: '📊',
      risk_alert: '⚠️',
      ips_policy: '📜',
      ips_breach: '🚨',
      ai_narrative: '🤖',
      report: '📋',
      document: '📄',
    },
  },
  en: {
    title: 'Data Sources',
    noSources: 'No linked sources',
    asOf: 'as of',
    types: {
      portfolio: 'Portfolio',
      risk_alert: 'Risk Alert',
      ips_policy: 'IPS Policy',
      ips_breach: 'IPS Breach',
      ai_narrative: 'AI Narrative',
      report: 'Report',
      document: 'Document',
    },
    icons: {
      portfolio: '📊',
      risk_alert: '⚠️',
      ips_policy: '📜',
      ips_breach: '🚨',
      ai_narrative: '🤖',
      report: '📋',
      document: '📄',
    },
  },
  uk: {
    title: 'Джерела даних',
    noSources: 'Немає пов\'язаних джерел',
    asOf: 'на',
    types: {
      portfolio: 'Портфель',
      risk_alert: 'Ризик алерт',
      ips_policy: 'IPS політика',
      ips_breach: 'IPS порушення',
      ai_narrative: 'AI наратив',
      report: 'Звіт',
      document: 'Документ',
    },
    icons: {
      portfolio: '📊',
      risk_alert: '⚠️',
      ips_policy: '📜',
      ips_breach: '🚨',
      ai_narrative: '🤖',
      report: '📋',
      document: '📄',
    },
  },
};

const SOURCE_ROUTES: Record<string, string> = {
  portfolio: '/m/net-worth',
  risk_alert: '/m/risk/item',
  ips_policy: '/m/ips/item',
  ips_breach: '/m/ips/item',
  ai_narrative: '/m/ai/item',
  report: '/m/reports/item',
  document: '/m/documents/item',
};

export function CmSourcesCard({ sources, lang = 'ru' }: CmSourcesCardProps) {
  const l = labels[lang];

  if (sources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{l.noSources}</div>
    );
  }

  const groupedSources = sources.reduce((acc, source) => {
    if (!acc[source.type]) {
      acc[source.type] = [];
    }
    acc[source.type].push(source);
    return acc;
  }, {} as Record<string, SourceRef[]>);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">{l.title}</h3>

      <div className="space-y-3">
        {Object.entries(groupedSources).map(([type, items]) => (
          <div key={type} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{l.icons[type as keyof typeof l.icons] || '📎'}</span>
              <span className="font-medium text-gray-700">
                {l.types[type as keyof typeof l.types] || type}
              </span>
              <span className="text-sm text-gray-500">({items.length})</span>
            </div>

            <ul className="space-y-2">
              {items.map((source, idx) => {
                const route = SOURCE_ROUTES[source.type];
                const href = route ? `${route}/${source.id}` : '#';

                return (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={href}
                        className="text-sm font-medium text-gray-900 hover:text-emerald-600 truncate block"
                      >
                        {source.title}
                      </Link>
                      {source.asOf && (
                        <span className="text-xs text-gray-500">
                          {l.asOf} {new Date(source.asOf).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <Link
                      href={href}
                      className="text-sm text-blue-600 hover:text-blue-700 ml-2"
                    >
                      →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
