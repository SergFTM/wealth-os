import { BaseRecord } from '@/db/storage/storage.types';

export interface PolicyVersion extends BaseRecord {
  clientId: string;
  docType: 'policy' | 'sop';
  docId: string;
  docTitle: string;
  versionLabel: string;
  versionMajor: number;
  versionMinor: number;
  status: 'draft' | 'published' | 'retired';
  snapshotMdRu: string;
  snapshotMdEn?: string;
  snapshotMdUk?: string;
  changeNotes?: string;
  previousVersionId?: string;
  publishedInternal: boolean;
  publishedClientSafe: boolean;
  requiresApproval: boolean;
  approvalItemId?: string;
  createdByUserId?: string;
  createdByName?: string;
  publishedAt?: string;
}

export interface CreateVersionInput {
  clientId: string;
  docType: 'policy' | 'sop';
  docId: string;
  docTitle: string;
  snapshotMdRu: string;
  snapshotMdEn?: string;
  snapshotMdUk?: string;
  changeNotes?: string;
  previousVersionId?: string;
  previousVersionMajor?: number;
  previousVersionMinor?: number;
  isMajor?: boolean;
  createdByUserId?: string;
  createdByName?: string;
}

export function generateVersionLabel(major: number, minor: number): string {
  return `v${major}.${minor}`;
}

export function incrementVersion(
  currentMajor: number,
  currentMinor: number,
  isMajor: boolean
): { major: number; minor: number } {
  if (isMajor) {
    return { major: currentMajor + 1, minor: 0 };
  }
  return { major: currentMajor, minor: currentMinor + 1 };
}

export function createVersionData(input: CreateVersionInput): Omit<PolicyVersion, 'id' | 'createdAt' | 'updatedAt'> {
  const prevMajor = input.previousVersionMajor ?? 0;
  const prevMinor = input.previousVersionMinor ?? 0;
  const isMajor = input.isMajor ?? false;

  const { major, minor } = input.previousVersionId
    ? incrementVersion(prevMajor, prevMinor, isMajor)
    : { major: 1, minor: 0 };

  return {
    clientId: input.clientId,
    docType: input.docType,
    docId: input.docId,
    docTitle: input.docTitle,
    versionLabel: generateVersionLabel(major, minor),
    versionMajor: major,
    versionMinor: minor,
    status: 'draft',
    snapshotMdRu: input.snapshotMdRu,
    snapshotMdEn: input.snapshotMdEn,
    snapshotMdUk: input.snapshotMdUk,
    changeNotes: input.changeNotes,
    previousVersionId: input.previousVersionId,
    publishedInternal: false,
    publishedClientSafe: false,
    requiresApproval: false,
    createdByUserId: input.createdByUserId,
    createdByName: input.createdByName,
  };
}

export function publishVersion(
  version: PolicyVersion,
  options: { internal?: boolean; clientSafe?: boolean }
): Partial<PolicyVersion> {
  if (version.status === 'retired') {
    throw new Error('Cannot publish a retired version');
  }

  return {
    status: 'published',
    publishedInternal: options.internal ?? true,
    publishedClientSafe: options.clientSafe ?? false,
    publishedAt: new Date().toISOString(),
  };
}

export function retireVersion(version: PolicyVersion): Partial<PolicyVersion> {
  return {
    status: 'retired',
  };
}

export function canPublish(version: PolicyVersion): { canPublish: boolean; reason?: string } {
  if (version.status === 'published') {
    return { canPublish: false, reason: 'Version is already published' };
  }
  if (version.status === 'retired') {
    return { canPublish: false, reason: 'Cannot publish a retired version' };
  }
  if (!version.snapshotMdRu) {
    return { canPublish: false, reason: 'Version has no content' };
  }
  return { canPublish: true };
}

export function getVersionSummary(version: PolicyVersion): {
  id: string;
  docType: string;
  docTitle: string;
  versionLabel: string;
  status: string;
  publishedAt?: string;
} {
  return {
    id: version.id,
    docType: version.docType,
    docTitle: version.docTitle,
    versionLabel: version.versionLabel,
    status: version.status,
    publishedAt: version.publishedAt,
  };
}
