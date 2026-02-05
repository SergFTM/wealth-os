'use client';

import { useRouter } from 'next/navigation';

type Locale = 'ru' | 'en' | 'uk';

interface SourceRef {
  type: 'note' | 'document' | 'url';
  id?: string;
  url?: string;
  title?: string;
}

interface IdSourcesCardProps {
  sources: SourceRef[];
  locale?: Locale;
  onAddSource?: () => void;
}

export function IdSourcesCard({
  sources,
  locale = 'ru',
  onAddSource,
}: IdSourcesCardProps) {
  const router = useRouter();

  const labels = {
    ru: { title: 'Источники', add: 'Добавить', empty: 'Нет источников' },
    en: { title: 'Sources', add: 'Add', empty: 'No sources' },
    uk: { title: 'Джерела', add: 'Додати', empty: 'Немає джерел' },
  };

  const t = labels[locale];

  const handleClick = (source: SourceRef) => {
    if (source.type === 'note' && source.id) {
      router.push(`/m/ideas/note/${source.id}`);
    } else if (source.type === 'document' && source.id) {
      router.push(`/m/documents/item/${source.id}`);
    } else if (source.type === 'url' && source.url) {
      window.open(source.url, '_blank');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'note':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'url':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{t.title}</h3>
        {onAddSource && (
          <button
            onClick={onAddSource}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + {t.add}
          </button>
        )}
      </div>

      <div className="p-4">
        {sources.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            {t.empty}
          </div>
        ) : (
          <div className="space-y-2">
            {sources.map((source, index) => (
              <button
                key={index}
                onClick={() => handleClick(source)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${source.type === 'note' ? 'bg-blue-50 text-blue-600' : ''}
                  ${source.type === 'document' ? 'bg-amber-50 text-amber-600' : ''}
                  ${source.type === 'url' ? 'bg-green-50 text-green-600' : ''}
                `}>
                  {getIcon(source.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {source.title || source.url || source.id}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {source.type}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IdSourcesCard;
