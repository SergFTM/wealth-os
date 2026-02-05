"use client";

import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface CmFiltersBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface FilterState {
  threadType?: string[];
  status?: string[];
  clientSafe?: boolean | null;
  slaStatus?: string[];
  dateRange?: { from?: string; to?: string };
}

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'requests', label: 'Запросы' },
  { id: 'approvals', label: 'Согласования' },
  { id: 'incidents', label: 'Инциденты' },
  { id: 'client_visible', label: 'Видимые клиенту' },
  { id: 'archived', label: 'Архив' },
];

const threadTypes = [
  { id: 'request', label: 'Запрос' },
  { id: 'approval', label: 'Согласование' },
  { id: 'incident', label: 'Инцидент' },
  { id: 'advisor', label: 'Консультация' },
  { id: 'client_service', label: 'Сервис' },
];

const statuses = [
  { id: 'open', label: 'Открыт' },
  { id: 'escalated', label: 'Эскалирован' },
  { id: 'closed', label: 'Закрыт' },
  { id: 'archived', label: 'Архив' },
];

const slaStatuses = [
  { id: 'ok', label: 'В норме' },
  { id: 'warning', label: 'Под угрозой' },
  { id: 'critical', label: 'Просрочен' },
];

export function CmFiltersBar({
  onSearch,
  onFilterChange,
  activeTab = 'all',
  onTabChange,
}: CmFiltersBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const activeFilterCount = Object.values(filters).filter(v =>
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-emerald-600 border-emerald-600'
                : 'text-stone-600 border-transparent hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Поиск по темам, участникам, сообщениям..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-stone-600 bg-white border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Фильтры
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Thread Type Filter */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-2">Тип треда</label>
              <div className="space-y-1">
                {threadTypes.map((type) => (
                  <label key={type.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.threadType?.includes(type.id) || false}
                      onChange={(e) => {
                        const current = filters.threadType || [];
                        const updated = e.target.checked
                          ? [...current, type.id]
                          : current.filter(t => t !== type.id);
                        handleFilterChange({ threadType: updated });
                      }}
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    {type.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-2">Статус</label>
              <div className="space-y-1">
                {statuses.map((status) => (
                  <label key={status.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status.id) || false}
                      onChange={(e) => {
                        const current = filters.status || [];
                        const updated = e.target.checked
                          ? [...current, status.id]
                          : current.filter(s => s !== status.id);
                        handleFilterChange({ status: updated });
                      }}
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    {status.label}
                  </label>
                ))}
              </div>
            </div>

            {/* SLA Status Filter */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-2">SLA статус</label>
              <div className="space-y-1">
                {slaStatuses.map((sla) => (
                  <label key={sla.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.slaStatus?.includes(sla.id) || false}
                      onChange={(e) => {
                        const current = filters.slaStatus || [];
                        const updated = e.target.checked
                          ? [...current, sla.id]
                          : current.filter(s => s !== sla.id);
                        handleFilterChange({ slaStatus: updated });
                      }}
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    {sla.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Client Safe Filter */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-2">Видимость</label>
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="clientSafe"
                    checked={filters.clientSafe === null || filters.clientSafe === undefined}
                    onChange={() => handleFilterChange({ clientSafe: null })}
                    className="w-4 h-4 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Все
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="clientSafe"
                    checked={filters.clientSafe === true}
                    onChange={() => handleFilterChange({ clientSafe: true })}
                    className="w-4 h-4 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Видимые клиенту
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="clientSafe"
                    checked={filters.clientSafe === false}
                    onChange={() => handleFilterChange({ clientSafe: false })}
                    className="w-4 h-4 border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Внутренние
                </label>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-stone-600 hover:text-stone-800"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
