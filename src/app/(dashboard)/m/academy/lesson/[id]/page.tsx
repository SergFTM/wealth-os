"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { AcStatusPill } from '@/modules/32-academy/ui';
import { renderContent, getReadingTime } from '@/modules/32-academy/engine/contentRenderer';
import seedData from '@/modules/32-academy/seed.json';

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, clientSafe } = useApp();
  const id = params.id as string;
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const lesson = seedData.kbLessons.find(l => l.id === id);
  const course = lesson?.courseId ? seedData.kbCourses.find(c => c.id === lesson.courseId) : null;

  const labels = {
    notFound: { ru: 'Урок не найден', en: 'Lesson not found', uk: 'Урок не знайдено' },
    back: { ru: '← К списку уроков', en: '← Back to lessons', uk: '← До списку уроків' },
    min: { ru: 'мин', en: 'min', uk: 'хв' },
    complete: { ru: 'Завершить урок', en: 'Complete Lesson', uk: 'Завершити урок' },
    quiz: { ru: 'Проверочный тест', en: 'Quiz', uk: 'Перевірочний тест' },
    submit: { ru: 'Проверить', en: 'Submit', uk: 'Перевірити' },
    correct: { ru: 'Правильно!', en: 'Correct!', uk: 'Правильно!' },
    incorrect: { ru: 'Неправильно', en: 'Incorrect', uk: 'Неправильно' },
    score: { ru: 'Результат', en: 'Score', uk: 'Результат' },
    nextLesson: { ru: 'Следующий урок', en: 'Next Lesson', uk: 'Наступний урок' },
    backToCourse: { ru: '← К курсу', en: '← Back to Course', uk: '← До курсу' },
  };

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-stone-800 mb-2">{labels.notFound[locale]}</h1>
        <Button variant="primary" onClick={() => router.push('/m/academy/list?tab=lessons')}>
          {labels.back[locale]}
        </Button>
      </div>
    );
  }

  const title = locale === 'ru' ? lesson.titleRu : lesson.titleEn || lesson.titleRu;
  const body = locale === 'ru' ? lesson.bodyRu : ((lesson as unknown as Record<string, string>).bodyEn || lesson.bodyRu);
  const readingTime = getReadingTime(body);
  const renderedContent = renderContent(body, { locale, clientSafe });

  // Get next lesson in course
  let nextLesson = null;
  if (course) {
    const currentIndex = course.lessonIdsJson?.indexOf(lesson.id) ?? -1;
    if (currentIndex >= 0 && course.lessonIdsJson && currentIndex < course.lessonIdsJson.length - 1) {
      nextLesson = seedData.kbLessons.find(l => l.id === course.lessonIdsJson![currentIndex + 1]);
    }
  }

  // Parse quiz if exists
  const quiz = lesson.quizJson as { questions: { q: string; options: string[]; correct: number }[] } | undefined;

  const handleQuizAnswer = (qIndex: number, aIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const getQuizScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    return correct;
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => router.push('/m/academy')} className="text-stone-500 hover:text-stone-700">
          {locale === 'ru' ? 'Академия' : 'Academy'}
        </button>
        <span className="text-stone-300">/</span>
        {course && (
          <>
            <button onClick={() => router.push(`/m/academy/course/${course.id}`)} className="text-stone-500 hover:text-stone-700">
              {locale === 'ru' ? course.titleRu : course.titleEn || course.titleRu}
            </button>
            <span className="text-stone-300">/</span>
          </>
        )}
        <span className="text-stone-800 font-medium truncate max-w-xs">{title}</span>
      </div>

      {/* Lesson Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">{title}</h1>
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <span>{readingTime} {labels.min[locale]}</span>
              <span>•</span>
              <span>{lesson.durationMin || 15} {labels.min[locale]} {locale === 'ru' ? 'рекомендуется' : 'recommended'}</span>
            </div>
          </div>
          <AcStatusPill status={lesson.audience} />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div
          className="prose prose-stone prose-emerald max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>

      {/* Quiz */}
      {quiz && quiz.questions && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-purple-100/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {labels.quiz[locale]}
          </h2>

          <div className="space-y-6">
            {quiz.questions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-3">
                <p className="font-medium text-stone-800">{qIndex + 1}. {q.q}</p>
                <div className="space-y-2">
                  {q.options.map((opt, aIndex) => {
                    const isSelected = quizAnswers[qIndex] === aIndex;
                    const isCorrect = q.correct === aIndex;
                    let bgClass = 'bg-stone-50 hover:bg-stone-100';
                    if (quizSubmitted) {
                      if (isCorrect) bgClass = 'bg-emerald-100 border-emerald-300';
                      else if (isSelected && !isCorrect) bgClass = 'bg-rose-100 border-rose-300';
                    } else if (isSelected) {
                      bgClass = 'bg-purple-100 border-purple-300';
                    }

                    return (
                      <button
                        key={aIndex}
                        onClick={() => handleQuizAnswer(qIndex, aIndex)}
                        disabled={quizSubmitted}
                        className={`w-full text-left px-4 py-2 rounded-lg border transition-colors ${bgClass}`}
                      >
                        <span className="text-sm text-stone-700">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <Button
              variant="primary"
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < quiz.questions.length}
              className="mt-6"
            >
              {labels.submit[locale]}
            </Button>
          ) : (
            <div className="mt-6 p-4 bg-purple-50 rounded-xl">
              <p className="font-medium text-stone-800">
                {labels.score[locale]}: {getQuizScore()}/{quiz.questions.length}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        {course && (
          <Button variant="secondary" onClick={() => router.push(`/m/academy/course/${course.id}`)}>
            {labels.backToCourse[locale]}
          </Button>
        )}
        <Button variant="primary" onClick={() => alert('Lesson completed (demo)')}>
          {labels.complete[locale]}
        </Button>
        {nextLesson && (
          <Button variant="ghost" onClick={() => router.push(`/m/academy/lesson/${nextLesson.id}`)}>
            {labels.nextLesson[locale]} →
          </Button>
        )}
      </div>
    </div>
  );
}
