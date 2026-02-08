/**
 * AI Consent Assistant — explain consents, detect conflicts, propose minimal access
 */

import type { ConsentRecord, ConsentConflict, DerivedPermission, PrivacyPolicy } from './types';
import { computeDerivedPermissions, isConsentActive } from './consentEngine';
import { detectAllConflicts } from './conflictEngine';

export interface AiInsight {
  title: string;
  body: string;
  confidence: number;
  sources: string[];
  assumptions: string[];
}

export function explainCurrentConsents(
  consents: ConsentRecord[]
): AiInsight {
  const active = consents.filter(isConsentActive);
  const derived = computeDerivedPermissions(active);

  const lines: string[] = [];
  lines.push(`Всего активных согласий: ${active.length}.`);
  lines.push(`Уникальных получателей доступа: ${derived.length}.`);
  lines.push('');

  for (const d of derived.slice(0, 5)) {
    const restrictions: string[] = [];
    if (d.viewOnly) restrictions.push('только просмотр');
    if (d.allowDownload) restrictions.push('скачивание разрешено');
    if (d.clientSafe) restrictions.push('client-safe');

    lines.push(
      `- **${d.granteeLabel}**: ${d.modules.length} модулей, ${d.entityIds.length} юр. лиц, ${d.docIds.length} документов. ` +
      `Ограничения: ${restrictions.join(', ') || 'нет'}.`
    );
  }

  if (derived.length > 5) {
    lines.push(`...и ещё ${derived.length - 5} получателей.`);
  }

  return {
    title: 'Обзор текущих согласий',
    body: lines.join('\n'),
    confidence: 0.95,
    sources: ['consents collection', `${active.length} active records`],
    assumptions: ['Согласия с истёкшим сроком не включены', 'Отозванные согласия не включены'],
  };
}

export function detectConflictsInsight(
  consents: ConsentRecord[],
  policies: PrivacyPolicy[]
): AiInsight {
  const detected = detectAllConflicts(consents, policies);

  if (detected.length === 0) {
    return {
      title: 'Конфликтов не обнаружено',
      body: 'Анализ не выявил конфликтов между согласиями, политиками и ограничениями. Все согласия корректны.',
      confidence: 0.9,
      sources: ['consents', 'privacyPolicies'],
      assumptions: ['Проверены пересечения, просроченные доступы, нарушения политик и client-safe несоответствия'],
    };
  }

  const bySeverity = {
    critical: detected.filter(d => d.severityKey === 'critical').length,
    warning: detected.filter(d => d.severityKey === 'warning').length,
  };

  const lines: string[] = [];
  lines.push(`Обнаружено конфликтов: ${detected.length} (критических: ${bySeverity.critical}, предупреждений: ${bySeverity.warning}).`);
  lines.push('');

  for (const d of detected.slice(0, 5)) {
    lines.push(`- [${d.severityKey.toUpperCase()}] ${d.suggestedResolutionJson?.description || d.conflictTypeKey}`);
  }

  if (detected.length > 5) {
    lines.push(`...и ещё ${detected.length - 5} конфликтов.`);
  }

  return {
    title: 'Обнаружены конфликты',
    body: lines.join('\n'),
    confidence: 0.85,
    sources: ['consents', 'privacyPolicies', 'conflict detection engine'],
    assumptions: ['Автоматическое обнаружение — некоторые конфликты могут быть ложноположительными'],
  };
}

export function proposeMinimalAccessSet(
  consents: ConsentRecord[],
  granteeId: string
): AiInsight {
  const granteeConsents = consents.filter(
    c => c.granteeRefJson.id === granteeId && isConsentActive(c)
  );

  if (granteeConsents.length === 0) {
    return {
      title: 'Нет активных согласий',
      body: `Получатель ${granteeId} не имеет активных согласий.`,
      confidence: 1.0,
      sources: ['consents'],
      assumptions: [],
    };
  }

  const grantee = granteeConsents[0].granteeRefJson;
  const allModules = new Set<string>();
  const allEntities = new Set<string>();
  const allDocs = new Set<string>();
  const allPacks = new Set<string>();

  for (const c of granteeConsents) {
    for (const m of c.scopeJson.modulesJson || []) allModules.add(m);
    for (const e of c.scopeJson.entityIdsJson || []) allEntities.add(e);
    for (const d of c.scopeJson.docIdsJson || []) allDocs.add(d);
    for (const p of c.scopeJson.packIdsJson || []) allPacks.add(p);
  }

  const purposes = [...new Set(granteeConsents.map(c => c.purposeKey))];

  const lines: string[] = [];
  lines.push(`Получатель: **${grantee.label}** (${grantee.type}).`);
  lines.push(`Цели доступа: ${purposes.join(', ')}.`);
  lines.push('');
  lines.push('Минимальный набор доступа:');
  lines.push(`- Модули: ${allModules.size > 0 ? [...allModules].join(', ') : 'все'}`);
  lines.push(`- Юр. лица: ${allEntities.size > 0 ? allEntities.size + ' записей' : 'все'}`);
  lines.push(`- Документы: ${allDocs.size > 0 ? allDocs.size + ' записей' : 'все'}`);
  lines.push(`- Пакеты: ${allPacks.size > 0 ? allPacks.size + ' записей' : 'все'}`);
  lines.push('');
  lines.push('Рекомендация: ограничить доступ только необходимыми модулями и объектами, использовать view-only и client-safe.');

  return {
    title: `Минимальный доступ: ${grantee.label}`,
    body: lines.join('\n'),
    confidence: 0.8,
    sources: [`${granteeConsents.length} active consents`],
    assumptions: ['Основано на текущих согласиях', 'Не учитывает будущие потребности'],
  };
}
