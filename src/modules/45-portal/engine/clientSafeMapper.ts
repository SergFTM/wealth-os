// Module 45: Client Safe Mapper - Transforms internal data to client-safe summaries

import {
  NetWorthSummary,
  PortfolioSummary,
  PerformanceSummary,
  LiquiditySummary,
  PortalDocument,
  PortalPack,
  PortalRequest,
  PortalThread,
  PortalEvent,
  PortalMinutes,
  PortalConsent,
  PortalKpis,
  RequestStatusKey,
  PortalDocTypeKey,
} from '../types';

// Mask sensitive account numbers
export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 4) return '****';
  return '****' + accountNumber.slice(-4);
}

// Format currency for display (client-safe, no raw cents)
export function formatCurrencySafe(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Map internal net worth snapshot to client-safe summary
export function mapNetWorthToClientSafe(internalData: {
  snapshots: Array<{
    id: string;
    totalValue: number;
    asOfDate: string;
    breakdown: Array<{ assetClass: string; value: number }>;
    sources: string[];
  }>;
  previousSnapshot?: { totalValue: number };
}): NetWorthSummary {
  const latest = internalData.snapshots[0];
  if (!latest) {
    return {
      total: 0,
      change30d: 0,
      changePercent30d: 0,
      asOfDate: new Date().toISOString(),
      byAssetClass: [],
      sources: [],
    };
  }

  const total = latest.totalValue;
  const previousTotal = internalData.previousSnapshot?.totalValue || total;
  const change30d = total - previousTotal;
  const changePercent30d = previousTotal > 0 ? (change30d / previousTotal) * 100 : 0;

  const byAssetClass = latest.breakdown.map(item => ({
    name: item.assetClass,
    value: item.value,
    percent: total > 0 ? (item.value / total) * 100 : 0,
  }));

  return {
    total,
    change30d,
    changePercent30d,
    asOfDate: latest.asOfDate,
    byAssetClass,
    sources: latest.sources || ['Consolidated View'],
  };
}

// Map internal portfolio to client-safe summary
export function mapPortfolioToClientSafe(internalPortfolio: {
  id: string;
  name: string;
  custodian: string;
  accountNumber: string;
  totalValue: number;
  holdings: Array<{ assetClass: string; value: number }>;
}): PortfolioSummary {
  const totalValue = internalPortfolio.totalValue;

  const allocation = internalPortfolio.holdings.map(h => ({
    assetClass: h.assetClass,
    value: h.value,
    percent: totalValue > 0 ? (h.value / totalValue) * 100 : 0,
  }));

  return {
    id: internalPortfolio.id,
    name: internalPortfolio.name,
    custodian: internalPortfolio.custodian,
    value: totalValue,
    allocation,
    accountNumberMasked: maskAccountNumber(internalPortfolio.accountNumber),
  };
}

// Map internal performance to client-safe summary
export function mapPerformanceToClientSafe(internalData: {
  periods: Array<{
    periodLabel: string;
    portfolioReturn: number;
    benchmarkReturn?: number;
  }>;
  asOfDate: string;
  benchmarkName?: string;
}): PerformanceSummary {
  return {
    periods: internalData.periods.map(p => ({
      period: p.periodLabel,
      return: p.portfolioReturn,
      benchmark: p.benchmarkReturn,
    })),
    asOfDate: internalData.asOfDate,
    benchmarkName: internalData.benchmarkName,
  };
}

// Map internal liquidity forecast to client-safe summary
export function mapLiquidityToClientSafe(internalData: {
  currentCash: number;
  forecast30d: number;
  forecast90d: number;
  projectedInflows: number;
  projectedOutflows: number;
  alerts: Array<{ severity: string; message: string }>;
  asOfDate: string;
}): LiquiditySummary {
  return {
    cashToday: internalData.currentCash,
    cashForecast30d: internalData.forecast30d,
    cashForecast90d: internalData.forecast90d,
    inflows30d: internalData.projectedInflows,
    outflows30d: internalData.projectedOutflows,
    alerts: internalData.alerts
      .filter(a => a.severity !== 'internal')
      .map(a => ({
        type: a.severity === 'warning' ? 'warning' : 'info',
        message: a.message,
      })),
    asOfDate: internalData.asOfDate,
  };
}

// Map internal document to client-safe document
export function mapDocumentToClientSafe(internalDoc: {
  id: string;
  title: string;
  documentType: string;
  tags: string[];
  publishedAt: string;
  publishedBy: string;
  fileUrl: string;
  fileSize: number;
  clientSafePublished: boolean;
  internalNotes?: string;
}): PortalDocument | null {
  if (!internalDoc.clientSafePublished) return null;

  return {
    id: internalDoc.id,
    title: internalDoc.title,
    type: internalDoc.documentType as PortalDocTypeKey,
    tags: internalDoc.tags.filter(t => !t.startsWith('internal:')),
    publishedAt: internalDoc.publishedAt,
    publishedBy: internalDoc.publishedBy,
    fileUrl: internalDoc.fileUrl,
    fileSize: internalDoc.fileSize,
    clientSafePublished: true,
  };
}

// Map export share to client-safe pack
export function mapExportShareToPack(exportShare: {
  id: string;
  title: string;
  description: string;
  documentIds: string[];
  createdAt: string;
  expiresAt?: string;
  accessCode?: string;
}): PortalPack {
  return {
    id: exportShare.id,
    title: exportShare.title,
    description: exportShare.description,
    documentIds: exportShare.documentIds,
    documentCount: exportShare.documentIds.length,
    createdAt: exportShare.createdAt,
    expiresAt: exportShare.expiresAt,
    accessCode: exportShare.accessCode,
  };
}

// Map internal case to client-safe request
export function mapCaseToRequest(internalCase: {
  id: string;
  caseNumber: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  updates: Array<{ text: string; isClientVisible: boolean; timestamp: string }>;
  attachmentIds: string[];
  createdAt: string;
  updatedAt: string;
  sourceType: string;
  internalNotes?: string;
}): PortalRequest | null {
  // Only show cases created from portal or marked client visible
  if (internalCase.sourceType !== 'portal') return null;

  const clientSafeUpdates = internalCase.updates
    .filter(u => u.isClientVisible)
    .map(u => `[${new Date(u.timestamp).toLocaleDateString('ru-RU')}] ${u.text}`);

  return {
    id: internalCase.id,
    number: internalCase.caseNumber,
    category: internalCase.category as any,
    subject: internalCase.subject,
    description: internalCase.description,
    status: mapCaseStatus(internalCase.status),
    clientSafeUpdates,
    attachmentIds: internalCase.attachmentIds,
    createdAt: internalCase.createdAt,
    updatedAt: internalCase.updatedAt,
  };
}

// Map case status to portal request status
function mapCaseStatus(caseStatus: string): RequestStatusKey {
  const statusMap: Record<string, RequestStatusKey> = {
    'new': 'open',
    'open': 'open',
    'in_progress': 'in_progress',
    'pending_client': 'awaiting_client',
    'awaiting_client': 'awaiting_client',
    'resolved': 'closed',
    'closed': 'closed',
  };
  return statusMap[caseStatus] || 'open';
}

// Map internal thread to client-safe thread
export function mapThreadToClientSafe(internalThread: {
  id: string;
  subject: string;
  threadType: string;
  participants: Array<{ name: string; role: string }>;
  messages: Array<{
    id: string;
    senderName: string;
    senderRole: string;
    content: string;
    isInternalNote: boolean;
    attachmentIds: string[];
    sentAt: string;
    isClientMessage: boolean;
  }>;
  lastMessageAt: string;
  unreadCount: number;
}): PortalThread {
  return {
    id: internalThread.id,
    subject: internalThread.subject,
    type: internalThread.threadType as any,
    participantNames: internalThread.participants.map(p => p.name),
    lastMessageAt: internalThread.lastMessageAt,
    unreadCount: internalThread.unreadCount,
    messages: internalThread.messages
      .filter(m => !m.isInternalNote)
      .map(m => ({
        id: m.id,
        senderName: m.senderName,
        senderRole: m.senderRole,
        content: m.content,
        attachmentIds: m.attachmentIds,
        sentAt: m.sentAt,
        isClientMessage: m.isClientMessage,
      })),
  };
}

// Map calendar event to client-safe event
export function mapEventToClientSafe(internalEvent: {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  eventType: string;
  clientSafeVisible: boolean;
  internalNotes?: string;
}): PortalEvent | null {
  if (!internalEvent.clientSafeVisible) return null;

  return {
    id: internalEvent.id,
    title: internalEvent.title,
    date: internalEvent.date,
    time: internalEvent.time,
    location: internalEvent.location,
    description: internalEvent.description,
    type: internalEvent.eventType,
    clientSafeVisible: true,
  };
}

// Map governance minutes to client-safe minutes
export function mapMinutesToClientSafe(internalMinutes: {
  id: string;
  meetingTitle: string;
  meetingDate: string;
  summaryPublic: string;
  summaryInternal?: string;
  decisions: Array<{ text: string; isPublic: boolean }>;
  publishedAt: string;
  clientSafePublished: boolean;
}): PortalMinutes | null {
  if (!internalMinutes.clientSafePublished) return null;

  return {
    id: internalMinutes.id,
    meetingTitle: internalMinutes.meetingTitle,
    meetingDate: internalMinutes.meetingDate,
    summary: internalMinutes.summaryPublic,
    decisions: internalMinutes.decisions
      .filter(d => d.isPublic)
      .map(d => d.text),
    publishedAt: internalMinutes.publishedAt,
    clientSafePublished: true,
  };
}

// Map consent record to client-safe consent
export function mapConsentToClientSafe(internalConsent: {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorOrganization: string;
  grantedScopes: string[];
  grantedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  status: string;
}): PortalConsent {
  let status: 'active' | 'revoked' | 'expired' = 'active';
  if (internalConsent.revokedAt) {
    status = 'revoked';
  } else if (internalConsent.expiresAt && new Date(internalConsent.expiresAt) < new Date()) {
    status = 'expired';
  }

  return {
    id: internalConsent.id,
    advisorName: internalConsent.advisorName,
    advisorOrg: internalConsent.advisorOrganization,
    scopes: internalConsent.grantedScopes as any[],
    grantedAt: internalConsent.grantedAt,
    expiresAt: internalConsent.expiresAt,
    status,
  };
}

// Compute portal KPIs from various sources
export function computePortalKpis(data: {
  netWorth?: NetWorthSummary;
  performance?: PerformanceSummary;
  liquidity?: LiquiditySummary;
  requests?: PortalRequest[];
  documents?: PortalDocument[];
  events?: PortalEvent[];
}): PortalKpis {
  const ytdPerformance = data.performance?.periods.find(p => p.period === 'YTD');
  const openRequests = data.requests?.filter(r => r.status !== 'closed').length || 0;

  // Count documents from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newDocuments = data.documents?.filter(
    d => new Date(d.publishedAt) >= thirtyDaysAgo
  ).length || 0;

  // Find next meeting
  const futureEvents = (data.events || [])
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextMeeting = futureEvents[0];

  return {
    netWorth: data.netWorth?.total || 0,
    netWorthChange: data.netWorth?.change30d || 0,
    performanceYtd: ytdPerformance?.return || 0,
    cashToday: data.liquidity?.cashToday || 0,
    openRequests,
    newDocuments,
    nextMeetingDate: nextMeeting?.date,
    nextMeetingTitle: nextMeeting?.title,
  };
}

// Batch mapper for collections
export function mapCollectionToClientSafe<TIn, TOut>(
  items: TIn[],
  mapper: (item: TIn) => TOut | null
): TOut[] {
  return items
    .map(mapper)
    .filter((item): item is TOut => item !== null);
}
