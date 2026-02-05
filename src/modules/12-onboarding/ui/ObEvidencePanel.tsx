"use client";

interface RequiredDoc {
  key: string;
  label: string;
  status: 'missing' | 'uploaded' | 'verified';
}

interface ObEvidencePanelProps {
  caseType?: string;
  requiredDocs?: RequiredDoc[];
  missingCount?: number;
  onUploadDoc?: () => void;
  onCreatePack?: () => void;
  onRequestDoc?: () => void;
  compact?: boolean;
}

const defaultDocs = (caseType: string): RequiredDoc[] => {
  const common: RequiredDoc[] = [
    { key: 'passport', label: 'Паспорт / ID', status: 'missing' },
    { key: 'proof_address', label: 'Подтверждение адреса', status: 'missing' },
    { key: 'w9_w8', label: 'W-9 / W-8 (если применимо)', status: 'missing' },
  ];
  if (caseType === 'entity') {
    return [
      ...common,
      { key: 'incorporation', label: 'Учредительные документы', status: 'missing' },
      { key: 'register_extract', label: 'Выписка из реестра', status: 'missing' },
      { key: 'shareholder_register', label: 'Реестр акционеров', status: 'missing' },
    ];
  }
  if (caseType === 'trust') {
    return [
      ...common,
      { key: 'trust_deed', label: 'Trust Deed', status: 'missing' },
      { key: 'schedule_beneficiaries', label: 'Schedule of Beneficiaries', status: 'missing' },
    ];
  }
  return common;
};

const statusColors: Record<string, string> = {
  missing: 'bg-red-100 text-red-700',
  uploaded: 'bg-amber-100 text-amber-700',
  verified: 'bg-emerald-100 text-emerald-700',
};

const statusLabels: Record<string, string> = {
  missing: 'Отсутствует',
  uploaded: 'Загружен',
  verified: 'Проверен',
};

export function ObEvidencePanel({
  caseType = 'household',
  requiredDocs,
  missingCount,
  onUploadDoc,
  onCreatePack,
  onRequestDoc,
  compact,
}: ObEvidencePanelProps) {
  const docs = requiredDocs || defaultDocs(caseType);
  const missing = missingCount ?? docs.filter(d => d.status === 'missing').length;

  return (
    <div className="space-y-3">
      {missing > 0 && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-700 font-medium">
            {missing} документ(ов) отсутствует
          </p>
        </div>
      )}

      {!compact && (
        <div className="space-y-1">
          {docs.map((doc) => (
            <div key={doc.key} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-stone-50">
              <span className="text-sm text-stone-700">{doc.label}</span>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[doc.status]}`}>
                {statusLabels[doc.status]}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {onUploadDoc && (
          <button
            onClick={onUploadDoc}
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
          >
            Загрузить документ
          </button>
        )}
        {onCreatePack && (
          <button
            onClick={onCreatePack}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 border border-stone-200 rounded-lg"
          >
            Evidence pack
          </button>
        )}
        {onRequestDoc && (
          <button
            onClick={onRequestDoc}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 border border-stone-200 rounded-lg"
          >
            Запросить у клиента
          </button>
        )}
      </div>
    </div>
  );
}
