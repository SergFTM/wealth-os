'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface Escalation {
  id: string;
  notificationId: string;
  notificationTitle: string;
  level: number;
  escalatedFromName: string;
  escalatedToName: string;
  escalatedToRole?: string | null;
  reason: 'no_response' | 'sla_breach' | 'manual' | 'threshold' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'expired';
  slaBreach: boolean;
  slaDeadline?: string | null;
  createdAt: string;
}

interface NtEscalationsTableProps {
  escalations: Escalation[];
}

const statusColors = {
  active: 'bg-red-100 text-red-700',
  acknowledged: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-gray-100 text-gray-600',
};

const reasonLabels: Record<string, Record<string, string>> = {
  no_response: { ru: 'Нет ответа', en: 'No response', uk: 'Немає відповіді' },
  sla_breach: { ru: 'Нарушение SLA', en: 'SLA breach', uk: 'Порушення SLA' },
  manual: { ru: 'Ручная', en: 'Manual', uk: 'Ручна' },
  threshold: { ru: 'Превышение порога', en: 'Threshold', uk: 'Перевищення порогу' },
  critical: { ru: 'Критическое', en: 'Critical', uk: 'Критичне' },
};

export function NtEscalationsTable({ escalations }: NtEscalationsTableProps) {
  const t = useTranslation();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (escalations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">✅</div>
        <div>{t('noEscalations', { ru: 'Нет активных эскалаций', en: 'No active escalations', uk: 'Немає активних ескалацій' })}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('notification', { ru: 'Уведомление', en: 'Notification', uk: 'Сповіщення' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('escalation', { ru: 'Эскалация', en: 'Escalation', uk: 'Ескалація' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('reason', { ru: 'Причина', en: 'Reason', uk: 'Причина' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('sla', { ru: 'SLA', en: 'SLA', uk: 'SLA' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('actions', { ru: 'Действия', en: 'Actions', uk: 'Дії' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {escalations.map((esc) => (
            <tr key={esc.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900 truncate max-w-xs">
                  {esc.notificationTitle}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(esc.createdAt)}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                    {t('level', { ru: 'Уровень', en: 'Level', uk: 'Рівень' })} {esc.level}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {esc.escalatedFromName} → {esc.escalatedToName}
                  {esc.escalatedToRole && (
                    <span className="ml-1 text-gray-400">({esc.escalatedToRole})</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-gray-600">
                  {reasonLabels[esc.reason]?.ru || esc.reason}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[esc.status]}`}>
                  {esc.status}
                </span>
              </td>
              <td className="py-3 px-4">
                {esc.slaBreach ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    ⚠️ {t('breached', { ru: 'Нарушен', en: 'Breached', uk: 'Порушено' })}
                  </span>
                ) : esc.slaDeadline ? (
                  <span className="text-xs text-gray-600">
                    {t('deadline', { ru: 'До', en: 'By', uk: 'До' })}: {formatDate(esc.slaDeadline)}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/m/notifications/escalation/${esc.id}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  {t('view', { ru: 'Просмотр', en: 'View', uk: 'Переглянути' })}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
