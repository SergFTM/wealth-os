"use client";

import { useState } from 'react';
import { Button } from './Button';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'email';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FormRendererProps {
  fields: FormField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function FormRenderer({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Сохранить',
  cancelLabel = 'Отмена',
  loading = false,
}: FormRendererProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);

  const handleChange = (key: string, value: unknown) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            {field.label}
            {field.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              value={String(values[field.key] || '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-white"
            >
              <option value="">Выберите...</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              value={String(values[field.key] || '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 h-24 resize-none"
            />
          ) : (
            <input
              type={field.type}
              value={String(values[field.key] || '')}
              onChange={(e) => handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          )}
        </div>
      ))}
      
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
