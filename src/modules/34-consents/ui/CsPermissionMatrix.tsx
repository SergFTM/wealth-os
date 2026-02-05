"use client";

import React from 'react';
import { Check, X } from 'lucide-react';

interface CsPermissionMatrixProps {
  permissions: string[];
  clientSafe?: boolean;
  watermarkRequired?: boolean;
  editable?: boolean;
  onChange?: (permissions: string[]) => void;
}

const allPermissions = [
  { key: 'view', label: 'View', description: 'Просмотр данных' },
  { key: 'download', label: 'Download', description: 'Скачивание файлов' },
  { key: 'export', label: 'Export', description: 'Экспорт в CSV/PDF' },
  { key: 'api', label: 'API', description: 'Доступ через API' },
];

export function CsPermissionMatrix({
  permissions,
  clientSafe,
  watermarkRequired,
  editable = false,
  onChange,
}: CsPermissionMatrixProps) {
  const togglePermission = (key: string) => {
    if (!editable || !onChange) return;

    if (permissions.includes(key)) {
      onChange(permissions.filter(p => p !== key));
    } else {
      onChange([...permissions, key]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {allPermissions.map(perm => {
          const isGranted = permissions.includes(perm.key);
          return (
            <button
              key={perm.key}
              onClick={() => togglePermission(perm.key)}
              disabled={!editable}
              className={`
                flex items-center gap-2 p-3 rounded-lg border transition-colors
                ${editable ? 'cursor-pointer hover:bg-stone-50' : 'cursor-default'}
                ${isGranted
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-stone-50 border-stone-200'
                }
              `}
            >
              <div className={`
                w-5 h-5 rounded flex items-center justify-center
                ${isGranted ? 'bg-emerald-500' : 'bg-stone-300'}
              `}>
                {isGranted ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <X className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="text-left">
                <div className={`font-medium text-sm ${isGranted ? 'text-emerald-700' : 'text-stone-500'}`}>
                  {perm.label}
                </div>
                <div className="text-xs text-stone-500">{perm.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {(clientSafe !== undefined || watermarkRequired !== undefined) && (
        <div className="flex gap-3 pt-2 border-t border-stone-200">
          {clientSafe !== undefined && (
            <div className={`
              flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium
              ${clientSafe
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-stone-50 text-stone-500 border border-stone-200'
              }
            `}>
              {clientSafe ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              Client-Safe
            </div>
          )}
          {watermarkRequired !== undefined && (
            <div className={`
              flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium
              ${watermarkRequired
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-stone-50 text-stone-500 border border-stone-200'
              }
            `}>
              {watermarkRequired ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              Watermark
            </div>
          )}
        </div>
      )}
    </div>
  );
}
