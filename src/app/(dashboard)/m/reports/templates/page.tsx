'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReportTemplate } from '@/modules/23-reports/schema/reportTemplate';

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

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/collections/reportTemplates');
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

  const handleUseTemplate = (template: ReportTemplate) => {
    // Store template in session storage and navigate to new pack page
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    router.push('/m/reports/pack/new?fromTemplate=true');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/m/reports')}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Report Templates</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-8">
            Create report packs quickly using predefined templates
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-900 mb-2">No templates available</h2>
          <p className="text-sm text-gray-500">
            Templates will appear here when created
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleUseTemplate(template)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPackTypeColor(template.packType)}`}>
                  {template.packType}
                </span>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">{template.name}</h3>
              {template.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span>{template.sections.length} sections</span>
                <span>Period: {template.defaultPeriodType}</span>
              </div>

              {/* Sections Preview */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Sections</p>
                <div className="flex flex-wrap gap-1">
                  {template.sections.slice(0, 4).map((section, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {section.title}
                    </span>
                  ))}
                  {template.sections.length > 4 && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      +{template.sections.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <button
                className="mt-4 w-full py-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
