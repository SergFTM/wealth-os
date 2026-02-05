/**
 * Connector Mocks Engine
 * Generate deterministic mock data for sandbox connectors
 */

export type ConnectorKey =
  | 'bank_mock'
  | 'custodian_mock'
  | 'bill_mock'
  | 'docvault_mock'
  | 'pricing_mock'
  | 'crm_mock'
  | 'accounting_mock'
  | 'tax_mock'
  | 'portfolio_mock'
  | 'custom_mock';

export type EntityType =
  | 'transactions'
  | 'positions'
  | 'invoices'
  | 'accounts'
  | 'contacts'
  | 'documents'
  | 'prices'
  | 'tax_lots'
  | 'capital_calls'
  | 'distributions';

export interface MockConfig {
  responseDelayMs: number;
  batchSize: number;
  entityTypes: EntityType[];
}

export interface ErrorInjection {
  enabled: boolean;
  failureRate: number; // 0-100
  errorTypes: ('timeout' | 'validation_error' | 'connection_error' | 'auth_error')[];
  invalidFieldRate: number; // 0-100
}

export interface MockPayload {
  connector: ConnectorKey;
  entityType: EntityType;
  records: Record<string, unknown>[];
  timestamp: string;
}

// Seed for deterministic random generation
let mockSeed = 12345;

function seededRandom(): number {
  mockSeed = (mockSeed * 1103515245 + 12345) & 0x7fffffff;
  return mockSeed / 0x7fffffff;
}

function resetSeed(seed: number = 12345): void {
  mockSeed = seed;
}

