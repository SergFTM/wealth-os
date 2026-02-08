/**
 * Clustering Engine - Groups similar exceptions together
 */

import { Exception } from './exceptionRouter';

export interface ExceptionCluster {
  id: string;
  clientId: string;
  name: string;
  clusterTypeKey: 'type_source' | 'title_pattern' | 'temporal';
  status: 'active' | 'resolved';
  memberIdsJson: string[];
  topSourceJson?: {
    moduleKey: string;
    collection?: string;
    count: number;
  };
  patternJson?: {
    typeKey?: string;
    sourceModuleKey?: string;
    titleTokens?: string[];
  };
  openCount: number;
  totalCount: number;
  lastExceptionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClusteringResult {
  clusters: Array<{
    pattern: ClusterPattern;
    exceptions: Exception[];
    name: string;
  }>;
  unclustered: Exception[];
}

interface ClusterPattern {
  typeKey: string;
  sourceModuleKey: string;
  titleTokens: string[];
}

function normalizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2)
    .slice(0, 5);
}

function getPatternKey(pattern: ClusterPattern): string {
  return `${pattern.typeKey}|${pattern.sourceModuleKey}|${pattern.titleTokens.slice(0, 3).join('_')}`;
}

export function clusterExceptions(exceptions: Exception[]): ClusteringResult {
  const patternMap = new Map<string, { pattern: ClusterPattern; exceptions: Exception[] }>();
  const unclustered: Exception[] = [];

  for (const exception of exceptions) {
    const pattern: ClusterPattern = {
      typeKey: exception.typeKey,
      sourceModuleKey: exception.sourceModuleKey,
      titleTokens: normalizeTitle(exception.title)
    };

    const key = getPatternKey(pattern);

    if (patternMap.has(key)) {
      patternMap.get(key)!.exceptions.push(exception);
    } else {
      patternMap.set(key, { pattern, exceptions: [exception] });
    }
  }

  const clusters: ClusteringResult['clusters'] = [];

  for (const [, value] of patternMap) {
    if (value.exceptions.length >= 2) {
      clusters.push({
        pattern: value.pattern,
        exceptions: value.exceptions,
        name: generateClusterName(value.pattern, value.exceptions)
      });
    } else {
      unclustered.push(...value.exceptions);
    }
  }

  return { clusters, unclustered };
}

function generateClusterName(pattern: ClusterPattern, exceptions: Exception[]): string {
  const typeLabels: Record<string, string> = {
    sync: 'Синхронизация',
    recon: 'Сверка',
    missing_doc: 'Отсутствие документа',
    stale_price: 'Устаревшая цена',
    approval: 'Согласование',
    vendor_sla: 'SLA вендора',
    security: 'Безопасность'
  };

  const typeLabel = typeLabels[pattern.typeKey] || pattern.typeKey;
  const count = exceptions.length;

  if (pattern.titleTokens.length > 0) {
    return `${typeLabel}: ${pattern.titleTokens.slice(0, 2).join(' ')} (${count})`;
  }

  return `${typeLabel} из модуля ${pattern.sourceModuleKey} (${count})`;
}

export function buildClusterRecord(
  clientId: string,
  clusterData: ClusteringResult['clusters'][0]
): Omit<ExceptionCluster, 'id' | 'createdAt' | 'updatedAt'> {
  const openExceptions = clusterData.exceptions.filter(e => e.status !== 'closed');

  const sourceCount = new Map<string, number>();
  for (const ex of clusterData.exceptions) {
    const key = ex.sourceModuleKey;
    sourceCount.set(key, (sourceCount.get(key) || 0) + 1);
  }

  let topSource: { moduleKey: string; count: number } | undefined;
  let maxCount = 0;
  for (const [moduleKey, count] of sourceCount) {
    if (count > maxCount) {
      maxCount = count;
      topSource = { moduleKey, count };
    }
  }

  const latestException = clusterData.exceptions.reduce((latest, ex) =>
    new Date(ex.createdAt) > new Date(latest.createdAt) ? ex : latest
  );

  return {
    clientId,
    name: clusterData.name,
    clusterTypeKey: 'type_source',
    status: openExceptions.length > 0 ? 'active' : 'resolved',
    memberIdsJson: clusterData.exceptions.map(e => e.id),
    topSourceJson: topSource,
    patternJson: clusterData.pattern,
    openCount: openExceptions.length,
    totalCount: clusterData.exceptions.length,
    lastExceptionAt: latestException.createdAt
  };
}

export function shouldMergeWithCluster(
  exception: Exception,
  cluster: ExceptionCluster
): boolean {
  if (!cluster.patternJson) return false;

  const { typeKey, sourceModuleKey, titleTokens } = cluster.patternJson;

  if (typeKey && exception.typeKey !== typeKey) return false;
  if (sourceModuleKey && exception.sourceModuleKey !== sourceModuleKey) return false;

  if (titleTokens && titleTokens.length > 0) {
    const exceptionTokens = normalizeTitle(exception.title);
    const matchingTokens = titleTokens.filter(t => exceptionTokens.includes(t));
    if (matchingTokens.length < Math.min(2, titleTokens.length)) return false;
  }

  return true;
}

export function addToCluster(
  cluster: ExceptionCluster,
  exceptionId: string
): Partial<ExceptionCluster> {
  const now = new Date().toISOString();
  const memberIds = [...cluster.memberIdsJson];

  if (!memberIds.includes(exceptionId)) {
    memberIds.push(exceptionId);
  }

  return {
    memberIdsJson: memberIds,
    totalCount: memberIds.length,
    openCount: cluster.openCount + 1,
    lastExceptionAt: now,
    updatedAt: now
  };
}

export function recalculateClusterStats(
  cluster: ExceptionCluster,
  exceptions: Exception[]
): Partial<ExceptionCluster> {
  const memberExceptions = exceptions.filter(e =>
    cluster.memberIdsJson.includes(e.id)
  );

  const openCount = memberExceptions.filter(e => e.status !== 'closed').length;

  return {
    openCount,
    totalCount: memberExceptions.length,
    status: openCount > 0 ? 'active' : 'resolved',
    updatedAt: new Date().toISOString()
  };
}
