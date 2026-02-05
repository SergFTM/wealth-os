'use client';

import React, { useState } from 'react';
import { ReportPack } from '../schema/reportPack';
import { ExportFormat } from '../schema/reportExport';

interface RpExportDialogProps {
  pack: ReportPack;
  onClose: () => void;
  onExported: () => void;
}

const formatOptions: { value: ExportFormat; label: string; description: string }[] = [
  { value: 'pdf', label: 'PDF', description: 'Formatted report for printing and sharing' },
  { value: 'csv', label: 'CSV', description: 'Tabular data for spreadsheet analysis' },
  { value: 'xlsx', label: 'Excel', description: 'Formatted Excel workbook' },
  { value: 'json', label: 'JSON', description: 'Structured data for API integrations' },
  { value: 'manifest', label: 'Manifest', description: 'Metadata and checksum for audit' },
];

export function RpExportDialog({ pack, onClose, onExported }: RpExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [includeAppendix, setIncludeAppendix] = useState(true);
  const [watermark, setWatermark] = useState('');
  const [loading, setLoading] = useState(false);
  const [exportResult, setExportResult] = useState<{ id: string; status: string } | null>(null);

  const handleExport = async () => {
    setLoading(true);

    try {
      const payload = {
        packId: pack.id,
        format,
        exportOptions: {
          includeAppendix,
          watermark: watermark || undefined,
        },
      };

      const res = await fetch('/api/reports/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setExportResult(result);

        // If completed immediately, trigger download
        if (result.status === 'completed' && result.filePath) {
          window.open(`/api/reports/exports/${result.id}/download`, '_blank');
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create export');
      }
    } catch (error) {
      console.error('Error creating export:', error);
      alert('Failed to create export');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Export Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {exportResult ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Export {exportResult.status === 'completed' ? 'Complete' : 'Started'}
              </h3>
              <p className="text-sm text-gray-500">
                {exportResult.status === 'completed'
                  ? 'Your download should start automatically.'
                  : 'Processing... Check the exports list for status.'}
              </p>
            </div>
          ) : (
            /* Form */
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="space-y-2">
                  {formatOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                        ${format === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={option.value}
                        checked={format === option.value}
                        onChange={() => setFormat(option.value)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {format === 'pdf' && (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeAppendix"
                      checked={includeAppendix}
                      onChange={(e) => setIncludeAppendix(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="includeAppendix" className="text-sm text-gray-700">
                      Include appendix sections
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Watermark (optional)
                    </label>
                    <input
                      type="text"
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      placeholder="e.g., CONFIDENTIAL, DRAFT"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  <strong>Pack:</strong> {pack.name}
                  <br />
                  <strong>Version:</strong> {pack.version}
                  <br />
                  <strong>Period:</strong> {pack.periodLabel}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {exportResult ? (
            <button
              onClick={onExported}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
