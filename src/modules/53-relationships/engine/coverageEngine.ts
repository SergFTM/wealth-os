/**
 * Coverage Engine
 * Manages RM coverage assignments and gap detection
 */

export interface Specialist {
  roleKey: string;
  userId: string;
}

export interface RelCoverage {
  id: string;
  clientId: string;
  scopeTypeKey: 'household' | 'person';
  scopeId: string;
  primaryUserId: string;
  backupUserId?: string;
  specialistsJson: Specialist[];
  tierKey: 'A' | 'B' | 'C';
  slaNotes?: string;
  hasGaps: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoverageParams {
  clientId: string;
  scopeTypeKey: 'household' | 'person';
  scopeId: string;
  primaryUserId: string;
  backupUserId?: string;
  specialists?: Specialist[];
  tierKey: 'A' | 'B' | 'C';
  slaNotes?: string;
}

export interface CoverageGap {
  scopeTypeKey: string;
  scopeId: string;
  scopeName: string;
  gapType: 'no_primary' | 'no_backup' | 'missing_specialist';
  details: string;
}

export async function createCoverage(
  params: CreateCoverageParams,
  apiBase: string = '/api/collections'
): Promise<RelCoverage> {
  const hasGaps = detectGaps(params);

  const record = {
    clientId: params.clientId,
    scopeTypeKey: params.scopeTypeKey,
    scopeId: params.scopeId,
    primaryUserId: params.primaryUserId,
    backupUserId: params.backupUserId || null,
    specialistsJson: params.specialists || [],
    tierKey: params.tierKey,
    slaNotes: params.slaNotes || null,
    hasGaps,
  };

  const res = await fetch(`${apiBase}/relCoverage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });

  if (!res.ok) throw new Error('Failed to create coverage');
  return res.json();
}

export async function updateCoverage(
  id: string,
  patch: Partial<RelCoverage>,
  apiBase: string = '/api/collections'
): Promise<RelCoverage> {
  // Recalculate gaps if relevant fields changed
  if (patch.primaryUserId !== undefined ||
      patch.backupUserId !== undefined ||
      patch.specialistsJson !== undefined ||
      patch.tierKey !== undefined) {
    patch.hasGaps = detectGaps(patch);
  }

  const res = await fetch(`${apiBase}/relCoverage/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });

  if (!res.ok) throw new Error('Failed to update coverage');
  return res.json();
}

export async function assignPrimaryRM(
  coverageId: string,
  userId: string,
  apiBase: string = '/api/collections'
): Promise<RelCoverage> {
  return updateCoverage(coverageId, { primaryUserId: userId }, apiBase);
}

export async function assignBackupRM(
  coverageId: string,
  userId: string,
  apiBase: string = '/api/collections'
): Promise<RelCoverage> {
  return updateCoverage(coverageId, { backupUserId: userId }, apiBase);
}

export async function addSpecialist(
  coverageId: string,
  specialist: Specialist,
  existingSpecialists: Specialist[],
  apiBase: string = '/api/collections'
): Promise<RelCoverage> {
  const specialistsJson = [...existingSpecialists, specialist];
  return updateCoverage(coverageId, { specialistsJson }, apiBase);
}

function detectGaps(params: Partial<CreateCoverageParams | RelCoverage>): boolean {
  // Tier A requires backup and more specialists
  if (params.tierKey === 'A') {
    if (!params.backupUserId) return true;
    const specialists = (params as RelCoverage).specialistsJson || (params as CreateCoverageParams).specialists || [];
    if (specialists.length < 2) return true;
  }

  // Tier B requires backup
  if (params.tierKey === 'B') {
    if (!params.backupUserId) return true;
  }

  return false;
}

export function findCoverageGaps(
  coverages: RelCoverage[],
  scopeNames: Map<string, string>
): CoverageGap[] {
  const gaps: CoverageGap[] = [];

  for (const coverage of coverages) {
    const scopeName = scopeNames.get(coverage.scopeId) || coverage.scopeId;

    if (!coverage.primaryUserId) {
      gaps.push({
        scopeTypeKey: coverage.scopeTypeKey,
        scopeId: coverage.scopeId,
        scopeName,
        gapType: 'no_primary',
        details: 'Нет основного RM',
      });
    }

    if (coverage.tierKey === 'A' || coverage.tierKey === 'B') {
      if (!coverage.backupUserId) {
        gaps.push({
          scopeTypeKey: coverage.scopeTypeKey,
          scopeId: coverage.scopeId,
          scopeName,
          gapType: 'no_backup',
          details: `Tier ${coverage.tierKey} требует резервного RM`,
        });
      }
    }

    if (coverage.tierKey === 'A') {
      const hasCompliance = coverage.specialistsJson.some(s => s.roleKey === 'compliance');
      if (!hasCompliance) {
        gaps.push({
          scopeTypeKey: coverage.scopeTypeKey,
          scopeId: coverage.scopeId,
          scopeName,
          gapType: 'missing_specialist',
          details: 'Tier A требует Compliance специалиста',
        });
      }
    }
  }

  return gaps;
}

export function getCoveragesWithGaps(coverages: RelCoverage[]): RelCoverage[] {
  return coverages.filter(c => c.hasGaps);
}

export function getTierLabel(
  tierKey: string,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const labels: Record<string, Record<string, string>> = {
    A: { ru: 'Уровень A', en: 'Tier A', uk: 'Рівень A' },
    B: { ru: 'Уровень B', en: 'Tier B', uk: 'Рівень B' },
    C: { ru: 'Уровень C', en: 'Tier C', uk: 'Рівень C' },
  };
  return labels[tierKey]?.[locale] || tierKey;
}

export function getSpecialistRoleLabel(
  roleKey: string,
  locale: 'ru' | 'en' | 'uk' = 'ru'
): string {
  const labels: Record<string, Record<string, string>> = {
    primary_rm: { ru: 'Основной RM', en: 'Primary RM', uk: 'Основний RM' },
    backup_rm: { ru: 'Резервный RM', en: 'Backup RM', uk: 'Резервний RM' },
    cio: { ru: 'CIO', en: 'CIO', uk: 'CIO' },
    cfo: { ru: 'CFO', en: 'CFO', uk: 'CFO' },
    compliance: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' },
    tax: { ru: 'Tax Advisor', en: 'Tax Advisor', uk: 'Податковий радник' },
    legal: { ru: 'Legal Counsel', en: 'Legal Counsel', uk: 'Юридичний радник' },
  };
  return labels[roleKey]?.[locale] || roleKey;
}
