'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { IdIdeaDetail } from '@/modules/38-ideas/ui/IdIdeaDetail';

type Locale = 'ru' | 'en' | 'uk';

interface Props {
  params: Promise<{ id: string }>;
}

export default function IdeaDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [locale] = useState<Locale>('ru');
  const [idea, setIdea] = useState<any>(null);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ideaRes = await fetch(`/api/collections/ideas/${id}`);
      if (!ideaRes.ok) {
        throw new Error('Idea not found');
      }
      const ideaData = await ideaRes.json();
      setIdea(ideaData);

      // Fetch outcomes
      const outcomesRes = await fetch(`/api/collections/ideaOutcomes?ideaId=${id}`);
      if (outcomesRes.ok) {
        const outcomesData = await outcomesRes.json();
        setOutcomes(outcomesData.items || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading idea');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/m/ideas/idea/${id}/edit`);
  };

  const handleGenerateMemo = async () => {
    // Navigate to memo generation or trigger modal
    router.push(`/m/ideas/list?tab=memos&action=create&ideaId=${id}`);
  };

  const handleLinkCommittee = () => {
    // Navigate to committee linking
    router.push(`/m/ideas/list?tab=committee&action=link&ideaId=${id}`);
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
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
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
            {locale === 'ru' ? 'Идея не найдена' : 'Idea not found'}
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error || (locale === 'ru' ? 'Идея не найдена' : 'Idea not found')}</p>
          <button
            onClick={() => router.push('/m/ideas/list')}
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
          <span className="text-gray-900">{idea.ideaNumber}</span>
        </nav>
      </div>

      <IdIdeaDetail
        idea={idea}
        outcomes={outcomes}
        locale={locale}
        onEdit={handleEdit}
        onGenerateMemo={handleGenerateMemo}
        onLinkCommittee={handleLinkCommittee}
      />
    </div>
  );
}
