export const config = {
  id: '02',
  slug: 'net-worth',
  title: { ru: 'Единый капитал', en: 'Net Worth', uk: 'Єдиний капітал' },
  description: { 
    ru: 'Агрегация всех активов, обязательств и оценок',
    en: 'Aggregation of all assets, liabilities and valuations',
    uk: "Агрегація всіх активів, зобов'язань та оцінок"
  },
  icon: 'wallet',
  collections: ['holdings', 'liabilities', 'valuations', 'entities', 'accounts', 'documents', 'tasks', 'auditEvents'],
  primaryCollection: 'holdings',
  rbac: {
    owner: { fullAccess: true },
    admin: { fullAccess: true },
    cio: { fullAccess: true },
    cfo: { fullAccess: true },
    operations: { fullAccess: true },
    compliance: { fullAccess: true },
    rm: { limitedEdit: true },
    advisor: { limitedEdit: true },
    client: { 
      clientSafe: true,
      hiddenKpis: ['assetsNoSource', 'reconIssues'],
      hiddenColumns: ['custodianDetails', 'reconNotes', 'internalNotes'],
      onlySharedDocs: true
    }
  },
  kpis: [
    { key: 'netWorth', title: 'Общий капитал', icon: 'wallet', format: 'currency' },
    { key: 'totalAssets', title: 'Активы всего', icon: 'assets', format: 'currency' },
    { key: 'totalLiabilities', title: 'Обязательства', icon: 'liabilities', format: 'currency' },
    { key: 'liquidAssets', title: 'Ликвидные', icon: 'liquid', format: 'currency' },
    { key: 'illiquidAssets', title: 'Неликвидные', icon: 'illiquid', format: 'currency' },
    { key: 'staleValuations', title: 'Устаревшие оценки', icon: 'stale', link: '/m/net-worth/list?valuationStatus=stale', format: 'number' },
    { key: 'assetsNoSource', title: 'Без источника', icon: 'warning', link: '/m/net-worth/list?sourceType=missing', format: 'number', clientSafeHidden: true },
    { key: 'reconIssues', title: 'Расхождения', icon: 'alert', link: '/m/net-worth/list?recon=issue', format: 'number', clientSafeHidden: true }
  ],
  assetClasses: ['Public', 'Private', 'RealEstate', 'Cash', 'Personal', 'Other'],
  valuationStatuses: ['priced', 'estimated', 'stale', 'missing'],
  reconStatuses: ['ok', 'issue', 'pending'],
  sourceTypes: ['custodian', 'bank', 'manual', 'pricing'],
  liquidity: ['liquid', 'illiquid'],
  liabilityTypes: ['Loan', 'Mortgage', 'CreditLine', 'Other'],
  valuationMethods: ['market', 'appraised', 'manual', 'model']
};
