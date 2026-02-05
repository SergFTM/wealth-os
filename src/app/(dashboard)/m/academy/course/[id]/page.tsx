"use client";

import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AcStatusPill } from '@/modules/32-academy/ui';
import seedData from '@/modules/32-academy/seed.json';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useApp();
  const id = params.id as string;

  const course = seedData.kbCourses.find(c => c.id === id);
  const lessons = seedData.kbLessons.filter(l => course?.lessonIdsJson?.includes(l.id));

  const labels = {
    notFound: { ru: 'Курс не найден', en: 'Course not found', uk: 'Курс не знайдено' },
    back: { ru: '← К списку курсов', en: '← Back to courses', uk: '← До списку курсів' },
    lessons: { ru: 'Уроки', en: 'Lessons', uk: 'Уроки' },
    duration: { ru: 'Длительность', en: 'Duration', uk: 'Тривалість' },
    min: { ru: 'мин', en: 'min', uk: 'хв' },
    start: { ru: 'Начать курс', en: 'Start Course', uk: 'Почати курс' },
    progress: { ru: 'Прогресс', en: 'Progress', uk: 'Прогрес' },
    quiz: { ru: 'Тест', en: 'Quiz', uk: 'Тест' },
    checklist: { ru: 'Связанный чек-лист', en: 'Related Checklist', uk: "Пов'язаний чек-лист" },
  };

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-stone-800 mb-2">{labels.notFound[locale]}</h1>
        <Button variant="primary" onClick={() => router.push('/m/academy/list?tab=courses')}>
          {labels.back[locale]}
        </Button>
      </div>
    );
  }

  const relatedChecklist = course.relatedChecklistId
    ? seedData.kbChecklists.find(c => c.id === course.relatedChecklistId)
    : null;

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => router.push('/m/academy')} className="text-stone-500 hover:text-stone-700">
          {locale === 'ru' ? 'Академия' : 'Academy'}
        </button>
        <span className="text-stone-300">/</span>
        <button onClick={() => router.push('/m/academy/list?tab=courses')} className="text-stone-500 hover:text-stone-700">
          {locale === 'ru' ? 'Курсы' : 'Courses'}
        </button>
        <span className="text-stone-300">/</span>
        <span className="text-stone-800 font-medium truncate max-w-xs">
          {locale === 'ru' ? course.titleRu : course.titleEn || course.titleRu}
        </span>
      </div>

      {/* Course Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">
              {locale === 'ru' ? course.titleRu : course.titleEn || course.titleRu}
            </h1>
            {course.descriptionRu && (
              <p className="text-stone-600 mb-4">
                {locale === 'ru' ? course.descriptionRu : ((course as unknown as Record<string, string>).descriptionEn || course.descriptionRu)}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>{lessons.length} {labels.lessons[locale]}</span>
              <span>•</span>
              <span>{course.estimatedDurationMin || 0} {labels.min[locale]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AcStatusPill status={course.status} />
            <AcStatusPill status={course.audience} />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-stone-200/50">
          <Button variant="primary" onClick={() => alert('Starting course (demo)')}>
            {labels.start[locale]}
          </Button>
        </div>
      </div>

      {/* Lessons List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">{labels.lessons[locale]}</h2>
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              onClick={() => router.push(`/m/academy/lesson/${lesson.id}`)}
              className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-emerald-50 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-stone-800">
                  {locale === 'ru' ? lesson.titleRu : lesson.titleEn || lesson.titleRu}
                </h4>
                <p className="text-xs text-stone-500">
                  {lesson.durationMin || 15} {labels.min[locale]}
                  {lesson.quizJson && ` • ${labels.quiz[locale]}`}
                </p>
              </div>
              <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Related Checklist */}
      {relatedChecklist && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">{labels.checklist[locale]}</h2>
          <div
            onClick={() => router.push(`/m/academy/checklist/${relatedChecklist.id}`)}
            className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 cursor-pointer transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-stone-800">
                {locale === 'ru' ? relatedChecklist.nameRu : relatedChecklist.nameEn || relatedChecklist.nameRu}
              </h4>
              <p className="text-xs text-stone-500">
                {relatedChecklist.stepsJson?.length || 0} {locale === 'ru' ? 'шагов' : 'steps'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
