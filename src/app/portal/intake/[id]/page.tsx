"use client";

import { useState, useMemo, use, useEffect } from 'react';
import { ObIntakeFormRenderer } from '@/modules/12-onboarding/ui/ObIntakeFormRenderer';

interface IntakeForm {
  id: string;
  caseId: string;
  formType: string;
  status: string;
  completionPct: number;
  payloadJson?: Record<string, string>;
  sentAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PortalIntakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [intake, setIntake] = useState<IntakeForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/collections/intakeForms/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setIntake(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSave = async (data: Record<string, string>) => {
    if (!intake) return;
    setSaving(true);
    try {
      const totalFields = 24;
      const filled = Object.values(data).filter(v => v && v.trim()).length;
      const pct = Math.round((filled / totalFields) * 100);

      const res = await fetch(`/api/collections/intakeForms/${intake.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payloadJson: data, completionPct: pct }),
      });
      if (res.ok) {
        const updated = await res.json();
        setIntake(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!intake) return;
    await fetch(`/api/collections/intakeForms/${intake.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed', completedAt: new Date().toISOString(), completionPct: 100 }),
    });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="text-stone-500">Загрузка...</div>
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-stone-800 mb-2">Анкета не найдена</h1>
          <p className="text-stone-500">Ссылка недействительна или анкета была удалена.</p>
        </div>
      </div>
    );
  }

  if (intake.status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-stone-800 mb-2">Анкета заполнена</h1>
          <p className="text-stone-500">Спасибо! Ваша анкета была успешно отправлена.</p>
          <p className="text-sm text-stone-400 mt-4">
            Дата завершения: {intake.completedAt ? new Date(intake.completedAt).toLocaleDateString('ru') : '—'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-stone-800">Wealth OS</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Onboarding анкета</h1>
          <p className="text-stone-500 mt-2">Пожалуйста, заполните все поля анкеты</p>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 mb-6">
          <p className="text-xs text-amber-700 text-center">
            Ваши данные защищены и будут использоваться только для целей комплаенс-проверки.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
            <span>Прогресс заполнения</span>
            <span>{intake.completionPct}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all"
              style={{ width: `${intake.completionPct}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {saving && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700">
              Сохранение...
            </div>
          )}
          {saved && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
              ✓ Сохранено
            </div>
          )}

          <ObIntakeFormRenderer
            payload={intake.payloadJson || {}}
            onSave={handleSave}
          />

          <div className="mt-6 pt-4 border-t border-stone-200">
            <button
              onClick={handleSubmit}
              disabled={intake.completionPct < 80}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Отправить анкету
            </button>
            {intake.completionPct < 80 && (
              <p className="text-xs text-stone-400 text-center mt-2">
                Заполните минимум 80% анкеты для отправки
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-stone-400">
          Powered by Wealth OS
        </div>
      </div>
    </div>
  );
}
