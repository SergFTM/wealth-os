"use client";

import { useState } from 'react';
import { DlStatusPill } from './DlStatusPill';
import { Button } from '@/components/ui/Button';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  ownerRole: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'na';
  dueAt?: string;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  order: number;
}

interface DlChecklistDetailProps {
  name: string;
  linkedName?: string;
  items: ChecklistItem[];
  completionPct: number;
  onItemStatusChange?: (itemId: string, status: ChecklistItem['status']) => void;
  onAddItem?: (title: string, ownerRole: string) => void;
}

const ROLE_LABELS: Record<string, string> = {
  legal: 'Legal',
  compliance: 'Compliance',
  tax: 'Tax',
  operations: 'Operations',
  cio: 'CIO',
  cfo: 'CFO',
};

export function DlChecklistDetail({
  name,
  linkedName,
  items,
  completionPct,
  onItemStatusChange,
  onAddItem,
}: DlChecklistDetailProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemRole, setNewItemRole] = useState('operations');

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const handleAddItem = () => {
    if (newItemTitle.trim() && onAddItem) {
      onAddItem(newItemTitle.trim(), newItemRole);
      setNewItemTitle('');
      setShowAddForm(false);
    }
  };

  const handleStatusClick = (item: ChecklistItem) => {
    if (!onItemStatusChange) return;

    const nextStatus: Record<string, ChecklistItem['status']> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
      blocked: 'pending',
      na: 'pending',
    };

    onItemStatusChange(item.id, nextStatus[item.status]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">{name}</h3>
          {linkedName && <p className="text-sm text-stone-500">{linkedName}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-stone-800">{completionPct}%</div>
            <div className="text-xs text-stone-500">завершено</div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#e7e5e4"
                strokeWidth="6"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={completionPct === 100 ? '#10b981' : '#3b82f6'}
                strokeWidth="6"
                strokeDasharray={`${(completionPct / 100) * 175.9} 175.9`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            completionPct === 100 ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {sortedItems.map((item) => {
          const isOverdue = item.dueAt && new Date(item.dueAt) < new Date() && item.status !== 'completed';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-lg border ${
                item.status === 'blocked' ? 'border-red-200' :
                isOverdue ? 'border-amber-200' :
                item.status === 'completed' ? 'border-emerald-200' :
                'border-stone-200'
              } p-3 hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => handleStatusClick(item)}
                  disabled={!onItemStatusChange}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : item.status === 'in_progress'
                      ? 'bg-blue-100 border-blue-500'
                      : item.status === 'blocked'
                      ? 'bg-red-100 border-red-500'
                      : 'border-stone-300 hover:border-stone-400'
                  }`}
                >
                  {item.status === 'completed' && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {item.status === 'in_progress' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                  {item.status === 'blocked' && (
                    <span className="text-red-500 text-xs font-bold">!</span>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${item.status === 'completed' ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                      {item.title}
                    </span>
                    {item.status !== 'completed' && item.status !== 'pending' && (
                      <DlStatusPill status={item.status} size="sm" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="bg-stone-100 px-1.5 py-0.5 rounded">
                      {ROLE_LABELS[item.ownerRole] || item.ownerRole}
                    </span>
                    {item.dueAt && (
                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                        Срок: {new Date(item.dueAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                    {item.completedAt && (
                      <span className="text-emerald-600">
                        Выполнено: {new Date(item.completedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="mt-1 text-sm text-stone-600">{item.notes}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add item form */}
      {showAddForm ? (
        <div className="bg-stone-50 rounded-lg p-3 space-y-2">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Название пункта"
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <select
              value={newItemRole}
              onChange={(e) => setNewItemRole(e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <Button variant="primary" size="sm" onClick={handleAddItem}>
              Добавить
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-2 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить пункт
        </button>
      )}
    </div>
  );
}

export default DlChecklistDetail;
