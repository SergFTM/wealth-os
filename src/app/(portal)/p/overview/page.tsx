'use client';

import React, { useState, useEffect } from 'react';
import { useCollection } from '@/lib/hooks';
import {
  PortalPageHeader,
  POverview,
  PCopilotPanel,
} from '@/modules/45-portal';
import {
  PortalKpis,
  PortalRequest,
  PortalDocument,
  PortalThread,
  PortalEvent,
} from '@/modules/45-portal/types';
import {
  computePortalKpis,
  mapDocumentToClientSafe,
  mapCaseToRequest,
  mapThreadToClientSafe,
} from '@/modules/45-portal/engine';

export default function OverviewPage() {
  const [showCopilot, setShowCopilot] = useState(false);

  // Fetch data from collections
  const { data: documentsData } = useCollection('ptPortalDocuments');
  const { data: requestsData } = useCollection('ptPortalRequests');
  const { data: threadsData } = useCollection('ptPortalThreads');
  const { data: eventsData } = useCollection('ptPortalEvents');

  // Process data
  const documents: PortalDocument[] = (documentsData || [])
    .map((d: any) => mapDocumentToClientSafe(d))
    .filter(Boolean) as PortalDocument[];

  const requests: PortalRequest[] = (requestsData || [])
    .map((r: any) => mapCaseToRequest(r))
    .filter(Boolean) as PortalRequest[];

  const threads: PortalThread[] = (threadsData || [])
    .map((t: any) => mapThreadToClientSafe(t))
    .filter(Boolean) as PortalThread[];

  // Compute KPIs
  const kpis: PortalKpis = computePortalKpis({
    netWorth: {
      total: 15750000,
      change30d: 320000,
      changePercent30d: 2.1,
      asOfDate: new Date().toISOString(),
      byAssetClass: [],
      sources: ['Consolidated'],
    },
    performance: {
      periods: [{ period: 'YTD', return: 8.5 }],
      asOfDate: new Date().toISOString(),
    },
    liquidity: {
      cashToday: 1250000,
      cashForecast30d: 1180000,
      cashForecast90d: 1050000,
      inflows30d: 50000,
      outflows30d: 120000,
      alerts: [],
      asOfDate: new Date().toISOString(),
    },
    requests,
    documents,
    events: (eventsData as unknown as PortalEvent[]) || [],
  });

  return (
    <div>
      <PortalPageHeader
        title="Обзор"
        subtitle={`Добро пожаловать, Александр`}
      />
      <POverview
        kpis={kpis}
        recentRequests={requests.slice(0, 5)}
        recentDocuments={documents.slice(0, 5)}
        recentThreads={threads.slice(0, 5)}
        locale="ru"
        onAskCopilot={() => setShowCopilot(true)}
      />
    </div>
  );
}
