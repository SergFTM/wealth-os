"use client";

import { ShieldAlert, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

interface AiGuardrailsNoticeProps {
  blocked?: boolean;
  reason?: string;
  type?: 'blocked' | 'warning' | 'info' | 'client_safe';
  actions?: { label: string; onClick: () => void }[];
}

export function AiGuardrailsNotice({
  blocked = false,
  reason,
  type = blocked ? 'blocked' : 'info',
  actions,
}: AiGuardrailsNoticeProps) {
  const config = {
    blocked: {
      icon: ShieldAlert,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      title: 'Запрос заблокирован',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-600',
      title: 'Внимание',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      title: 'Информация',
    },
    client_safe: {
      icon: ShieldCheck,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      iconColor: 'text-emerald-600',
      title: 'Client-safe режим',
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <div
      className={`rounded-xl border ${currentConfig.bgColor} ${currentConfig.borderColor} p-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${currentConfig.iconColor} flex-shrink-0 mt-0.5`} />

        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${currentConfig.textColor}`}>
            {currentConfig.title}
          </h4>

          {reason && (
            <p className={`text-sm mt-1 ${currentConfig.textColor} opacity-80`}>
              {reason}
            </p>
          )}

          {type === 'client_safe' && !reason && (
            <p className={`text-sm mt-1 ${currentConfig.textColor} opacity-80`}>
              Ответ безопасен для показа клиенту. Internal notes и staff-only данные скрыты.
            </p>
          )}

          {type === 'blocked' && !reason && (
            <p className={`text-sm mt-1 ${currentConfig.textColor} opacity-80`}>
              Этот запрос не разрешен для вашей роли. Обратитесь к администратору.
            </p>
          )}

          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    type === 'blocked'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : type === 'warning'
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Disclaimer banner component
export function AiDisclaimerBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          <strong>Дисклеймер:</strong> AI выводы информационные и требуют проверки человеком.
        </p>
      </div>
    </div>
  );
}
