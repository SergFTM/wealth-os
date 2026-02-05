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
  'corporateActions', 'capitalEvents', 'dealApprovals', 'dealDocuments'
];

type RouteParams = Promise<{ collection: string; id: string }>;

export async function GET(_request: NextRequest, { params }: { params: RouteParams }) {
  const { collection, id } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const record = await storage.get(collection, id);
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(record);
}

export async function PATCH(request: NextRequest, { params }: { params: RouteParams }) {
  const { collection, id } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const body = await request.json();
  const record = await storage.update(collection, id, body);
  
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await storage.appendAudit({
    actorRole: 'admin',
    actorName: 'System',
    action: 'update',
    collection,
    recordId: id,
    summary: `Updated ${collection} record`,
  });

  return NextResponse.json(record);
}

export async function DELETE(_request: NextRequest, { params }: { params: RouteParams }) {
  const { collection, id } = await params;
  
  if (!VALID_COLLECTIONS.includes(collection as Collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
  }

  await ensureSeedOnce();
  const storage = getStorage();

  const deleted = await storage.remove(collection, id);
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await storage.appendAudit({
    actorRole: 'admin',
    actorName: 'System',
    action: 'delete',
    collection,
    recordId: id,
    summary: `Deleted ${collection} record`,
  });

  return NextResponse.json({ success: true });
}
