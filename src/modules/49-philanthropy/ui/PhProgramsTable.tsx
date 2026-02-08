"use client";

import { PROGRAM_THEME_KEYS } from '../config';

interface PhilProgram {
  id: string;
  name: string;
  themeKey: keyof typeof PROGRAM_THEME_KEYS;
  ownerUserId?: string;
  status: 'active' | 'archived';
  annualBudget?: number;
  currency?: string;
  grantsCount?: number;
}

interface PhProgramsTableProps {
  programs: PhilProgram[];
  onRowClick?: (program: PhilProgram) => void;
  emptyMessage?: string;
}

export function PhProgramsTable({ programs, onRowClick, emptyMessage = 'Нет программ' }: PhProgramsTableProps) {
  if (programs.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Программа</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Тема</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Грантов</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {programs.map((program) => {
            const themeConfig = PROGRAM_THEME_KEYS[program.themeKey];
            return (
              <tr
                key={program.id}
                onClick={() => onRowClick?.(program)}
                className="hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-900">{program.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${themeConfig?.color || 'stone'}-100 text-${themeConfig?.color || 'stone'}-700`}>
                    {themeConfig?.ru || program.themeKey}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    program.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {program.status === 'active' ? 'Активна' : 'Архив'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {program.grantsCount ?? '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
