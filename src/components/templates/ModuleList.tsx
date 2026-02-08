"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useCollection } from '@/lib/hooks';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { FormRenderer } from '@/components/ui/FormRenderer';
import { useState, useEffect } from 'react';
import { DetailDrawer } from './DetailDrawer';
import { FiltersBar } from './FiltersBar';
import { BaseRecord } from '@/db/storage/storage.types';

interface ModuleSchema {
  slug: string;
  title: Record<string, string>;
  listColumns: Array<{ key: string; header: string; type: string }>;
  createFields?: Array<{ key: string; label: string; type: string; required?: boolean; options?: string[] }>;
}

// Schema-based props (original API)
interface SchemaBasedProps {
  schema: ModuleSchema;
  primaryCollection: string;
  moduleSlug?: never;
  title?: never;
  backHref?: never;
  children?: never;
}

// Simple props with children (used by governance, deals, etc.)
interface SimpleProps {
  moduleSlug: string;
  title: string;
  backHref?: string;
  children: React.ReactNode;
  schema?: never;
  primaryCollection?: never;
}

type ModuleListProps = SchemaBasedProps | SimpleProps;

export function ModuleList(props: ModuleListProps) {
  const router = useRouter();

  // If children are provided, render simple wrapper layout
  if ('children' in props && props.children) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
        <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {props.backHref && (
                <Link href={props.backHref}>
                  <Button variant="ghost" className="gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад
                  </Button>
                </Link>
              )}
              <h1 className="text-xl font-semibold text-stone-800">{props.title}</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          {props.children}
        </div>
      </div>
    );
  }

  // Schema-based rendering (original behavior)
  const { schema, primaryCollection } = props as SchemaBasedProps;
  return <SchemaBasedList schema={schema} primaryCollection={primaryCollection} />;
}

function SchemaBasedList({ schema, primaryCollection }: SchemaBasedProps) {
  const { locale } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<(BaseRecord & Record<string, unknown>) | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const { items, loading, total, create, refetch } = useCollection<BaseRecord & Record<string, unknown>>(
    primaryCollection,
    { search: filters.search, status: filters.status }
  );

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreate(true);
    }
  }, [searchParams]);

  const columns = schema.listColumns.map(col => ({
    key: col.key,
    header: col.header,
    render: col.type === 'status' || col.type === 'badge'
      ? (item: BaseRecord & Record<string, unknown>) => <StatusBadge status={String(item[col.key]) as 'pending' | 'success'} size="sm" />
      : col.type === 'currency'
      ? (item: BaseRecord & Record<string, unknown>) => `$${Number(item[col.key] || 0).toLocaleString()}`
      : undefined,
  }));

  const formFields = (schema.createFields || []).map(f => ({
    key: f.key,
    label: f.label,
    type: f.type as 'text' | 'textarea' | 'select' | 'date' | 'number' | 'email',
    required: f.required,
    options: f.options?.map(o => ({ value: o, label: o })),
  }));

  const handleCreate = async (values: Record<string, unknown>) => {
    setCreating(true);
    await create(values);
    setCreating(false);
    setShowCreate(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/m/${schema.slug}`}>
            <Button variant="ghost" className="gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-stone-800">
            {schema.title[locale] || schema.title.ru} — Список
          </h1>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          Создать
        </Button>
      </div>

      <FiltersBar filters={filters} onFiltersChange={setFilters} />

      <div className="text-sm text-stone-500">
        Найдено: {total} записей
      </div>

      {loading ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Нет записей"
          description="Создайте первую запись или измените фильтры."
          action={{ label: 'Создать', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <DataTable
          data={items}
          columns={columns}
          onRowClick={(item) => setSelectedItem(item)}
        />
      )}

      <DetailDrawer
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        columns={schema.listColumns}
        onOpenFull={() => {
          if (selectedItem) {
            router.push(`/m/${schema.slug}/item/${selectedItem.id}`);
          }
        }}
      />

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Создать запись"
        size="md"
      >
        <FormRenderer
          fields={formFields}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={creating}
        />
      </Modal>
    </div>
  );
}
