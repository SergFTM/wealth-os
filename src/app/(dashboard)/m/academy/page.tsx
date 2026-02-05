"use client";

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AcKpiStrip, AcActionsBar, AcAiPanel, ActionIcons } from '@/modules/32-academy/ui';
import { buildSearchIndex, SearchDocument } from '@/modules/32-academy/engine/searchIndex';
import { askKnowledgeBase } from '@/modules/32-academy/engine/kbAiAssistant';
import seedData from '@/modules/32-academy/seed.json';

const i18n = {
  ru: {
    title: 'Академия',
    subtitle: 'База знаний, курсы и обучение',
    disclaimer: 'Материалы носят информационный характер. Tax и Trust разделы не заменяют профессиональные консультации.',
    viewList: 'Подробнее',
    featured: 'Рекомендуемые материалы',
  },
  en: {
    title: 'Academy',
    subtitle: 'Knowledge base, courses and training',
    disclaimer: 'Materials are for informational purposes only. Tax and Trust sections do not replace professional advice.',
    viewList: 'View details',
    featured: 'Featured content',
  },
  uk: {
    title: 'Академія',
    subtitle: 'База знань, курси та навчання',
    disclaimer: 'Матеріали носять інформаційний характер. Tax і Trust розділи не замінюють професійні консультації.',
    viewList: 'Детальніше',
    featured: 'Рекомендовані матеріали',
  },
};

const kpiLabels = {
  articles: { ru: 'Статей опубликовано', en: 'Articles Published', uk: 'Статей опубліковано' },
  courses: { ru: 'Курсов активно', en: 'Courses Active', uk: 'Курсів активно' },
  lessons: { ru: 'Всего уроков', en: 'Total Lessons', uk: 'Всього уроків' },
  checklists: { ru: 'Чек-листов в работе', en: 'Checklists Running', uk: 'Чек-листів в роботі' },
  faq: { ru: 'FAQ ответов', en: 'FAQ Items', uk: 'FAQ відповідей' },
  policies: { ru: 'Политик обновлено', en: 'Policies Updated', uk: 'Політик оновлено' },
  clientSafe: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' },
  searches: { ru: 'Поисков 7д', en: 'Searches 7d', uk: 'Пошуків 7д' },
};

const actionLabels = {
  createArticle: { ru: 'Создать статью', en: 'Create Article', uk: 'Створити статтю' },
  createCourse: { ru: 'Создать курс', en: 'Create Course', uk: 'Створити курс' },
  createLesson: { ru: 'Создать урок', en: 'Create Lesson', uk: 'Створити урок' },
  createChecklist: { ru: 'Создать чек-лист', en: 'Create Checklist', uk: 'Створити чек-лист' },
  rebuildIndex: { ru: 'Перестроить индекс', en: 'Rebuild Index', uk: 'Перебудувати індекс' },
  generateDemo: { ru: 'Сгенерировать demo', en: 'Generate Demo', uk: 'Згенерувати demo' },
};

const featuredCards = [
  { key: 'onboarding', titleRu: 'Онбординг', titleEn: 'Onboarding', icon: '🎓', link: '/m/academy/list?tab=courses&filter=onboarding' },
  { key: 'security', titleRu: 'Безопасность', titleEn: 'Security', icon: '🔒', link: '/m/academy/list?tab=articles&filter=security' },
  { key: 'reports', titleRu: 'Отчетность', titleEn: 'Reporting', icon: '📊', link: '/m/academy/list?tab=articles&filter=reporting' },
  { key: 'documents', titleRu: 'Документы', titleEn: 'Documents', icon: '📁', link: '/m/academy/list?tab=articles&filter=documents' },
  { key: 'compliance', titleRu: 'Комплаенс', titleEn: 'Compliance', icon: '✅', link: '/m/academy/list?tab=articles&filter=compliance' },
  { key: 'ips', titleRu: 'IPS', titleEn: 'IPS', icon: '📋', link: '/m/academy/list?tab=articles&filter=ips' },
];

