'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/store';

const labels = {
  title: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' },
  subtitle: { ru: 'Выберите тип запроса и заполните детали', en: 'Select request type and fill in details', uk: 'Оберіть тип запиту та заповніть деталі' },
  back: { ru: '← Назад', en: '← Back', uk: '← Назад' },
  requestType: { ru: 'Тип запроса', en: 'Request Type', uk: 'Тип запиту' },
  requestTitle: { ru: 'Название', en: 'Title', uk: 'Назва' },
  description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
  priority: { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' },
  attachments: { ru: 'Прикрепить документы', en: 'Attach Documents', uk: 'Прикріпити документи' },
  submit: { ru: 'Отправить запрос', en: 'Submit Request', uk: 'Відправити запит' },
  cancel: { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' },
  success: { ru: 'Запрос успешно создан!', en: 'Request created successfully!', uk: 'Запит успішно створено!' },
  successDesc: { ru: 'Мы получили ваш запрос и свяжемся с вами в ближайшее время.', en: 'We received your request and will contact you soon.', uk: 'Ми отримали ваш запит і зв\'яжемося з вами найближчим часом.' },
  viewRequest: { ru: 'Открыть запрос', en: 'View Request', uk: 'Відкрити запит' },
  createAnother: { ru: 'Создать еще', en: 'Create Another', uk: 'Створити ще' },
  disclaimer: { ru: 'Стандартный срок ответа — 1-2 рабочих дня. Срочные запросы обрабатываются в течение 4 часов.', en: 'Standard response time is 1-2 business days. Urgent requests are processed within 4 hours.', uk: 'Стандартний термін відповіді — 1-2 робочих дні. Термінові запити обробляються протягом 4 годин.' },
};

const requestTypes = [
  {
    key: 'document_request',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    label: { ru: 'Запрос документа', en: 'Document Request', uk: 'Запит документа' },
    desc: { ru: 'Запросить копию документа или справку', en: 'Request document copy or certificate', uk: 'Запросити копію документа або довідку' },
  },
  {
    key: 'payment_request',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    label: { ru: 'Запрос платежа', en: 'Payment Request', uk: 'Запит платежу' },
    desc: { ru: 'Запросить информацию о платеже или счете', en: 'Request payment or invoice information', uk: 'Запросити інформацію про платіж або рахунок' },
  },
  {
    key: 'change_request',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    label: { ru: 'Запрос изменения', en: 'Change Request', uk: 'Запит зміни' },
    desc: { ru: 'Запросить изменение данных или настроек', en: 'Request data or settings change', uk: 'Запросити зміну даних або налаштувань' },
  },
  {
    key: 'question',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    label: { ru: 'Вопрос', en: 'Question', uk: 'Питання' },
    desc: { ru: 'Задать вопрос команде', en: 'Ask a question', uk: 'Задати питання команді' },
  },
];

const priorities = [
  { key: 'low', label: { ru: 'Низкий', en: 'Low', uk: 'Низький' } },
  { key: 'normal', label: { ru: 'Обычный', en: 'Normal', uk: 'Звичайний' } },
  { key: 'high', label: { ru: 'Высокий', en: 'High', uk: 'Високий' } },
  { key: 'urgent', label: { ru: 'Срочный', en: 'Urgent', uk: 'Терміновий' } },
];

export function PtRequestNew() {
  const { locale, user } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type');

  const [step, setStep] = useState(preselectedType ? 2 : 1);
  const [requestType, setRequestType] = useState(preselectedType || '');
  const [title, setTitle] = useState(searchParams.get('subject') || '');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdId, setCreatedId] = useState('');

  const handleSelectType = (type: string) => {
    setRequestType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);

    const newRequest = {
      id: `cr-${Date.now()}`,
      clientId: 'client-001',
      householdId: 'hh-001',
      requestedByUserId: user?.name || 'user-001',
      requestType,
      title,
      description,
      priority,
      status: 'submitted',
      slaDueAt: new Date(Date.now() + (priority === 'urgent' ? 4 * 60 * 60 * 1000 : 2 * 24 * 60 * 60 * 1000)).toISOString(),
      attachmentDocIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/collections/clientRequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });
      setCreatedId(newRequest.id);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to create request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">{labels.success[locale]}</h2>
          <p className="text-stone-500 mb-6">{labels.successDesc[locale]}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/portal/requests/${createdId}`}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              {labels.viewRequest[locale]}
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setRequestType('');
                setTitle('');
                setDescription('');
                setPriority('normal');
              }}
              className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors"
            >
              {labels.createAnother[locale]}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/portal/requests" className="text-sm text-emerald-600 hover:text-emerald-700">
        {labels.back[locale]}
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
        <p className="text-sm text-stone-500 mt-1">{labels.subtitle[locale]}</p>
      </div>

      {/* Step 1: Select type */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requestTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => handleSelectType(type.key)}
              className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 text-left hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center text-emerald-600 mb-4">
                {type.icon}
              </div>
              <h3 className="font-semibold text-stone-800 mb-1">{type.label[locale]}</h3>
              <p className="text-sm text-stone-500">{type.desc[locale]}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Fill details */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6 space-y-5">
            {/* Request type display */}
            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                {requestTypes.find(t => t.key === requestType)?.icon}
              </div>
              <div>
                <div className="text-xs text-stone-500">{labels.requestType[locale]}</div>
                <div className="font-medium text-stone-800">
                  {requestTypes.find(t => t.key === requestType)?.label[locale]}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="ml-auto text-sm text-emerald-600 hover:text-emerald-700"
              >
                {locale === 'ru' ? 'Изменить' : 'Change'}
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {labels.requestTitle[locale]} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-100 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                placeholder={locale === 'ru' ? 'Краткое описание запроса' : 'Brief request description'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {labels.description[locale]} *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-100 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none"
                placeholder={locale === 'ru' ? 'Подробное описание...' : 'Detailed description...'}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {labels.priority[locale]}
              </label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPriority(p.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      priority === p.key
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {p.label[locale]}
                  </button>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {labels.attachments[locale]}
              </label>
              <div className="border-2 border-dashed border-emerald-100 rounded-xl p-6 text-center hover:border-emerald-200 transition-colors cursor-pointer">
                <svg className="w-8 h-8 text-stone-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-stone-500">
                  {locale === 'ru' ? 'Перетащите файлы или нажмите для выбора' : 'Drag files or click to select'}
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-emerald-800">{labels.disclaimer[locale]}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link
              href="/portal/requests"
              className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors"
            >
              {labels.cancel[locale]}
            </Link>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !description.trim()}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (locale === 'ru' ? 'Отправка...' : 'Submitting...') : labels.submit[locale]}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
