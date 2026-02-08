"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OwPctPill } from './OwPctPill';
import { OwSourceCard } from './OwSourceCard';

interface OwLink {
  id: string;
  fromNodeId: string;
  fromNodeName?: string;
  toNodeId: string;
  toNodeName?: string;
  ownershipPct: number;
  profitSharePct?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  sourceRefJson?: { docId?: string; description?: string; url?: string };
  attachmentDocIdsJson?: string[];
  createdAt: string;
  updatedAt: string;
}

interface OwLinkDetailProps {
  link: OwLink;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onNodeClick: (nodeId: string) => void;
}

type TabKey = 'overview' | 'documents' | 'source' | 'history';

export function OwLinkDetail({
  link,
  onClose,
  onEdit,
  onDelete,
  onNodeClick,
}: OwLinkDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'documents', label: 'Документы' },
    { key: 'source', label: 'Источник' },
    { key: 'history', label: 'История' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Связь владения</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
              <span
                onClick={() => onNodeClick(link.fromNodeId)}
                className="text-emerald-600 hover:underline cursor-pointer"
              >
                {link.fromNodeName || link.fromNodeId.slice(0, 8)}
              </span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span
                onClick={() => onNodeClick(link.toNodeId)}
                className="text-emerald-600 hover:underline cursor-pointer"
              >
                {link.toNodeName || link.toNodeId.slice(0, 8)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="primary" onClick={onEdit}>Редактировать</Button>
          <Button variant="ghost" onClick={onDelete} className="text-red-600 hover:text-red-700">
            Удалить
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="text-xs text-emerald-600 uppercase mb-1">Доля владения</div>
                <div className="text-2xl font-bold text-emerald-700">
                  {link.ownershipPct.toFixed(2)}%
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-xs text-amber-600 uppercase mb-1">Доля прибыли</div>
                <div className="text-2xl font-bold text-amber-700">
                  {link.profitSharePct !== undefined ? `${link.profitSharePct.toFixed(2)}%` : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-stone-500 uppercase">Действует с</div>
                <div className="text-sm text-stone-700">
                  {new Date(link.effectiveFrom).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase">Действует до</div>
                <div className="text-sm text-stone-700">
                  {link.effectiveTo ? new Date(link.effectiveTo).toLocaleDateString('ru-RU') : 'Бессрочно'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-lg">
              <div className="text-xs text-stone-500 uppercase mb-2">ID связи</div>
              <div className="text-sm text-stone-600 font-mono">{link.id}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-stone-500 uppercase">Создано</div>
                <div className="text-stone-600">
                  {new Date(link.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase">Обновлено</div>
                <div className="text-stone-600">
                  {new Date(link.updatedAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            {link.attachmentDocIdsJson && link.attachmentDocIdsJson.length > 0 ? (
              link.attachmentDocIdsJson.map((docId) => (
                <div key={docId} className="p-3 bg-stone-50 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-emerald-600 hover:underline cursor-pointer">{docId}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-stone-500 py-8">
                <p>Нет прикрепленных документов</p>
                <Button variant="secondary" className="mt-3">
                  Прикрепить документ
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'source' && (
          <OwSourceCard source={link.sourceRefJson || null} />
        )}

        {activeTab === 'history' && (
          <div className="text-center text-stone-500 py-8">
            История изменений загружается...
          </div>
        )}
      </div>
    </div>
  );
}

export default OwLinkDetail;
