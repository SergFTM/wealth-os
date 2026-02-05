/**
 * Deal Numbering Engine
 * Generates unique deal numbers in format: DL-YYYY-####
 */

export interface DealNumberContext {
  clientId: string;
  year?: number;
  existingNumbers?: string[];
}

/**
 * Generate next deal number for a client
 * Format: DL-YYYY-####
 */
export function generateDealNumber(context: DealNumberContext): string {
  const year = context.year || new Date().getFullYear();
  const prefix = `DL-${year}-`;

  // Find highest existing number for this year
  let maxNumber = 0;
  if (context.existingNumbers) {
    context.existingNumbers.forEach(num => {
      if (num.startsWith(prefix)) {
        const seq = parseInt(num.slice(prefix.length), 10);
        if (!isNaN(seq) && seq > maxNumber) {
          maxNumber = seq;
        }
      }
    });
  }

  const nextNumber = maxNumber + 1;
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Parse deal number into components
 */
export function parseDealNumber(dealNumber: string): {
  prefix: string;
  year: number;
  sequence: number;
} | null {
  const match = dealNumber.match(/^DL-(\d{4})-(\d{4})$/);
  if (!match) return null;

  return {
    prefix: 'DL',
    year: parseInt(match[1], 10),
    sequence: parseInt(match[2], 10)
  };
}

/**
 * Validate deal number format
 */
export function isValidDealNumber(dealNumber: string): boolean {
  return /^DL-\d{4}-\d{4}$/.test(dealNumber);
}

/**
 * Generate transaction reference
 * Format: TX-DL-YYYY-####-##
 */
export function generateTxRef(dealNumber: string, txIndex: number): string {
  return `TX-${dealNumber}-${String(txIndex + 1).padStart(2, '0')}`;
}

/**
 * Generate corporate action reference
 * Format: CA-YYYY-####
 */
export function generateCaRef(year?: number, existingRefs?: string[]): string {
  const y = year || new Date().getFullYear();
  const prefix = `CA-${y}-`;

  let maxNumber = 0;
  if (existingRefs) {
    existingRefs.forEach(ref => {
      if (ref.startsWith(prefix)) {
        const seq = parseInt(ref.slice(prefix.length), 10);
        if (!isNaN(seq) && seq > maxNumber) {
          maxNumber = seq;
        }
      }
    });
  }

  return `${prefix}${String(maxNumber + 1).padStart(4, '0')}`;
}

/**
 * Generate capital event reference
 * Format: CE-YYYY-####
 */
export function generateCeRef(year?: number, existingRefs?: string[]): string {
  const y = year || new Date().getFullYear();
  const prefix = `CE-${y}-`;

  let maxNumber = 0;
  if (existingRefs) {
    existingRefs.forEach(ref => {
      if (ref.startsWith(prefix)) {
        const seq = parseInt(ref.slice(prefix.length), 10);
        if (!isNaN(seq) && seq > maxNumber) {
          maxNumber = seq;
        }
      }
    });
  }

  return `${prefix}${String(maxNumber + 1).padStart(4, '0')}`;
}

/**
 * Generate approval request ID
 * Format: APR-DL-YYYY-####-[TYPE]-##
 */
export function generateApprovalRef(dealNumber: string, approvalType: string, index: number): string {
  return `APR-${dealNumber}-${approvalType.toUpperCase()}-${String(index + 1).padStart(2, '0')}`;
}
