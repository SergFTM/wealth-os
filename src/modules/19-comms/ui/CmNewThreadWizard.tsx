"use client";

import { useState } from 'react';
import { MessageSquare, CheckCircle, AlertTriangle, Users, HelpCircle, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { CmClientSafeToggle } from './CmClientSafeToggle';

interface CmNewThreadWizardProps {
  onClose?: () => void;
  onSubmit?: (data: ThreadFormData) => void;
  preselectedType?: string;
  preselectedScope?: { type: string; id: string };
}

interface ThreadFormData {
  title: string;
  threadType: string;
  scopeType: string;
  scopeId: string;
  clientSafe: boolean;
  initialMessage: string;
  participants: string[];
}

const threadTypes = [
  {
    id: 'request',
    label: 'Запрос',
    description: 'Запрос информации или действия от команды',
    Icon: MessageSquare,
    color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100',
  },
  {
    id: 'approval',
    label: 'Согласование',
    description: 'Процесс утверждения документа или решения',
    Icon: CheckCircle,
    color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100',
  },
  {
    id: 'incident',
    label: 'Инцидент',
    description: 'Срочный вопрос требующий немедленного внимания',
    Icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100',
  },
  {
    id: 'advisor',
    label: 'Консультация',
    description: 'Обсуждение с внешним консультантом',
    Icon: Users,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
  },
  {
    id: 'client_service',
    label: 'Сервис',
    description: 'Сервисный запрос от клиента',
    Icon: HelpCircle,
    color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100',
  },
];

const scopeTypes = [
  { id: 'household', label: 'Домохозяйство' },
  { id: 'entity', label: 'Юр. лицо' },
  { id: 'portfolio', label: 'Портфель' },
  { id: 'account', label: 'Счет' },
];

// Mock scope options for demo
const scopeOptions: Record<string, { id: string; label: string }[]> = {
  household: [
    { id: 'hh-ivanov-001', label: 'Семья Ивановых' },
    { id: 'hh-petrov-001', label: 'Семья Петровых' },
    { id: 'hh-sidorov-001', label: 'Семья Сидоровых' },
  ],
  entity: [
    { id: 'ent-alpha-001', label: 'ООО "Альфа Инвест"' },
    { id: 'ent-beta-001', label: 'ЗАО "Бета Холдинг"' },
  ],
  portfolio: [
    { id: 'port-growth-001', label: 'Рост-Агрессивный' },
    { id: 'port-balanced-001', label: 'Сбалансированный' },
  ],
  account: [
    { id: 'acc-brok-001', label: 'Брокерский счет #1234' },
    { id: 'acc-iis-001', label: 'ИИС #5678' },
  ],
};

// Mock team members
const teamMembers = [
  { id: 'user-rm-001', name: 'Михаил Козлов', role: 'RM' },
  { id: 'user-rm-002', name: 'Анна Петрова', role: 'RM' },
  { id: 'user-pm-001', name: 'Сергей Иванов', role: 'PM' },
  { id: 'user-legal-001', name: 'Ольга Волкова', role: 'Legal' },
  { id: 'user-compliance-001', name: 'Татьяна Белова', role: 'Compliance' },
  { id: 'user-tax-001', name: 'Ирина Соколова', role: 'Tax' },
];

export function CmNewThreadWizard({
  onClose,
  onSubmit,
  preselectedType,
  preselectedScope,
}: CmNewThreadWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ThreadFormData>({
    title: '',
    threadType: preselectedType || '',
    scopeType: preselectedScope?.type || '',
    scopeId: preselectedScope?.id || '',
    clientSafe: false,
    initialMessage: '',
    participants: [],
  });

  const canProceedStep1 = formData.threadType !== '';
  const canProceedStep2 = formData.scopeType !== '' && formData.scopeId !== '' && formData.title.trim() !== '';
  const canSubmit = formData.initialMessage.trim() !== '' || formData.participants.length > 0;

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">Новый тред</h2>
            <p className="text-sm text-stone-500">Шаг {step} из 3</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-stone-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Thread Type */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-stone-700">Выберите тип треда</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {threadTypes.map((type) => {
                  const Icon = type.Icon;
                  const isSelected = formData.threadType === type.id;

                  return (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, threadType: type.id })}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? type.color.replace('hover:', '')
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        isSelected ? type.color.split(' ')[0] : 'text-stone-400'
                      }`} />
                      <div>
                        <div className="font-medium text-stone-800">{type.label}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{type.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Scope & Title */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Scope Type */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Область (scope)
                </label>
                <div className="flex flex-wrap gap-2">
                  {scopeTypes.map((scope) => (
                    <button
                      key={scope.id}
                      onClick={() => setFormData({ ...formData, scopeType: scope.id, scopeId: '' })}
                      className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                        formData.scopeType === scope.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scope ID */}
              {formData.scopeType && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Выберите {scopeTypes.find(s => s.id === formData.scopeType)?.label}
                  </label>
                  <select
                    value={formData.scopeId}
                    onChange={(e) => setFormData({ ...formData, scopeId: e.target.value })}
                    className="w-full px-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Выберите...</option>
                    {scopeOptions[formData.scopeType]?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Тема треда
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Краткое описание темы..."
                  className="w-full px-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Client Safe Toggle */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Видимость для клиента
                </label>
                <CmClientSafeToggle
                  isClientSafe={formData.clientSafe}
                  onChange={(value) => setFormData({ ...formData, clientSafe: value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Participants & Initial Message */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Добавить участников
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-stone-200 rounded-lg p-3">
                  {teamMembers.map((member) => (
                    <label key={member.id} className="flex items-center gap-3 cursor-pointer hover:bg-stone-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={formData.participants.includes(member.id)}
                        onChange={(e) => {
                          const newParticipants = e.target.checked
                            ? [...formData.participants, member.id]
                            : formData.participants.filter(p => p !== member.id);
                          setFormData({ ...formData, participants: newParticipants });
                        }}
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-stone-700">{member.name}</span>
                      <span className="text-xs text-stone-400">({member.role})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Initial Message */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Первое сообщение
                </label>
                <textarea
                  value={formData.initialMessage}
                  onChange={(e) => setFormData({ ...formData, initialMessage: e.target.value })}
                  placeholder="Опишите суть вопроса или задачи..."
                  rows={4}
                  className="w-full px-4 py-3 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-stone-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-stone-700 mb-2">Сводка</h4>
                <div className="space-y-1 text-sm text-stone-600">
                  <p><span className="text-stone-400">Тип:</span> {threadTypes.find(t => t.id === formData.threadType)?.label}</p>
                  <p><span className="text-stone-400">Scope:</span> {formData.scopeType} / {formData.scopeId}</p>
                  <p><span className="text-stone-400">Тема:</span> {formData.title}</p>
                  <p><span className="text-stone-400">Видимость:</span> {formData.clientSafe ? 'Виден клиенту' : 'Только для команды'}</p>
                  <p><span className="text-stone-400">Участники:</span> {formData.participants.length} чел.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose?.()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 1 ? 'Назад' : 'Отмена'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              className={`inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                (step === 1 ? canProceedStep1 : canProceedStep2)
                  ? 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                  : 'text-stone-400 bg-stone-200 cursor-not-allowed'
              }`}
            >
              Далее
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                canSubmit
                  ? 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                  : 'text-stone-400 bg-stone-200 cursor-not-allowed'
              }`}
            >
              Создать тред
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
