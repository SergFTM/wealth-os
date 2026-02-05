"use client";

import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/Button";

interface ScActionsBarProps {
  onCreateUser?: () => void;
  onCreateRole?: () => void;
  onBindRole?: () => void;
  onStartReview?: () => void;
  onGenerateIncidents?: () => void;
  onExportAudit?: () => void;
}

export function ScActionsBar({
  onCreateUser,
  onCreateRole,
  onBindRole,
  onStartReview,
  onGenerateIncidents,
  onExportAudit,
}: ScActionsBarProps) {
  const { locale } = useApp();

  return (
    <div className="flex flex-wrap gap-2">
      {onCreateUser && (
        <Button variant="primary" onClick={onCreateUser}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {locale === "ru" ? "Создать пользователя" : "Create User"}
        </Button>
      )}
      {onCreateRole && (
        <Button variant="secondary" onClick={onCreateRole}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {locale === "ru" ? "Создать роль" : "Create Role"}
        </Button>
      )}
      {onBindRole && (
        <Button variant="secondary" onClick={onBindRole}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {locale === "ru" ? "Привязать роль" : "Bind Role"}
        </Button>
      )}
      {onStartReview && (
        <Button variant="secondary" onClick={onStartReview}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          {locale === "ru" ? "Запустить ревью" : "Start Review"}
        </Button>
      )}
      {onGenerateIncidents && (
        <Button variant="secondary" onClick={onGenerateIncidents}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {locale === "ru" ? "Сгенерировать инциденты" : "Generate Incidents"}
        </Button>
      )}
      {onExportAudit && (
        <Button variant="secondary" onClick={onExportAudit}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {locale === "ru" ? "Экспорт аудита" : "Export Audit"}
        </Button>
      )}
    </div>
  );
}
