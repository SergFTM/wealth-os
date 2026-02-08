"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { OwPctPill } from '@/modules/47-ownership/ui/OwPctPill';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OwnershipUboDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ubo, loading } = useRecord('ownershipUbo', id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: nodes = [] } = useCollection('ownershipNodes') as { data: any[] };

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

  if (!ubo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500">UBO запись не найдена</p>
          <Link href="/m/ownership/list?tab=ubo">
            <Button variant="secondary" className="mt-4">Вернуться к списку</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nodeMap = new Map(nodes.map((n: { id: string; name: string }) => [n.id, n.name]));
  const getNodeName = (nodeId: string) => nodeMap.get(nodeId) || nodeId.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/ownership/list?tab=ubo">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-stone-800">UBO Запись</h1>
              <p className="text-sm text-stone-500 mt-1">Конечный бенефициар</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Summary */}
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-700">
                {ubo.personMdmId?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xl font-semibold text-emerald-800">{ubo.personMdmId}</div>
              <div className="text-emerald-600 mt-1">
                владеет <span className="font-bold text-2xl">{ubo.computedPct?.toFixed(2)}%</span> в{' '}
                <Link href={`/m/ownership/node/${ubo.targetNodeId}`} className="underline hover:no-underline">
                  {getNodeName(ubo.targetNodeId)}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-xs text-stone-500 uppercase mb-1">ID записи</div>
              <div className="text-sm text-stone-700 font-mono">{ubo.id}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 uppercase mb-1">Рассчитано</div>
              <div className="text-sm text-stone-700">
                {new Date(ubo.computedAt).toLocaleString('ru-RU')}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500 uppercase mb-1">Бенефициар MDM ID</div>
              <div className="text-sm text-stone-700 font-mono">{ubo.personMdmId}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 uppercase mb-1">Целевой узел</div>
              <Link href={`/m/ownership/node/${ubo.targetNodeId}`} className="text-sm text-emerald-600 hover:underline">
                {getNodeName(ubo.targetNodeId)}
              </Link>
            </div>
          </div>
        </div>

        {/* Paths */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">
            Пути владения ({ubo.pathsJson?.length || 0})
          </h2>
          <div className="space-y-4">
            {(ubo.pathsJson || []).map((path: { nodeIds: string[]; pct: number }, index: number) => (
              <div key={index} className="p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-stone-600">Путь {index + 1}</span>
                  <OwPctPill value={path.pct} type="ownership" size="md" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {path.nodeIds.map((nodeId: string, nodeIndex: number) => (
                    <div key={nodeId} className="flex items-center gap-2">
                      <Link
                        href={`/m/ownership/node/${nodeId}`}
                        className="px-3 py-1.5 bg-white rounded-lg border border-stone-200 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        {getNodeName(nodeId)}
                      </Link>
                      {nodeIndex < path.nodeIds.length - 1 && (
                        <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        {ubo.sourcesJson && ubo.sourcesJson.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">
              Использованные связи ({ubo.sourcesJson.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {ubo.sourcesJson.slice(0, 20).map((linkId: string) => (
                <Link
                  key={linkId}
                  href={`/m/ownership/link/${linkId}`}
                  className="px-2 py-1 bg-stone-100 rounded text-xs text-stone-600 hover:bg-stone-200"
                >
                  {linkId.slice(0, 12)}...
                </Link>
              ))}
              {ubo.sourcesJson.length > 20 && (
                <span className="px-2 py-1 text-xs text-stone-500">
                  и еще {ubo.sourcesJson.length - 20}...
                </span>
              )}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Как рассчитывается UBO?</p>
              <p className="mt-1">
                Доля UBO рассчитывается путем умножения долей владения вдоль каждого пути
                от бенефициара до целевой сущности. Если существует несколько путей,
                доли суммируются. Согласно большинству юрисдикций, бенефициар с долей
                25% и более считается UBO.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
