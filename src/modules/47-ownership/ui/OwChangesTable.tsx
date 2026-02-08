"use client";

interface OwChange {
  id: string;
  changeTypeKey: string;
  linkId: string;
  changedFieldsJson: Record<string, { old: unknown; new: unknown }>;
  changedByUserId: string;
  changedAt: string;
  notes?: string;
}

interface OwChangesTableProps {
  data: OwChange[];
  onRowClick?: (change: OwChange) => void;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  link_created: { label: 'Создание', color: 'bg-emerald-100 text-emerald-700' },
  link_updated: { label: 'Изменение', color: 'bg-blue-100 text-blue-700' },
  link_deleted: { label: 'Удаление', color: 'bg-red-100 text-red-700' },
  pct_changed: { label: 'Изменение %', color: 'bg-amber-100 text-amber-700' },
  effective_date_changed: { label: 'Изменение даты', color: 'bg-purple-100 text-purple-700' },
};

export function OwChangesTable({ data, onRowClick }: OwChangesTableProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        Нет изменений для отображения
      </div>
    );
  }

  const formatChanges = (fields: Record<string, { old: unknown; new: unknown }>): string => {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(fields)) {
      if (key === 'ownershipPct' || key === 'profitSharePct') {
        parts.push(`${value.old}% → ${value.new}%`);
      }
    }
    return parts.join(', ') || '—';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Дата</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Тип</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Изменения</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Пользователь</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">Примечание</th>
          </tr>
        </thead>
        <tbody>
          {data.map((change) => {
            const typeStyle = typeLabels[change.changeTypeKey] || { label: change.changeTypeKey, color: 'bg-stone-100 text-stone-600' };

            return (
              <tr
                key={change.id}
                onClick={() => onRowClick?.(change)}
                className={`border-b border-stone-100 ${onRowClick ? 'hover:bg-stone-50 cursor-pointer' : ''} transition-colors`}
              >
                <td className="px-4 py-3 text-sm text-stone-600">
                  {new Date(change.changedAt).toLocaleString('ru-RU')}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeStyle.color}`}>
                    {typeStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {formatChanges(change.changedFieldsJson)}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {change.changedByUserId}
                </td>
                <td className="px-4 py-3 text-sm text-stone-500 max-w-xs truncate">
                  {change.notes || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OwChangesTable;
