/**
 * Type definitions for Module 52: Advisor Packs
 */

export type RecipientType = 'auditor' | 'bank' | 'tax' | 'legal' | 'committee' | 'investor' | 'regulator' | 'other';
export type ScopeType = 'household' | 'entity' | 'portfolio' | 'global';
export type SensitivityLevel = 'low' | 'medium' | 'high';
export type WatermarkSetting = 'on' | 'off';
export type PackStatus = 'draft' | 'pending_approval' | 'approved' | 'shared' | 'closed';
export type ShareStatus = 'active' | 'expired' | 'revoked';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type ItemType = 'document' | 'export' | 'snapshot' | 'cover_letter' | 'checklist';
export type ActionType = 'view' | 'download' | 'download_all';
export type ApproverRole = 'admin' | 'cfo' | 'controller' | 'compliance' | 'legal' | 'family_office_head';
export type UrgencyLevel = 'low' | 'normal' | 'high' | 'urgent';
export type AudienceType = 'auditor' | 'bank' | 'tax' | 'legal' | 'committee' | 'investor' | 'regulator' | 'general';

export interface RecipientInfo {
  type: RecipientType;
  org: string;
  contactEmail?: string;
  contactName?: string;
}

export interface ScopeInfo {
  scopeType: ScopeType;
  scopeId?: string;
  scopeName?: string;
}

export interface PeriodInfo {
  start: string;
  end: string;
  label?: string;
}

export interface ItemRef {
  collection: string;
  id: string;
  version?: string;
  query?: Record<string, unknown>;
}

export interface ReportPack {
  id: string;
  clientId: string;
  name: string;
  recipientJson: RecipientInfo;
  purpose: string;
  scopeJson: ScopeInfo;
  periodJson: PeriodInfo;
  clientSafe: boolean;
  sensitivityKey: SensitivityLevel;
  watermarkKey: WatermarkSetting;
  statusKey: PackStatus;
  templateId?: string;
  coverLetterMd?: string;
  itemsCount?: number;
  createdByUserId: string;
  approvedByUserId?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PackTemplate {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  audienceKey: AudienceType;
  defaultClientSafe: boolean;
  defaultSensitivityKey: SensitivityLevel;
  defaultWatermarkKey?: WatermarkSetting;
  defaultItemsJson?: TemplateItem[];
  coverLetterTemplateMd?: string;
  usageCount?: number;
  createdByUserId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TemplateItem {
  itemTypeKey: ItemType;
  title: string;
  refJson?: ItemRef;
  required?: boolean;
  clientSafe?: boolean;
}

export interface PackItem {
  id: string;
  clientId: string;
  packId: string;
  itemTypeKey: ItemType;
  title: string;
  description?: string;
  refJson?: ItemRef;
  contentMd?: string;
  include: boolean;
  clientSafe: boolean;
  sensitivityKey: SensitivityLevel;
  orderIndex: number;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
}

export interface PackShare {
  id: string;
  clientId: string;
  packId: string;
  tokenHash: string;
  tokenPreview?: string;
  statusKey: ShareStatus;
  expiresAt: string;
  allowDownload: boolean;
  maxDownloads?: number;
  downloadCount: number;
  viewCount?: number;
  passwordHash?: string;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  recipientEmail?: string;
  notifyOnAccess?: boolean;
  createdByUserId?: string;
  createdAt: string;
  revokedAt?: string;
  revokedByUserId?: string;
  revokeReason?: string;
}

export interface PackApproval {
  id: string;
  clientId: string;
  packId: string;
  requestedByUserId: string;
  requestedByName?: string;
  approverRoleKey: ApproverRole;
  approverUserId?: string;
  statusKey: ApprovalStatus;
  decisionByUserId?: string;
  decisionByName?: string;
  decisionAt?: string;
  notes?: string;
  dueAt?: string;
  reminderSentAt?: string;
  urgencyKey?: UrgencyLevel;
  createdAt: string;
}

export interface PackDownload {
  id: string;
  clientId: string;
  packId: string;
  shareId: string;
  itemId?: string;
  actionKey: ActionType;
  actorLabelMasked: string;
  actorEmail?: string;
  ipMasked?: string;
  userAgent?: string;
  geoLocation?: string;
  sessionId?: string;
  at: string;
}

export interface PackCompositionRequest {
  recipientType: RecipientType;
  purpose: string;
  scopeType: ScopeType;
  scopeId?: string;
  periodStart: string;
  periodEnd: string;
  clientSafe: boolean;
  templateId?: string;
}

export interface PackCompositionResult {
  suggestedItems: SuggestedItem[];
  missingDocs: MissingDoc[];
  coverLetterDraft?: string;
}

export interface SuggestedItem {
  itemTypeKey: ItemType;
  title: string;
  refJson?: ItemRef;
  reason: string;
  required: boolean;
  clientSafe: boolean;
  sensitivityKey: SensitivityLevel;
}

export interface MissingDoc {
  docType: string;
  title: string;
  reason: string;
  severity: 'required' | 'recommended' | 'optional';
  suggestion?: string;
}

export interface ApprovalRequest {
  packId: string;
  requestedByUserId: string;
  approverRoleKey: ApproverRole;
  urgencyKey?: UrgencyLevel;
  dueAt?: string;
  notes?: string;
}

export interface ShareRequest {
  packId: string;
  expiresInDays: number;
  allowDownload: boolean;
  maxDownloads?: number;
  password?: string;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  recipientEmail?: string;
  notifyOnAccess?: boolean;
}

export interface ShareResult {
  shareId: string;
  token: string;
  url: string;
  expiresAt: string;
}

export interface AiAssistantRequest {
  action: 'propose_contents' | 'draft_cover_letter' | 'check_missing_docs';
  packId?: string;
  recipientType?: RecipientType;
  purpose?: string;
  scopeType?: ScopeType;
  period?: PeriodInfo;
  existingItems?: PackItem[];
}

export interface AiAssistantResult {
  action: string;
  result: unknown;
  sources: string[];
  confidence: number;
  assumptions: string[];
  requiresHumanReview: boolean;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'diagonal';
  opacity: number;
}

export interface AuditEvent {
  id: string;
  clientId: string;
  moduleId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorUserId?: string;
  actorName?: string;
  actorRole?: string;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high';
  at: string;
}
