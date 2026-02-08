"use client";

interface SourceRef {
  docId?: string;
  description?: string;
  url?: string;
  asOf?: string;
}

interface OwSourceCardProps {
  source: SourceRef | null;
  asOf?: string;
}

export function OwSourceCard({ source, asOf }: OwSourceCardProps) {
  if (!source && !asOf) {
    return (
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 text-amber-700">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">Источник не указан</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
      <div className="text-sm font-medium text-stone-700">Источник</div>

      {source?.description && (
        <div className="text-sm text-stone-600">{source.description}</div>
      )}

      {source?.docId && (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-emerald-600 hover:underline cursor-pointer">
            {source.docId}
          </span>
        </div>
      )}

      {source?.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {source.url}
        </a>
      )}

      {(asOf || source?.asOf) && (
        <div className="text-xs text-stone-500">
          По состоянию на: {new Date(asOf || source?.asOf || '').toLocaleDateString('ru-RU')}
        </div>
      )}
    </div>
  );
}

export default OwSourceCard;
