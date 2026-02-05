'use client';

import React from 'react';
import { ReportPack, PackStatus, PackType } from '../schema/reportPack';

interface RpPackListProps {
  packs: ReportPack[];
  onViewPack: (packId: string) => void;
  compact?: boolean;
}

function getStatusBadge(status: PackStatus) {
  const styles = {
    draft: 'bg-gray-100 text-gray-700',
    locked: 'bg-blue-100 text-blue-700',
    published: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-gray-100 text-gray-500',
  };

  const labels = {
    draft: 'Draft',
    locked: 'Locked',
    published: 'Published',
    archived: 'Archived',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function getTypeBadge(packType: PackType) {
  const styles = {
    executive: 'bg-purple-100 text-purple-700',
    committee: 'bg-indigo-100 text-indigo-700',
    client: 'bg-teal-100 text-teal-700',
    compliance: 'bg-orange-100 text-orange-700',
    regulatory: 'bg-red-100 text-red-700',
    custom: 'bg-gray-100 text-gray-700',
  };

  const labels = {
    executive: 'Executive',
    committee: 'Committee',
    client: 'Client',
    compliance: 'Compliance',
    regulatory: 'Regulatory',
    custom: 'Custom',
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[packType]}`}>
      {labels[packType]}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function RpPackList({ packs, onViewPack, compact = false }: RpPackListProps) {
  if (packs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No report packs found</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="divide-y divide-gray-100">
        {packs.map((pack) => (
          <div
            key={pack.id}
            onClick={() => onViewPack(pack.id)}
            className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{pack.name}</p>
                <p className="text-xs text-gray-500">{pack.periodLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTypeBadge(pack.packType)}
              {getStatusBadge(pack.status)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pack Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Version
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {packs.map((pack) => (
            <tr
              key={pack.id}
              onClick={() => onViewPack(pack.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{pack.name}</div>
                    {pack.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {pack.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {getTypeBadge(pack.packType)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {getStatusBadge(pack.status)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                v{pack.version}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {pack.periodLabel}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(pack.updatedAt)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewPack(pack.id);
                  }}
                  className="text-emerald-600 hover:text-emerald-900"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
