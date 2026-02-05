'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { SbStatusPill } from './SbStatusPill';

interface Environment {
  id: string;
  name: string;
  status: 'active' | 'archived' | 'paused';
  envType: string;
  linkedDatasetId?: string;
  connectorIds?: string[];
  updatedAt: string;
}

interface SbEnvPanelProps {
  environments: Environment[];
  className?: string;
}

const i18n = {
  ru: { title: 'Среды', noEnv: 'Нет сред', connectors: 'коннекторов', open: 'Открыть' },
  en: { title: 'Environments', noEnv: 'No environments', connectors: 'connectors', open: 'Open' },
  uk: { title: 'Середовища', noEnv: 'Немає середовищ', connectors: 'конекторів', open: 'Відкрити' },
};

export function SbEnvPanel({ environments, className }: SbEnvPanelProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  const activeEnvs = environments.filter(e => e.status === 'active');

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-800">{t.title}</h3>
        <span className="text-xs text-stone-400">{activeEnvs.length} active</span>
      </div>

      {environments.length === 0 ? (
        <p className="text-sm text-stone-500 text-center py-4">{t.noEnv}</p>
      ) : (
        <div className="space-y-3">
          {environments.slice(0, 4).map((env) => (
            <div
              key={env.id}
              onClick={() => router.push(`/m/sandbox/env/${env.id}`)}
              className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-indigo-50 cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-stone-800 text-sm truncate">{env.name}</h4>
                  <SbStatusPill status={env.status} size="sm" />
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {env.connectorIds?.length || 0} {t.connectors}
                </p>
              </div>
              <button className="text-xs text-indigo-600 hover:text-indigo-700">
                {t.open} →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
