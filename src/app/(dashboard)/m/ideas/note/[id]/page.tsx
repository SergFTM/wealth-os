'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { IdNoteDetail } from '@/modules/38-ideas/ui/IdNoteDetail';

type Locale = 'ru' | 'en' | 'uk';

interface Props {
  params: Promise<{ id: string }>;
}

export default function NoteDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [locale] = useState<Locale>('ru');
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/researchNotes/${id}`);
      if (!res.ok) {
        throw new Error('Note not found');
      }
      const data = await res.json();
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading note');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/m/ideas/note/${id}/edit`);
  };

  const handleSummarize = async () => {
    // Trigger AI summarization
    console.log('Summarize note');
  };

  const handleLinkToIdea = () => {
    // Open idea linking modal
    console.log('Link to idea');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
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

  if (error || !note) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
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
            {locale === 'ru' ? 'Заметка не найдена' : 'Note not found'}
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/m/ideas/list?tab=notes')}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
          >
            {locale === 'ru' ? 'Вернуться к списку' : 'Back to list'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
          <button onClick={() => router.push('/m/ideas/list?tab=notes')} className="hover:text-gray-700">
            {locale === 'ru' ? 'Заметки' : 'Notes'}
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900 truncate max-w-[200px] inline-block">{note.title}</span>
        </nav>
      </div>

      <IdNoteDetail
        note={note}
        locale={locale}
        onEdit={handleEdit}
        onSummarize={handleSummarize}
        onLinkToIdea={handleLinkToIdea}
      />
    </div>
  );
}
