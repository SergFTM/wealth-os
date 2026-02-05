'use client';

import React, { useEffect, useState } from 'react';
import { ReportTemplate } from '../schema/reportTemplate';

interface RpTemplateSelectorProps {
  onSelect: (template: ReportTemplate) => void;
  onCancel: () => void;
}

function getPackTypeColor(packType: string): string {
  const colors: Record<string, string> = {
    executive: 'bg-purple-100 text-purple-700',
    committee: 'bg-indigo-100 text-indigo-700',
    client: 'bg-teal-100 text-teal-700',
    compliance: 'bg-orange-100 text-orange-700',
    regulatory: 'bg-red-100 text-red-700',
    custom: 'bg-gray-100 text-gray-700',
  };
  return colors[packType] || colors.custom;
}

export function RpTemplateSelector({ onSelect, onCancel }: RpTemplateSelectorProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/collections/reportTemplates?isActive=true');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.description?.toLowerCase().includes(filter.toLowerCase()) ||
      t.packType.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Choose Template</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <p>No templates found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${selectedTemplate?.id === template.id
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
                      {template.description && (
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPackTypeColor(template.packType)}`}>
                      {template.packType}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>{template.sections.length} sections</span>
                    <span>Period: {template.defaultPeriodType}</span>
                    {template.category && <span>Category: {template.category}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedTemplate && onSelect(selectedTemplate)}
            disabled={!selectedTemplate}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}
