'use client';

/**
 * Admin Item Detail Page
 * /m/admin/item/[id]
 */

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PolicyBanner, policyModuleLabels, policySeverityLabels, policyPlacementLabels, ALL_POLICY_MODULES, PolicyModuleKey, PolicySeverity, PolicyPlacement } from '@/modules/25-admin/schema/policyBanner';
import { FeatureFlag, flagAudienceLabels, FlagAudience } from '@/modules/25-admin/schema/featureFlag';

const labels = {
  back: { ru: '← Назад', en: '← Back', uk: '← Назад' },
  save: { ru: 'Сохранить', en: 'Save', uk: 'Зберегти' },
  delete: { ru: 'Удалить', en: 'Delete', uk: 'Видалити' },
  policyDetail: { ru: 'Редактирование политики', en: 'Edit Policy', uk: 'Редагування політики' },
  flagDetail: { ru: 'Редактирование флага', en: 'Edit Flag', uk: 'Редагування флага' },
  module: { ru: 'Модуль', en: 'Module', uk: 'Модуль' },
  severity: { ru: 'Тип', en: 'Severity', uk: 'Тип' },
  placement: { ru: 'Размещение', en: 'Placement', uk: 'Розміщення' },
  textRu: { ru: 'Текст (RU)', en: 'Text (RU)', uk: 'Текст (RU)' },
  textEn: { ru: 'Текст (EN)', en: 'Text (EN)', uk: 'Текст (EN)' },
  textUk: { ru: 'Текст (UK)', en: 'Text (UK)', uk: 'Текст (UK)' },
  key: { ru: 'Ключ', en: 'Key', uk: 'Ключ' },
  description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
  audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
  rollout: { ru: 'Rollout %', en: 'Rollout %', uk: 'Rollout %' },
  enabled: { ru: 'Включен', en: 'Enabled', uk: 'Увімкнено' },
  notFound: { ru: 'Не найдено', en: 'Not found', uk: 'Не знайдено' },
};

export default function AdminItemPage() {
  const lang = 'ru';
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const type = searchParams.get('type');

  const [policy, setPolicy] = useState<PolicyBanner | null>(null);
  const [flag, setFlag] = useState<FeatureFlag | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (type === 'policy') {
      fetch('/api/tenant/policies')
        .then(r => r.json())
        .then(d => {
          const found = d.data?.find((b: PolicyBanner) => b.id === id);
          setPolicy(found || null);
        });
    } else if (type === 'flag') {
      fetch('/api/tenant/flags')
        .then(r => r.json())
        .then(d => {
          const found = d.data?.find((f: FeatureFlag) => f.id === id);
          setFlag(found || null);
        });
    }
  }, [id, type]);

  const savePolicy = async () => {
    if (!policy) return;
    setSaving(true);
    try {
      await fetch('/api/tenant/policies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      router.push('/m/admin/list?tab=policies');
    } finally {
      setSaving(false);
    }
  };

  const saveFlag = async () => {
    if (!flag) return;
    setSaving(true);
    try {
      await fetch('/api/tenant/flags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flag),
      });
      router.push('/m/admin/list?tab=flags');
    } finally {
      setSaving(false);
    }
  };

  if (type === 'policy') {
    if (!policy) {
      return <div className="p-6 text-gray-500">{labels.notFound[lang]}</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/m/admin/list?tab=policies" className="text-emerald-600 hover:underline">
              {labels.back[lang]}
            </Link>
            <h1 className="text-xl font-semibold">{labels.policyDetail[lang]}</h1>
          </div>
          <button
            onClick={savePolicy}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? '...' : labels.save[lang]}
          </button>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{labels.module[lang]}</label>
              <select
                value={policy.moduleKey}
                onChange={e => setPolicy({ ...policy, moduleKey: e.target.value as PolicyModuleKey })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {ALL_POLICY_MODULES.map(m => (
                  <option key={m} value={m}>{policyModuleLabels[m][lang]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{labels.severity[lang]}</label>
              <select
                value={policy.severity}
                onChange={e => setPolicy({ ...policy, severity: e.target.value as PolicySeverity })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {(['info', 'warn'] as PolicySeverity[]).map(s => (
                  <option key={s} value={s}>{policySeverityLabels[s][lang]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{labels.placement[lang]}</label>
              <select
                value={policy.placement}
                onChange={e => setPolicy({ ...policy, placement: e.target.value as PolicyPlacement })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {(['top-banner', 'section-footer', 'modal'] as PolicyPlacement[]).map(p => (
                  <option key={p} value={p}>{policyPlacementLabels[p][lang]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.textRu[lang]}</label>
            <textarea
              value={policy.textRu}
              onChange={e => setPolicy({ ...policy, textRu: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.textEn[lang]}</label>
            <textarea
              value={policy.textEn}
              onChange={e => setPolicy({ ...policy, textEn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.textUk[lang]}</label>
            <textarea
              value={policy.textUk}
              onChange={e => setPolicy({ ...policy, textUk: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'flag') {
    if (!flag) {
      return <div className="p-6 text-gray-500">{labels.notFound[lang]}</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/m/admin/list?tab=flags" className="text-emerald-600 hover:underline">
              {labels.back[lang]}
            </Link>
            <h1 className="text-xl font-semibold">{labels.flagDetail[lang]}</h1>
          </div>
          <button
            onClick={saveFlag}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? '...' : labels.save[lang]}
          </button>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{labels.key[lang]}</label>
              <input
                type="text"
                value={flag.key}
                onChange={e => setFlag({ ...flag, key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{labels.audience[lang]}</label>
              <select
                value={flag.audience}
                onChange={e => setFlag({ ...flag, audience: e.target.value as FlagAudience })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {(['staff', 'client', 'both'] as FlagAudience[]).map(a => (
                  <option key={a} value={a}>{flagAudienceLabels[a][lang]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">{labels.description[lang]}</label>
            <textarea
              value={flag.description}
              onChange={e => setFlag({ ...flag, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">{labels.rollout[lang]}</label>
              <input
                type="number"
                value={flag.rolloutPct}
                onChange={e => setFlag({ ...flag, rolloutPct: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min={0}
                max={100}
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flag.enabled}
                  onChange={e => setFlag({ ...flag, enabled: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded"
                />
                <span>{labels.enabled[lang]}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="p-6 text-gray-500">{labels.notFound[lang]}</div>;
}
