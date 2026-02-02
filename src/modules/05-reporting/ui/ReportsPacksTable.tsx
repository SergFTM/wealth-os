"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ReportPack {
  id: string;
  name: string;
  clientId: string;
  templateId: string;
  templateName?: string;
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  asOf: string;
  owner: string;
  missingSources?: number;
  currentVersion: number;
  updatedAt: string;
}

interface ReportsPacksTableProps {
  packs: ReportPack[];
  onRowClick?: (packId: string) => void;
  onAction?: (action: string, packId: string) => void;
}

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  in_review: 'На согласовании',
  approved: 'Одобрен',
  published: 'Опубликован',
  archived: 'Архив',
};

const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'pending'> = {
  draft: 'pending',
  in_review: 'warning',
  approved: 'ok',
  published: 'ok',
  archived: 'pending',
};

export function ReportsPacksTable({ packs, onRowClick, onAction }: ReportsPacksTableProps) {
  const router = useRouter();

  const handleRowClick = (packId: string) => {
    if (onRowClick) {
      onRowClick(packId);
    } else {
      router.push(`/m/reporting/item/${packId}`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200">
        <h3 className="font-semibold text-stone-800">Последние пакеты</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Название</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Клиент</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Шаблон</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">As-of</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Владелец</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Действие</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Обновлён</th>
          </tr>
        </thead>
        <tbody>
          {packs.map(pack => (
            <tr
              key={pack.id}
              onClick={() => handleRowClick(pack.id)}
              className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-800">{pack.name}</span>
                  {(pack.missingSources ?? 0) > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                      {pack.missingSources} missing
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-stone-600">{pack.clientId}</td>
              <td className="py-3 px-4 text-stone-500">{pack.templateName || pack.templateId}</td>
              <td className="py-3 px-4 text-center">
                <StatusBadge
                  status={statusMap[pack.status]}
                  size="sm"
                  label={statusLabels[pack.status]}
                />
              </td>
              <td className="py-3 px-4 text-center text-stone-600">
                {new Date(pack.asOf).toLocaleDateString('ru-RU')}
              </td>
              <td className="py-3 px-4 text-stone-500 text-xs">{pack.owner.split('@')[0]}</td>
              <td className="py-3 px-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    onAction?.(pack.status === 'draft' ? 'submit' : pack.status === 'approved' ? 'publish' : 'view', pack.id);
                  }}
                >
                  {pack.status === 'draft' ? 'Отправить' :
                   pack.status === 'in_review' ? 'Одобрить' :
                   pack.status === 'approved' ? 'Опубликовать' : 'Открыть'}
                </Button>
              </td>
              <td className="py-3 px-4 text-right text-stone-400 text-xs">
                {new Date(pack.updatedAt).toLocaleDateString('ru-RU')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
