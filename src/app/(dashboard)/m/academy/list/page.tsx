"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import {
  AcArticlesTable,
  AcCoursesTable,
  AcLessonsTable,
  AcChecklistsTable,
  AcPoliciesTable,
  AcFaqTable,
  AcSearchView,
} from '@/modules/32-academy/ui';
import seedData from '@/modules/32-academy/seed.json';

const tabs = [
  { id: 'articles', label: { ru: 'Статьи', en: 'Articles', uk: 'Статті' } },
  { id: 'courses', label: { ru: 'Курсы', en: 'Courses', uk: 'Курси' } },
  { id: 'lessons', label: { ru: 'Уроки', en: 'Lessons', uk: 'Уроки' } },
  { id: 'checklists', label: { ru: 'Чек-листы', en: 'Checklists', uk: 'Чек-листи' } },
  { id: 'policies', label: { ru: 'Политики', en: 'Policies', uk: 'Політики' } },
  { id: 'faq', label: { ru: 'FAQ', en: 'FAQ', uk: 'FAQ' } },
  { id: 'library', label: { ru: 'Библиотека', en: 'Library', uk: 'Бібліотека' } },
  { id: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
];

const i18n = {
  ru: { title: 'Академия', subtitle: 'База знаний и обучение', back: '← Дашборд', noData: 'Нет данных' },
  en: { title: 'Academy', subtitle: 'Knowledge base and training', back: '← Dashboard', noData: 'No data' },
  uk: { title: 'Академія', subtitle: 'База знань та навчання', back: '← Дашборд', noData: 'Немає даних' },
};

function AcademyListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, clientSafe } = useApp();
  const t = i18n[locale];

  const initialTab = searchParams.get('tab') || 'articles';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/m/academy/list?tab=${tabId}`, { scroll: false });
  };

  // Filter data based on clientSafe mode
  const filterByAudience = <T extends { audience: string }>(items: T[]) => {
    if (clientSafe) {
      return items.filter(i => i.audience === 'client' || i.audience === 'both');
    }
    return items;
  };

  const articles = filterByAudience(seedData.kbArticles);
  const courses = filterByAudience(seedData.kbCourses);
  const lessons = filterByAudience(seedData.kbLessons);
  const checklists = filterByAudience(seedData.kbChecklists);
  const policies = filterByAudience(seedData.kbPolicies);
  const faqItems = filterByAudience(seedData.kbFaq);

  const handlePublishArticle = (id: string) => {
    alert(`Publishing article ${id} (demo)`);
  };

  const handleStartCourse = (id: string) => {
    router.push(`/m/academy/course/${id}`);
  };

  const handleStartChecklist = (id: string) => {
    router.push(`/m/academy/checklist/${id}?action=start`);
  };

  const handleAcknowledgePolicy = (id: string) => {
    alert(`Acknowledging policy ${id} (demo)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{t.title}</h1>
          <p className="text-sm text-stone-500">{t.subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/academy')}>
          {t.back}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label[locale]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'articles' && (
          <AcArticlesTable
            articles={articles}
            onPublish={handlePublishArticle}
          />
        )}

        {activeTab === 'courses' && (
          <AcCoursesTable
            courses={courses}
            onStart={handleStartCourse}
          />
        )}

        {activeTab === 'lessons' && (
          <AcLessonsTable
            lessons={lessons}
            courses={seedData.kbCourses}
          />
        )}

        {activeTab === 'checklists' && (
          <AcChecklistsTable
            checklists={checklists}
            runs={seedData.kbChecklistRuns}
            onStartRun={handleStartChecklist}
          />
        )}

        {activeTab === 'policies' && (
          <AcPoliciesTable
            policies={policies}
            onAcknowledge={handleAcknowledgePolicy}
          />
        )}

        {activeTab === 'faq' && (
          <AcFaqTable items={faqItems} />
        )}

        {activeTab === 'library' && (
          <AcSearchView />
        )}

        {activeTab === 'audit' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-8 text-center">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-stone-500">{locale === 'ru' ? 'Audit события модуля Академия' : 'Academy module audit events'}</p>
            <p className="text-xs text-stone-400 mt-2">{locale === 'ru' ? 'Фильтруется из auditEvents' : 'Filtered from auditEvents'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcademyListPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">Загрузка...</div>}>
      <AcademyListContent />
    </Suspense>
  );
}
