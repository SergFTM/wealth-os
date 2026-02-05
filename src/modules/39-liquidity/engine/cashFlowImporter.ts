/**
 * Cash Flow Importer
 * Imports cash flows from various source systems
 */

import { CashFlow } from './types';

export type ImportSource =
  | 'invoices'
  | 'capital_calls'
  | 'distributions'
  | 'tax_deadlines'
  | 'gl_transactions';

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
  flows: CashFlow[];
}

export interface Invoice {
  id: string;
  clientId: string;
  type: 'payable' | 'receivable';
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
  description?: string;
}

export interface CapitalCall {
  id: string;
  clientId: string;
  fundName: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
}

export interface Distribution {
  id: string;
  clientId: string;
  fundName: string;
  amount: number;
  currency: string;
  expectedDate: string;
  status: string;
}

export interface TaxDeadline {
  id: string;
  clientId: string;
  taxType: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
}

/**
 * Import invoices as cash flows
 */
export function importFromInvoices(
  invoices: Invoice[],
  clientId: string,
  scopeType: string = 'household',
  scopeId?: string
): ImportResult {
  const flows: CashFlow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (const invoice of invoices) {
    if (invoice.clientId !== clientId) {
      skipped++;
      continue;
    }

    if (invoice.status === 'paid' || invoice.status === 'cancelled') {
      skipped++;
      continue;
    }

    try {
      const flow: CashFlow = {
        id: `inv-${invoice.id}`,
        clientId: invoice.clientId,
        scopeType: scopeType as 'household' | 'entity' | 'portfolio' | 'account',
        scopeId,
        flowType: invoice.type === 'receivable' ? 'inflow' : 'outflow',
        categoryKey: 'invoice',
        flowDate: invoice.dueDate,
        amount: invoice.amount,
        currency: invoice.currency,
        description: invoice.description || `Invoice ${invoice.id}`,
        isConfirmed: invoice.status === 'approved',
        sourceType: 'invoice',
        sourceId: invoice.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      flows.push(flow);
    } catch (e) {
      errors.push(`Failed to import invoice ${invoice.id}: ${e}`);
    }
  }

  return {
    imported: flows.length,
    skipped,
    errors,
    flows,
  };
}

/**
 * Import capital calls as cash flows
 */
export function importFromCapitalCalls(
  calls: CapitalCall[],
  clientId: string,
  scopeType: string = 'household',
  scopeId?: string
): ImportResult {
  const flows: CashFlow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (const call of calls) {
    if (call.clientId !== clientId) {
      skipped++;
      continue;
    }

    if (call.status === 'funded' || call.status === 'cancelled') {
      skipped++;
      continue;
    }

    try {
      const flow: CashFlow = {
        id: `cc-${call.id}`,
        clientId: call.clientId,
        scopeType: scopeType as 'household' | 'entity' | 'portfolio' | 'account',
        scopeId,
        flowType: 'outflow',
        categoryKey: 'capital_call',
        flowDate: call.dueDate,
        amount: call.amount,
        currency: call.currency,
        description: `Capital Call: ${call.fundName}`,
        isConfirmed: call.status === 'confirmed',
        sourceType: 'capital_call',
        sourceId: call.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      flows.push(flow);
    } catch (e) {
      errors.push(`Failed to import capital call ${call.id}: ${e}`);
    }
  }

  return {
    imported: flows.length,
    skipped,
    errors,
    flows,
  };
}

/**
 * Import distributions as cash flows
 */
export function importFromDistributions(
  distributions: Distribution[],
  clientId: string,
  scopeType: string = 'household',
  scopeId?: string
): ImportResult {
  const flows: CashFlow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (const dist of distributions) {
    if (dist.clientId !== clientId) {
      skipped++;
      continue;
    }

    if (dist.status === 'received' || dist.status === 'cancelled') {
      skipped++;
      continue;
    }

    try {
      const flow: CashFlow = {
        id: `dist-${dist.id}`,
        clientId: dist.clientId,
        scopeType: scopeType as 'household' | 'entity' | 'portfolio' | 'account',
        scopeId,
        flowType: 'inflow',
        categoryKey: 'distribution',
        flowDate: dist.expectedDate,
        amount: dist.amount,
        currency: dist.currency,
        description: `Distribution: ${dist.fundName}`,
        isConfirmed: dist.status === 'confirmed',
        sourceType: 'distribution',
        sourceId: dist.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      flows.push(flow);
    } catch (e) {
      errors.push(`Failed to import distribution ${dist.id}: ${e}`);
    }
  }

  return {
    imported: flows.length,
    skipped,
    errors,
    flows,
  };
}

/**
 * Import tax deadlines as cash flows
 */
export function importFromTaxDeadlines(
  deadlines: TaxDeadline[],
  clientId: string,
  scopeType: string = 'household',
  scopeId?: string
): ImportResult {
  const flows: CashFlow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (const deadline of deadlines) {
    if (deadline.clientId !== clientId) {
      skipped++;
      continue;
    }

    if (deadline.status === 'paid' || deadline.status === 'cancelled') {
      skipped++;
      continue;
    }

    try {
      const flow: CashFlow = {
        id: `tax-${deadline.id}`,
        clientId: deadline.clientId,
        scopeType: scopeType as 'household' | 'entity' | 'portfolio' | 'account',
        scopeId,
        flowType: 'outflow',
        categoryKey: 'tax',
        flowDate: deadline.dueDate,
        amount: deadline.amount,
        currency: deadline.currency,
        description: `Tax Payment: ${deadline.taxType}`,
        isConfirmed: deadline.status === 'confirmed',
        sourceType: 'tax_deadline',
        sourceId: deadline.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      flows.push(flow);
    } catch (e) {
      errors.push(`Failed to import tax deadline ${deadline.id}: ${e}`);
    }
  }

  return {
    imported: flows.length,
    skipped,
    errors,
    flows,
  };
}

/**
 * Import all available sources
 */
export async function importAllSources(
  clientId: string,
  scopeType: string = 'household',
  scopeId?: string,
  options: {
    invoices?: Invoice[];
    capitalCalls?: CapitalCall[];
    distributions?: Distribution[];
    taxDeadlines?: TaxDeadline[];
  } = {}
): Promise<ImportResult> {
  const allFlows: CashFlow[] = [];
  const allErrors: string[] = [];
  let totalImported = 0;
  let totalSkipped = 0;

  if (options.invoices) {
    const result = importFromInvoices(options.invoices, clientId, scopeType, scopeId);
    allFlows.push(...result.flows);
    allErrors.push(...result.errors);
    totalImported += result.imported;
    totalSkipped += result.skipped;
  }

  if (options.capitalCalls) {
    const result = importFromCapitalCalls(options.capitalCalls, clientId, scopeType, scopeId);
    allFlows.push(...result.flows);
    allErrors.push(...result.errors);
    totalImported += result.imported;
    totalSkipped += result.skipped;
  }

  if (options.distributions) {
    const result = importFromDistributions(options.distributions, clientId, scopeType, scopeId);
    allFlows.push(...result.flows);
    allErrors.push(...result.errors);
    totalImported += result.imported;
    totalSkipped += result.skipped;
  }

  if (options.taxDeadlines) {
    const result = importFromTaxDeadlines(options.taxDeadlines, clientId, scopeType, scopeId);
    allFlows.push(...result.flows);
    allErrors.push(...result.errors);
    totalImported += result.imported;
    totalSkipped += result.skipped;
  }

  return {
    imported: totalImported,
    skipped: totalSkipped,
    errors: allErrors,
    flows: allFlows,
  };
}
