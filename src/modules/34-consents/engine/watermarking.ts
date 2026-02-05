/**
 * Watermarking Engine - manages watermark metadata for downloads
 * MVP: Adds metadata labels only, no actual PDF watermarking
 */

export interface WatermarkConfig {
  text: string;
  includeClientId: boolean;
  includeDate: boolean;
  includeUserName: boolean;
  position?: 'header' | 'footer' | 'diagonal';
  opacity?: number;
}

export interface WatermarkResult {
  watermarkText: string;
  appliedAt: string;
  appliedBy: string;
  config: WatermarkConfig;
}

export function generateWatermarkText(
  config: WatermarkConfig,
  context: {
    clientId?: string;
    clientName?: string;
    userName?: string;
    date?: string;
  }
): string {
  const parts: string[] = [config.text];

  if (config.includeClientId && context.clientId) {
    parts.push(context.clientName || context.clientId);
  }

  if (config.includeUserName && context.userName) {
    parts.push(`Accessed by: ${context.userName}`);
  }

  if (config.includeDate) {
    const date = context.date || new Date().toISOString().split('T')[0];
    parts.push(date);
  }

  return parts.join(' | ');
}

export function createWatermarkResult(
  config: WatermarkConfig,
  context: {
    clientId?: string;
    clientName?: string;
    userName: string;
  }
): WatermarkResult {
  return {
    watermarkText: generateWatermarkText(config, context),
    appliedAt: new Date().toISOString(),
    appliedBy: context.userName,
    config,
  };
}

export function getDefaultWatermarkConfig(purpose: string): WatermarkConfig {
  const configs: Record<string, WatermarkConfig> = {
    audit: {
      text: 'CONFIDENTIAL - AUDIT USE ONLY',
      includeClientId: true,
      includeDate: true,
      includeUserName: true,
      position: 'diagonal',
      opacity: 0.3,
    },
    legal: {
      text: 'PRIVILEGED & CONFIDENTIAL',
      includeClientId: true,
      includeDate: true,
      includeUserName: true,
      position: 'footer',
      opacity: 0.5,
    },
    trustee_review: {
      text: 'TRUSTEE REVIEW ONLY',
      includeClientId: true,
      includeDate: true,
      includeUserName: false,
      position: 'header',
      opacity: 0.4,
    },
    advisor_pack: {
      text: 'CONFIDENTIAL',
      includeClientId: true,
      includeDate: true,
      includeUserName: true,
      position: 'footer',
      opacity: 0.3,
    },
    default: {
      text: 'CONFIDENTIAL',
      includeClientId: true,
      includeDate: true,
      includeUserName: false,
      position: 'footer',
      opacity: 0.3,
    },
  };

  return configs[purpose] || configs.default;
}

export function formatWatermarkForPreview(watermarkText: string): string {
  return `
┌──────────────────────────────────────────────┐
│                                              │
│            [WATERMARK PREVIEW]               │
│                                              │
│    ${watermarkText.padEnd(40).substring(0, 40)}│
│                                              │
└──────────────────────────────────────────────┘
  `.trim();
}

export function shouldApplyWatermark(
  consentRequiresWatermark: boolean,
  policyEnforcesWatermark: boolean,
  dataRoomWatermarkText?: string
): boolean {
  return consentRequiresWatermark || policyEnforcesWatermark || !!dataRoomWatermarkText;
}
