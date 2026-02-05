'use client';

import React from 'react';
import { ReportSection, SectionType } from '../schema/reportSection';

interface RpSectionListProps {
  sections: ReportSection[];
  editable?: boolean;
  onEdit?: (sectionId: string) => void;
  onReorder?: () => void;
}

function getSectionTypeIcon(type: SectionType): string {
  const icons: Record<SectionType, string> = {
    'cover': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z',
    'toc': 'M4 6h16M4 10h16M4 14h16M4 18h16',
    'executive-summary': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    'performance': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    'allocation': 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z',
    'holdings': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    'transactions': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    'fees': 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    'risk': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    'compliance': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'ips-status': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'tax-summary': 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    'liquidity': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    'trusts': 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    'commentary': 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    'ai-narrative': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    'appendix': 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13',
    'custom': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  };

  return icons[type] || icons.custom;
}

function getSectionTypeLabel(type: SectionType): string {
  const labels: Record<SectionType, string> = {
    'cover': 'Cover Page',
    'toc': 'Table of Contents',
    'executive-summary': 'Executive Summary',
    'performance': 'Performance',
    'allocation': 'Asset Allocation',
    'holdings': 'Holdings',
    'transactions': 'Transactions',
    'fees': 'Fees',
    'risk': 'Risk Analysis',
    'compliance': 'Compliance',
    'ips-status': 'IPS Status',
    'tax-summary': 'Tax Summary',
    'liquidity': 'Liquidity',
    'trusts': 'Trusts',
    'commentary': 'Commentary',
    'ai-narrative': 'AI Narrative',
    'appendix': 'Appendix',
    'custom': 'Custom',
  };

  return labels[type] || type;
}

export function RpSectionList({ sections, editable, onEdit, onReorder }: RpSectionListProps) {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  if (sections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p>No sections added yet</p>
        {editable && (
          <p className="text-sm mt-1">Click "Add Section" to get started</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedSections.map((section, index) => (
        <div
          key={section.id}
          className={`
            flex items-center gap-4 p-3 rounded-lg border
            ${editable ? 'cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/50' : ''}
            ${section.isResolved ? 'border-gray-200 bg-white' : 'border-amber-200 bg-amber-50'}
          `}
          onClick={() => editable && onEdit?.(section.id)}
        >
          {/* Drag Handle (for reordering) */}
          {editable && (
            <div className="text-gray-400 cursor-move">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          )}

          {/* Order Number */}
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium text-gray-600">
            {index + 1}
          </div>

          {/* Section Icon */}
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSectionTypeIcon(section.sectionType)} />
            </svg>
          </div>

          {/* Section Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{section.title}</p>
            <p className="text-xs text-gray-500">
              {getSectionTypeLabel(section.sectionType)}
              {section.dataSource && ` • Data: ${section.dataSource.moduleKey}`}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            {!section.isResolved && section.dataSource && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                Pending
              </span>
            )}
            {section.errorMessage && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                Error
              </span>
            )}
            {section.isResolved && (
              <span className="text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </div>

          {/* Edit Arrow */}
          {editable && (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
