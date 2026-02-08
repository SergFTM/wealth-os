"use client";

import { useState } from 'react';
import { PaWizardStepRecipient } from './PaWizardStepRecipient';
import { PaWizardStepScope } from './PaWizardStepScope';
import { PaWizardStepContent } from './PaWizardStepContent';
import { PaWizardStepReview } from './PaWizardStepReview';
import { PaWizardStepApprove } from './PaWizardStepApprove';

interface WizardData {
  // Step 1: Recipient
  recipientType: string;
  recipientOrg: string;
  recipientContactName?: string;
  recipientContactEmail?: string;
  purpose: string;
  // Step 2: Scope
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
  periodStart: string;
  periodEnd: string;
  periodLabel?: string;
  clientSafe: boolean;
  // Step 3: Content
  items: WizardItem[];
  coverLetterMd?: string;
  // Step 4: Review
  sensitivityKey: string;
  watermarkKey: string;
  // Step 5: Approve
  approverRoleKey?: string;
  urgencyKey?: string;
  approvalNotes?: string;
}

interface WizardItem {
  id: string;
  itemTypeKey: string;
  title: string;
  include: boolean;
  clientSafe: boolean;
  sensitivityKey: string;
}

interface PaCreateWizardProps {
  templateId?: string;
  templateData?: Partial<WizardData>;
  onComplete: (data: WizardData) => void;
  onCancel: () => void;
}

const STEPS = [
  { key: 'recipient', label: 'Получатель', number: 1 },
  { key: 'scope', label: 'Scope', number: 2 },
  { key: 'content', label: 'Содержимое', number: 3 },
  { key: 'review', label: 'Обзор', number: 4 },
  { key: 'approve', label: 'Согласование', number: 5 },
];

const initialData: WizardData = {
  recipientType: '',
  recipientOrg: '',
  purpose: '',
  scopeType: 'household',
  periodStart: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  periodEnd: new Date().toISOString().split('T')[0],
  clientSafe: true,
  items: [],
  sensitivityKey: 'medium',
  watermarkKey: 'on',
};

export function PaCreateWizard({ templateId, templateData, onComplete, onCancel }: PaCreateWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>({ ...initialData, ...templateData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Recipient
        if (!data.recipientType) newErrors.recipientType = 'Выберите тип получателя';
        if (!data.recipientOrg) newErrors.recipientOrg = 'Введите название организации';
        if (!data.purpose || data.purpose.length < 10) newErrors.purpose = 'Опишите цель (мин. 10 символов)';
        break;
      case 1: // Scope
        if (!data.scopeType) newErrors.scopeType = 'Выберите scope';
        if (!data.periodStart) newErrors.periodStart = 'Укажите начало периода';
        if (!data.periodEnd) newErrors.periodEnd = 'Укажите конец периода';
        break;
      case 2: // Content
        const includedItems = data.items.filter(i => i.include);
        if (includedItems.length === 0) newErrors.items = 'Добавьте хотя бы один документ';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      onComplete(data);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PaWizardStepRecipient
            data={data}
            errors={errors}
            onChange={updateData}
          />
        );
      case 1:
        return (
          <PaWizardStepScope
            data={data}
            errors={errors}
            onChange={updateData}
          />
        );
      case 2:
        return (
          <PaWizardStepContent
            data={data}
            errors={errors}
            onChange={updateData}
          />
        );
      case 3:
        return (
          <PaWizardStepReview
            data={data}
            errors={errors}
            onChange={updateData}
          />
        );
      case 4:
        return (
          <PaWizardStepApprove
            data={data}
            errors={errors}
            onChange={updateData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    idx < currentStep
                      ? 'bg-emerald-600 text-white'
                      : idx === currentStep
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-600'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {idx < currentStep ? '✓' : step.number}
                </div>
                <span className={`text-xs mt-2 ${idx === currentStep ? 'text-emerald-700 font-medium' : 'text-stone-500'}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-16 md:w-24 h-0.5 mx-2 ${idx < currentStep ? 'bg-emerald-600' : 'bg-stone-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-stone-600 hover:text-stone-800"
        >
          Отмена
        </button>
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200"
            >
              Назад
            </button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Создать пакет
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
