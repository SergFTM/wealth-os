"use client";

import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AcArticleView } from '@/modules/32-academy/ui';
import seedData from '@/modules/32-academy/seed.json';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useApp();
  const id = params.id as string;

  const article = seedData.kbArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-stone-800 mb-2">
          {locale === 'ru' ? 'Статья не найдена' : 'Article not found'}
        </h1>
        <Button variant="primary" onClick={() => router.push('/m/academy/list?tab=articles')}>
          {locale === 'ru' ? '← К списку статей' : '← Back to articles'}
        </Button>
      </div>
    );
  }

  const handlePublish = () => {
    alert(`Publishing article ${id} (demo)`);
  };

  const handleEdit = () => {
    alert(`Editing article ${id} (demo)`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => router.push('/m/academy')}
          className="text-stone-500 hover:text-stone-700"
        >
          {locale === 'ru' ? 'Академия' : 'Academy'}
        </button>
        <span className="text-stone-300">/</span>
        <button
          onClick={() => router.push('/m/academy/list?tab=articles')}
          className="text-stone-500 hover:text-stone-700"
        >
          {locale === 'ru' ? 'Статьи' : 'Articles'}
        </button>
        <span className="text-stone-300">/</span>
        <span className="text-stone-800 font-medium truncate max-w-xs">
          {locale === 'ru' ? article.titleRu : article.titleEn || article.titleRu}
        </span>
      </div>

      {/* Article View */}
      <AcArticleView
        article={article}
        onPublish={article.status === 'draft' ? handlePublish : undefined}
        onEdit={handleEdit}
      />
    </div>
  );
}
