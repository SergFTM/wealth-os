/**
 * Case Numbering Engine
 * Generates unique case numbers in format CS-YYYY-####
 */

let sequenceCounter = 1000;

export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const sequence = ++sequenceCounter;
  return `CS-${year}-${sequence.toString().padStart(4, '0')}`;
}

export function parseCaseNumber(caseNumber: string): { year: number; sequence: number } | null {
  const match = caseNumber.match(/^CS-(\d{4})-(\d+)$/);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    sequence: parseInt(match[2], 10),
  };
}

export function validateCaseNumber(caseNumber: string): boolean {
  return /^CS-\d{4}-\d{4,}$/.test(caseNumber);
}

export async function getNextCaseNumber(existingCases: { caseNumber: string }[]): Promise<string> {
  const year = new Date().getFullYear();
  const yearPrefix = `CS-${year}-`;

  const currentYearCases = existingCases
    .filter(c => c.caseNumber.startsWith(yearPrefix))
    .map(c => {
      const parsed = parseCaseNumber(c.caseNumber);
      return parsed ? parsed.sequence : 0;
    });

  const maxSequence = currentYearCases.length > 0
    ? Math.max(...currentYearCases)
    : 0;

  const nextSequence = maxSequence + 1;
  return `CS-${year}-${nextSequence.toString().padStart(4, '0')}`;
}
