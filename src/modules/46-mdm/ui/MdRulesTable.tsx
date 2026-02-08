"use client";

import { DataTable } from '@/components/ui/DataTable';
import { MdStatusPill } from './MdStatusPill';
import { MdmRuleTypeLabels, MdmRuleTypeKey, MdmRecordTypeKey } from '../config';

interface MdmRule {
  id: string;
  name: string;
  description?: string;
  ruleTypeKey: MdmRuleTypeKey;
  appliesToKey: MdmRecordTypeKey;
  status: string;
  priority?: number;
  createdAt: string;
  updatedAt: string;
}

interface MdRulesTableProps {
  data: MdmRule[];
  onRowClick?: (rule: MdmRule) => void;
}

const recordTypeLabels: Record<MdmRecordTypeKey, string> = {
  people: 'Люди',
  entities: 'Сущности',
  accounts: 'Счета',
  assets: 'Активы',
};

export function MdRulesTable({ data, onRowClick }: MdRulesTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Название',
      render: (item: MdmRule) => (
        <div>
          <span className="font-medium text-stone-800">{item.name}</span>
          {item.description && (
            <div className="text-xs text-stone-500 truncate max-w-xs">
              {item.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'ruleTypeKey',
      header: 'Тип правила',
      width: 'w-32',
      render: (item: MdmRule) => (
        <span className="text-stone-600 text-sm">
          {MdmRuleTypeLabels[item.ruleTypeKey]?.ru || item.ruleTypeKey}
        </span>
      ),
    },
    {
      key: 'appliesToKey',
      header: 'Применяется к',
      width: 'w-28',
      render: (item: MdmRule) => (
        <span className="text-stone-600 text-sm">
          {recordTypeLabels[item.appliesToKey] || item.appliesToKey}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Приоритет',
      width: 'w-24',
      render: (item: MdmRule) => (
        <span className="text-stone-600 text-sm">
          {item.priority ?? '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: MdmRule) => <MdStatusPill status={item.status} />,
    },
    {
      key: 'updatedAt',
      header: 'Обновлено',
      width: 'w-28',
      render: (item: MdmRule) => (
        <span className="text-stone-500 text-sm">
          {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
}
