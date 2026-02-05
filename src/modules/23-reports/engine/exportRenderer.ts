/**
 * Export Renderer Engine
 * Renders report packs to various export formats
 */

import {
  ReportPack,
} from '../schema/reportPack';
import {
  ReportSection,
} from '../schema/reportSection';
import {
  ReportExport,
  ReportExportCreateInput,
  ExportFormat,
  ExportManifest,
} from '../schema/reportExport';
import { ResolvedSectionData } from './sectionResolvers';

// Generate unique ID
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get current timestamp
function now(): string {
  return new Date().toISOString();
}

/**
 * Create an export job
 */
export function createExportJob(
  input: ReportExportCreateInput,
  pack: ReportPack,
  userId: string
): ReportExport {
  const timestamp = now();

  return {
    id: generateId('export'),
    packId: input.packId,
    packVersion: pack.version,

    format: input.format,
    status: 'pending',

    exportOptions: input.exportOptions,

    downloadCount: 0,

    requestedBy: userId,
    createdAt: timestamp,
  };
}

/**
 * Generate export manifest
 */
export function generateManifest(
  pack: ReportPack,
  sections: ReportSection[],
  userId: string
): ExportManifest {
  return {
    packId: pack.id,
    packName: pack.name,
    packType: pack.packType,
    version: pack.version,
    periodLabel: pack.periodLabel,
    exportedAt: now(),
    exportedBy: userId,
    sections: sections
      .sort((a, b) => a.order - b.order)
      .map(s => ({
        id: s.id,
        title: s.title,
        sectionType: s.sectionType,
        dataSource: s.dataSource?.moduleKey,
      })),
    checksum: generateChecksum(pack, sections),
  };
}

/**
 * Generate a simple checksum for the pack
 */
