"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormRenderer } from '@/components/ui/FormRenderer';
import { OwStatusPill } from '@/modules/47-ownership/ui/OwStatusPill';
import { OwSourceCard } from '@/modules/47-ownership/ui/OwSourceCard';
import { OwPctPill } from '@/modules/47-ownership/ui/OwPctPill';

interface PageProps {
  params: Promise<{ id: string }>;
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

export default function OwnershipNodeDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'relationships' | 'documents' | 'source' | 'audit'>('overview');
  const [showEdit, setShowEdit] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: node, loading, refetch } = useRecord('ownershipNodes', id) as { data: any; loading: boolean; refetch: () => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: links = [] } = useCollection('ownershipLinks') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allNodes = [] } = useCollection('ownershipNodes') as { data: any[] };
  const { mutate } = useMutateRecord('ownershipNodes', id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500">Узел не найден</p>
          <Link href="/m/ownership/list?tab=nodes">
            <Button variant="secondary" className="mt-4">Вернуться к списку</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nodeMap = new Map(allNodes.map((n: { id: string; name: string }) => [n.id, n.name]));

  const incomingLinks = links
    .filter((l: { toNodeId: string }) => l.toNodeId === id)
    .map((l: { id: string; fromNodeId: string; ownershipPct: number; profitSharePct?: number }) => ({
      ...l,
      nodeName: nodeMap.get(l.fromNodeId) || l.fromNodeId,
    }));

  const outgoingLinks = links
    .filter((l: { fromNodeId: string }) => l.fromNodeId === id)
    .map((l: { id: string; toNodeId: string; ownershipPct: number; profitSharePct?: number }) => ({
      ...l,
      nodeName: nodeMap.get(l.toNodeId) || l.toNodeId,
    }));

  const tabs = [
    { key: 'overview', label: 'Обзор' },
    { key: 'relationships', label: 'Связи' },
    { key: 'documents', label: 'Документы' },
    { key: 'source', label: 'Источник' },
    { key: 'audit', label: 'Аудит' },
  ];

  const editFields = [
    { key: 'name', label: 'Название', type: 'text' as const, required: true },
    { key: 'nodeTypeKey', label: 'Тип', type: 'select' as const, required: true, options: [
      { value: 'household', label: 'Домохозяйство' },
      { value: 'trust', label: 'Траст' },
      { value: 'entity', label: 'Юр. лицо' },
      { value: 'partnership', label: 'Партнерство' },
      { value: 'spv', label: 'SPV' },
      { value: 'account', label: 'Счет' },
      { value: 'asset', label: 'Актив' },
    ]},
    { key: 'jurisdiction', label: 'Юрисдикция', type: 'text' as const },
    { key: 'status', label: 'Статус', type: 'select' as const, required: true, options: [
      { value: 'active', label: 'Активный' },
      { value: 'inactive', label: 'Неактивный' },
    ]},
  ];

  const handleEdit = async (values: Record<string, unknown>) => {
    await mutate(values);
    refetch();
    setShowEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/ownership/list?tab=nodes">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-stone-800">{node.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-stone-500">{typeLabels[node.nodeTypeKey] || node.nodeTypeKey}</span>
                <OwStatusPill status={node.status} />
              </div>
            </div>
            <Button variant="primary" onClick={() => setShowEdit(true)}>Редактировать</Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-stone-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                ${activeTab === tab.key
                  ? 'bg-white border-t border-l border-r border-stone-200 text-emerald-700 -mb-px'
                  : 'text-stone-500 hover:text-stone-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">ID</div>
                  <div className="text-sm text-stone-700 font-mono">{node.id}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">Юрисдикция</div>
                  <div className="text-sm text-stone-700">{node.jurisdiction || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">MDM ссылка</div>
                  <div className="text-sm text-stone-700">
                    {node.mdmRefId ? `${node.mdmRefType}: ${node.mdmRefId}` : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">Создано</div>
                  <div className="text-sm text-stone-700">
                    {new Date(node.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>

              {node.metaJson && Object.keys(node.metaJson).length > 0 && (
                <div className="p-4 bg-stone-50 rounded-lg">
                  <div className="text-xs text-stone-500 uppercase mb-2">Метаданные</div>
                  <pre className="text-sm text-stone-600 overflow-x-auto">
                    {JSON.stringify(node.metaJson, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="space-y-6">
              {incomingLinks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Входящие связи (владельцы)</h3>
                  <div className="space-y-2">
                    {incomingLinks.map((link: { id: string; nodeName: string; ownershipPct: number; profitSharePct?: number }) => (
                      <Link key={link.id} href={`/m/ownership/link/${link.id}`}>
                        <div className="p-4 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer flex items-center justify-between">
                          <span className="font-medium text-stone-700">{link.nodeName}</span>
                          <div className="flex items-center gap-2">
                            <OwPctPill value={link.ownershipPct} type="ownership" />
                            {link.profitSharePct !== undefined && (
                              <OwPctPill value={link.profitSharePct} type="profit" />
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {outgoingLinks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Исходящие связи (владеет)</h3>
                  <div className="space-y-2">
                    {outgoingLinks.map((link: { id: string; nodeName: string; ownershipPct: number; profitSharePct?: number }) => (
                      <Link key={link.id} href={`/m/ownership/link/${link.id}`}>
                        <div className="p-4 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer flex items-center justify-between">
                          <span className="font-medium text-stone-700">{link.nodeName}</span>
                          <div className="flex items-center gap-2">
                            <OwPctPill value={link.ownershipPct} type="ownership" />
                            {link.profitSharePct !== undefined && (
                              <OwPctPill value={link.profitSharePct} type="profit" />
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {incomingLinks.length === 0 && outgoingLinks.length === 0 && (
                <p className="text-center text-stone-500 py-8">Нет связей</p>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {node.attachmentDocIdsJson && node.attachmentDocIdsJson.length > 0 ? (
                node.attachmentDocIdsJson.map((docId: string) => (
                  <div key={docId} className="p-4 bg-stone-50 rounded-lg flex items-center gap-3">
                    <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-emerald-600 hover:underline cursor-pointer">{docId}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-stone-500">Нет прикрепленных документов</p>
                  <Button variant="secondary" className="mt-4">Прикрепить документ</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'source' && (
            <OwSourceCard source={node.sourceRefJson} asOf={node.asOf} />
          )}

          {activeTab === 'audit' && (
            <p className="text-center text-stone-500 py-8">История изменений загружается...</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Редактировать узел"
        size="md"
      >
        <FormRenderer
          fields={editFields}
          initialValues={node}
          onSubmit={handleEdit}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </div>
  );
}
