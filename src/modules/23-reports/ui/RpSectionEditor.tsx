'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReportSection, SectionType, DataSourceModule } from '../schema/reportSection';
import { getSectionResolverConfig, getSectionTypeLabel } from '../engine/sectionResolvers';

interface RpSectionEditorProps {
  packId: string;
  section?: ReportSection;
  onSave: (section: Partial<ReportSection>) => Promise<void>;
  onCancel: () => void;
}

const sectionTypes: SectionType[] = [
  'cover',
  'toc',
  'executive-summary',
  'performance',
  'allocation',
  'holdings',
  'transactions',
  'fees',
  'risk',
  'compliance',
  'ips-status',
  'tax-summary',
  'liquidity',
  'commentary',
  'appendix',
  'custom',
];

export function RpSectionEditor({ packId, section, onSave, onCancel }: RpSectionEditorProps) {
  const [sectionType, setSectionType] = useState<SectionType>(section?.sectionType || 'custom');
  const [title, setTitle] = useState(section?.title || '');
  const [subtitle, setSubtitle] = useState(section?.subtitle || '');
  const [dataSourceModule, setDataSourceModule] = useState<DataSourceModule | ''>(
    section?.dataSource?.moduleKey || ''
  );
  const [customContent, setCustomContent] = useState(section?.customContent || '');
  const [showTitle, setShowTitle] = useState(section?.displayConfig?.showTitle ?? true);
  const [pageBreakBefore, setPageBreakBefore] = useState(section?.displayConfig?.pageBreakBefore ?? false);
  const [loading, setLoading] = useState(false);

  const resolverConfig = getSectionResolverConfig(sectionType);

  const handleSectionTypeChange = (type: SectionType) => {
    setSectionType(type);
    // Set default title
    if (!title || title === getSectionTypeLabel(section?.sectionType || 'custom')) {
      setTitle(getSectionTypeLabel(type));
    }
    // Set default data source
    const config = getSectionResolverConfig(type);
    if (config.defaultModule) {
      setDataSourceModule(config.defaultModule);
    } else {
      setDataSourceModule('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setLoading(true);

    try {
      const sectionData: Partial<ReportSection> = {
        packId,
        sectionType,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        dataSource: dataSourceModule
          ? { moduleKey: dataSourceModule as DataSourceModule }
          : undefined,
        customContent: customContent.trim() || undefined,
        displayConfig: {
          showTitle,
          pageBreakBefore,
        },
      };

      await onSave(sectionData);
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {sectionTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSectionTypeChange(type)}
                className={`
                  px-3 py-2 text-xs font-medium rounded-lg border transition-colors
                  ${sectionType === type
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {getSectionTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Section title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Optional subtitle"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Data Source */}
        {resolverConfig.requiresData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Source
            </label>
            <select
              value={dataSourceModule}
              onChange={(e) => setDataSourceModule(e.target.value as DataSourceModule | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">No data source</option>
              {resolverConfig.supportedModules.map((module) => (
                <option key={module} value={module}>
                  {module.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom Content */}
        {!resolverConfig.requiresData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown)
            </label>
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Enter content using Markdown..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
            />
          </div>
        )}

        {/* Display Options */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Display Options</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showTitle}
                onChange={(e) => setShowTitle(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Show section title</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={pageBreakBefore}
                onChange={(e) => setPageBreakBefore(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Page break before section</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : section ? 'Update Section' : 'Add Section'}
          </button>
        </div>
      </form>
    </div>
  );
}
