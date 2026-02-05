'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Modal } from '@/components/ui/Modal';

interface NtCreateRuleModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function NtCreateRuleModal({ onClose, onCreated }: NtCreateRuleModalProps) {
  const t = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'event',
    triggerEvent: '',
    priority: 'normal',
    category: 'task',
    channels: ['inbox'],
    status: 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/collections/notificationRules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientId: 'client-001',
          conditions: [],
          targetRoles: [],
          firedCount: 0,
          createdByUserId: 'user-001',
          createdByName: 'Current User',
        }),
      });

      if (response.ok) {
        onCreated();
      }
    } catch (error) {
      console.error('Failed to create rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  return (
    <Modal open={true} onClose={onClose} title={t('createRule', { ru: 'Создать правило', en: 'Create Rule', uk: 'Створити правило' })}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('ruleName', { ru: 'Название правила', en: 'Rule Name', uk: 'Назва правила' })}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('description', { ru: 'Описание', en: 'Description', uk: 'Опис' })}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={2}
          />
        </div>

        {/* Trigger Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('triggerType', { ru: 'Тип триггера', en: 'Trigger Type', uk: 'Тип тригера' })}
          </label>
          <select
            value={formData.triggerType}
            onChange={(e) => setFormData(prev => ({ ...prev, triggerType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="event">{t('event', { ru: 'Событие', en: 'Event', uk: 'Подія' })}</option>
            <option value="schedule">{t('schedule', { ru: 'Расписание', en: 'Schedule', uk: 'Розклад' })}</option>
            <option value="condition">{t('condition', { ru: 'Условие', en: 'Condition', uk: 'Умова' })}</option>
            <option value="threshold">{t('threshold', { ru: 'Порог', en: 'Threshold', uk: 'Поріг' })}</option>
          </select>
        </div>

        {/* Trigger Event (if event type) */}
        {formData.triggerType === 'event' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('triggerEvent', { ru: 'Событие', en: 'Event', uk: 'Подія' })}
            </label>
            <select
              value={formData.triggerEvent}
              onChange={(e) => setFormData(prev => ({ ...prev, triggerEvent: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">{t('selectEvent', { ru: 'Выберите событие', en: 'Select event', uk: 'Оберіть подію' })}</option>
              <option value="task.assigned">{t('taskAssigned', { ru: 'Задача назначена', en: 'Task assigned', uk: 'Завдання призначено' })}</option>
              <option value="task.completed">{t('taskCompleted', { ru: 'Задача завершена', en: 'Task completed', uk: 'Завдання завершено' })}</option>
              <option value="task.overdue">{t('taskOverdue', { ru: 'Задача просрочена', en: 'Task overdue', uk: 'Завдання прострочено' })}</option>
              <option value="approval.requested">{t('approvalRequested', { ru: 'Запрос одобрения', en: 'Approval requested', uk: 'Запит схвалення' })}</option>
              <option value="document.updated">{t('documentUpdated', { ru: 'Документ обновлён', en: 'Document updated', uk: 'Документ оновлено' })}</option>
              <option value="message.received">{t('messageReceived', { ru: 'Сообщение получено', en: 'Message received', uk: 'Повідомлення отримано' })}</option>
              <option value="compliance.violation">{t('complianceViolation', { ru: 'Нарушение комплаенс', en: 'Compliance violation', uk: 'Порушення комплаєнсу' })}</option>
            </select>
          </div>
        )}

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('priority', { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' })}
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="low">{t('low', { ru: 'Низкий', en: 'Low', uk: 'Низький' })}</option>
            <option value="normal">{t('normal', { ru: 'Обычный', en: 'Normal', uk: 'Звичайний' })}</option>
            <option value="high">{t('high', { ru: 'Высокий', en: 'High', uk: 'Високий' })}</option>
            <option value="urgent">{t('urgent', { ru: 'Срочный', en: 'Urgent', uk: 'Терміновий' })}</option>
          </select>
        </div>

        {/* Channels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('channels', { ru: 'Каналы доставки', en: 'Delivery Channels', uk: 'Канали доставки' })}
          </label>
          <div className="flex flex-wrap gap-2">
            {['inbox', 'email', 'push', 'sms', 'slack', 'teams'].map(channel => (
              <label
                key={channel}
                className={`
                  px-3 py-1.5 rounded-lg border cursor-pointer transition-colors
                  ${formData.channels.includes(channel)
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={formData.channels.includes(channel)}
                  onChange={() => handleChannelToggle(channel)}
                  className="sr-only"
                />
                {channel}
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {t('cancel', { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' })}
          </button>
          <button
            type="submit"
            disabled={loading || !formData.name}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {loading
              ? t('creating', { ru: 'Создание...', en: 'Creating...', uk: 'Створення...' })
              : t('create', { ru: 'Создать', en: 'Create', uk: 'Створити' })
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}
