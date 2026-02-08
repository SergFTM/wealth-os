"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormRenderer } from '@/components/ui/FormRenderer';
import { OwPctPill } from '@/modules/47-ownership/ui/OwPctPill';
import { OwSourceCard } from '@/modules/47-ownership/ui/OwSourceCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OwnershipLinkDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'source' | 'history'>('overview');
  const [showEdit, setShowEdit] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: link, loading, refetch } = useRecord('ownershipLinks', id) as { data: any; loading: boolean; refetch: () => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: nodes = [] } = useCollection('ownershipNodes') as { data: any[] };
  const { mutate } = useMutateRecord('ownershipLinks', id);

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

  if (!link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500">Связь не найдена</p>
          <Link href="/m/ownership/list?tab=links">
            <Button variant="secondary" className="mt-4">Вернуться к списку</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nodeMap = new Map(nodes.map((n: { id: string; name: string }) => [n.id, n.name]));
  const fromNodeName = nodeMap.get(link.fromNodeId) || link.fromNodeId;
  const toNodeName = nodeMap.get(link.toNodeId) || link.toNodeId;

  const tabs = [
    { key: 'overview', label: 'Обзор' },
    { key: 'documents', label: 'Документы' },
    { key: 'source', label: 'Источник' },
    { key: 'history', label: 'История' },
  ];

  const editFields = [
    { key: 'ownershipPct', label: 'Доля владения (%)', type: 'number' as const, required: true },
    { key: 'profitSharePct', label: 'Доля прибыли (%)', type: 'number' as const },
    { key: 'effectiveFrom', label: 'Действует с', type: 'date' as const, required: true },
    { key: 'effectiveTo', label: 'Действует до', type: 'date' as const },
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
            <Link href="/m/ownership/list?tab=links">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-stone-800">Связь владения</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
                <Link href={`/m/ownership/node/${link.fromNodeId}`} className="text-emerald-600 hover:underline">
                  {fromNodeName}
                </Link>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <Link href={`/m/ownership/node/${link.toNodeId}`} className="text-emerald-600 hover:underline">
                  {toNodeName}
                </Link>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50 rounded-xl text-center">
                  <div className="text-xs text-emerald-600 uppercase mb-2">Доля владения</div>
                  <div className="text-4xl font-bold text-emerald-700">
                    {link.ownershipPct.toFixed(2)}%
                  </div>
                </div>
                <div className="p-6 bg-amber-50 rounded-xl text-center">
                  <div className="text-xs text-amber-600 uppercase mb-2">Доля прибыли</div>
                  <div className="text-4xl font-bold text-amber-700">
                    {link.profitSharePct !== undefined ? `${link.profitSharePct.toFixed(2)}%` : '—'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">Действует с</div>
                  <div className="text-sm text-stone-700">
                    {new Date(link.effectiveFrom).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">Действует до</div>
                  <div className="text-sm text-stone-700">
                    {link.effectiveTo ? new Date(link.effectiveTo).toLocaleDateString('ru-RU') : 'Бессрочно'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">ID связи</div>
                  <div className="text-sm text-stone-700 font-mono">{link.id}</div>
                </div>
                <div>
                  <div className="text-xs text-stone-500 uppercase mb-1">Обновлено</div>
                  <div className="text-sm text-stone-700">
                    {new Date(link.updatedAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {link.attachmentDocIdsJson && link.attachmentDocIdsJson.length > 0 ? (
                link.attachmentDocIdsJson.map((docId: string) => (
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
            <OwSourceCard source={link.sourceRefJson} />
          )}

          {activeTab === 'history' && (
            <p className="text-center text-stone-500 py-8">История изменений загружается...</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Редактировать связь"
        size="md"
      >
        <FormRenderer
          fields={editFields}
          initialValues={{
            ...link,
            effectiveFrom: link.effectiveFrom?.split('T')[0],
            effectiveTo: link.effectiveTo?.split('T')[0],
          }}
          onSubmit={handleEdit}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>
    </div>
  );
}
