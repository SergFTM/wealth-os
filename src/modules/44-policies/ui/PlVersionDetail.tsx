"use client";

import { useState } from 'react';
import { PlStatusPill } from './PlStatusPill';
import { PlDiffViewer } from './PlDiffViewer';
import { Button } from '@/components/ui/Button';
import { computeLineDiff } from '../engine/diffEngine';

interface PolicyVersion {
  id: string;
  docType: 'policy' | 'sop';
  docId: string;
  docTitle: string;
  versionLabel: string;
  versionMajor: number;
  versionMinor: number;
  status: string;
  snapshotMdRu: string;
  snapshotMdEn?: string;
  snapshotMdUk?: string;
  changeNotes?: string;
  previousVersionId?: string;
  publishedInternal: boolean;
  publishedClientSafe: boolean;
  requiresApproval: boolean;
  createdByUserId?: string;
  createdByName?: string;
  createdAt: string;
  publishedAt?: string;
}

interface PlVersionDetailProps {
  version: PolicyVersion;
  previousVersion?: PolicyVersion;
  onPublish?: (options: { internal: boolean; clientSafe: boolean }) => void;
  onRetire?: () => void;
}

type TabKey = 'snapshot' | 'diff' | 'publish' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'snapshot', label: 'Снимок' },
  { key: 'diff', label: 'Сравнение' },
  { key: 'publish', label: 'Публикация' },
  { key: 'audit', label: 'Audit' },
];

export function PlVersionDetail({
  version,
  previousVersion,
  onPublish,
  onRetire,
}: PlVersionDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('snapshot');
  const [publishInternal, setPublishInternal] = useState(true);
  const [publishClientSafe, setPublishClientSafe] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const diff = previousVersion
    ? computeLineDiff(previousVersion.snapshotMdRu || '', version.snapshotMdRu || '')
    : null;

  const handlePublish = () => {
    if (onPublish) {
      onPublish({ internal: publishInternal, clientSafe: publishClientSafe });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                version.docType === 'policy'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {version.docType === 'policy' ? 'Политика' : 'SOP'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{version.docTitle}</h1>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg text-stone-700">{version.versionLabel}</span>
              <PlStatusPill status={version.status} size="md" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {version.publishedInternal && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                Internal
              </span>
            )}
            {version.publishedClientSafe && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200">
                Client-safe
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-stone-500">Автор:</span>
            <div className="font-medium text-stone-800">{version.createdByName || '—'}</div>
          </div>
          <div>
            <span className="text-stone-500">Создан:</span>
            <div className="font-medium text-stone-800">{formatDate(version.createdAt)}</div>
          </div>
          <div>
            <span className="text-stone-500">Опубликован:</span>
            <div className="font-medium text-stone-800">
              {version.publishedAt ? formatDate(version.publishedAt) : '—'}
            </div>
          </div>
          <div>
            <span className="text-stone-500">Предыдущая версия:</span>
            <div className="font-medium text-stone-800">
              {previousVersion ? previousVersion.versionLabel : '—'}
            </div>
          </div>
        </div>

        {version.changeNotes && (
          <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-xs font-medium text-stone-500 uppercase">Примечания к изменениям:</span>
            <p className="text-sm text-stone-700 mt-1">{version.changeNotes}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-stone-200'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              {tab.label}
              {tab.key === 'diff' && diff && (
                <span className="ml-1 text-xs">
                  ({diff.addedCount > 0 ? `+${diff.addedCount}` : ''}{diff.removedCount > 0 ? ` -${diff.removedCount}` : ''})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'snapshot' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Снимок содержания</h3>
          <div className="whitespace-pre-wrap font-mono text-sm bg-stone-50 p-4 rounded-lg border border-stone-200 max-h-[600px] overflow-auto">
            {version.snapshotMdRu || 'Содержание пусто'}
          </div>
        </div>
      )}

      {activeTab === 'diff' && (
        <div className="space-y-4">
          {diff ? (
            <PlDiffViewer
              diff={diff}
              title={`Сравнение: ${previousVersion?.versionLabel || 'начало'} → ${version.versionLabel}`}
            />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
              <p className="text-stone-500">Нет предыдущей версии для сравнения</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'publish' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Настройки публикации</h3>

          {version.status === 'published' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-700">Эта версия уже опубликована</span>
              </div>
              {onRetire && (
                <Button variant="secondary" onClick={onRetire}>
                  Отменить версию
                </Button>
              )}
            </div>
          ) : version.status === 'retired' ? (
            <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="text-stone-600">Эта версия отменена и не может быть опубликована</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={publishInternal}
                    onChange={(e) => setPublishInternal(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-medium text-stone-800">Внутренняя публикация</div>
                    <div className="text-xs text-stone-500">Доступна всем сотрудникам MFO</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={publishClientSafe}
                    onChange={(e) => setPublishClientSafe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-medium text-stone-800">Client-safe публикация</div>
                    <div className="text-xs text-stone-500">Доступна клиентам через портал (без внутренних деталей)</div>
                  </div>
                </label>
              </div>

              {version.requiresApproval && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-amber-700 text-sm">Требуется согласование перед публикацией</span>
                </div>
              )}

              {onPublish && (
                <Button
                  variant="primary"
                  onClick={handlePublish}
                  disabled={!publishInternal && !publishClientSafe}
                >
                  Опубликовать версию
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Audit Trail</h3>
          <p className="text-stone-500 text-sm">История изменений загружается из auditEvents</p>
        </div>
      )}
    </div>
  );
}
