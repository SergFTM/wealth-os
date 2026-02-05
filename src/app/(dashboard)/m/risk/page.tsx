"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RkDashboardPage } from '@/modules/14-risk/ui';

interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface Exposure extends BaseRecord {
  portfolioId: string;
  dimension: string;
  segment: string;
  exposure: number;
  benchmark: number;
  deviation: number;
  marketValue: number;
  asOfDate: string;
}

interface StressScenario extends BaseRecord {
  name: string;
  type: 'historical' | 'hypothetical';
  severity: 'moderate' | 'severe';
  status: 'active' | 'draft';
  lastRunDate: string | null;
  frequency: string;
}

interface StressRun extends BaseRecord {
  scenarioId: string;
  scenarioName: string;
  portfolioId: string;
  runDate: string;
  status: 'completed' | 'running' | 'failed';
  portfolioImpact: number | null;
  varBreached: boolean | null;
}

interface RiskAlert extends BaseRecord {
  portfolioId: string;
  title: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'resolved';
  triggeredAt: string;
  description: string;
  currentValue: number | null;
  threshold: number | null;
  unit: string | null;
  source: string;
  assignedTo: string | null;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

export default function RiskDashboardPage() {
  const router = useRouter();
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [scenarios, setScenarios] = useState<StressScenario[]>([]);
  const [stressRuns, setStressRuns] = useState<StressRun[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exposuresRes, scenariosRes, stressRunsRes, alertsRes] = await Promise.all([
          fetch('/api/collections/riskExposures'),
          fetch('/api/collections/stressScenarios'),
          fetch('/api/collections/stressRuns'),
          fetch('/api/collections/riskAlerts'),
        ]);

        const [exposuresData, scenariosData, stressRunsData, alertsData] = await Promise.all([
          exposuresRes.json(),
          scenariosRes.json(),
          stressRunsRes.json(),
          alertsRes.json(),
        ]);

        setExposures(exposuresData.items || []);
        setScenarios(scenariosData.items || []);
        setStressRuns(stressRunsData.items || []);
        setAlerts(alertsData.items || []);
      } catch (error) {
        console.error('Failed to fetch risk data:', error);
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
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-stone-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-stone-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <RkDashboardPage
        exposures={exposures}
        scenarios={scenarios}
        stressRuns={stressRuns}
        alerts={alerts}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