export default function AcademyDashboardPage() {
  const router = useRouter();
  const { locale, clientSafe } = useApp();
  const t = i18n[locale];

  // Calculate KPIs
  const articlesPublished = seedData.kbArticles.filter(a => a.status === 'published').length;
  const coursesActive = seedData.kbCourses.filter(c => c.status === 'active').length;
  const lessonsTotal = seedData.kbLessons.length;
  const checklistsRunning = seedData.kbChecklistRuns.filter(r => r.status === 'in_progress').length;
  const faqItems = seedData.kbFaq.length;
  const policiesUpdated = seedData.kbPolicies.filter(p => {
    const updated = new Date(p.updatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return updated > thirtyDaysAgo;
  }).length;
  const clientSafeContent = seedData.kbArticles.filter(a => a.audience === 'client' || a.audience === 'both').length;
  const searches7d = 42; // Demo value

  const kpis = [
    { id: 'articles', value: articlesPublished, label: kpiLabels.articles, link: '/m/academy/list?tab=articles&status=published' },
    { id: 'courses', value: coursesActive, label: kpiLabels.courses, link: '/m/academy/list?tab=courses&status=active' },
    { id: 'lessons', value: lessonsTotal, label: kpiLabels.lessons, link: '/m/academy/list?tab=lessons' },
    { id: 'checklists', value: checklistsRunning, label: kpiLabels.checklists, link: '/m/academy/list?tab=checklists&filter=running', status: checklistsRunning > 5 ? 'warning' as const : 'ok' as const },
    { id: 'faq', value: faqItems, label: kpiLabels.faq, link: '/m/academy/list?tab=faq' },
    { id: 'policies', value: policiesUpdated, label: kpiLabels.policies, link: '/m/academy/list?tab=policies&period=30d' },
    { id: 'clientSafe', value: clientSafeContent, label: kpiLabels.clientSafe, link: '/m/academy/list?tab=articles&filter=client_safe' },
    { id: 'searches', value: searches7d, label: kpiLabels.searches, link: '/m/academy/list?tab=library' },
  ];

  const actions = [
    { id: 'createArticle', label: actionLabels.createArticle, icon: ActionIcons.FileText, variant: 'primary' as const, onClick: () => router.push('/m/academy/list?tab=articles&action=create') },
    { id: 'createCourse', label: actionLabels.createCourse, icon: ActionIcons.Book, variant: 'secondary' as const, onClick: () => router.push('/m/academy/list?tab=courses&action=create') },
    { id: 'createLesson', label: actionLabels.createLesson, icon: ActionIcons.Play, variant: 'secondary' as const, onClick: () => router.push('/m/academy/list?tab=lessons&action=create') },
    { id: 'createChecklist', label: actionLabels.createChecklist, icon: ActionIcons.CheckSquare, variant: 'secondary' as const, onClick: () => router.push('/m/academy/list?tab=checklists&action=create') },
    { id: 'rebuildIndex', label: actionLabels.rebuildIndex, icon: ActionIcons.Refresh, variant: 'ghost' as const, onClick: () => alert('Index rebuilt (demo)') },
    { id: 'generateDemo', label: actionLabels.generateDemo, icon: ActionIcons.Database, variant: 'ghost' as const, onClick: () => alert('Demo content generated') },
  ];

  // AI search setup
  const documents: SearchDocument[] = useMemo(() => {
    const docs: SearchDocument[] = [];
    seedData.kbArticles.forEach(art => {
      const a = art as unknown as Record<string, unknown>;
      docs.push({ id: art.id, type: 'article', titleRu: art.titleRu, titleEn: art.titleEn, bodyRu: art.bodyRu, bodyEn: a.bodyEn as string, tagsJson: art.tagsJson, audience: art.audience });
    });
    seedData.kbLessons.forEach(les => {
      const l = les as unknown as Record<string, unknown>;
      docs.push({ id: les.id, type: 'lesson', titleRu: les.titleRu, titleEn: les.titleEn, bodyRu: les.bodyRu, bodyEn: l.bodyEn as string, audience: les.audience });
    });
    seedData.kbFaq.forEach(faq => {
      const f = faq as unknown as Record<string, unknown>;
      docs.push({ id: faq.id, type: 'faq', titleRu: faq.questionRu, titleEn: f.questionEn as string, bodyRu: faq.answerRu, bodyEn: f.answerEn as string, tagsJson: faq.tagsJson, audience: faq.audience });
    });
    return docs;
  }, []);

  const index = useMemo(() => buildSearchIndex(documents), [documents]);

  const handleAiAsk = async (question: string) => {
    return askKnowledgeBase(question, {
      documents,
      index,
      audience: clientSafe ? 'client' : 'staff',
      locale,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">{t.title}</h1>
          <p className="text-sm text-stone-500">{t.subtitle}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/academy/list')}>
          {t.viewList} →
        </Button>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-amber-800">{t.disclaimer}</p>
      </div>

      {/* KPI Strip */}
      <AcKpiStrip kpis={kpis} />

      {/* Actions Bar */}
      <AcActionsBar actions={actions} />

      {/* Featured Content Grid */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">{t.featured}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCards.map((card) => (
            <button
              key={card.key}
              onClick={() => router.push(card.link)}
              className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all text-left"
            >
              <span className="text-2xl mb-2 block">{card.icon}</span>
              <span className="font-medium text-stone-800 text-sm">
                {locale === 'ru' ? card.titleRu : card.titleEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Panel */}
      <AcAiPanel onAsk={handleAiAsk} />

      {/* Recent Articles Preview */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-800">
            {locale === 'ru' ? 'Последние статьи' : 'Recent Articles'}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => router.push('/m/academy/list?tab=articles')}>
            {locale === 'ru' ? 'Все' : 'All'} →
          </Button>
        </div>
        <div className="space-y-3">
          {seedData.kbArticles
            .filter(a => a.status === 'published')
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5)
            .map((article) => (
              <div
                key={article.id}
                onClick={() => router.push(`/m/academy/article/${article.id}`)}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-stone-800 text-sm truncate">
                    {locale === 'ru' ? article.titleRu : article.titleEn || article.titleRu}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {new Date(article.updatedAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US')}
                  </p>
                </div>
                <span className="text-xs text-stone-400">{article.viewCount || 0} views</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
