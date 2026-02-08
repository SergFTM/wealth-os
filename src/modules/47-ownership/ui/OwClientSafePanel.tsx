"use client";

import { Button } from '@/components/ui/Button';

interface ClientSafeView {
  id: string;
  scopeHouseholdNodeId: string;
  scopeHouseholdName?: string;
  publishedAt: string;
  publishedByUserId: string;
  nodesCount: number;
  linksCount: number;
}

interface OwClientSafePanelProps {
  views: ClientSafeView[];
  onViewClick: (view: ClientSafeView) => void;
  onPublishNew: () => void;
}

export function OwClientSafePanel({ views, onViewClick, onPublishNew }: OwClientSafePanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Опубликованные виды</h3>
          <p className="text-sm text-stone-500">Client-safe снимки для портала</p>
        </div>
        <Button variant="primary" onClick={onPublishNew} className="gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Опубликовать
        </Button>
      </div>

      {views.length === 0 ? (
        <div className="p-8 text-center bg-white/80 rounded-xl border border-stone-200/50">
          <svg className="w-12 h-12 mx-auto text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <p className="font-medium text-stone-600">Нет опубликованных видов</p>
          <p className="text-sm text-stone-500 mt-1">
            Создайте client-safe вид для показа клиенту
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {views.map((view) => (
            <div
              key={view.id}
              onClick={() => onViewClick(view)}
              className="p-4 bg-white/80 rounded-xl border border-stone-200/50 hover:border-emerald-200 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">
                      {view.scopeHouseholdName || `Household ${view.scopeHouseholdNodeId.slice(0, 8)}`}
                    </div>
                    <div className="text-sm text-stone-500">
                      {view.nodesCount} узлов, {view.linksCount} связей
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-600">
                    {new Date(view.publishedAt).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-xs text-stone-400">
                    {view.publishedByUserId}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium">Client-Safe публикация</p>
            <p className="mt-1">
              Опубликованные виды автоматически доступны в клиентском портале.
              Номера счетов и внутренние заметки маскируются.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwClientSafePanel;
