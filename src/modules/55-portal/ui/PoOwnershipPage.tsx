'use client';

import React from 'react';
import { PoSourceFooter } from './PoSourceFooter';

interface OwnershipNode {
  id: string;
  name: string;
  share?: string;
  type: 'trust' | 'llc' | 'lp' | 'corp';
}

const ROOT: OwnershipNode = {
  id: 'root',
  name: 'Aurora Family Trust',
  type: 'trust',
};

const CHILDREN: OwnershipNode[] = [
  { id: 'c1', name: 'Aurora Holdings LLC', share: '100%', type: 'llc' },
  { id: 'c2', name: 'Aurora Real Estate LP', share: '75%', type: 'lp' },
  { id: 'c3', name: 'Petrov Investment Corp', share: '100%', type: 'corp' },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  trust: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  llc: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  lp: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
  corp: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-300' },
};

const typeLabels: Record<string, string> = {
  trust: 'Траст',
  llc: 'LLC',
  lp: 'LP',
  corp: 'Корпорация',
};

function NodeCard({ node, isRoot }: { node: OwnershipNode; isRoot?: boolean }) {
  const c = typeColors[node.type];
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5 ${
        isRoot ? 'shadow-md ring-2 ring-emerald-200/60' : 'hover:shadow-md transition-shadow'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${c.bg} ${c.text}`}
        >
          {node.type === 'trust' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-stone-800 leading-tight">{node.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.bg} ${c.text} font-medium`}>
              {typeLabels[node.type]}
            </span>
            {node.share && (
              <span className="text-xs text-stone-500 font-medium">
                {node.share}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PoOwnershipPage() {
  return (
    <div className="space-y-6 font-[Inter]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Структура владения</h1>
        <p className="text-stone-500 mt-1">
          Опубликованный снимок структуры владения семейного траста
        </p>
      </div>

      {/* Tree graph */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-8">
        <div className="flex flex-col items-center">
          {/* Root node */}
          <div className="w-full max-w-sm">
            <NodeCard node={ROOT} isRoot />
          </div>

          {/* Vertical connector from root */}
          <div className="w-px h-8 bg-stone-300" />

          {/* Horizontal connector bar */}
          <div className="relative w-full max-w-3xl">
            <div className="absolute top-0 left-1/6 right-1/6 h-px bg-stone-300" style={{ left: '16.67%', right: '16.67%' }} />

            {/* Children row */}
            <div className="grid grid-cols-3 gap-6">
              {CHILDREN.map((child, idx) => (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Vertical connector to child */}
                  <div className="w-px h-8 bg-stone-300" />
                  {/* Share label on connector */}
                  <div className="mb-1">
                    <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                      {child.share}
                    </span>
                  </div>
                  <NodeCard node={child} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-5 border-t border-stone-100">
          <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wider">Легенда</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(typeLabels).map(([key, label]) => {
              const c = typeColors[key];
              return (
                <span key={key} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${c.bg} ${c.text} font-medium`}>
                  <span className={`w-2 h-2 rounded-full ${c.border} border-2`} />
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <PoSourceFooter
          asOfDate="2025-12-31"
          sources={['WealthOS Ownership Module', 'Legal Registry']}
          showTrustDisclaimer
        />
      </div>
    </div>
  );
}
