"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Owner {
  id: string;
  name: string;
  ownerType: string;
  ownershipPct: number;
  profitSharePct: number;
  parentId?: string | null;
}

interface PsStructureGraphProps {
  partnershipName: string;
  owners: Owner[];
  onNodeClick?: (ownerId: string) => void;
  maxDepth?: 1 | 2 | 3;
  showEBO?: boolean;
}

export function PsStructureGraph({ partnershipName, owners, onNodeClick, maxDepth = 2, showEBO = false }: PsStructureGraphProps) {
  const [depth, setDepth] = useState(maxDepth);
  const [eboMode, setEboMode] = useState(showEBO);
  const topLevel = owners.filter(o => !o.parentId);

  const renderNode = (owner: Owner, level: number) => {
    if (level > depth) return null;
    const children = owners.filter(o => o.parentId === owner.id);
    
    // In EBO mode, skip intermediate entities and show only end beneficial owners
    if (eboMode && owner.ownerType === 'entity' && children.length > 0) {
      return (
        <div key={owner.id} className="flex flex-col items-center">
          <div className="flex gap-4 flex-wrap justify-center">
            {children.map(c => renderNode(c, level))}
          </div>
        </div>
      );
    }
    
    return (
      <div key={owner.id} className="flex flex-col items-center">
        <button
          onClick={() => onNodeClick?.(owner.id)}
          className={cn(
            "px-4 py-3 rounded-xl border-2 bg-white shadow-sm hover:shadow-md transition-all min-w-[140px] text-center",
            owner.ownerType === 'person' ? "border-blue-200 hover:border-blue-300" : 
            owner.ownerType === 'trust' ? "border-purple-200 hover:border-purple-300" : 
            "border-stone-200 hover:border-stone-300"
          )}
        >
          <p className="font-medium text-stone-800 text-sm">{owner.name}</p>
          <p className="text-xs text-stone-500 mt-1">
            {owner.ownershipPct}% / {owner.profitSharePct}%
          </p>
          <span className={cn("inline-block mt-1 px-2 py-0.5 rounded text-[10px]",
            owner.ownerType === 'person' ? "bg-blue-50 text-blue-600" : 
            owner.ownerType === 'trust' ? "bg-purple-50 text-purple-600" : 
            "bg-stone-50 text-stone-600"
          )}>
            {owner.ownerType === 'person' ? 'Физлицо' : owner.ownerType === 'trust' ? 'Траст' : 'Юрлицо'}
          </span>
        </button>
        {children.length > 0 && level < depth && !eboMode && (
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-stone-300" />
            <div className="flex gap-4">
              {children.map(c => renderNode(c, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-stone-800">Структура владения</h3>
          <p className="text-xs text-stone-500">{partnershipName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEboMode(!eboMode)}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition-all border",
              eboMode ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-stone-100 text-stone-500 border-stone-200"
            )}
          >
            EBO
          </button>
          <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
            {[1, 2, 3].map(d => (
              <button
                key={d}
                onClick={() => setDepth(d as 1 | 2 | 3)}
                className={cn("px-3 py-1 rounded text-xs font-medium transition-all", 
                  depth === d ? "bg-white shadow-sm text-stone-800" : "text-stone-500")}
              >
                {d} ур.
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="px-6 py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-medium shadow-lg mb-4">
          {partnershipName}
        </div>
        <div className="w-px h-4 bg-stone-300" />
        <div className="flex gap-6 flex-wrap justify-center">
          {topLevel.map(o => renderNode(o, 1))}
        </div>
      </div>
      {topLevel.length === 0 && <p className="text-stone-500 text-center py-8">Нет владельцев</p>}
    </div>
  );
}
