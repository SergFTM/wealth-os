"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AcSearchView } from '@/modules/32-academy/ui';

export default function AcademySearchPage() {
  const router = useRouter();
  const { locale } = useApp();

  const labels = {
    back: { ru: '← Назад', en: '← Back', uk: '← Назад' },
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => router.push('/m/academy')} className="text-stone-500 hover:text-stone-700">
            {locale === 'ru' ? 'Академия' : 'Academy'}
          </button>
          <span className="text-stone-300">/</span>
          <span className="text-stone-800 font-medium">
            {locale === 'ru' ? 'Поиск' : 'Search'}
          </span>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>
          {labels.back[locale]}
        </Button>
      </div>

      {/* Search View */}
      <AcSearchView />
    </div>
  );
}
