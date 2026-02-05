"use client";

import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface CmClientSafeToggleProps {
  isClientSafe: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  showWarning?: boolean;
}

export function CmClientSafeToggle({
  isClientSafe,
  onChange,
  disabled = false,
  showWarning = true,
}: CmClientSafeToggleProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => !disabled && onChange?.(!isClientSafe)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } ${isClientSafe ? 'bg-emerald-500' : 'bg-stone-300'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
              isClientSafe ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          {isClientSafe ? (
            <>
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Виден клиенту</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-stone-500" />
              <span className="text-sm font-medium text-stone-600">Только для команды</span>
            </>
          )}
        </div>
      </div>

      {showWarning && isClientSafe && (
        <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Этот тред и его сообщения будут видны клиенту в портале.
            Внутренние заметки (internal notes) останутся скрытыми.
          </p>
        </div>
      )}

      {!isClientSafe && (
        <p className="text-xs text-stone-500">
          Только участники команды смогут видеть этот тред
        </p>
      )}
    </div>
  );
}

// Compact version for inline use
export function CmClientSafeBadge({ isClientSafe }: { isClientSafe: boolean }) {
  if (isClientSafe) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Eye className="w-3 h-3" />
        Виден клиенту
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-stone-100 text-stone-600 border border-stone-200">
      <EyeOff className="w-3 h-3" />
      Внутренний
    </span>
  );
}
