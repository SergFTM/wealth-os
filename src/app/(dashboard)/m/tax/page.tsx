"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TxDashboardPage } from '@/modules/15-tax/ui';

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

export default function TaxDashboardPage() {
  const router = useRouter();
  const [lots, setLots] = useState<TaxLot[]>([]);
  const [gains, setGains] = useState<TaxGain[]>([]);
  const [deadlines, setDeadlines] = useState<TaxDeadline[]>([]);
  const [harvesting, setHarvesting] = useState<HarvestingOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotsRes, gainsRes, deadlinesRes, harvestingRes] = await Promise.all([
          fetch('/api/collections/taxLots'),
          fetch('/api/collections/taxGains'),
          fetch('/api/collections/taxDeadlines'),
          fetch('/api/collections/taxHarvesting'),
        ]);

        const [lotsData, gainsData, deadlinesData, harvestingData] = await Promise.all([
          lotsRes.json(),
          gainsRes.json(),
          deadlinesRes.json(),
          harvestingRes.json(),
        ]);

        setLots(lotsData.items || []);
        setGains(gainsData.items || []);
        setDeadlines(deadlinesData.items || []);
        setHarvesting(harvestingData.items || []);
      } catch (error) {
        console.error('Failed to fetch tax data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-stone-200 rounded w-1/4" />
          <div className="h-4 bg-stone-200 rounded w-1/3" />
          <div className="h-16 bg-amber-100 rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-stone-200 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 bg-stone-200 rounded-xl" />
            <div className="h-64 bg-stone-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TxDashboardPage
        lots={lots}
        gains={gains}
        deadlines={deadlines}
        harvesting={harvesting}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
