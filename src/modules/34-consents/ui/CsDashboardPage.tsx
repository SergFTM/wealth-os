"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { CsKpiStrip } from './CsKpiStrip';
import { CsActionsBar } from './CsActionsBar';
import { CsConsentsTable } from './CsConsentsTable';
import { CsRequestsTable } from './CsRequestsTable';
import { CsDataRoomsTable } from './CsDataRoomsTable';
import { HelpPanel } from '@/components/ui/HelpPanel';
import { AlertTriangle, X } from 'lucide-react';

interface Consent {
  id: string;
  clientId: string;
  subjectType: string;
  subjectId: string;
  subjectName?: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  clientSafe: boolean;
  validFrom: string;
  validUntil?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AccessRequest {
  id: string;
  clientId: string;
  requestedBySubjectType: string;
  requestedById: string;
  requestedByName?: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  permissions: string[];
  reason: string;
  status: string;
  slaDueAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DataRoom {
  id: string;
  name: string;
  purpose: string;
  status: string;
  expiresAt?: string;
  itemsCount: number;
  audience: { subjectName?: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Revocation {
  id: string;
  revokedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function CsDashboardPage() {
  const router = useRouter();
  const [showCreateConsent, setShowCreateConsent] = useState(false);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const { items: consents } = useCollection<Consent>('consents');
  const { items: requests } = useCollection<AccessRequest>('accessRequests');
  const { items: rooms } = useCollection<DataRoom>('dataRooms');
  const { items: revocations } = useCollection<Revocation>('revocations');

  const kpis = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const activeConsents = consents.filter(c => c.status === 'active').length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const expiring30d = consents.filter(c => {
      if (c.status !== 'active' || !c.validUntil) return false;
      const exp = new Date(c.validUntil);
      return exp > now && exp <= thirtyDaysFromNow;
    }).length;
    const revocations30d = revocations.filter(r => new Date(r.revokedAt) >= thirtyDaysAgo).length;
    const activeRooms = rooms.filter(r => r.status === 'active').length;
    const clientSafeShares = consents.filter(c => c.status === 'active' && c.clientSafe).length;

    return [
      { id: 'activeConsents', label: 'Активные согласия', value: activeConsents, status: 'ok' as const, linkTo: '/m/consents/list?tab=consents&status=active' },
      { id: 'pendingRequests', label: 'Запросы на рассмотрении', value: pendingRequests, status: pendingRequests > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/consents/list?tab=requests&status=pending' },
      { id: 'expiring30d', label: 'Истекают 30д', value: expiring30d, status: expiring30d > 0 ? 'warning' as const : 'ok' as const, linkTo: '/m/consents/list?tab=consents&filter=expiring30d' },
      { id: 'revocations30d', label: 'Отозвано 30д', value: revocations30d, status: 'info' as const, linkTo: '/m/consents/list?tab=revocations&period=30d' },
      { id: 'dataRoomsActive', label: 'Data Rooms активные', value: activeRooms, status: 'ok' as const, linkTo: '/m/consents/list?tab=rooms&status=active' },
      { id: 'downloadsBlocked', label: 'Скачивания заблокированы', value: 3, status: 'critical' as const, linkTo: '/m/consents/list?tab=policies&filter=blocked' },
      { id: 'clientSafeShares', label: 'Client-safe шары', value: clientSafeShares, status: 'ok' as const, linkTo: '/m/consents/list?tab=policies&filter=client_safe' },
      { id: 'auditEvents', label: 'Audit события', value: 47, status: 'info' as const, linkTo: '/m/consents/list?tab=audit' },
    ];
  }, [consents, requests, rooms, revocations]);

  const pendingRequestsList = useMemo(() => {
    return requests
      .filter(r => r.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [requests]);

  const expiringConsentsList = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return consents
      .filter(c => {
        if (c.status !== 'active' || !c.validUntil) return false;
        const exp = new Date(c.validUntil);
        return exp > now && exp <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.validUntil!).getTime() - new Date(b.validUntil!).getTime())
      .slice(0, 5);
  }, [consents]);

  const activeRoomsList = useMemo(() => {
    return rooms
      .filter(r => r.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [rooms]);

  const helpContent = {
    title: 'Согласия и контуры доступа',
    description: 'Управление тем, кто и на каких условиях может видеть, получать и экспортировать данные клиентов.',
    features: [
      'Согласия по уровням: household, entity, account, document',
      'Типы разрешений: view, download, export, api',
      'Workflow запросов доступа с SLA',
      'Data Rooms для аудиторов и юристов',
      'Client-safe режим для ограниченного доступа',
      'Watermark для конфиденциальных документов',
      'Отзыв доступа с audit trail',
    ],
    scenarios: [
      'Создать согласие для внешнего advisor',
      'Одобрить запрос на доступ',
      'Создать Data Room для аудита',
      'Отозвать согласие сотрудника',
    ],
    dataSources: ['Ручной ввод', 'Workflow запросов'],
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-amber-800">
            <strong>Дисклеймер:</strong> Доступы и согласия в MVP демонстрационные.
            Для production требуется юридическая проработка и инфраструктура.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Согласия</h1>
          <p className="text-stone-500 mt-1">Управление согласиями, разрешениями и контурами доступа</p>
        </div>
        <button
          onClick={() => router.push('/m/consents/list')}
          className="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          Показать все →
        </button>
      </div>

      {/* KPI Strip */}
      <CsKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <CsActionsBar
        onCreateConsent={() => setShowCreateConsent(true)}
        onCreateRequest={() => setShowCreateRequest(true)}
        onCreateRoom={() => setShowCreateRoom(true)}
        onRevokeAccess={() => router.push('/m/consents/list?tab=consents&action=revoke')}
        onGenerateDemo={() => {}}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests + Expiring */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Requests */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-amber-50/50 to-white flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Запросы на рассмотрении</h3>
              <button
                onClick={() => router.push('/m/consents/list?tab=requests&status=pending')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <CsRequestsTable
              requests={pendingRequestsList}
              onOpen={(id) => router.push(`/m/consents/request/${id}`)}
              onApprove={(id) => router.push(`/m/consents/request/${id}?action=approve`)}
              onReject={(id) => router.push(`/m/consents/request/${id}?action=reject`)}
              compact
            />
          </div>

          {/* Expiring Consents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-rose-50/50 to-white flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Истекающие согласия (30д)</h3>
              <button
                onClick={() => router.push('/m/consents/list?tab=consents&filter=expiring30d')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <CsConsentsTable
              consents={expiringConsentsList}
              onOpen={(id) => router.push(`/m/consents/consent/${id}`)}
              compact
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Data Rooms */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30 flex justify-between items-center">
              <h3 className="font-semibold text-stone-800">Data Rooms</h3>
              <button
                onClick={() => router.push('/m/consents/list?tab=rooms')}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Все →
              </button>
            </div>
            <CsDataRoomsTable
              rooms={activeRoomsList}
              onOpen={(id) => router.push(`/m/consents/room/${id}`)}
              compact
            />
          </div>

          {/* Help Panel */}
          <HelpPanel {...helpContent} />
        </div>
      </div>

      {/* Create Consent Modal */}
      {showCreateConsent && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowCreateConsent(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Создать согласие</h2>
                <button onClick={() => setShowCreateConsent(false)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Тип субъекта</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                    <option value="advisor">Advisor</option>
                    <option value="user">Пользователь</option>
                    <option value="client">Клиент</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Субъект</label>
                  <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg" placeholder="Имя или ID" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Scope</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                    <option value="household">Household</option>
                    <option value="entity">Entity</option>
                    <option value="account">Account</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Разрешения</label>
                  <div className="flex flex-wrap gap-2">
                    {['view', 'download', 'export', 'api'].map(p => (
                      <label key={p} className="flex items-center gap-1.5">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Действует до</label>
                  <input type="date" className="w-full px-3 py-2 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Причина</label>
                  <textarea className="w-full px-3 py-2 border border-stone-300 rounded-lg h-20" placeholder="Причина выдачи согласия..." />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={() => setShowCreateConsent(false)} className="flex-1 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">
                    Отмена
                  </button>
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Создать
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Request Modal */}
      {showCreateRequest && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowCreateRequest(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Запросить доступ</h2>
                <button onClick={() => setShowCreateRequest(false)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Scope</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                    <option value="household">Household</option>
                    <option value="entity">Entity</option>
                    <option value="account">Account</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Разрешения</label>
                  <div className="flex flex-wrap gap-2">
                    {['view', 'download', 'export', 'api'].map(p => (
                      <label key={p} className="flex items-center gap-1.5">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Причина запроса</label>
                  <textarea className="w-full px-3 py-2 border border-stone-300 rounded-lg h-20" placeholder="Зачем нужен доступ..." />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={() => setShowCreateRequest(false)} className="flex-1 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">
                    Отмена
                  </button>
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowCreateRoom(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">Создать Data Room</h2>
                <button onClick={() => setShowCreateRoom(false)} className="p-1 hover:bg-stone-100 rounded">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Название</label>
                  <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg" placeholder="Название комнаты" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Цель</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg">
                    <option value="audit">Аудит</option>
                    <option value="legal">Legal Due Diligence</option>
                    <option value="trustee_review">Trustee Review</option>
                    <option value="advisor_pack">Advisor Pack</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Истекает</label>
                  <input type="date" className="w-full px-3 py-2 border border-stone-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Описание</label>
                  <textarea className="w-full px-3 py-2 border border-stone-300 rounded-lg h-20" placeholder="Описание комнаты..." />
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={() => setShowCreateRoom(false)} className="flex-1 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">
                    Отмена
                  </button>
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Создать
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
