'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { AcStatusPill } from './AcStatusPill';

interface Course {
  id: string;
  titleRu: string;
  titleEn?: string;
  audience: string;
  lessonIdsJson?: string[];
  status: string;
  estimatedDurationMin?: number;
  updatedAt?: string;
}

interface AcCoursesTableProps {
  courses: Course[];
  onStart?: (id: string) => void;
}

export function AcCoursesTable({ courses, onStart }: AcCoursesTableProps) {
  const router = useRouter();
  const { locale } = useApp();

  const labels = {
    title: { ru: 'Курс', en: 'Course', uk: 'Курс' },
    audience: { ru: 'Аудитория', en: 'Audience', uk: 'Аудиторія' },
    lessons: { ru: 'Уроков', en: 'Lessons', uk: 'Уроків' },
    duration: { ru: 'Длительность', en: 'Duration', uk: 'Тривалість' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    start: { ru: 'Начать', en: 'Start', uk: 'Почати' },
    min: { ru: 'мин', en: 'min', uk: 'хв' },
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
                {labels.audience[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.lessons[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.duration[locale]}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.status[locale]}
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {labels.actions[locale]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/m/academy/course/${course.id}`)}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-800">
                    {locale === 'ru' ? course.titleRu : course.titleEn || course.titleRu}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AcStatusPill status={course.audience} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {course.lessonIdsJson?.length || 0}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {course.estimatedDurationMin || 0} {labels.min[locale]}
                </td>
                <td className="px-4 py-3">
                  <AcStatusPill status={course.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="text-xs text-emerald-600 hover:text-emerald-700"
                      onClick={() => router.push(`/m/academy/course/${course.id}`)}
                    >
                      {labels.open[locale]}
                    </button>
                    {course.status === 'active' && onStart && (
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => onStart(course.id)}
                      >
                        {labels.start[locale]}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