// Generate mock transaction
function generateMockTransaction(index: number): Record<string, unknown> {
  const types = ['buy', 'sell', 'dividend', 'interest', 'fee', 'transfer'];
  const currencies = ['USD', 'EUR', 'GBP', 'CHF'];

  return {
    txn_id: `TXN-${Date.now()}-${index}`,
    txn_date: new Date(Date.now() - Math.floor(seededRandom() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    txn_type: types[Math.floor(seededRandom() * types.length)],
    amount_cents: Math.floor(seededRandom() * 1000000),
    currency: currencies[Math.floor(seededRandom() * currencies.length)],
    description: `Mock transaction #${index}`,
    account_id: `ACC-${Math.floor(seededRandom() * 10) + 1}`,
  };
}

// Generate mock position
function generateMockPosition(index: number): Record<string, unknown> {
  const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'MA'];

  return {
    position_id: `POS-${Date.now()}-${index}`,
    security_id: tickers[index % tickers.length],
    ticker: tickers[index % tickers.length],
    quantity: Math.floor(seededRandom() * 1000) + 1,
    market_value: Math.floor(seededRandom() * 500000) + 1000,
    cost_basis: Math.floor(seededRandom() * 400000) + 800,
    account_id: `ACC-${Math.floor(seededRandom() * 10) + 1}`,
  };
}

// Generate mock invoice
function generateMockInvoice(index: number): Record<string, unknown> {
  const vendors = ['AWS', 'Google Cloud', 'Microsoft Azure', 'Bloomberg', 'Thomson Reuters', 'Legal Firm LLC'];

  return {
    invoice_no: `INV-${2024}-${String(index).padStart(5, '0')}`,
    vendor_name: vendors[index % vendors.length],
    total_amount: Math.floor(seededRandom() * 50000) + 100,
    currency: 'USD',
    due_date: new Date(Date.now() + Math.floor(seededRandom() * 60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    status: seededRandom() > 0.3 ? 'pending' : 'paid',
  };
}

// Generate mock account
function generateMockAccount(index: number): Record<string, unknown> {
  const types = ['checking', 'savings', 'brokerage', 'ira', '401k', 'trust'];
  const banks = ['JPMorgan', 'Goldman Sachs', 'Morgan Stanley', 'UBS', 'Credit Suisse'];

  return {
    account_number: `${Math.floor(seededRandom() * 9000000000) + 1000000000}`,
    account_name: `${types[index % types.length].toUpperCase()} Account ${index}`,
    account_type: types[index % types.length],
    currency_code: 'USD',
    institution: banks[index % banks.length],
    balance: Math.floor(seededRandom() * 10000000),
  };
}

// Generate mock contact
function generateMockContact(index: number): Record<string, unknown> {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson'];

  return {
    contact_id: `CON-${Date.now()}-${index}`,
    first_name: firstNames[index % firstNames.length],
    last_name: lastNames[index % lastNames.length],
    email_address: `${firstNames[index % firstNames.length].toLowerCase()}.${lastNames[index % lastNames.length].toLowerCase()}@example.com`,
    phone: `+1-${Math.floor(seededRandom() * 900) + 100}-${Math.floor(seededRandom() * 900) + 100}-${Math.floor(seededRandom() * 9000) + 1000}`,
  };
}

// Generate mock document
function generateMockDocument(index: number): Record<string, unknown> {
  const types = ['statement', 'contract', 'tax_form', 'report', 'correspondence', 'legal'];
  const extensions = ['pdf', 'xlsx', 'docx', 'pdf', 'pdf', 'pdf'];

  return {
    doc_id: `DOC-${Date.now()}-${index}`,
    file_name: `${types[index % types.length]}_${Date.now()}.${extensions[index % extensions.length]}`,
    mime_type: extensions[index % extensions.length] === 'pdf' ? 'application/pdf' : 'application/octet-stream',
    size_bytes: Math.floor(seededRandom() * 5000000) + 10000,
    uploaded_at: new Date().toISOString(),
  };
}

// Generate mock price
function generateMockPrice(index: number): Record<string, unknown> {
  const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'MA', 'BRK.A', 'UNH', 'XOM', 'PG', 'HD'];
  const ticker = tickers[index % tickers.length];
  const basePrice = 100 + (index % 15) * 50;

  return {
    symbol: ticker,
    price: basePrice + seededRandom() * 10 - 5,
    price_date: new Date().toISOString().split('T')[0],
    bid: basePrice + seededRandom() * 10 - 6,
    ask: basePrice + seededRandom() * 10 - 4,
    volume: Math.floor(seededRandom() * 10000000),
  };
}

// Generate mock tax lot
function generateMockTaxLot(index: number): Record<string, unknown> {
  const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'];

  return {
    lot_id: `LOT-${Date.now()}-${index}`,
    security: tickers[index % tickers.length],
    acquisition_date: new Date(Date.now() - Math.floor(seededRandom() * 365 * 3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    quantity: Math.floor(seededRandom() * 100) + 1,
    cost_basis: Math.floor(seededRandom() * 50000) + 1000,
    holding_period: seededRandom() > 0.5 ? 'long_term' : 'short_term',
  };
}

// Entity type to generator mapping
const generators: Record<EntityType, (index: number) => Record<string, unknown>> = {
  transactions: generateMockTransaction,
  positions: generateMockPosition,
  invoices: generateMockInvoice,
  accounts: generateMockAccount,
  contacts: generateMockContact,
  documents: generateMockDocument,
  prices: generateMockPrice,
  tax_lots: generateMockTaxLot,
  capital_calls: generateMockTransaction, // Simplified
  distributions: generateMockTransaction, // Simplified
};

export function generateMockPayload(
  connector: ConnectorKey,
  entityType: EntityType,
  count: number,
  seed?: number
): MockPayload {
  if (seed !== undefined) {
    resetSeed(seed);
  }

  const generator = generators[entityType];
  const records: Record<string, unknown>[] = [];

  for (let i = 0; i < count; i++) {
    records.push(generator(i));
  }

  return {
    connector,
    entityType,
    records,
    timestamp: new Date().toISOString(),
  };
}

export function shouldInjectError(config: ErrorInjection): { inject: boolean; errorType?: string } {
  if (!config.enabled) {
    return { inject: false };
  }

  if (seededRandom() * 100 < config.failureRate) {
    const errorType = config.errorTypes[Math.floor(seededRandom() * config.errorTypes.length)];
    return { inject: true, errorType };
  }

  return { inject: false };
}

export function getConnectorEntityTypes(connector: ConnectorKey): EntityType[] {
  const mapping: Record<ConnectorKey, EntityType[]> = {
    bank_mock: ['transactions', 'accounts'],
    custodian_mock: ['positions', 'transactions', 'accounts'],
    bill_mock: ['invoices'],
    docvault_mock: ['documents'],
    pricing_mock: ['prices'],
    crm_mock: ['contacts'],
    accounting_mock: ['transactions', 'accounts'],
    tax_mock: ['tax_lots'],
    portfolio_mock: ['positions', 'transactions'],
    custom_mock: ['transactions'],
  };

  return mapping[connector] || ['transactions'];
}
