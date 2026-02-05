/**
 * Export Renderer Engine
 * Orchestrates the export run process
 */

import { buildPackDatasets, PackConfig, PackBuildResult, DatasetResult } from './packBuilder';
import { generateCsvFile, CsvGenerationResult } from './csvWriter';
import { generatePdfPlaceholder, getDisclaimersForPackType, PdfGenerationResult } from './pdfPlaceholder';
import { buildLineageSnapshot, LineageSnapshot } from './lineageBuilder';

export interface ExportRunConfig {
  packId: string;
  packName: string;
  packType: 'audit' | 'tax' | 'bank' | 'ops';
  clientId: string;
  scopeType: string;
  scopeId?: string;
  asOf: string;
  clientSafe: boolean;
  sections: {
    sectionId: string;
    enabled: boolean;
    filters?: Record<string, unknown>;
    columns?: string[];
    format?: 'csv' | 'pdf';
  }[];
  generatePdf?: boolean;
  triggeredBy?: string;
}

export interface ExportFile {
  id: string;
  sectionId?: string;
  fileName: string;
  format: 'csv' | 'pdf';
  content: string;
  sizeBytes: number;
  rowCount?: number;
}

export interface ExportRunResult {
  runId: string;
  packId: string;
  status: 'success' | 'failed' | 'partial';
  startedAt: string;
  finishedAt: string;
  files: ExportFile[];
  lineage: LineageSnapshot;
  errors: { sectionId?: string; message: string; timestamp: string }[];
  summary: {
    sectionsProcessed: number;
    sectionsTotal: number;
    filesGenerated: number;
    totalSizeBytes: number;
    totalRows: number;
  };
}

function generateRunId(): string {
  return `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateFileId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function executeExportRun(config: ExportRunConfig): Promise<ExportRunResult> {
  const runId = generateRunId();
  const startedAt = new Date().toISOString();
  const files: ExportFile[] = [];
  const errors: { sectionId?: string; message: string; timestamp: string }[] = [];

  // Build pack config
  const packConfig: PackConfig = {
    id: config.packId,
    name: config.packName,
    packType: config.packType,
    scopeType: config.scopeType,
    scopeId: config.scopeId,
    asOf: config.asOf,
    clientSafe: config.clientSafe,
    sections: config.sections,
  };

  // Build datasets
  let buildResult: PackBuildResult;
  try {
    buildResult = await buildPackDatasets(packConfig);
  } catch (err) {
    return {
      runId,
      packId: config.packId,
      status: 'failed',
      startedAt,
      finishedAt: new Date().toISOString(),
      files: [],
      lineage: buildLineageSnapshot({
        packId: config.packId,
        runId,
        sections: [],
        asOf: config.asOf,
      }),
      errors: [{
        message: err instanceof Error ? err.message : 'Failed to build datasets',
        timestamp: new Date().toISOString(),
      }],
      summary: {
        sectionsProcessed: 0,
        sectionsTotal: config.sections.filter(s => s.enabled).length,
        filesGenerated: 0,
        totalSizeBytes: 0,
        totalRows: 0,
      },
    };
  }

  // Add build errors
  buildResult.errors.forEach(err => {
    errors.push({
      sectionId: err.sectionId,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  });

  // Generate CSV files for each dataset
  let totalRows = 0;
  for (const dataset of buildResult.datasets) {
    try {
      const csvResult: CsvGenerationResult = generateCsvFile(
        config.packName,
        dataset.label,
        dataset.data,
        dataset.columns,
        config.asOf
      );

      files.push({
        id: generateFileId(),
        sectionId: dataset.sectionId,
        fileName: csvResult.fileName,
        format: 'csv',
        content: csvResult.content,
        sizeBytes: csvResult.sizeBytes,
        rowCount: csvResult.rowCount,
      });

      totalRows += csvResult.rowCount;
    } catch (err) {
      errors.push({
        sectionId: dataset.sectionId,
        message: err instanceof Error ? err.message : 'Failed to generate CSV',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Generate PDF placeholder
  if (config.generatePdf !== false) {
    try {
      const pdfResult: PdfGenerationResult = generatePdfPlaceholder({
        packName: config.packName,
        packType: config.packType,
        asOf: config.asOf,
        clientSafe: config.clientSafe,
        sections: buildResult.datasets.map(ds => ({
          title: ds.label,
          rowCount: ds.rowCount,
          columns: ds.columns,
        })),
        disclaimers: getDisclaimersForPackType(config.packType),
        generatedAt: new Date().toISOString(),
        generatedBy: config.triggeredBy,
      });

      files.push({
        id: generateFileId(),
        fileName: pdfResult.fileName,
        format: 'pdf',
        content: pdfResult.content,
        sizeBytes: pdfResult.sizeBytes,
      });
    } catch (err) {
      errors.push({
        message: err instanceof Error ? err.message : 'Failed to generate PDF',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Build lineage
  const lineage = buildLineageSnapshot({
    packId: config.packId,
    runId,
    sections: buildResult.datasets.map(ds => ({
      sectionId: ds.sectionId,
      collection: ds.sources[0],
      rowCount: ds.rowCount,
    })),
    asOf: config.asOf,
  });

  const finishedAt = new Date().toISOString();
  const totalSizeBytes = files.reduce((sum, f) => sum + f.sizeBytes, 0);

  // Determine status
  const enabledSections = config.sections.filter(s => s.enabled).length;
  const processedSections = buildResult.datasets.length;
  let status: 'success' | 'failed' | 'partial';

  if (errors.length === 0 && processedSections === enabledSections) {
    status = 'success';
  } else if (processedSections === 0) {
    status = 'failed';
  } else {
    status = 'partial';
  }

  return {
    runId,
    packId: config.packId,
    status,
    startedAt,
    finishedAt,
    files,
    lineage,
    errors,
    summary: {
      sectionsProcessed: processedSections,
      sectionsTotal: enabledSections,
      filesGenerated: files.length,
      totalSizeBytes,
      totalRows,
    },
  };
}

export async function rerunExport(
  originalRunId: string,
  packConfig: ExportRunConfig
): Promise<ExportRunResult> {
  // Simply execute a new run with the same config
  return executeExportRun(packConfig);
}

export function formatExportDuration(startedAt: string, finishedAt: string): string {
  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();
  const durationMs = end - start;

  if (durationMs < 1000) {
    return `${durationMs}ms`;
  } else if (durationMs < 60000) {
    return `${(durationMs / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
