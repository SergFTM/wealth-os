"use client";

interface FiltersBarProps {
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
}

export function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Поиск..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        <select
          value={filters.status || ''}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <option value="">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="in_progress">В работе</option>
          <option value="completed">Завершено</option>
          <option value="active">Активный</option>
          <option value="open">Открыт</option>
        </select>

        {(filters.search || filters.status) && (
          <button
            onClick={() => onFiltersChange({})}
            className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Сбросить
          </button>
        )}
      </div>
    </div>
  );
}
