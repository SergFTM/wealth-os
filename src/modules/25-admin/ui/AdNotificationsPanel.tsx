'use client';

/**
 * Admin Notifications Panel Component
 * Manage notification templates
 */

import { useState } from 'react';
import { NotificationTemplate, templateKeyLabels, ALL_TEMPLATE_KEYS, TemplateKey } from '../schema/notificationTemplate';

interface AdNotificationsPanelProps {
  templates: NotificationTemplate[];
  onSave: (template: Partial<NotificationTemplate>) => Promise<void>;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  templates: { ru: 'Шаблоны уведомлений', en: 'Notification Templates', uk: 'Шаблони сповіщень' },
  selectTemplate: { ru: 'Выберите шаблон для редактирования', en: 'Select template to edit', uk: 'Оберіть шаблон для редагування' },
  subject: { ru: 'Тема письма', en: 'Subject', uk: 'Тема листа' },
  body: { ru: 'Текст письма', en: 'Body', uk: 'Текст листа' },
  senderName: { ru: 'Имя отправителя', en: 'Sender Name', uk: 'Імя відправника' },
  signature: { ru: 'Подпись', en: 'Signature', uk: 'Підпис' },
  active: { ru: 'Активен', en: 'Active', uk: 'Активний' },
  preview: { ru: 'Предпросмотр', en: 'Preview', uk: 'Попередній перегляд' },
  save: { ru: 'Сохранить шаблон', en: 'Save Template', uk: 'Зберегти шаблон' },
  mvpNote: { ru: 'MVP: отправка писем не реализована', en: 'MVP: email sending not implemented', uk: 'MVP: відправка листів не реалізована' },
};

export function AdNotificationsPanel({ templates, onSave, lang = 'ru' }: AdNotificationsPanelProps) {
  const [selectedKey, setSelectedKey] = useState<TemplateKey | null>(null);
  const [editTemplate, setEditTemplate] = useState<Partial<NotificationTemplate> | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const selectTemplate = (key: TemplateKey) => {
    const existing = templates.find(t => t.templateKey === key);
    if (existing) {
      setEditTemplate({ ...existing });
    } else {
      setEditTemplate({
        templateKey: key,
        subjectRu: '',
        subjectEn: '',
        subjectUk: '',
        bodyRu: '',
        bodyEn: '',
        bodyUk: '',
        senderName: 'Wealth OS',
        signature: '',
        isActive: true,
      });
    }
    setSelectedKey(key);
    setShowPreview(false);
  };

  const updateField = (field: keyof NotificationTemplate, value: string | boolean) => {
    if (!editTemplate) return;
    setEditTemplate({ ...editTemplate, [field]: value });
  };

  const handleSave = async () => {
    if (!editTemplate) return;
    setSaving(true);
    try {
      await onSave(editTemplate);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* MVP Note */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        {labels.mvpNote[lang]}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Template List */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-3">
            {labels.templates[lang]}
          </div>
          {ALL_TEMPLATE_KEYS.map(key => {
            const existing = templates.find(t => t.templateKey === key);
            const isActive = existing?.isActive ?? false;

            return (
              <button
                key={key}
                onClick={() => selectTemplate(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedKey === key
                    ? 'bg-emerald-100 border-emerald-500 border'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{templateKeyLabels[key][lang]}</span>
                  {existing && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Template Editor */}
        <div className="col-span-2">
          {!selectedKey ? (
            <div className="text-gray-500 text-center py-12">
              {labels.selectTemplate[lang]}
            </div>
          ) : editTemplate && !showPreview ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {templateKeyLabels[selectedKey][lang]}
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editTemplate.isActive ?? true}
                    onChange={e => updateField('isActive', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm">{labels.active[lang]}</span>
                </label>
              </div>

              {/* Subject Fields */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Subject (RU)</label>
                  <input
                    type="text"
                    value={editTemplate.subjectRu || ''}
                    onChange={e => updateField('subjectRu', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Subject (EN)</label>
                  <input
                    type="text"
                    value={editTemplate.subjectEn || ''}
                    onChange={e => updateField('subjectEn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Subject (UK)</label>
                  <input
                    type="text"
                    value={editTemplate.subjectUk || ''}
                    onChange={e => updateField('subjectUk', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Body Fields */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">{labels.body[lang]} (RU)</label>
                <textarea
                  value={editTemplate.bodyRu || ''}
                  onChange={e => updateField('bodyRu', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">{labels.body[lang]} (EN)</label>
                <textarea
                  value={editTemplate.bodyEn || ''}
                  onChange={e => updateField('bodyEn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  rows={4}
                />
              </div>

              {/* Sender & Signature */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{labels.senderName[lang]}</label>
                  <input
                    type="text"
                    value={editTemplate.senderName || ''}
                    onChange={e => updateField('senderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{labels.signature[lang]}</label>
                  <input
                    type="text"
                    value={editTemplate.signature || ''}
                    onChange={e => updateField('signature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? '...' : labels.save[lang]}
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {labels.preview[lang]}
                </button>
              </div>
            </div>
          ) : editTemplate && showPreview ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                <span className="text-sm font-medium">Preview</span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  ← Back
                </button>
              </div>
              <div className="p-4 bg-white">
                <div className="text-xs text-gray-500 mb-1">From: {editTemplate.senderName}</div>
                <div className="font-medium mb-4">{editTemplate.subjectRu}</div>
                <div className="text-sm whitespace-pre-wrap">{editTemplate.bodyRu}</div>
                {editTemplate.signature && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    {editTemplate.signature}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
