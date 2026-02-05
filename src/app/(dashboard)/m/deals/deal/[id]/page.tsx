'use client';

import { useState, useEffect, use } from 'react';
import { DlDealDetail } from '@/modules/29-deals/ui/DlDealDetail';

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [deal, setDeal] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [dealRes, stagesRes, txRes, approvalsRes, docsRes, auditRes] = await Promise.all([
        fetch(`/api/collections/deals/${id}`),
        fetch('/api/collections/dealStages'),
        fetch('/api/collections/dealTransactions'),
        fetch('/api/collections/dealApprovals'),
        fetch('/api/collections/dealDocuments'),
        fetch('/api/collections/auditEvents')
      ]);

      if (dealRes.ok) setDeal(await dealRes.json());
      if (stagesRes.ok) setStages(await stagesRes.json());
      if (txRes.ok) {
        const allTx = await txRes.json();
        setTransactions(allTx.filter((t: any) => t.dealId === id));
      }
      if (approvalsRes.ok) {
        const allApprovals = await approvalsRes.json();
        setApprovals(allApprovals.filter((a: any) => a.dealId === id));
      }
      if (docsRes.ok) {
        const allDocs = await docsRes.json();
        setDocuments(allDocs.filter((d: any) => d.dealId === id));
      }
      if (auditRes.ok) {
        const allAudit = await auditRes.json();
        setAuditEvents(allAudit.filter((e: any) => e.recordId === id));
      }
    } catch (error) {
      console.error('Error loading deal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-24 bg-slate-200 rounded-xl"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-slate-900">Сделка не найдена</h2>
          <p className="text-slate-500 mt-2">Сделка с ID {id} не существует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DlDealDetail
        deal={deal}
        transactions={transactions}
        approvals={approvals}
        documents={documents}
        stages={stages}
        auditEvents={auditEvents}
      />
    </div>
  );
}
