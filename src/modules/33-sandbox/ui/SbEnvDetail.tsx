'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SbStatusPill } from './SbStatusPill';

interface Environment {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'paused';
  envType: string;
  linkedDatasetId?: string;
  connectorIds?: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface SbEnvDetailProps {
  environment: Environment;
  onActivate?: () => void;
  onArchive?: () => void;
  onUseEnv?: () => void;
}

const i18n = {
  ru: {
    back: '← Назад',
    type: 'Тип',
    status: 'Статус',
    dataset: 'Привязанный датасет',
    connectors: 'Коннекторы',
    created: 'Создано',
    createdBy: 'Кем',
    updated: 'Обновлено',
    activate: 'Активировать',
    archive: 'Архивировать',
    useEnv: 'Использовать эту среду',
    noConnectors: 'Нет привязанных коннекторов',
  },
  en: {
    back: '← Back',
    type: 'Type',
    status: 'Status',
    dataset: 'Linked Dataset',
    connectors: 'Connectors',
    created: 'Created',
    createdBy: 'Created by',
    updated: 'Updated',
    activate: 'Activate',
    archive: 'Archive',
    useEnv: 'Use this environment',
    noConnectors: 'No linked connectors',
  },
  uk: {
    back: '← Назад',
    type: 'Тип',
    status: 'Статус',
    dataset: 'Привязаний датасет',
    connectors: 'Конектори',
    created: 'Створено',
    createdBy: 'Ким',
    updated: 'Оновлено',
    activate: 'Активувати',
    archive: 'Архівувати',
    useEnv: 'Використовувати це середовище',
    noConnectors: 'Немає привязаних конекторів',
  },
};

export function SbEnvDetail({ environment, onActivate, onArchive, onUseEnv }: SbEnvDetailProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];
  const [isUsing, setIsUsing] = useState(false);

  const handleUseEnv = () => {
    setIsUsing(true);
    setTimeout(() => {
      setIsUsing(false);
      onUseEnv?.();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/m/sandbox/list?tab=environments')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-stone-800">{environment.name}</h1>
          {environment.description && (
            <p className="text-sm text-stone-500 mt-1">{environment.description}</p>
          )}
        </div>
        <SbStatusPill status={environment.status} size="md" />
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Meta Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Info</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500">{t.type}</dt>
              <dd className="text-sm font-medium text-stone-800">{environment.envType}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500">{t.status}</dt>
              <dd className="text-sm font-medium text-stone-800">{environment.status}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500">{t.dataset}</dt>
              <dd className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline">
                {environment.linkedDatasetId || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500">{t.created}</dt>
              <dd className="text-sm font-medium text-stone-800">
                {new Date(environment.createdAt).toLocaleDateString()}
              </dd>
            </div>
            {environment.createdBy && (
              <div className="flex justify-between">
                <dt className="text-sm text-stone-500">{t.createdBy}</dt>
                <dd className="text-sm font-medium text-stone-800">{environment.createdBy}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500">{t.updated}</dt>
              <dd className="text-sm font-medium text-stone-800">
                {new Date(environment.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* Connectors */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">{t.connectors}</h3>
          {environment.connectorIds && environment.connectorIds.length > 0 ? (
            <div className="space-y-2">
              {environment.connectorIds.map((connId) => (
                <div
                  key={connId}
                  onClick={() => router.push(`/m/sandbox/connector/${connId}`)}
                  className="flex items-center justify-between p-2 rounded-lg bg-stone-50 hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <span className="text-sm text-stone-700">{connId}</span>
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500 text-center py-4">{t.noConnectors}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={handleUseEnv}
            disabled={environment.status !== 'active' || isUsing}
            className="bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            {isUsing ? 'Switching...' : t.useEnv}
          </Button>
          {environment.status !== 'active' && (
            <Button variant="secondary" onClick={onActivate}>
              {t.activate}
            </Button>
          )}
          {environment.status === 'active' && (
            <Button variant="ghost" onClick={onArchive}>
              {t.archive}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
