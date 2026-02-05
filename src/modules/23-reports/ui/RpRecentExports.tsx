'use client';

import React, { useEffect, useState } from 'react';
import { ReportExport } from '../schema/reportExport';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFormatIcon(format: string) {
  const icons: Record<string, string> = {
    pdf: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    csv: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    xlsx: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    json: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  };

  return icons[format] || icons.pdf;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-emerald-600';
    case 'processing':
      return 'text-blue-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function RpRecentExports() {
  const [exports, setExports] = useState<ReportExport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExports();
  }, []);

  const fetchExports = async () => {
    try {
      const res = await fetch('/api/collections/reportExports?limit=5&sort=createdAt&order=desc');
      if (res.ok) {
        const data = await res.json();
        setExports(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching exports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Exports</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Exports</h3>

      {exports.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No recent exports</p>
      ) : (
        <div className="space-y-3">
          {exports.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg bg-gray-100 ${getStatusColor(exp.status)}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getFormatIcon(exp.format)} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {exp.fileName || `export.${exp.format}`}
                </p>
                <p className="text-xs text-gray-500">{formatDate(exp.createdAt)}</p>
              </div>
              {exp.status === 'completed' && exp.filePath && (
                <button
                  onClick={() => window.open(`/api/reports/exports/${exp.id}/download`, '_blank')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Download"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
