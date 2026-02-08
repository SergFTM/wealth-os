export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryOptions {
  search?: string;
  status?: string;
  clientId?: string;
  entityId?: string;
  portfolioId?: string;
  accountId?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditEvent {
  id: string;
  ts: string;
  actorRole: string;
  actorName: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'view' | 'share' | 'revoke';
  collection: string;
  recordId: string;
  summary: string;
  scope?: string;
  severity?: 'info' | 'warning' | 'critical';
  details?: Record<string, unknown>;
}

export interface StorageAdapter {
  list<T extends BaseRecord>(collection: string, query?: QueryOptions): Promise<T[]>;
  get<T extends BaseRecord>(collection: string, id: string): Promise<T | null>;
  create<T extends BaseRecord>(collection: string, record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update<T extends BaseRecord>(collection: string, id: string, patch: Partial<T>): Promise<T | null>;
  remove(collection: string, id: string): Promise<boolean>;
  appendAudit(event: Omit<AuditEvent, 'id' | 'ts'>): Promise<AuditEvent>;
  getAuditEvents(recordId: string): Promise<AuditEvent[]>;
  count(collection: string, query?: QueryOptions): Promise<number>;
}

// Single source of truth: array drives both runtime validation and the Collection type.
export const ALL_COLLECTIONS = [
  // Core
  'clients', 'entities', 'portfolios', 'accounts', 'documents',
  'tasks', 'approvals', 'breaches', 'alerts', 'invoices',
  'payments', 'syncJobs', 'dataQualityIssues', 'messages', 'threads',
  'accessReviews', 'auditEvents', 'connections',
  // Legacy / cross-module
  'reports', 'glEntries', 'partnerships', 'capitalCalls', 'distributions',
  'cashflows', 'ipsRules', 'riskAlerts', 'sessions',
  // Private Capital (M08)
  'pcFunds', 'pcCommitments', 'pcCapitalCalls', 'pcDistributions',
  'pcValuations', 'pcVintageMetrics', 'pcForecasts',
  // Liquidity (M09)
  'cashAccounts', 'cashMovements', 'cashForecast', 'obligations',
  'liquidityAlerts', 'liquidityBuckets',
  // Document Vault (M10)
  'documentVersions', 'documentLinks', 'evidencePacks', 'docShares', 'docTags',
  // Onboarding & Compliance (M15)
  'onboardingCases', 'intakeForms', 'beneficialOwners',
  'screeningChecks', 'riskScores', 'complianceTasks',
  // IPS & Constraints (M16)
  'ipsPolicies', 'ipsVersions', 'ipsConstraints', 'ipsBreaches',
  'ipsWaivers', 'committeeMeetings', 'committeeDecisions',
  // Risk Oversight (M17)
  'riskExposures', 'riskConcentrations', 'riskMetrics',
  'stressScenarios', 'stressRuns', 'riskActions',
  // Tax Center (M18)
  'taxLots', 'taxGains', 'taxHarvesting', 'taxDeadlines',
  'taxAdvisorPacks', 'taxProfiles',
  // Trust & Estate (M19)
  'trusts', 'beneficiaries', 'trustees', 'trustDistributions',
  'trustEvents', 'trustCalendars', 'trustPowers',
  // Fee Billing (M13)
  'feeContracts', 'feeSchedules', 'feeRuns', 'feeInvoices',
  'arPayments', 'feePolicies',
  // Data Integrations Hub (M14/M20)
  'connectors', 'connectorCredentials', 'syncRuns', 'mappings',
  'reconciliations', 'errorLogs',
  // Secure Communications (M15/M21)
  'commThreads', 'commMessages', 'commParticipants',
  'commAttachments', 'commSlaPolicies', 'commThreadPins',
  // AI Advisory Layer (M16/M20)
  'aiEvents', 'aiNarratives', 'aiDrafts',
  'aiTriageItems', 'aiFeedback', 'aiPolicies',
  // Security Center (M21)
  'users', 'roles', 'groups', 'permissions', 'roleBindings',
  'mfaEnrollments', 'reviewAttestations', 'securityIncidents',
  'auditLogViews', 'securitySettings',
  // Platform Shell (M22)
  'savedViews', 'demoScenarios', 'demoSeeds', 'notifications',
  // Reporting Studio (M23)
  'reportPacks', 'reportPackSections', 'reportTemplates',
  'reportExports', 'reportShares', 'reportLibraryItems',
  // Deals & Corporate Actions (M29)
  'deals', 'dealStages', 'dealTransactions',
  'corporateActions', 'capitalEvents', 'dealApprovals', 'dealDocuments',
  // Academy & Knowledge Base (M32)
  'kbArticles', 'kbCourses', 'kbLessons', 'kbChecklists',
  'kbChecklistRuns', 'kbFaq', 'kbPolicies', 'kbTags',
  // Integration Sandbox (M33)
  'sbEnvironments', 'sbDatasets', 'sbConnectors', 'sbSyncJobs',
  'sbPayloads', 'sbMappings', 'sbReplayRuns', 'sbLogs',
  // Consents & Data Sharing (M34)
  'consents', 'accessRequests', 'sharingPolicies',
  'dataRooms', 'dataRoomItems', 'revocations',
  // Notifications & Escalations (M35)
  'notificationRules', 'escalations', 'digests',
  'notificationTemplates', 'notificationChannels', 'userNotificationPrefs',
  // Service Desk & Cases (M36)
  'cases', 'caseComments', 'caseLinks', 'caseTemplates',
  'slaPolicies', 'caseReports',
  // Exports & Audit Packs (M37)
  'exportPacks', 'exportTemplates', 'exportRuns',
  'exportFiles', 'exportShares', 'exportSchedules',
  // Investment Ideas & Research Hub (M38)
  'ideas', 'watchlists', 'watchlistItems',
  'researchNotes', 'ideaMemos', 'ideaOutcomes',
  // Liquidity Planning & Cash Forecast (M39)
  'cashPositions', 'cashForecasts', 'cashFlows', 'cashScenarios', 'cashStressTests',
  // Family Governance (M40)
  'gvMeetings', 'gvAgendaItems', 'gvDecisions', 'gvVotes',
  'gvPolicies', 'gvActionItems', 'gvMinutes',
  // Calendar and Meetings (M41)
  'calendarEvents', 'meetingAgenda', 'meetingNotes',
  'meetingActionItems', 'calendarIntegrations',
  // Deals and Corporate Actions (M42)
  'dlCorporateActions', 'dlPrivateDeals', 'dlFundEvents',
  'dlChecklists', 'dlApprovals', 'dlDocs',
  // Vendors and Service Providers (M43)
  'vdVendors', 'vdContracts', 'vdSlas',
  'vdScorecards', 'vdIncidents', 'vdInvoices',
  // Policies and SOP Center (M44)
  'plPolicies', 'plSops', 'plVersions',
  'plAcknowledgements', 'plChecklists', 'plLinks',
  // Client Portal (M45)
  'ptPortalUsers', 'ptPortalDocuments', 'ptPortalPacks',
  'ptPortalRequests', 'ptPortalThreads', 'ptPortalEvents',
  'ptPortalMinutes', 'ptPortalConsents', 'ptPortalPreferences',
  'ptPortalKpis', 'ptPortalPerformance',
  // Master Data Management (M46)
  'mdmPeople', 'mdmEntities', 'mdmAccounts', 'mdmAssets',
  'mdmDuplicates', 'mdmMergeJobs', 'mdmStewardQueue', 'mdmRules',
  // Ownership Map (M47)
  'ownershipNodes', 'ownershipLinks', 'ownershipUbo',
  'ownershipChanges', 'ownershipViews',
  // Exception Center (M48)
  'exceptions', 'exceptionClusters', 'exceptionRules', 'exceptionSlaPolicies',
  // Philanthropy (M49)
  'philEntities', 'philPrograms', 'philGrants', 'philPayouts',
  'philBudgets', 'philImpactReports', 'philComplianceChecks',
  // Credit and Banking (M50)
  'creditBanks', 'creditFacilities', 'creditLoans', 'creditCollateral',
  'creditCovenants', 'creditPayments', 'creditSchedules', 'creditCalendar',
  // Data Governance (M51)
  'dataKpis', 'dataLineage', 'dataQualityScores',
  'dataReconciliations', 'dataOverrides', 'dataGovernanceRules',
  // Advisor Packs (M52)
  'packTemplates', 'packItems', 'packShares', 'packApprovals', 'packDownloads',
  // Relationship Hub (M53)
  'relHouseholds', 'relRelationships', 'relInteractions',
  'relInitiatives', 'relCoverage', 'relVipViews',
  // Consent & Privacy Center (M54)
  'consentRequests', 'privacyPolicies', 'consentConflicts',
  // Client Portal & Client Safe Experience (M55)
  'portalUsers', 'portalSessions', 'portalViews', 'portalRequests', 'portalAnnouncements',
] as const;

export type Collection = (typeof ALL_COLLECTIONS)[number];
