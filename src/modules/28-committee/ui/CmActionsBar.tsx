'use client';

/**
 * Committee Actions Bar Component
 * Primary action buttons for committee dashboard
 */

interface CmActionsBarProps {
  onCreateMeeting?: () => void;
  onAddAgendaItem?: () => void;
  onRecordDecision?: () => void;
  onOpenVote?: () => void;
  onPublishMinutes?: () => void;
  onGenerateDemo?: () => void;
  loading?: boolean;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    createMeeting: 'Создать заседание',
    addAgendaItem: 'Добавить пункт',
    recordDecision: 'Записать решение',
    openVote: 'Открыть голосование',
    publishMinutes: 'Опубликовать протокол',
    generateDemo: 'Демо заседание',
  },
  en: {
    createMeeting: 'Create Meeting',
    addAgendaItem: 'Add Agenda Item',
    recordDecision: 'Record Decision',
    openVote: 'Open Vote',
    publishMinutes: 'Publish Minutes',
    generateDemo: 'Generate Demo',
  },
  uk: {
    createMeeting: 'Створити засідання',
    addAgendaItem: 'Додати пункт',
    recordDecision: 'Записати рішення',
    openVote: 'Відкрити голосування',
    publishMinutes: 'Опублікувати протокол',
    generateDemo: 'Демо засідання',
  },
};

export function CmActionsBar({
  onCreateMeeting,
  onAddAgendaItem,
  onRecordDecision,
  onOpenVote,
  onPublishMinutes,
  onGenerateDemo,
  loading = false,
  lang = 'ru',
}: CmActionsBarProps) {
  const l = labels[lang];

  const buttonBase = 'px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50';
  const primaryBtn = `${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`;
  const secondaryBtn = `${buttonBase} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`;
  const ghostBtn = `${buttonBase} text-gray-600 hover:bg-gray-100`;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-xl border border-gray-200">
      {onCreateMeeting && (
        <button onClick={onCreateMeeting} disabled={loading} className={primaryBtn}>
          📅 {l.createMeeting}
        </button>
      )}

      {onAddAgendaItem && (
        <button onClick={onAddAgendaItem} disabled={loading} className={secondaryBtn}>
          📋 {l.addAgendaItem}
        </button>
      )}

      {onRecordDecision && (
        <button onClick={onRecordDecision} disabled={loading} className={secondaryBtn}>
          ✅ {l.recordDecision}
        </button>
      )}

      {onOpenVote && (
        <button onClick={onOpenVote} disabled={loading} className={secondaryBtn}>
          🗳️ {l.openVote}
        </button>
      )}

      {onPublishMinutes && (
        <button onClick={onPublishMinutes} disabled={loading} className={secondaryBtn}>
          📝 {l.publishMinutes}
        </button>
      )}

      {onGenerateDemo && (
        <button onClick={onGenerateDemo} disabled={loading} className={ghostBtn}>
          🎲 {l.generateDemo}
        </button>
      )}
    </div>
  );
}
