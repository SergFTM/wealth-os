"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { OwStatusPill } from './OwStatusPill';
import { OwSourceCard } from './OwSourceCard';
import { OwPctPill } from './OwPctPill';

interface OwNode {
  id: string;
  name: string;
  nodeTypeKey: string;
  jurisdiction?: string;
  status: string;
  mdmRefType?: string;
  mdmRefId?: string;
  metaJson?: Record<string, unknown>;
  attachmentDocIdsJson?: string[];
  sourceRefJson?: { docId?: string; description?: string; url?: string };
  asOf?: string;
  createdAt: string;
  updatedAt: string;
}

interface RelatedLink {
  id: string;
  direction: 'incoming' | 'outgoing';
  nodeId: string;
  nodeName: string;
  ownershipPct: number;
  profitSharePct?: number;
}

interface OwNodeDetailProps {
  node: OwNode;
  incomingLinks: RelatedLink[];
  outgoingLinks: RelatedLink[];
  onClose: () => void;
  onEdit: () => void;
  onOpenFull: () => void;
  onLinkClick: (linkId: string) => void;
}

const typeLabels: Record<string, string> = {
  household: 'Домохозяйство',
  trust: 'Траст',
  entity: 'Юр. лицо',
  partnership: 'Партнерство',
  spv: 'SPV',
  account: 'Счет',
  asset: 'Актив',
};

type TabKey = 'overview' | 'relationships' | 'documents' | 'source' | 'audit';

export function OwNodeDetail({
  node,
  incomingLinks,
  outgoingLinks,
  onClose,
  onEdit,
  onOpenFull,
  onLinkClick,
}: OwNodeDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'relationships', label: 'Связи' },
    { key: 'documents', label: 'Документы' },
    { key: 'source', label: 'Источник' },
    { key: 'audit', label: 'Аудит' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">{node.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-stone-500">
                {typeLabels[node.nodeTypeKey] || node.nodeTypeKey}
              </span>
              <OwStatusPill status={node.status as 'active' | 'inactive'} />
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
          <Button variant="secondary" onClick={onOpenFull}>Открыть</Button>
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
              <div>
                <div className="text-xs text-stone-500 uppercase">ID</div>
                <div className="text-sm text-stone-700 font-mono">{node.id.slice(0, 12)}...</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase">Юрисдикция</div>
                <div className="text-sm text-stone-700">{node.jurisdiction || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase">MDM ссылка</div>
                <div className="text-sm text-stone-700">
                  {node.mdmRefId ? `${node.mdmRefType}: ${node.mdmRefId.slice(0, 8)}` : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase">Обновлено</div>
                <div className="text-sm text-stone-700">
                  {new Date(node.updatedAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>

            {node.metaJson && Object.keys(node.metaJson).length > 0 && (
              <div className="p-3 bg-stone-50 rounded-lg">
                <div className="text-xs text-stone-500 uppercase mb-2">Метаданные</div>
                <pre className="text-xs text-stone-600 overflow-x-auto">
                  {JSON.stringify(node.metaJson, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-4">
            {incomingLinks.length > 0 && (
              <div>
                <div className="text-sm font-medium text-stone-600 mb-2">Входящие связи (владельцы)</div>
                <div className="space-y-2">
                  {incomingLinks.map((link) => (
                    <div
                      key={link.id}
                      onClick={() => onLinkClick(link.id)}
                      className="p-3 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-700">{link.nodeName}</span>
                        <OwPctPill value={link.ownershipPct} type="ownership" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {outgoingLinks.length > 0 && (
              <div>
                <div className="text-sm font-medium text-stone-600 mb-2">Исходящие связи (владеет)</div>
                <div className="space-y-2">
                  {outgoingLinks.map((link) => (
                    <div
                      key={link.id}
                      onClick={() => onLinkClick(link.id)}
                      className="p-3 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-700">{link.nodeName}</span>
                        <OwPctPill value={link.ownershipPct} type="ownership" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {incomingLinks.length === 0 && outgoingLinks.length === 0 && (
              <div className="text-center text-stone-500 py-8">
                Нет связей
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-3">
            {node.attachmentDocIdsJson && node.attachmentDocIdsJson.length > 0 ? (
              node.attachmentDocIdsJson.map((docId) => (
                <div key={docId} className="p-3 bg-stone-50 rounded-lg flex items-center gap-3">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-emerald-600 hover:underline cursor-pointer">{docId}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-stone-500 py-8">
                Нет прикрепленных документов
              </div>
            )}
          </div>
        )}

        {activeTab === 'source' && (
          <OwSourceCard source={node.sourceRefJson || null} asOf={node.asOf} />
        )}

        {activeTab === 'audit' && (
          <div className="text-center text-stone-500 py-8">
            История изменений загружается...
          </div>
        )}
      </div>
    </div>
  );
}

export default OwNodeDetail;
