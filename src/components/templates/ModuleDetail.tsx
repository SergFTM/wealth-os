"use client";

import Link from 'next/link';
import { useApp } from '@/lib/store';
import { useRecord } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useState } from 'react';
import { AuditDrawer } from './AuditDrawer';
import { BaseRecord } from '@/db/storage/storage.types';

interface ModuleSchema {
  slug: string;
  title: Record<string, string>;
  disclaimer?: Record<string, string>;
  listColumns: Array<{ key: string; header: string; type: string }>;
}

interface ModuleDetailProps {
  schema: ModuleSchema;
  primaryCollection: string;
  itemId: string;
}

export function ModuleDetail({ schema, primaryCollection, itemId }: ModuleDetailProps) {
  const { locale } = useApp();
  const { record, loading } = useRecord<BaseRecord & Record<string, unknown>>(primaryCollection, itemId);
  const [showAudit, setShowAudit] = useState(false);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-12 text-center">
        <p className="text-stone-500">Запись не найдена</p>
        <Link href={`/m/${schema.slug}/list`}>
          <Button variant="secondary" className="mt-4">К списку</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {schema.disclaimer && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {schema.disclaimer[locale] || schema.disclaimer.ru}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/m/${schema.slug}/list`}>
            <Button variant="ghost" className="gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              К списку
            </Button>
          </Link>
        </div>
        <Button variant="secondary" onClick={() => setShowAudit(true)}>
          Audit Trail
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h1 className="text-xl font-bold text-stone-800 mb-6">
          {String(record[schema.listColumns[0]?.key] || `${schema.title[locale]} #${record.id}`)}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schema.listColumns.map(col => (
            <div key={col.key}>
              <label className="text-xs text-stone-500 uppercase tracking-wide">{col.header}</label>
              <div className="mt-1">
                {col.type === 'status' || col.type === 'badge' ? (
                  <StatusBadge status={String(record[col.key]) as 'pending' | 'success'} />
                ) : col.type === 'currency' ? (
                  <p className="text-lg font-semibold text-stone-800">${Number(record[col.key] || 0).toLocaleString()}</p>
                ) : (
                  <p className="text-stone-800">{String(record[col.key] || '-')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-4">Метаданные</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">ID</span>
              <span className="text-stone-800 font-mono">{record.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Создано</span>
              <span className="text-stone-800">{new Date(record.createdAt).toLocaleString('ru-RU')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Изменено</span>
              <span className="text-stone-800">{new Date(record.updatedAt).toLocaleString('ru-RU')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-4">Действия</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">Редактировать</Button>
            <Button variant="secondary" size="sm">Дублировать</Button>
            <Button variant="ghost" size="sm">Архивировать</Button>
          </div>
        </div>
      </div>

      <AuditDrawer open={showAudit} onClose={() => setShowAudit(false)} recordId={record.id} />
    </div>
  );
}
