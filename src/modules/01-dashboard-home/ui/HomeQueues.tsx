"use client";

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

interface QueueItem {
  id: string;
  [key: string]: unknown;
}

interface QueueTab {
  key: string;
  title: string;
  items: QueueItem[];
  columns: Array<{ key: string; header: string; type: string }>;
}

interface HomeQueuesProps {
  tabs: QueueTab[];
  loading?: boolean;
  clientSafe?: boolean;
  onRowClick: (item: QueueItem, queueKey: string) => void;
}

export function HomeQueues({ tabs, loading, clientSafe, onRowClick }: HomeQueuesProps) {
  const { locale } = useApp();
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'tasks');

  const filteredTabs = clientSafe 
    ? tabs.filter(t => ['messages'].includes(t.key))
    : tabs;

  const activeQueue = filteredTabs.find(t => t.key === activeTab) || filteredTabs[0];

  const renderCell = (item: QueueItem, col: { key: string; type: string }) => {
    const value = item[col.key];
    
    switch (col.type) {
      case 'status':
      case 'badge':
        return <StatusBadge status={String(value) as 'pending'} size="sm" />;
      case 'date':
        return value ? new Date(String(value)).toLocaleDateString('ru-RU') : '-';
      case 'datetime':
        return value ? new Date(String(value)).toLocaleString('ru-RU', { 
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
        }) : '-';
      default:
        return String(value || '-');
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-stone-200 rounded-lg w-24 animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="border-b border-stone-200/50 px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {filteredTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.key
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-stone-600 hover:bg-stone-100"
              )}
            >
              {tab.title}
              {tab.items.length > 0 && (
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs",
                  activeTab === tab.key ? "bg-emerald-200" : "bg-stone-200"
                )}>
                  {tab.items.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {!activeQueue || activeQueue.items.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <p>{locale === 'ru' ? 'Нет элементов в очереди' : 'No items in queue'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200">
                  {activeQueue.columns.map((col) => (
                    <th key={col.key} className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeQueue.items.slice(0, 5).map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onRowClick(item, activeQueue.key)}
                    className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    {activeQueue.columns.map((col) => (
                      <td key={col.key} className="py-3 px-3">
                        {renderCell(item, col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