function generateChecksum(pack: ReportPack, sections: ReportSection[]): string {
  const content = JSON.stringify({
    packId: pack.id,
    version: pack.version,
    sectionCount: sections.length,
    updatedAt: pack.updatedAt,
  });

  // Simple hash
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Render pack to CSV format
 */
export function renderToCSV(
  pack: ReportPack,
  sections: ReportSection[],
  resolvedData: Map<string, ResolvedSectionData>
): string {
  const lines: string[] = [];

  // Header
  lines.push(`"Report Pack: ${pack.name}"`);
  lines.push(`"Period: ${pack.periodLabel}"`);
  lines.push(`"Type: ${pack.packType}"`);
  lines.push(`"Version: ${pack.version}"`);
  lines.push(`"Generated: ${now()}"`);
  lines.push('');

  // Sections
  sections
    .sort((a, b) => a.order - b.order)
    .forEach(section => {
      lines.push(`"Section: ${section.title}"`);

      const resolved = resolvedData.get(section.id);
      if (resolved?.data) {
        if (Array.isArray(resolved.data)) {
          // Tabular data
          const data = resolved.data as Record<string, unknown>[];
          if (data.length > 0) {
            const headers = Object.keys(data[0]);
            lines.push(headers.map(h => `"${h}"`).join(','));
            data.forEach(row => {
              lines.push(headers.map(h => `"${row[h] ?? ''}"`).join(','));
            });
          }
        } else if (typeof resolved.data === 'string') {
          lines.push(`"${resolved.data.replace(/"/g, '""')}"`);
        }
      }

      lines.push('');
    });

  return lines.join('\n');
}

/**
 * Render pack to JSON format
 */
export function renderToJSON(
  pack: ReportPack,
  sections: ReportSection[],
  resolvedData: Map<string, ResolvedSectionData>
): string {
  const output = {
    pack: {
      id: pack.id,
      name: pack.name,
      packType: pack.packType,
      status: pack.status,
      version: pack.version,
      periodLabel: pack.periodLabel,
      periodStart: pack.periodStart,
      periodEnd: pack.periodEnd,
      clientId: pack.clientId,
    },
    sections: sections
      .sort((a, b) => a.order - b.order)
      .map(section => {
        const resolved = resolvedData.get(section.id);
        return {
          id: section.id,
          sectionType: section.sectionType,
          title: section.title,
          subtitle: section.subtitle,
          order: section.order,
          data: resolved?.data || null,
          metadata: resolved?.metadata || null,
        };
      }),
    exportedAt: now(),
  };

  return JSON.stringify(output, null, 2);
}

/**
 * Render cover page HTML
 */
export function renderCoverPage(
  pack: ReportPack,
  options?: {
    logoUrl?: string;
    primaryColor?: string;
    companyName?: string;
  }
): string {
  const color = options?.primaryColor || '#1a5f4a';

  return `
    <div class="cover-page" style="text-align: center; padding: 60px 40px;">
      ${options?.logoUrl ? `<img src="${options.logoUrl}" alt="Logo" style="max-width: 200px; margin-bottom: 40px;" />` : ''}

      <h1 style="font-size: 32px; color: ${color}; margin-bottom: 20px;">
        ${pack.name}
      </h1>

      <h2 style="font-size: 24px; color: #666; margin-bottom: 40px;">
        ${pack.periodLabel}
      </h2>

      <div style="margin-top: 60px; color: #888;">
        <p>${getPackTypeLabel(pack.packType)}</p>
        <p>Version ${pack.version}</p>
        <p>${new Date().toLocaleDateString()}</p>
      </div>

      ${options?.companyName ? `<p style="margin-top: 80px; font-size: 14px; color: #999;">${options.companyName}</p>` : ''}
    </div>
  `;
}

/**
 * Render table of contents HTML
 */
export function renderTableOfContents(
  sections: ReportSection[]
): string {
  const sortedSections = sections.sort((a, b) => a.order - b.order);

  return `
    <div class="toc" style="padding: 40px;">
      <h2 style="font-size: 24px; margin-bottom: 30px;">Contents</h2>

      <ul style="list-style: none; padding: 0;">
        ${sortedSections.map((section, index) => `
          <li style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
            <span>${section.title}</span>
            <span style="color: #888;">${index + 1}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

/**
 * Render section header HTML
 */
export function renderSectionHeader(
  section: ReportSection,
  options?: { showSubtitle?: boolean }
): string {
  return `
    <div class="section-header" style="margin-bottom: 20px; ${section.displayConfig?.pageBreakBefore ? 'page-break-before: always;' : ''}">
      <h2 style="font-size: 22px; color: #1a5f4a; margin-bottom: 8px;">
        ${section.title}
      </h2>
      ${options?.showSubtitle && section.subtitle ? `
        <p style="font-size: 14px; color: #666;">${section.subtitle}</p>
      ` : ''}
    </div>
  `;
}

/**
 * Get pack type label
 */
function getPackTypeLabel(packType: string): string {
  const labels: Record<string, string> = {
    'executive': 'Executive Report',
    'committee': 'Committee Package',
    'client': 'Client Report',
    'compliance': 'Compliance Report',
    'regulatory': 'Regulatory Report',
    'custom': 'Custom Report',
  };

  return labels[packType] || 'Report';
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    'pdf': 'application/pdf',
    'csv': 'text/csv',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'json': 'application/json',
    'manifest': 'application/json',
  };

  return mimeTypes[format];
}

/**
 * Get file extension for export format
 */
export function getFileExtension(format: ExportFormat): string {
  const extensions: Record<ExportFormat, string> = {
    'pdf': 'pdf',
    'csv': 'csv',
    'xlsx': 'xlsx',
    'json': 'json',
    'manifest': 'json',
  };

  return extensions[format];
}

/**
 * Generate filename for export
 */
export function generateExportFilename(
  pack: ReportPack,
  format: ExportFormat
): string {
  const sanitizedName = pack.name.replace(/[^a-zA-Z0-9-_]/g, '_');
  const sanitizedPeriod = pack.periodLabel.replace(/[^a-zA-Z0-9-_]/g, '_');
  const timestamp = new Date().toISOString().slice(0, 10);
  const extension = getFileExtension(format);

  return `${sanitizedName}_${sanitizedPeriod}_v${pack.version}_${timestamp}.${extension}`;
}
