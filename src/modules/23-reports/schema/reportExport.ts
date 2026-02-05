/**
 * ReportExport Schema
 * Tracks export operations and generated files
 */

export type ExportFormat = 'pdf' | 'csv' | 'xlsx' | 'json' | 'manifest';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ReportExport {
  id: string;
  packId: string;
  packVersion: number;

  // Export details
  format: ExportFormat;
  status: ExportStatus;

  // File info
  fileName?: string;
  filePath?: string;
  fileSize?: number; // bytes
  mimeType?: string;

  // Processing
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;

  // Options used
  exportOptions?: {
    includeAppendix?: boolean;
    includeRawData?: boolean;
    watermark?: string;
    password?: string;
    compressionLevel?: number;
  };

  // Download tracking
  downloadCount: number;
  lastDownloadAt?: string;

  // Audit
  requestedBy: string;
  createdAt: string;
}

export interface ReportExportCreateInput {
  packId: string;
  format: ExportFormat;
  exportOptions?: ReportExport['exportOptions'];
}

export interface ExportManifest {
  packId: string;
  packName: string;
  packType: string;
  version: number;
  periodLabel: string;
  exportedAt: string;
  exportedBy: string;
  sections: {
    id: string;
    title: string;
    sectionType: string;
    dataSource?: string;
  }[];
  checksum?: string;
}
