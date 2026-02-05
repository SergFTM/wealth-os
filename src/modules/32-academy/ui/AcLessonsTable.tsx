'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AcStatusPill } from './AcStatusPill';

interface Lesson {
  id: string;
  courseId?: string;
  titleRu: string;
  titleEn?: string;
  durationMin?: number;
  audience: string;
  quizJson?: object;
}

interface Course {
  id: string;
  titleRu: string;
  titleEn?: string;
}

interface AcLessonsTableProps {
  lessons: Lesson[];
  courses?: Course[];
}

export function AcLessonsTable({ lessons, courses = [] }: AcLessonsTableProps) {
  const router = useRouter();
  const { locale } = useApp();

  const getCourseTitle = (courseId?: string) => {
    if (!courseId) return '—';
    const course = courses.find(c => c.id === courseId);
    if (!course) return '—';
    return locale === 'ru' ? course.titleRu : course.titleEn || course.titleRu;
  };

  const labels = {
    title: { ru: 'Урок', en: 'Lesson', uk: 'Урок' },
    course: { ru: 'Курс', en: 'Course', uk: 'Курс' },
    duration: { ru: 'Длительность', en: 'Duration', uk: 'Тривалість' },
    audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
    quiz: { ru: 'Тест', en: 'Quiz', uk: 'Тест' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    min: { ru: 'мин', en: 'min', uk: 'хв' },
    yes: { ru: 'Да', en: 'Yes', uk: 'Так' },
    no: { ru: 'Нет', en: 'No', uk: 'Ні' },
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.title[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.course[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.duration[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.audience[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.quiz[locale]}
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.actions[locale]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
                className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/m/academy/lesson/${lesson.id}`)}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-800">
                    {locale === 'ru' ? lesson.titleRu : lesson.titleEn || lesson.titleRu}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {getCourseTitle(lesson.courseId)}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {lesson.durationMin || 15} {labels.min[locale]}
                </td>
                <td className="px-4 py-3">
                  <AcStatusPill status={lesson.audience} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {lesson.quizJson ? (
                    <span className="text-emerald-600">{labels.yes[locale]}</span>
                  ) : (
                    <span className="text-stone-400">{labels.no[locale]}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/m/academy/lesson/${lesson.id}`);
                    }}
                  >
                    {labels.open[locale]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
