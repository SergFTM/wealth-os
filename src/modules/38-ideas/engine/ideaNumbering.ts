/**
 * Idea Numbering Engine
 * Generates human-readable idea numbers in format ID-YYYY-####
 */

export interface IdeaNumberResult {
  ideaNumber: string;
  year: number;
  sequence: number;
}

/**
 * Generate next idea number based on existing ideas
 * Format: ID-YYYY-0001
 */
export function generateIdeaNumber(existingNumbers: string[]): IdeaNumberResult {
  const currentYear = new Date().getFullYear();
  const prefix = `ID-${currentYear}-`;

  // Filter numbers from current year
  const currentYearNumbers = existingNumbers
    .filter(num => num.startsWith(prefix))
    .map(num => {
      const seqPart = num.replace(prefix, '');
      return parseInt(seqPart, 10);
    })
    .filter(n => !isNaN(n));

  // Find max sequence
  const maxSequence = currentYearNumbers.length > 0
    ? Math.max(...currentYearNumbers)
    : 0;

  const nextSequence = maxSequence + 1;
  const ideaNumber = `${prefix}${nextSequence.toString().padStart(4, '0')}`;

  return {
    ideaNumber,
    year: currentYear,
    sequence: nextSequence
  };
}

/**
 * Parse idea number to extract year and sequence
 */
export function parseIdeaNumber(ideaNumber: string): { year: number; sequence: number } | null {
  const match = ideaNumber.match(/^ID-(\d{4})-(\d{4})$/);
  if (!match) return null;

  return {
    year: parseInt(match[1], 10),
    sequence: parseInt(match[2], 10)
  };
}

/**
 * Validate idea number format
 */
export function isValidIdeaNumber(ideaNumber: string): boolean {
  return /^ID-\d{4}-\d{4}$/.test(ideaNumber);
}

/**
 * Format idea number for display with highlight
 */
export function formatIdeaNumberDisplay(ideaNumber: string): { prefix: string; number: string } {
  const parts = ideaNumber.split('-');
  if (parts.length !== 3) {
    return { prefix: 'ID', number: ideaNumber };
  }
  return {
    prefix: `${parts[0]}-${parts[1]}`,
    number: parts[2]
  };
}
