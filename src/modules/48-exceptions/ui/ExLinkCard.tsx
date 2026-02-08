'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ExLinkCardProps {
  title: string;
  subtitle?: string;
  linkUrl?: string;
  sourceModule?: string;
  sourceCollection?: string;
  sourceId?: string;
  className?: string;
}

const moduleLabels: Record<string, { label: string; icon: string }> = {
  '14': { label: 'Интеграции', icon: '🔄' },
  '2': { label: 'Главная книга', icon: '📒' },
  '39': { label: 'Ликвидность', icon: '💧' },
  '42': { label: 'Сделки', icon: '💼' },
  '5': { label: 'Документы', icon: '📄' },
  '16': { label: 'Ценообразование', icon: '💰' },
  '7': { label: 'Согласования', icon: '✅' },
  '28': { label: 'Воркфлоу', icon: '⚙️' },
  '44': { label: 'Политики', icon: '📜' },
  '43': { label: 'Вендоры', icon: '🏢' },
  '17': { label: 'Безопасность', icon: '🔒' }
};

export function ExLinkCard({
  title,
  subtitle,
  linkUrl,
  sourceModule,
  sourceCollection,
  sourceId,
  className
}: ExLinkCardProps) {
  const moduleInfo = sourceModule ? moduleLabels[sourceModule] : null;

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border border-stone-200 bg-white/60',
        'hover:bg-stone-50 hover:border-stone-300 transition-all',
        linkUrl && 'cursor-pointer',
        className
      )}
    >
      {moduleInfo && (
        <div className="text-2xl">{moduleInfo.icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-stone-900 truncate">{title}</div>
        {subtitle && (
          <div className="text-sm text-stone-500 truncate mt-0.5">{subtitle}</div>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
          {moduleInfo && <span>{moduleInfo.label}</span>}
          {sourceCollection && (
            <>
              <span>•</span>
              <span>{sourceCollection}</span>
            </>
          )}
          {sourceId && (
            <>
              <span>•</span>
              <span className="font-mono">{sourceId.slice(0, 8)}</span>
            </>
          )}
        </div>
      </div>
      {linkUrl && (
        <div className="text-stone-400">
          <ExternalLinkIcon />
        </div>
      )}
    </div>
  );

  if (linkUrl) {
    return (
      <Link href={linkUrl} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

export default ExLinkCard;
