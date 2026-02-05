'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { IdWatchlistDetail } from '@/modules/38-ideas/ui/IdWatchlistDetail';

type Locale = 'ru' | 'en' | 'uk';

interface Props {
  params: Promise<{ id: string }>;
}

export default function WatchlistDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [locale] = useState<Locale>('ru');
  const [watchlist, setWatchlist] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const wlRes = await fetch(`/api/collections/watchlists/${id}`);
      if (!wlRes.ok) {
        throw new Error('Watchlist not found');
      }
      const wlData = await wlRes.json();
      setWatchlist(wlData);

      // Fetch items
      const itemsRes = await fetch(`/api/collections/watchlistItems?watchlistId=${id}`);
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData.items || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/m/ideas/watchlist/${id}/edit`);
  };

  const handleAddItem = () => {
    // Open add item modal or navigate
    console.log('Add item');
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm(locale === 'ru' ? 'Удалить элемент?' : 'Remove item?')) return;

    try {
      const res = await fetch(`/api/collections/watchlistItems/${itemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems(items.filter(i => i.id !== itemId));
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !watchlist) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {locale === 'ru' ? 'Watchlist не найден' : 'Watchlist not found'}
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/m/ideas/list?tab=watchlists')}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
          >
            {locale === 'ru' ? 'Вернуться к списку' : 'Back to list'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <nav className="text-sm text-gray-500">
          <button onClick={() => router.push('/m/ideas')} className="hover:text-gray-700">
            {locale === 'ru' ? 'Идеи' : 'Ideas'}
          </button>
          <span className="mx-2">/</span>
          <button onClick={() => router.push('/m/ideas/list?tab=watchlists')} className="hover:text-gray-700">
            Watchlists
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{watchlist.name}</span>
        </nav>
      </div>

      <IdWatchlistDetail
        watchlist={watchlist}
        items={items}
        locale={locale}
        onEdit={handleEdit}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
