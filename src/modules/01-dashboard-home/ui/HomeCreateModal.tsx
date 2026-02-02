"use client";

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { createRecord } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';

interface HomeCreateModalProps {
  open: boolean;
  type: string;
  onClose: () => void;
}

export function HomeCreateModal({ open, type, onClose }: HomeCreateModalProps) {
  const { locale } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!open) return null;

  const typeConfig: Record<string, { title: string; collection: string; fields: Array<{ key: string; label: string; type: string; required?: boolean }> }> = {
    task: {
      title: locale === 'ru' ? 'Создать задачу' : 'Create Task',
      collection: 'tasks',
      fields: [
        { key: 'title', label: locale === 'ru' ? 'Название' : 'Title', type: 'text', required: true },
        { key: 'description', label: locale === 'ru' ? 'Описание' : 'Description', type: 'textarea' },
        { key: 'priority', label: locale === 'ru' ? 'Приоритет' : 'Priority', type: 'select' },
        { key: 'dueDate', label: locale === 'ru' ? 'Срок' : 'Due Date', type: 'date', required: true },
      ],
    },
    request: {
      title: locale === 'ru' ? 'Создать запрос' : 'Create Request',
      collection: 'threads',
      fields: [
        { key: 'subject', label: locale === 'ru' ? 'Тема' : 'Subject', type: 'text', required: true },
        { key: 'message', label: locale === 'ru' ? 'Сообщение' : 'Message', type: 'textarea', required: true },
      ],
    },
    report: {
      title: locale === 'ru' ? 'Создать отчетный пакет' : 'Create Report Package',
      collection: 'documents',
      fields: [
        { key: 'title', label: locale === 'ru' ? 'Название' : 'Title', type: 'text', required: true },
        { key: 'type', label: locale === 'ru' ? 'Тип' : 'Type', type: 'select' },
      ],
    },
    invoice: {
      title: locale === 'ru' ? 'Создать счёт' : 'Create Invoice',
      collection: 'invoices',
      fields: [
        { key: 'type', label: locale === 'ru' ? 'Тип' : 'Type', type: 'select', required: true },
        { key: 'amount', label: locale === 'ru' ? 'Сумма' : 'Amount', type: 'number', required: true },
        { key: 'dueDate', label: locale === 'ru' ? 'Срок оплаты' : 'Due Date', type: 'date', required: true },
      ],
    },
    document: {
      title: locale === 'ru' ? 'Добавить документ' : 'Add Document',
      collection: 'documents',
      fields: [
        { key: 'title', label: locale === 'ru' ? 'Название' : 'Title', type: 'text', required: true },
        { key: 'type', label: locale === 'ru' ? 'Тип' : 'Type', type: 'select' },
      ],
    },
  };

  const config = typeConfig[type] || typeConfig.task;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createRecord(config.collection, {
        ...formData,
        status: 'open',
      });
      onClose();
      setFormData({});
    } catch (error) {
      console.error('Create failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">{config.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {config.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    rows={3}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required={field.required}
                  >
                    <option value="">{locale === 'ru' ? 'Выберите...' : 'Select...'}</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                {locale === 'ru' ? 'Отмена' : 'Cancel'}
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading 
                  ? (locale === 'ru' ? 'Создание...' : 'Creating...') 
                  : (locale === 'ru' ? 'Создать' : 'Create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
