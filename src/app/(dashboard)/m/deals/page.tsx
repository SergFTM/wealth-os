'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { DlKpiStrip } from '@/modules/29-deals/ui/DlKpiStrip';
import { DlActionsBar } from '@/modules/29-deals/ui/DlActionsBar';
import { DlStageKanban } from '@/modules/29-deals/ui/DlStageKanban';
import { DlTransactionsTable } from '@/modules/29-deals/ui/DlTransactionsTable';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [corporateActions, setCorporateActions] = useState<any[]>([]);
  const [capitalEvents, setCapitalEvents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHelpDrawer, setShowHelpDrawer] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dealsRes, stagesRes, txRes, approvalsRes, actionsRes, eventsRes, docsRes] = await Promise.all([
        fetch('/api/collections/deals'),
        fetch('/api/collections/dealStages'),
        fetch('/api/collections/dealTransactions'),
        fetch('/api/collections/dealApprovals'),
        fetch('/api/collections/corporateActions'),
        fetch('/api/collections/capitalEvents'),
        fetch('/api/collections/dealDocuments')
      ]);

      if (dealsRes.ok) setDeals(await dealsRes.json());
      if (stagesRes.ok) setStages(await stagesRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
      if (approvalsRes.ok) setApprovals(await approvalsRes.json());
      if (actionsRes.ok) setCorporateActions(await actionsRes.json());
      if (eventsRes.ok) setCapitalEvents(await eventsRes.json());
      if (docsRes.ok) setDocuments(await docsRes.json());
    } catch (error) {
      console.error('Error loading deals data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = () => {
    setShowCreateModal(true);
  };

  const handleAddTransaction = () => {
    router.push('/m/deals/list?tab=transactions&action=create');
  };

  const handleAddCorporateAction = () => {
    router.push('/m/deals/list?tab=actions&action=create');
  };

  const handleAddCapitalEvent = () => {
    router.push('/m/deals/list?tab=events&action=create');
  };

  const handleRequestApproval = () => {
    router.push('/m/deals/list?tab=approvals&action=create');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-8 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Сделки</h1>
          <p className="text-sm text-slate-500 mt-1">
            Сделки, корпоративные действия и капитальные события
          </p>
        </div>
        <button
          onClick={() => setShowHelpDrawer(true)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <HelpCircle className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      {/* Disclaimer Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          <strong>Дисклеймер:</strong> Модуль ведет операционный учет сделок.
          Инвестиционные решения требуют подтверждения уполномоченным инвестиционным менеджером.
        </p>
      </div>

      {/* KPI Strip */}
      <DlKpiStrip
        deals={deals}
        transactions={transactions}
        approvals={approvals}
        corporateActions={corporateActions}
        capitalEvents={capitalEvents}
        documents={documents}
      />

      {/* Actions Bar */}
      <DlActionsBar
        onCreateDeal={handleCreateDeal}
        onAddTransaction={handleAddTransaction}
        onAddCorporateAction={handleAddCorporateAction}
        onAddCapitalEvent={handleAddCapitalEvent}
        onRequestApproval={handleRequestApproval}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Kanban */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-900">Pipeline сделок</h2>
            <button
              onClick={() => router.push('/m/deals/list?tab=pipeline')}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Показать все →
            </button>
          </div>
          <DlStageKanban deals={deals} stages={stages} compact />
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-slate-900">Недавние транзакции</h2>
            <button
              onClick={() => router.push('/m/deals/list?tab=transactions')}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Все →
            </button>
          </div>
          <DlTransactionsTable transactions={transactions} deals={deals} compact />
        </div>
      </div>

      {/* Create Deal Modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Создать сделку">
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          const newDeal = {
            id: `deal-${Date.now()}`,
            clientId: 'demo',
            dealNumber: `DL-${new Date().getFullYear()}-${String(deals.length + 1).padStart(4, '0')}`,
            name: formData.get('name'),
            assetType: formData.get('assetType'),
            stageId: 'stage-1',
            status: 'active',
            estimatedValue: Number(formData.get('estimatedValue')) || 0,
            currency: formData.get('currency') || 'USD',
            expectedCloseAt: formData.get('expectedCloseAt'),
            ownerUserId: 'user-1',
            counterparty: formData.get('counterparty'),
            description: formData.get('description'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          try {
            const res = await fetch('/api/collections/deals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newDeal)
            });
            if (res.ok) {
              setShowCreateModal(false);
              loadData();
            }
          } catch (error) {
            console.error('Error creating deal:', error);
          }
        }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Название *</label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Название сделки"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Тип актива *</label>
              <select
                name="assetType"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="private-equity">Private Equity</option>
                <option value="venture">Venture</option>
                <option value="real-estate">Real Estate</option>
                <option value="public">Public</option>
                <option value="debt">Debt</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Оценка</label>
              <input
                name="estimatedValue"
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Валюта</label>
              <select
                name="currency"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Дата закрытия</label>
              <input
                name="expectedCloseAt"
                type="date"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Контрагент</label>
            <input
              name="counterparty"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Название контрагента"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Описание</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Описание сделки"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700"
            >
              Создать
            </button>
          </div>
        </form>
      </Modal>

      {/* Help Drawer */}
      <Drawer open={showHelpDrawer} onClose={() => setShowHelpDrawer(false)} title="Справка: Сделки">
        <div className="prose prose-sm prose-slate max-w-none">
          <h3>Что это?</h3>
          <p>
            Модуль <strong>Сделки</strong> обеспечивает полный операционный учет инвестиционных сделок,
            корпоративных действий и капитальных событий.
          </p>

          <h3>Типы записей</h3>
          <ul>
            <li><strong>Сделки (Deals)</strong> — покупка/продажа долей в private assets</li>
            <li><strong>Транзакции</strong> — отдельные финансовые операции</li>
            <li><strong>Корпоративные действия</strong> — дивиденды, сплиты, слияния</li>
            <li><strong>Капитальные события</strong> — capital calls, distributions</li>
          </ul>

          <h3>Pipeline сделок</h3>
          <p>Каждая сделка проходит стадии:</p>
          <ol>
            <li>Sourcing — поиск</li>
            <li>Screening — скрининг</li>
            <li>IC Review — комитет</li>
            <li>Legal — юридическая</li>
            <li>Closing — закрытие</li>
            <li>Post-close — пост-закрытие</li>
            <li>Closed — завершено</li>
          </ol>

          <h3>Влияние на капитал</h3>
          <p>
            Каждая транзакция влияет на Net Worth, GL и Performance.
            Панель Impact показывает планируемые проводки и дельту.
          </p>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-700 text-sm">
              <strong>⚠️ Дисклеймер:</strong> Модуль ведет операционный учет сделок.
              Инвестиционные решения требуют подтверждения уполномоченным инвестиционным менеджером.
            </p>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
