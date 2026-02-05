"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calculator, TrendingUp, Leaf, Calendar, FileText, File, ArrowLeft } from 'lucide-react';
import { TxLotsTable } from '@/modules/15-tax/ui/TxLotsTable';
import { TxGainsTable } from '@/modules/15-tax/ui/TxGainsTable';
import { TxHarvestingPanel } from '@/modules/15-tax/ui/TxHarvestingPanel';
import { TxDeadlinesTable } from '@/modules/15-tax/ui/TxDeadlinesTable';
import { TxAdvisorPacksTable } from '@/modules/15-tax/ui/TxAdvisorPacksTable';
import { TxActionsBar } from '@/modules/15-tax/ui/TxActionsBar';

interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface TaxLot extends BaseRecord {
  portfolioId: string;
  symbol: string;
  assetName: string;
  assetClass: string;
  quantity: number;
  costBasis: number;
  costBasisPerShare: number;
  currentValue: number;
  currentPrice: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  term: 'short' | 'long';
  holdingDays: number;
  acquisitionDate: string;
  taxRate: number;
  estimatedTax: number;
  lotStatus: 'active' | 'partial' | 'closed';
  currency: string;
}

interface TaxGain extends BaseRecord {
  lotId: string;
  portfolioId: string;
  symbol: string;
  assetName: string;
  eventType: 'sell' | 'dividend' | 'coupon' | 'distribution';
  eventDate: string;
  quantity: number;
  proceeds: number;
  costBasis: number;
  realizedPL: number;
  term: 'short' | 'long';
  holdingDays: number;
  taxRate: number;
  taxAmount: number;
  currency: string;
  settlementDate: string;
  reportedToIrs: boolean;
}

interface TaxDeadline extends BaseRecord {
  profileId: string;
  title: string;
  type: 'filing' | 'payment';
  jurisdiction: string;
  dueDate: string;
  status: 'overdue' | 'pending' | 'in_progress' | 'completed';
  amount: number | null;
  currency: string;
  description: string;
  penaltyRate: number | null;
  reminderDays: number[];
  assignedTo: string;
  completedAt: string | null;
  notes: string | null;
  linkedDocuments: string[];
}

interface HarvestingOpportunity extends BaseRecord {
  lotId: string;
  portfolioId: string;
  symbol: string;
  assetName: string;
  quantity: number;
  costBasis: number;
  currentValue: number;
  unrealizedLoss: number;
  term: 'short' | 'long';
  holdingDays: number;
  potentialSavings: number;
  taxRate: number;
  suggestedAction: 'sell' | 'hold';
  replacementSuggestion: string | null;
  washSaleRisk: boolean;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewing' | 'approved' | 'executed' | 'declined';
  notes: string | null;
}

interface PackDocument {
  documentId: string;
  name: string;
  type: string;
  addedAt: string;
}

interface AdvisorPack extends BaseRecord {
  profileId: string;
  title: string;
  year: number;
  jurisdiction: string;
  status: 'draft' | 'locked' | 'shared' | 'completed';
  createdBy: string;
  advisorEmail: string | null;
  advisorName: string | null;
  documents: PackDocument[];
  notes: string | null;
  sharedAt: string | null;
  expiresAt: string | null;
  lockedAt: string | null;
}

const tabs = [
  { id: 'lots', label: 'Лоты', icon: Calculator },
  { id: 'gains', label: 'Реализации', icon: TrendingUp },
  { id: 'harvesting', label: 'Харвестинг', icon: Leaf },
  { id: 'deadlines', label: 'Дедлайны', icon: Calendar },
  { id: 'advisorPacks', label: 'Пакеты консультанта', icon: FileText },
  { id: 'documents', label: 'Документы', icon: File },
];

export default function TaxListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'lots';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);

  const [lots, setLots] = useState<TaxLot[]>([]);
  const [gains, setGains] = useState<TaxGain[]>([]);
  const [harvesting, setHarvesting] = useState<HarvestingOpportunity[]>([]);
  const [deadlines, setDeadlines] = useState<TaxDeadline[]>([]);
  const [advisorPacks, setAdvisorPacks] = useState<AdvisorPack[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          lotsRes,
          gainsRes,
          harvestingRes,
          deadlinesRes,
          advisorPacksRes,
        ] = await Promise.all([
          fetch('/api/collections/taxLots'),
          fetch('/api/collections/taxGains'),
          fetch('/api/collections/taxHarvesting'),
          fetch('/api/collections/taxDeadlines'),
          fetch('/api/collections/taxAdvisorPacks'),
        ]);

        const [
          lotsData,
          gainsData,
          harvestingData,
          deadlinesData,
          advisorPacksData,
        ] = await Promise.all([
          lotsRes.json(),
          gainsRes.json(),
          harvestingRes.json(),
          deadlinesRes.json(),
          advisorPacksRes.json(),
        ]);

        setLots(lotsData.items || []);
        setGains(gainsData.items || []);
        setHarvesting(harvestingData.items || []);
        setDeadlines(deadlinesData.items || []);
        setAdvisorPacks(advisorPacksData.items || []);
      } catch (error) {
        console.error('Failed to fetch tax data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/m/tax/list?tab=${tabId}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-stone-200 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/m/tax')}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Налоговые данные</h1>
            <p className="text-sm text-stone-500 mt-1">Детальный просмотр налоговой информации</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Actions Bar */}
      <TxActionsBar
        activeTab={activeTab}
        onCreateLot={() => console.log('Create lot')}
        onCreatePack={() => console.log('Create pack')}
        onExport={() => console.log('Export')}
        onRefresh={() => window.location.reload()}
      />

      {/* Content */}
      {activeTab === 'lots' && (
        <TxLotsTable
          lots={lots}
          onRowClick={(lot) => router.push(`/m/tax/item/${lot.id}?type=lot`)}
        />
      )}

      {activeTab === 'gains' && (
        <TxGainsTable
          gains={gains}
          onRowClick={(gain) => router.push(`/m/tax/item/${gain.id}?type=gain`)}
        />
      )}

      {activeTab === 'harvesting' && (
        <TxHarvestingPanel
          opportunities={harvesting}
          onSelect={(opp) => router.push(`/m/tax/item/${opp.lotId}?type=lot`)}
          onApprove={(id) => console.log('Approve:', id)}
          onDecline={(id) => console.log('Decline:', id)}
        />
      )}

      {activeTab === 'deadlines' && (
        <TxDeadlinesTable
          deadlines={deadlines}
          onRowClick={(deadline) => router.push(`/m/tax/item/${deadline.id}?type=deadline`)}
          onComplete={(id) => console.log('Complete:', id)}
          showCompleted={false}
        />
      )}

      {activeTab === 'advisorPacks' && (
        <TxAdvisorPacksTable
          packs={advisorPacks}
          onRowClick={(pack) => router.push(`/m/tax/item/${pack.id}?type=advisorPack`)}
          onCreateNew={() => console.log('Create new pack')}
        />
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
          <File className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <div className="text-lg font-medium text-stone-700 mb-2">Налоговые документы</div>
          <div>Документы отображаются из модуля Документы с фильтром по налоговой категории</div>
          <button
            onClick={() => router.push('/m/documents/list?category=tax')}
            className="mt-4 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Открыть документы
          </button>
        </div>
      )}
    </div>
  );
}
