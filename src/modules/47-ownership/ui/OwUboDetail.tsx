"use client";

import { OwPctPill } from './OwPctPill';

interface UboPath {
  nodeIds: string[];
  pct: number;
}

interface OwUbo {
  id: string;
  personName: string;
  personMdmId: string;
  rootHouseholdNodeId: string;
  targetNodeId: string;
  targetNodeName: string;
  computedPct: number;
  pathsJson: UboPath[];
  computedAt: string;
  sourcesJson?: string[];
}

interface OwUboDetailProps {
  ubo: OwUbo;
  nodeNames: Record<string, string>;
  onClose: () => void;
  onNodeClick: (nodeId: string) => void;
}

export function OwUboDetail({
  ubo,
  nodeNames,
  onClose,
  onNodeClick,
}: OwUboDetailProps) {
  const getNodeName = (nodeId: string) => nodeNames[nodeId] || nodeId.slice(0, 8);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">UBO Запись</h2>
            <p className="text-sm text-stone-500 mt-1">
              Конечный бенефициар
            </p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Summary */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-xl font-bold text-emerald-700">
                {ubo.personName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-emerald-800">{ubo.personName}</div>
              <div className="text-sm text-emerald-600">
                владеет <span className="font-bold">{ubo.computedPct.toFixed(2)}%</span> в {ubo.targetNodeName}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-stone-500 uppercase">Бенефициар MDM ID</div>
            <div className="text-sm text-stone-700 font-mono">{ubo.personMdmId}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500 uppercase">Рассчитано</div>
            <div className="text-sm text-stone-700">
              {new Date(ubo.computedAt).toLocaleString('ru-RU')}
            </div>
          </div>
        </div>

        {/* Paths */}
        <div>
          <div className="text-sm font-semibold text-stone-700 mb-3">
            Пути владения ({ubo.pathsJson.length})
          </div>
          <div className="space-y-3">
            {ubo.pathsJson.map((path, index) => (
              <div key={index} className="p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-stone-500">Путь {index + 1}</span>
                  <OwPctPill value={path.pct} type="ownership" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {path.nodeIds.map((nodeId, nodeIndex) => (
                    <div key={nodeId} className="flex items-center gap-2">
                      <span
                        onClick={() => onNodeClick(nodeId)}
                        className="px-2 py-1 bg-white rounded border border-stone-200 text-sm text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                      >
                        {getNodeName(nodeId)}
                      </span>
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
          <div>
            <div className="text-sm font-semibold text-stone-700 mb-2">
              Использованные связи ({ubo.sourcesJson.length})
            </div>
            <div className="text-sm text-stone-600">
              {ubo.sourcesJson.slice(0, 10).join(', ')}
              {ubo.sourcesJson.length > 10 && ` и еще ${ubo.sourcesJson.length - 10}...`}
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Как рассчитывается UBO?</p>
              <p className="mt-1">
                Доля UBO рассчитывается путем умножения долей владения вдоль каждого пути
                от бенефициара до целевой сущности. Если существует несколько путей,
                доли суммируются.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwUboDetail;
