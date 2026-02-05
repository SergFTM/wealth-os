"use client";

interface ObIntakeWizardProps {
  onCreateIntake: (caseType: string) => void;
}

const intakeTypes = [
  { key: 'household', label: 'Household', desc: 'Физическое лицо / семья', icon: '👤' },
  { key: 'entity', label: 'Entity', desc: 'Юридическое лицо / компания', icon: '🏢' },
  { key: 'trust', label: 'Trust', desc: 'Траст / фонд', icon: '🏛' },
  { key: 'advisor', label: 'Advisor', desc: 'Внешний советник', icon: '💼' },
];

export function ObIntakeWizard({ onCreateIntake }: ObIntakeWizardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <h3 className="font-semibold text-stone-800 mb-3">Создать Intake</h3>
      <div className="grid grid-cols-2 gap-2">
        {intakeTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => onCreateIntake(type.key)}
            className="flex items-start gap-3 p-3 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left"
          >
            <span className="text-xl">{type.icon}</span>
            <div>
              <div className="text-sm font-medium text-stone-800">{type.label}</div>
              <div className="text-xs text-stone-500">{type.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
