'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ExStatusPill } from './ExStatusPill';
import { ExSeverityPill } from './ExSeverityPill';
import { ExSlaBadge } from './ExSlaBadge';
import { ExTimeline } from './ExTimeline';
import { ExLinkCard } from './ExLinkCard';
import { ExAiPanel } from './ExAiPanel';
import { Exception } from '../engine/exceptionRouter';

interface ExExceptionDetailProps {
  exception: Exception;
  onAssign?: (role: string) => void;
  onChangeSeverity?: (severity: string) => void;
  onChangeStatus?: (status: string) => void;
  onAddRemediation?: (step: { title: string; ownerRole?: string }) => void;
  onUpdateRemediation?: (index: number, update: { status: string }) => void;
  onMarkSourceResolved?: (resolved: boolean) => void;
  onAddComment?: (comment: string) => void;
  className?: string;
}

type TabKey = 'overview' | 'links' | 'remediation' | 'timeline' | 'similar' | 'ai';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Обзор' },
  { key: 'links', label: 'Связи' },
  { key: 'remediation', label: 'Устранение' },
  { key: 'timeline', label: 'История' },
  { key: 'ai', label: 'AI' }
];

const roleOptions = [
  { value: 'operations_analyst', label: 'Операционный аналитик' },
  { value: 'compliance_officer', label: 'Комплаенс-офицер' },
  { value: 'head_of_ops', label: 'Руководитель операций' },
  { value: 'data_steward', label: 'Data Steward' },
  { value: 'risk_manager', label: 'Риск-менеджер' }
];

const severityOptions = [
  { value: 'ok', label: 'Норма' },
  { value: 'warning', label: 'Внимание' },
  { value: 'critical', label: 'Критично' }
];

const statusOptions = [
  { value: 'open', label: 'Открыто' },
  { value: 'triage', label: 'Триаж' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'closed', label: 'Закрыто' }
];

export function ExExceptionDetail({
  exception,
  onAssign,
  onChangeSeverity,
  onChangeStatus,
  onAddRemediation,
  onUpdateRemediation,
  onMarkSourceResolved,
  onAddComment,
  className
}: ExExceptionDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleAddStep = () => {
    if (newStepTitle.trim() && onAddRemediation) {
      onAddRemediation({ title: newStepTitle.trim() });
      setNewStepTitle('');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-stone-900 mb-2">{exception.title}</h2>
            {exception.description && (
              <p className="text-sm text-stone-600">{exception.description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExSeverityPill severity={exception.severity as 'ok' | 'warning' | 'critical'} size="md" />
            <ExStatusPill status={exception.status as 'open' | 'triage' | 'in_progress' | 'closed'} size="md" />
            <ExSlaBadge slaDueAt={exception.slaDueAt} slaAtRisk={exception.slaAtRisk} size="md" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Assign */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Назначено
                </label>
                <select
                  value={exception.assignedToRole || ''}
                  onChange={(e) => onAssign?.(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                >
                  <option value="">Не назначено</option>
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Важность
                </label>
                <select
                  value={exception.severity}
                  onChange={(e) => onChangeSeverity?.(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                >
                  {severityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Статус
                </label>
                <select
                  value={exception.status}
                  onChange={(e) => onChangeStatus?.(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Source Resolved Toggle */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">
                    Источник исправлен
                  </span>
                  <button
                    onClick={() => onMarkSourceResolved?.(!exception.sourceResolved)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      exception.sourceResolved ? 'bg-emerald-500' : 'bg-stone-300'
                    )}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                      exception.sourceResolved ? 'left-7' : 'left-1'
                    )} />
                  </button>
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  При включении исключение может быть авто-закрыто
                </p>
              </div>

              {/* Add Comment */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Добавить комментарий
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Введите комментарий..."
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 disabled:opacity-50"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-4">
            <ExLinkCard
              title="Первичный источник"
              subtitle={exception.sourceCollection}
              linkUrl={exception.linkUrl}
              sourceModule={exception.sourceModuleKey}
              sourceCollection={exception.sourceCollection}
              sourceId={exception.sourceId}
            />

            {exception.lineageJson && (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
                <h3 className="text-sm font-medium text-stone-700 mb-2">Lineage</h3>
                <p className="text-sm text-stone-600">
                  {(exception.lineageJson as { reason?: string }).reason || 'Нет данных'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'remediation' && (
          <div className="space-y-4">
            {/* Existing Steps */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-medium text-stone-700 mb-3">Шаги устранения</h3>
              {exception.remediationJson && exception.remediationJson.length > 0 ? (
                <div className="space-y-2">
                  {exception.remediationJson.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-stone-50 rounded-lg"
                    >
                      <button
                        onClick={() => onUpdateRemediation?.(index, {
                          status: step.status === 'completed' ? 'pending' : 'completed'
                        })}
                        className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center',
                          step.status === 'completed'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-stone-300'
                        )}
                      >
                        {step.status === 'completed' && '✓'}
                      </button>
                      <span className={cn(
                        'flex-1 text-sm',
                        step.status === 'completed' && 'line-through text-stone-400'
                      )}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400">Шаги не добавлены</p>
              )}
            </div>

            {/* Add New Step */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-medium text-stone-700 mb-2">Добавить шаг</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  placeholder="Описание шага..."
                  className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
                <button
                  onClick={handleAddStep}
                  disabled={!newStepTitle.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
            <ExTimeline events={exception.timelineJson || []} />
          </div>
        )}

        {activeTab === 'ai' && (
          <ExAiPanel
            exception={exception}
            onApplyStep={(step) => onAddRemediation?.({ title: step })}
          />
        )}
      </div>
    </div>
  );
}

export default ExExceptionDetail;
