import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/db/storage/getStorage';
import { ensureSeedOnce } from '@/db/storage/ensureSeed';
import { Collection } from '@/db/storage/storage.types';

const VALID_COLLECTIONS: Collection[] = [
  'clients', 'entities', 'portfolios', 'accounts', 'documents',
  'tasks', 'approvals', 'breaches', 'alerts', 'invoices',
  'payments', 'syncJobs', 'threads', 'messages', 'connections', 'auditEvents',
  // Private Capital collections
  'pcFunds', 'pcCommitments', 'pcCapitalCalls', 'pcDistributions', 
  'pcValuations', 'pcVintageMetrics', 'pcForecasts',
  // Liquidity collections
  'cashAccounts', 'cashMovements', 'cashForecast', 'obligations',
  'liquidityAlerts', 'liquidityBuckets',
  // Document Vault collections
  'documentVersions', 'documentLinks', 'evidencePacks', 'docShares', 'docTags',
  // Onboarding & Compliance collections
  'onboardingCases', 'intakeForms', 'beneficialOwners',
  'screeningChecks', 'riskScores', 'complianceTasks',
  // IPS & Constraints collections
  'ipsPolicies', 'ipsVersions', 'ipsConstraints', 'ipsBreaches',
  'ipsWaivers', 'committeeMeetings', 'committeeDecisions',
  // Risk Oversight collections
  'riskExposures', 'riskConcentrations', 'riskMetrics',
  'stressScenarios', 'stressRuns', 'riskAlerts', 'riskActions',
  // Tax Center collections
  'taxLots', 'taxGains', 'taxHarvesting', 'taxDeadlines',
  'taxAdvisorPacks', 'taxProfiles',
  // Trust & Estate collections
  'trusts', 'beneficiaries', 'trustees', 'trustDistributions',
  'trustEvents', 'trustCalendars', 'trustPowers',
  // Fee Billing & Invoicing collections
  'feeContracts', 'feeSchedules', 'feeRuns', 'feeInvoices',
  'arPayments', 'feePolicies',
  // Data Integrations Hub collections
  'connectors', 'connectorCredentials', 'syncRuns', 'mappings',
  'dataQualityIssues', 'reconciliations', 'errorLogs',
  // Secure Communications collections
  'commThreads', 'commMessages', 'commParticipants',
  'commAttachments', 'commSlaPolicies', 'commThreadPins',
  // AI Advisory Layer collections
  'aiEvents', 'aiNarratives', 'aiDrafts',
  'aiTriageItems', 'aiFeedback', 'aiPolicies',
  // Deals & Corporate Actions collections
  'deals', 'dealStages', 'dealTransactions',
  'corporateActions', 'capitalEvents', 'dealApprovals', 'dealDocuments',
  // Family Governance collections (Module 40)
  'gvMeetings', 'gvAgendaItems', 'gvDecisions', 'gvVotes',
  'gvPolicies', 'gvActionItems', 'gvMinutes',
  // Calendar and Meetings collections (Module 41)
  'calendarEvents', 'meetingAgenda', 'meetingNotes',
  'meetingActionItems', 'calendarIntegrations',
  // Deals and Corporate Actions collections (Module 42)
  'dlCorporateActions', 'dlPrivateDeals', 'dlFundEvents',
  'dlChecklists', 'dlApprovals', 'dlDocs',
  // Vendors and Service Providers collections (Module 43)
  'vdVendors', 'vdContracts', 'vdSlas',
  'vdScorecards', 'vdIncidents', 'vdInvoices',
  // Master Data Management collections (Module 46)
  'mdmPeople', 'mdmEntities', 'mdmAccounts', 'mdmAssets',
  'mdmDuplicates', 'mdmMergeJobs', 'mdmStewardQueue', 'mdmRules',
  // Exception Center collections (Module 48)
  'exceptions', 'exceptionClusters', 'exceptionRules', 'exceptionSlaPolicies',
  // Advisor Packs collections (Module 52)
  'reportPacks', 'packTemplates', 'packItems', 'packShares', 'packApprovals', 'packDownloads',
  // Relationship Hub collections (Module 53)
  'relHouseholds', 'relRelationships', 'relInteractions',
  'relInitiatives', 'relCoverage', 'relVipViews',
  // Consent & Privacy Center collections (Module 54)
  'consents', 'consentRequests', 'privacyPolicies', 'accessReviews', 'consentConflicts',
  // Client Portal & Client Safe Experience collections (Module 55)
  'portalUsers', 'portalSessions', 'portalViews', 'portalRequests', 'portalAnnouncements'
];

type RouteParams = Promise<{ collection: string }>;

export async function GET(request: NextRequest, { params }: { params: RouteParams }) {
  const { collection } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const { searchParams } = new URL(request.url);
  const query = {
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    clientId: searchParams.get('clientId') || undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    sortBy: searchParams.get('sortBy') || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  };

  const items = await storage.list(collection, query);
  const total = await storage.count(collection, query);

  return NextResponse.json({ items, total });
}

export async function POST(request: NextRequest, { params }: { params: RouteParams }) {
  const { collection } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const body = await request.json();
  const record = await storage.create(collection, body);
  
  await storage.appendAudit({
    actorRole: 'admin',
    actorName: 'System',
    action: 'create',
    collection,
    recordId: record.id,
    summary: `Created ${collection} record`,
  });

  return NextResponse.json(record, { status: 201 });
}
