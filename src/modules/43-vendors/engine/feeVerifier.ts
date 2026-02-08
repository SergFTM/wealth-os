/**
 * Fee Verifier Engine
 * Compares invoices against contract fee rules and detects anomalies
 */

export interface FeeVerificationResult {
  invoiceId: string;
  vendorId: string;
  contractId?: string;
  invoiceAmount: number;
  expectedAmount: number;
  variance: number;
  variancePercent: number;
  anomalyScore: number; // 0-100
  anomalyFlag: boolean;
  anomalyReasons: string[];
  verificationStatus: 'verified' | 'warning' | 'anomaly' | 'unverifiable';
  recommendations: string[];
  confidence: number;
  assumptions: string[];
}

interface InvoiceData {
  id: string;
  vendorId: string;
  linkedContractId?: string;
  amount: number;
  currency: string;
  invoiceDate: string;
  categoryKey?: string;
  lineItemsJson?: Array<{
    description: string;
    amount: number;
    category?: string;
  }>;
}

interface ContractFeeRules {
  baseFee?: number;
  currency?: string;
  frequency?: string;
  aumRate?: number;
  hourlyRate?: number;
  minimumFee?: number;
  maximumFee?: number;
  tiers?: Array<{ from: number; to: number; rate: number }>;
}

interface ContractData {
  id: string;
  feeModelKey?: string;
  feeRulesJson?: ContractFeeRules;
}

interface HistoricalInvoice {
  amount: number;
  invoiceDate: string;
}

/**
 * Verify invoice against contract fee rules
 */
export function verifyInvoiceFee(
  invoice: InvoiceData,
  contract: ContractData | null,
  historicalInvoices: HistoricalInvoice[] = []
): FeeVerificationResult {
  const anomalyReasons: string[] = [];
  const recommendations: string[] = [];
  const assumptions: string[] = [];
  let anomalyScore = 0;
  let expectedAmount = 0;
  let verificationStatus: FeeVerificationResult['verificationStatus'] = 'unverifiable';

  // If no contract linked, try to use historical average
  if (!contract || !contract.feeRulesJson) {
    if (historicalInvoices.length >= 3) {
      const avgAmount = historicalInvoices.reduce((sum, inv) => sum + inv.amount, 0) / historicalInvoices.length;
      expectedAmount = avgAmount;
      assumptions.push('Ожидаемая сумма рассчитана на основе исторических данных');

      const variance = Math.abs(invoice.amount - avgAmount);
      const variancePercent = (variance / avgAmount) * 100;

      if (variancePercent > 50) {
        anomalyScore = 80;
        anomalyReasons.push(`Отклонение от среднего: ${variancePercent.toFixed(1)}%`);
        verificationStatus = 'anomaly';
      } else if (variancePercent > 20) {
        anomalyScore = 40;
        anomalyReasons.push(`Отклонение от среднего: ${variancePercent.toFixed(1)}%`);
        verificationStatus = 'warning';
      } else {
        verificationStatus = 'verified';
      }
    } else {
      assumptions.push('Недостаточно исторических данных для сравнения');
      assumptions.push('Контракт не привязан к счету');
      return {
        invoiceId: invoice.id,
        vendorId: invoice.vendorId,
        contractId: undefined,
        invoiceAmount: invoice.amount,
        expectedAmount: 0,
        variance: 0,
        variancePercent: 0,
        anomalyScore: 0,
        anomalyFlag: false,
        anomalyReasons: [],
        verificationStatus: 'unverifiable',
        recommendations: ['Привяжите контракт к провайдеру для верификации счетов'],
        confidence: 20,
        assumptions,
      };
    }
  } else {
    // Calculate expected amount from contract rules
    const rules = contract.feeRulesJson;

    switch (contract.feeModelKey) {
      case 'fixed':
        expectedAmount = rules.baseFee || 0;
        break;

      case 'retainer':
        expectedAmount = rules.baseFee || 0;
        break;

      case 'aum':
        // Would need AUM data - use minimum as baseline
        expectedAmount = rules.minimumFee || rules.baseFee || 0;
        assumptions.push('AUM данные недоступны, используется минимальная комиссия');
        break;

      case 'hourly':
        // Can't verify without hours data
        expectedAmount = rules.minimumFee || 0;
        assumptions.push('Данные о часах недоступны');
        break;

      default:
        expectedAmount = rules.baseFee || 0;
    }

    // Check against max
    if (rules.maximumFee && invoice.amount > rules.maximumFee) {
      anomalyScore += 50;
      anomalyReasons.push(`Превышает максимальную комиссию по контракту: $${rules.maximumFee.toLocaleString()}`);
    }

    // Calculate variance
    if (expectedAmount > 0) {
      const variance = invoice.amount - expectedAmount;
      const variancePercent = (Math.abs(variance) / expectedAmount) * 100;

      if (variancePercent > 30) {
        anomalyScore += 40;
        anomalyReasons.push(`Отклонение от ожидаемой суммы: ${variancePercent.toFixed(1)}%`);
      } else if (variancePercent > 15) {
        anomalyScore += 20;
        anomalyReasons.push(`Умеренное отклонение: ${variancePercent.toFixed(1)}%`);
      }
    }

    // Determine status
    if (anomalyScore >= 60) {
      verificationStatus = 'anomaly';
    } else if (anomalyScore >= 30) {
      verificationStatus = 'warning';
    } else {
      verificationStatus = 'verified';
    }
  }

  // Additional checks
  if (invoice.amount < 0) {
    anomalyScore += 30;
    anomalyReasons.push('Отрицательная сумма счета');
  }

  // Check for round number (potential estimate, not actual)
  if (invoice.amount >= 1000 && invoice.amount % 1000 === 0) {
    anomalyReasons.push('Круглая сумма - возможно оценка');
    anomalyScore += 5;
  }

  // Generate recommendations
  if (verificationStatus === 'anomaly') {
    recommendations.push('Запросите детализацию счета у провайдера');
    recommendations.push('Сверьте с условиями контракта');
  } else if (verificationStatus === 'warning') {
    recommendations.push('Проверьте причину отклонения');
  }

  const variance = expectedAmount > 0 ? invoice.amount - expectedAmount : 0;
  const variancePercent = expectedAmount > 0 ? (Math.abs(variance) / expectedAmount) * 100 : 0;

  // Calculate confidence
  let confidence = 80;
  if (!contract) confidence -= 30;
  if (assumptions.length > 2) confidence -= 15;
  if (historicalInvoices.length < 3) confidence -= 10;

  return {
    invoiceId: invoice.id,
    vendorId: invoice.vendorId,
    contractId: contract?.id,
    invoiceAmount: invoice.amount,
    expectedAmount,
    variance,
    variancePercent,
    anomalyScore: Math.min(100, anomalyScore),
    anomalyFlag: anomalyScore >= 50,
    anomalyReasons,
    verificationStatus,
    recommendations,
    confidence: Math.max(0, confidence),
    assumptions,
  };
}

