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

export type Collection = 
  | 'clients'
  | 'entities'
  | 'portfolios'
  | 'accounts'
  | 'documents'
  | 'tasks'
  | 'approvals'
  | 'breaches'
  | 'alerts'
  | 'invoices'
  | 'payments'
  | 'syncJobs'
  | 'dataQualityIssues'
  | 'messages'
  | 'threads'
  | 'accessReviews'
  | 'auditEvents'
  | 'taxLots'
  | 'trusts'
  | 'beneficiaries'
  | 'reports'
  | 'glEntries'
  | 'partnerships'
  | 'capitalCalls'
  | 'distributions'
  | 'cashflows'
  | 'ipsRules'
  | 'riskAlerts'
  | 'sessions'
  | 'connections'
  // Private Capital collections
  | 'pcFunds'
  | 'pcCommitments'
  | 'pcCapitalCalls'
  | 'pcDistributions'
  | 'pcValuations'
  | 'pcVintageMetrics'
  | 'pcForecasts'
  // Liquidity collections
  | 'cashAccounts'
  | 'cashMovements'
  | 'cashForecast'
  | 'obligations'
  | 'liquidityAlerts'
  | 'liquidityBuckets'
  // Document Vault collections
  | 'documentVersions'
  | 'documentLinks'
  | 'evidencePacks'
  | 'docShares'
  | 'docTags'
  // Onboarding & Compliance collections
  | 'onboardingCases'
  | 'intakeForms'
  | 'beneficialOwners'
  | 'screeningChecks'
  | 'riskScores'
  | 'complianceTasks'
  // IPS & Constraints collections
  | 'ipsPolicies'
  | 'ipsVersions'
  | 'ipsConstraints'
  | 'ipsBreaches'
  | 'ipsWaivers'
  | 'committeeMeetings'
  | 'committeeDecisions'
  // Risk Oversight collections
  | 'riskExposures'
  | 'riskConcentrations'
  | 'riskMetrics'
  | 'stressScenarios'
  | 'stressRuns'
  | 'riskActions'
  // Tax Center collections
  | 'taxLots'
  | 'taxGains'
  | 'taxHarvesting'
  | 'taxDeadlines'
  | 'taxAdvisorPacks'
  | 'taxProfiles'
  // Trust & Estate collections
  | 'trustees'
  | 'trustDistributions'
  | 'trustEvents'
  | 'trustCalendars'
  | 'trustPowers'
  // Fee Billing & Invoicing collections
  | 'feeContracts'
  | 'feeSchedules'
  | 'feeRuns'
  | 'feeInvoices'
  | 'arPayments'
  | 'feePolicies'
  // Data Integrations Hub collections
  | 'connectors'
  | 'connectorCredentials'
  | 'syncRuns'
  | 'mappings'
  | 'reconciliations'
  | 'errorLogs'
  // Secure Communications collections
  | 'commThreads'
  | 'commMessages'
  | 'commParticipants'
  | 'commAttachments'
  | 'commSlaPolicies'
  | 'commThreadPins'
  // AI Advisory Layer collections
  | 'aiEvents'
  | 'aiNarratives'
  | 'aiDrafts'
  | 'aiTriageItems'
  | 'aiFeedback'
  | 'aiPolicies'
  // Security Center collections
  | 'users'
  | 'roles'
  | 'groups'
  | 'permissions'
  | 'roleBindings'
  | 'mfaEnrollments'
  | 'reviewAttestations'
  | 'securityIncidents'
  | 'auditLogViews'
  | 'securitySettings'
  // Platform Shell collections
  | 'savedViews'
  | 'demoScenarios'
  | 'demoSeeds'
  | 'notifications'
  // Reporting Studio collections
  | 'reportPacks'
  | 'reportPackSections'
  | 'reportTemplates'
  | 'reportExports'
  | 'reportShares'
  | 'reportLibraryItems'
  // Deals & Corporate Actions collections
  | 'deals'
  | 'dealStages'
  | 'dealTransactions'
  | 'corporateActions'
  | 'capitalEvents'
  | 'dealApprovals'
  | 'dealDocuments'
  // Academy & Knowledge Base collections
  | 'kbArticles'
  | 'kbCourses'
  | 'kbLessons'
  | 'kbChecklists'
  | 'kbChecklistRuns'
  | 'kbFaq'
  | 'kbPolicies'
  | 'kbTags'
  // Integration Sandbox collections
  | 'sbEnvironments'
  | 'sbDatasets'
  | 'sbConnectors'
  | 'sbSyncJobs'
  | 'sbPayloads'
  | 'sbMappings'
  | 'sbReplayRuns'
  | 'sbLogs'
  // Consents & Data Sharing collections
  | 'consents'
  | 'accessRequests'
  | 'sharingPolicies'
  | 'dataRooms'
  | 'dataRoomItems'
  | 'revocations'
  // Notifications & Escalations collections
  | 'notificationRules'
  | 'escalations'
  | 'digests'
  | 'notificationTemplates'
  | 'notificationChannels'
  | 'userNotificationPrefs'
  // Service Desk & Cases collections
  | 'cases'
  | 'caseComments'
  | 'caseLinks'
  | 'caseTemplates'
  | 'slaPolicies'
  | 'caseReports'
  // Exports & Audit Packs collections
  | 'exportPacks'
  | 'exportTemplates'
  | 'exportRuns'
  | 'exportFiles'
  | 'exportShares'
  | 'exportSchedules'
  // Investment Ideas & Research Hub collections
  | 'ideas'
  | 'watchlists'
  | 'watchlistItems'
  | 'researchNotes'
  | 'ideaMemos'
  | 'ideaOutcomes'
  // Liquidity Planning & Cash Forecast collections (Module 39)
  | 'cashPositions'
  | 'cashForecasts'
  | 'cashFlows'
  | 'cashScenarios'
  | 'cashStressTests'
  // Family Governance collections (Module 40)
  | 'gvMeetings'
  | 'gvAgendaItems'
  | 'gvDecisions'
  | 'gvVotes'
  | 'gvPolicies'
  | 'gvActionItems'
  | 'gvMinutes'
  // Calendar and Meetings collections (Module 41)
  | 'calendarEvents'
  | 'meetingAgenda'
  | 'meetingNotes'
  | 'meetingActionItems'
  | 'calendarIntegrations'
  // Deals and Corporate Actions collections (Module 42)
  | 'dlCorporateActions'
  | 'dlPrivateDeals'
  | 'dlFundEvents'
  | 'dlChecklists'
  | 'dlApprovals'
  | 'dlDocs'
  // Vendors and Service Providers collections (Module 43)
  | 'vdVendors'
  | 'vdContracts'
  | 'vdSlas'
  | 'vdScorecards'
  | 'vdIncidents'
  | 'vdInvoices'
  // Policies and SOP Center collections (Module 44)
  | 'plPolicies'
  | 'plSops'
  | 'plVersions'
  | 'plAcknowledgements'
  | 'plChecklists'
  | 'plLinks'
  // Client Portal collections (Module 45)
  | 'ptPortalUsers'
  | 'ptPortalDocuments'
  | 'ptPortalPacks'
  | 'ptPortalRequests'
  | 'ptPortalThreads'
  | 'ptPortalEvents'
  | 'ptPortalMinutes'
  | 'ptPortalConsents'
  | 'ptPortalPreferences'
  | 'ptPortalKpis'
  | 'ptPortalPerformance'
  // Master Data Management collections (Module 46)
  | 'mdmPeople'
  | 'mdmEntities'
  | 'mdmAccounts'
  | 'mdmAssets'
  | 'mdmDuplicates'
  | 'mdmMergeJobs'
  | 'mdmStewardQueue'
  | 'mdmRules'
  // Exception Center collections (Module 48)
  | 'exceptions'
  | 'exceptionClusters'
  | 'exceptionRules'
  | 'exceptionSlaPolicies'
  // Ownership Map collections (Module 47)
  | 'ownershipNodes'
  | 'ownershipLinks'
  | 'ownershipUbo'
  | 'ownershipChanges'
  | 'ownershipViews'
  // Philanthropy collections (Module 49)
  | 'philEntities'
  | 'philPrograms'
  | 'philGrants'
  | 'philPayouts'
  | 'philBudgets'
  | 'philImpactReports'
  | 'philComplianceChecks'
  // Credit and Banking collections (Module 50)
  | 'creditBanks'
  | 'creditFacilities'
  | 'creditLoans'
  | 'creditCollateral'
  | 'creditCovenants'
  | 'creditPayments'
  | 'creditSchedules'
  | 'creditCalendar'
  // Data Governance collections (Module 51)
  | 'dataKpis'
  | 'dataLineage'
  | 'dataQualityScores'
  | 'dataReconciliations'
  | 'dataOverrides'
  | 'dataGovernanceRules'
  // Advisor Packs collections (Module 52)
  | 'packTemplates'
  | 'packItems'
  | 'packShares'
  | 'packApprovals'
  | 'packDownloads'
  // Relationship Hub collections (Module 53)
  | 'relHouseholds'
  | 'relRelationships'
  | 'relInteractions'
  | 'relInitiatives'
  | 'relCoverage'
  | 'relVipViews'
  // Consent & Privacy Center collections (Module 54)
  | 'consents'
  | 'consentRequests'
  | 'privacyPolicies'
  | 'accessReviews'
  | 'consentConflicts'
  // Client Portal & Client Safe Experience collections (Module 55)
  | 'portalUsers'
  | 'portalSessions'
  | 'portalViews'
  | 'portalRequests'
  | 'portalAnnouncements';
