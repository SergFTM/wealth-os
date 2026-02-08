"use client";

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Eye,
  Download,
  Lock,
  FileText,
  Layers,
  ClipboardList,
  User,
  Calendar,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Purpose labels                                                     */
/* ------------------------------------------------------------------ */
const PURPOSE_LABELS: Record<string, { label: string; color: string }> = {
  audit:          { label: 'Аудит',           color: 'bg-violet-100 text-violet-700' },
  tax:            { label: 'Налоги',          color: 'bg-amber-100 text-amber-700' },
  legal:          { label: 'Юридический',     color: 'bg-blue-100 text-blue-700' },
  advisor_access: { label: 'Доступ советника', color: 'bg-emerald-100 text-emerald-700' },
  banking:        { label: 'Банковский',      color: 'bg-cyan-100 text-cyan-700' },
  other:          { label: 'Прочее',          color: 'bg-stone-100 text-stone-600' },
};

const STATUS_STYLES: Record<string, string> = {
  active:  'bg-emerald-100 text-emerald-700',
  revoked: 'bg-red-100 text-red-700',
  expired: 'bg-stone-200 text-stone-600',
};

/* ------------------------------------------------------------------ */
/*  Tabs                                                               */
/* ------------------------------------------------------------------ */
type Tab = 'overview' | 'scope' | 'evidence' | 'objects' | 'audit';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview',  label: 'Обзор' },
  { key: 'scope',     label: 'Scope' },
  { key: 'evidence',  label: 'Evidence' },
  { key: 'objects',   label: 'Объекты' },
  { key: 'audit',     label: 'Аудит' },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface CoConsentDetailProps {
  consent: any;
  onBack: () => void;
  onRevoke: () => void;
  onShowAudit: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function CoConsentDetail({
  consent,
  onBack,
  onRevoke,
  onShowAudit,
}: CoConsentDetailProps) {
  const [tab, setTab] = useState<Tab>('overview');

  const grantor = consent.grantorRefJson;
  const grantee = consent.granteeRefJson;
  const purpose = PURPOSE_LABELS[consent.purposeKey] ?? PURPOSE_LABELS.other;
  const statusStyle = STATUS_STYLES[consent.statusKey] ?? STATUS_STYLES.expired;

  const scope = consent.scopeJson ?? {};
  const restrictions = consent.restrictionsJson ?? {};
  const evidenceDocIds: string[] = consent.evidenceDocIdsJson ?? [];

  return (
    <div className="space-y-6">
      {/* ---- Back + Header ---- */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-stone-800">
                {grantor?.label ?? grantor?.id ?? 'Гранторы'}
              </h2>
              <ArrowRight className="w-4 h-4 text-stone-400" />
              <span className="text-lg font-semibold text-stone-700">
                {grantee?.label ?? grantee?.id}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${purpose.color}`}>
                {purpose.label}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle}`}>
                {consent.statusKey}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShowAudit}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Аудит
          </button>
          {consent.statusKey === 'active' && (
            <button
              onClick={onRevoke}
              className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
            >
              Отозвать
            </button>
          )}
        </div>
      </div>

      {/* ---- Tabs ---- */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-4 -mb-px">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ---- Tab content ---- */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Dates */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-400" />
              Период действия
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-stone-400">Действует с</div>
                <div className="text-sm font-medium text-stone-700">
                  {new Date(consent.effectiveFrom).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-400">Действует до</div>
                <div className="text-sm font-medium text-stone-700">
                  {consent.effectiveTo
                    ? new Date(consent.effectiveTo).toLocaleDateString('ru-RU')
                    : 'Бессрочно'}
                </div>
              </div>
              <div>
                <div className="text-xs text-stone-400">Создано</div>
                <div className="text-sm font-medium text-stone-700">
                  {new Date(consent.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-stone-400" />
              Ограничения
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                restrictions.viewOnly ? 'bg-amber-50 text-amber-700' : 'bg-stone-50 text-stone-400'
              }`}>
                <Eye className="w-4 h-4" />
                Только просмотр
                <span className="text-xs">
                  {restrictions.viewOnly ? 'Да' : 'Нет'}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                restrictions.allowDownload ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-50 text-stone-400'
              }`}>
                <Download className="w-4 h-4" />
                Скачивание
                <span className="text-xs">
                  {restrictions.allowDownload ? 'Разрешено' : 'Запрещено'}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                restrictions.clientSafe ? 'bg-blue-50 text-blue-700' : 'bg-stone-50 text-stone-400'
              }`}>
                <Lock className="w-4 h-4" />
                Client-safe
                <span className="text-xs">
                  {restrictions.clientSafe ? 'Да' : 'Нет'}
                </span>
              </div>
            </div>
          </div>

          {/* Created By */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-stone-400" />
              Автор
            </h3>
            <div className="text-sm text-stone-700">
              {consent.createdByUserId}
            </div>
            {consent.revokedByUserId && (
              <div className="mt-2">
                <div className="text-xs text-stone-400">Отозвано</div>
                <div className="text-sm text-red-600">
                  {consent.revokedByUserId}{' '}
                  {consent.revokedAt && (
                    <span className="text-stone-400">
                      ({new Date(consent.revokedAt).toLocaleDateString('ru-RU')})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'scope' && (
        <div className="space-y-4">
          <ScopeSection
            label="Модули"
            items={scope.modulesJson}
            icon={<Layers className="w-4 h-4 text-emerald-600" />}
          />
          <ScopeSection
            label="Юр. лица"
            items={scope.entityIdsJson}
            icon={<User className="w-4 h-4 text-blue-600" />}
          />
          <ScopeSection
            label="Документы"
            items={scope.docIdsJson}
            icon={<FileText className="w-4 h-4 text-amber-600" />}
          />
          <ScopeSection
            label="Пакеты"
            items={scope.packIdsJson}
            icon={<ClipboardList className="w-4 h-4 text-violet-600" />}
          />
        </div>
      )}

      {tab === 'evidence' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Документы-основания</h3>
          {evidenceDocIds.length === 0 ? (
            <p className="text-sm text-stone-400">Нет прикреплённых документов</p>
          ) : (
            <ul className="space-y-2">
              {evidenceDocIds.map((docId) => (
                <li key={docId} className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span className="text-emerald-700 hover:underline cursor-pointer font-medium">
                    {docId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'objects' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
          <Layers className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-400">
            Производные разрешения будут отображены здесь
          </p>
        </div>
      )}

      {tab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
          <ClipboardList className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-400">
            Аудит-лог будет отображён здесь
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scope helper                                                       */
/* ------------------------------------------------------------------ */
function ScopeSection({
  label,
  items,
  icon,
}: {
  label: string;
  items?: string[];
  icon: React.ReactNode;
}) {
  const list = items ?? [];
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-stone-800 flex items-center gap-2">
          {icon}
          {label}
        </h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
          {list.length}
        </span>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-stone-400">Все (без ограничений)</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {list.map((item) => (
            <span
              key={item}
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