/**
 * Batch verify multiple invoices
 */
export function batchVerifyInvoices(
  invoices: InvoiceData[],
  contracts: Map<string, ContractData>,
  historicalByVendor: Map<string, HistoricalInvoice[]>
): FeeVerificationResult[] {
  return invoices.map(invoice => {
    const contract = invoice.linkedContractId
      ? contracts.get(invoice.linkedContractId)
      : null;
    const historical = historicalByVendor.get(invoice.vendorId) || [];

    return verifyInvoiceFee(invoice, contract || null, historical);
  });
}

/**
 * Get invoices with anomalies
 */
export function getAnomalousInvoices(
  verificationResults: FeeVerificationResult[]
): FeeVerificationResult[] {
  return verificationResults.filter(r => r.anomalyFlag);
}

/**
 * Calculate vendor spend summary
 */
export function calculateVendorSpend(
  invoices: InvoiceData[],
  vendorId: string
): { total: number; ytd: number; lastMonth: number; avgMonthly: number } {
  const vendorInvoices = invoices.filter(inv => inv.vendorId === vendorId);

  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const total = vendorInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const ytd = vendorInvoices
    .filter(inv => new Date(inv.invoiceDate) >= yearStart)
    .reduce((sum, inv) => sum + inv.amount, 0);

  const lastMonth = vendorInvoices
    .filter(inv => new Date(inv.invoiceDate) >= monthStart)
    .reduce((sum, inv) => sum + inv.amount, 0);

  const monthsWithData = new Set(
    vendorInvoices.map(inv => {
      const d = new Date(inv.invoiceDate);
      return `${d.getFullYear()}-${d.getMonth()}`;
    })
  ).size;

  const avgMonthly = monthsWithData > 0 ? total / monthsWithData : 0;

  return { total, ytd, lastMonth, avgMonthly };
}
