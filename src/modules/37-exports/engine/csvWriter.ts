/**
 * CSV Writer Engine
 * Converts datasets to CSV format
 */

export interface CsvOptions {
  delimiter?: string;
  quoteChar?: string;
  lineEnding?: string;
  includeHeader?: boolean;
  dateFormat?: string;
}

const DEFAULT_OPTIONS: CsvOptions = {
  delimiter: ',',
  quoteChar: '"',
  lineEnding: '\r\n',
  includeHeader: true,
};

function escapeValue(value: unknown, quoteChar: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // Check if quoting is needed
  const needsQuoting = str.includes(quoteChar) ||
                       str.includes(',') ||
                       str.includes('\n') ||
                       str.includes('\r');

  if (needsQuoting) {
    // Escape quotes by doubling them
    const escaped = str.replace(new RegExp(quoteChar, 'g'), quoteChar + quoteChar);
    return quoteChar + escaped + quoteChar;
  }

  return str;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}

export function datasetToCsv(
  data: Record<string, unknown>[],
  columns: string[],
  options: CsvOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines: string[] = [];

  // Header row
  if (opts.includeHeader) {
    const headerRow = columns.map(col => escapeValue(col, opts.quoteChar!));
    lines.push(headerRow.join(opts.delimiter));
  }

  // Data rows
  for (const row of data) {
    const values = columns.map(col => {
      const rawValue = row[col];
      const formatted = formatValue(rawValue);
      return escapeValue(formatted, opts.quoteChar!);
    });
    lines.push(values.join(opts.delimiter));
  }

  return lines.join(opts.lineEnding);
}

export function generateCsvFilename(
  packName: string,
  sectionLabel: string,
  asOf?: string
): string {
  const sanitizedPack = packName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const sanitizedSection = sectionLabel.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const dateStr = asOf ? asOf.split('T')[0] : new Date().toISOString().split('T')[0];

  return `${sanitizedPack}_${sanitizedSection}_${dateStr}.csv`;
}

export function calculateCsvSize(csvContent: string): number {
  // Return size in bytes (UTF-8)
  return new Blob([csvContent]).size;
}

export interface CsvGenerationResult {
  fileName: string;
  content: string;
  sizeBytes: number;
  rowCount: number;
  columnCount: number;
}

export function generateCsvFile(
  packName: string,
  sectionLabel: string,
  data: Record<string, unknown>[],
  columns: string[],
  asOf?: string,
  options?: CsvOptions
): CsvGenerationResult {
  const content = datasetToCsv(data, columns, options);
  const fileName = generateCsvFilename(packName, sectionLabel, asOf);

  return {
    fileName,
    content,
    sizeBytes: calculateCsvSize(content),
    rowCount: data.length,
    columnCount: columns.length,
  };
}

// Export multiple datasets as a single combined CSV with section headers
export function generateCombinedCsv(
  packName: string,
  datasets: { label: string; data: Record<string, unknown>[]; columns: string[] }[],
  asOf?: string
): CsvGenerationResult {
  const opts = { ...DEFAULT_OPTIONS };
  const lines: string[] = [];
  let totalRows = 0;
  let maxColumns = 0;

  for (const dataset of datasets) {
    // Add section separator
    if (lines.length > 0) {
      lines.push('');
      lines.push('');
    }

    // Section header
    lines.push(`### ${dataset.label} ###`);
    lines.push('');

    // Header row
    const headerRow = dataset.columns.map(col => escapeValue(col, opts.quoteChar!));
    lines.push(headerRow.join(opts.delimiter));

    // Data rows
    for (const row of dataset.data) {
      const values = dataset.columns.map(col => {
        const rawValue = row[col];
        const formatted = formatValue(rawValue);
        return escapeValue(formatted, opts.quoteChar!);
      });
      lines.push(values.join(opts.delimiter));
    }

    totalRows += dataset.data.length;
    maxColumns = Math.max(maxColumns, dataset.columns.length);
  }

  const content = lines.join(opts.lineEnding);
  const sanitizedPack = packName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const dateStr = asOf ? asOf.split('T')[0] : new Date().toISOString().split('T')[0];
  const fileName = `${sanitizedPack}_combined_${dateStr}.csv`;

  return {
    fileName,
    content,
    sizeBytes: calculateCsvSize(content),
    rowCount: totalRows,
    columnCount: maxColumns,
  };
}
