"use client";

import { CreditBank, CreditFacility, CreditLoan } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

export interface CrBankDetailProps {
  bank: CreditBank;
  facilities: CreditFacility[];
  loans?: CreditLoan[];
  totalExposure?: number;
  onBack?: () => void;
  onEdit?: () => void;
  onOpenFacility?: (id: string) => void;
  onOpenLoan?: (loanId: string) => void;
  onShowAudit?: () => void;
}

export function CrBankDetail({ bank, facilities, loans = [], totalExposure, onBack, onOpenFacility, onEdit, onOpenLoan, onShowAudit }: CrBankDetailProps) {
  const totalLimit = facilities.reduce((sum, f) => sum + f.limitAmount, 0);
  const totalDrawn = facilities.reduce((sum, f) => sum + f.drawnAmount, 0);
  const exposure = totalExposure ?? totalDrawn;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-stone-800">{bank.name}</h2>
            <p className="text-sm text-stone-500 mt-1">
              {bank.swiftCode && <span className="mr-3">SWIFT: {bank.swiftCode}</span>}
              <span>ID: {bank.id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onShowAudit && (
            <button
              onClick={onShowAudit}
              className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
            >
              Аудит
            </button>
          )}
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Редактировать
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Facilities</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {facilities.length}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Общий лимит</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(totalLimit)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Использовано</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(totalDrawn)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Exposure</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(exposure)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Использование</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {totalLimit > 0 ? ((totalDrawn / totalLimit) * 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>

      {/* Contacts */}
      {bank.contactsJson && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Контакты</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bank.contactsJson.relationshipManager && (
              <div>
                <div className="text-xs text-stone-400">Relationship Manager</div>
                <div className="text-sm font-medium text-stone-700">
                  {bank.contactsJson.relationshipManager}
                </div>
                {bank.contactsJson.rmEmail && (
                  <div className="text-sm text-stone-500">{bank.contactsJson.rmEmail}</div>
                )}
              </div>
            )}
            {bank.contactsJson.creditOfficer && (
              <div>
                <div className="text-xs text-stone-400">Credit Officer</div>
                <div className="text-sm font-medium text-stone-700">
                  {bank.contactsJson.creditOfficer}
                </div>
                {bank.contactsJson.coEmail && (
                  <div className="text-sm text-stone-500">{bank.contactsJson.coEmail}</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Facilities List */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h3 className="font-semibold text-stone-800">Facilities</h3>
        </div>
        {facilities.length === 0 ? (
          <div className="p-6 text-center text-stone-400">
            Нет facilities для этого банка
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">Название</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Тип</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Лимит</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Drawn</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Maturity</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr
                  key={facility.id}
                  className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer"
                  onClick={() => onOpenFacility?.(facility.id)}
                >
                  <td className="px-4 py-2 font-medium text-stone-800">
                    {facility.name}
                  </td>
                  <td className="px-4 py-2 text-stone-600 capitalize">
                    {facility.facilityTypeKey}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(facility.limitAmount)}
                  </td>
                  <td className="px-4 py-2 text-right text-stone-600">
                    {formatCurrency(facility.drawnAmount)}
                  </td>
                  <td className="px-4 py-2 text-stone-600">
                    {new Date(facility.maturityAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-2">
                    <CrStatusPill status={facility.statusKey} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Loans List */}
      {loans.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100">
            <h3 className="font-semibold text-stone-800">Loans</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-4 py-2 font-medium text-stone-600">Название</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Тип ставки</th>
                <th className="text-right px-4 py-2 font-medium text-stone-600">Остаток</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Maturity</th>
                <th className="text-left px-4 py-2 font-medium text-stone-600">Статус</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr
                  key={loan.id}
                  className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer"
                  onClick={() => onOpenLoan?.(loan.id)}
                >
                  <td className="px-4 py-2 font-medium text-stone-800">{loan.name}</td>
                  <td className="px-4 py-2 text-stone-600 capitalize">{loan.rateTypeKey}</td>
                  <td className="px-4 py-2 text-right text-stone-600">{formatCurrency(loan.outstandingAmount)}</td>
                  <td className="px-4 py-2 text-stone-600">{new Date(loan.maturityAt).toLocaleDateString('ru-RU')}</td>
                  <td className="px-4 py-2"><CrStatusPill status={loan.statusKey} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      {bank.notes && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Заметки</h3>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{bank.notes}</p>
        </div>
      )}
    </div>
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}
