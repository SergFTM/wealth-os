"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useCollection } from '@/lib/hooks';
import { KpiCard } from '@/components/ui/KpiCard';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';
import { DetailDrawer } from './DetailDrawer';
import { BaseRecord } from '@/db/storage/storage.types';

interface ModuleSchema {
  slug: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  disclaimer?: Record<string, string>;
  collections: string[];
  kpis: Array<{ key: string; title: string; format: string }>;
  listColumns: Array<{ key: string; header: string; type: string }>;
  help: {
    title: string;
    description: string;
    features: string[];
    scenarios: string[];
    dataSources: string[];
  };
}

// Schema-based props (original API)
interface SchemaBasedProps {
  schema: ModuleSchema;
  primaryCollection: string;
  moduleSlug?: never;
  title?: never;
  subtitle?: never;
  children?: never;
}

// Simple props with children (used by governance, deals, etc.)
interface SimpleProps {
  moduleSlug: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  schema?: never;
  primaryCollection?: never;
}

type ModuleDashboardProps = SchemaBasedProps | SimpleProps;

export function ModuleDashboard(props: ModuleDashboardProps) {
  // If children are provided, render simple wrapper layout
  if ('children' in props && props.children) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
        <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-stone-800">{props.title}</h1>
            {props.subtitle && (
              <p className="text-stone-500 mt-1">{props.subtitle}</p>
            )}
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
  return <SchemaBasedDashboard schema={schema} primaryCollection={primaryCollection} />;
}

function SchemaBasedDashboard({ schema, primaryCollection }: SchemaBasedProps) {
  const { locale } = useApp();
  const router = useRouter();
  const { items, loading, total } = useCollection<BaseRecord & Record<string, unknown>>(primaryCollection, { limit: 5 });
  const [selectedItem, setSelectedItem] = useState<(BaseRecord & Record<string, unknown>) | null>(null);

  const columns = schema.listColumns.map(col => ({
    key: col.key,
    header: col.header,
    width: col.type === 'status' || col.type === 'badge' ? 'w-24' : undefined,
    render: col.type === 'status' || col.type === 'badge'
      ? (item: BaseRecord & Record<string, unknown>) => <StatusBadge status={String(item[col.key]) as 'pending' | 'success'} size="sm" />
      : col.type === 'currency'
      ? (item: BaseRecord & Record<string, unknown>) => `$${Number(item[col.key] || 0).toLocaleString()}`
      : undefined,
  }));

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {schema.kpis.slice(0, 4).map((kpi) => (
              <KpiCard
                key={kpi.key}
                title={kpi.title}
                value={kpi.format === 'currency' ? '$487.5M' : kpi.format === 'percent' ? '94%' : String(total)}
                status="ok"
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-800">Последние записи</h2>
            <div className="flex gap-2">
              <Link href={`/m/${schema.slug}/list`}>
                <Button variant="secondary">Все записи</Button>
              </Link>
              <Button variant="primary" onClick={() => router.push(`/m/${schema.slug}/list?create=true`)}>
                Создать
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-stone-500 mt-4">Загрузка...</p>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="Нет записей"
              description="Здесь пока ничего нет. Создайте первую запись или настройте интеграцию."
              action={{ label: 'Создать', onClick: () => router.push(`/m/${schema.slug}/list?create=true`) }}
            />
          ) : (
            <DataTable
              data={items}
              columns={columns}
              onRowClick={(item) => setSelectedItem(item)}
            />
          )}
        </div>

        <div className="space-y-4">
          <HelpPanel
            title={schema.help.title}
            description={schema.help.description}
            features={schema.help.features}
            scenarios={schema.help.scenarios}
            dataSources={schema.help.dataSources}
          />
        </div>
      </div>

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
    </div>
  );
}
