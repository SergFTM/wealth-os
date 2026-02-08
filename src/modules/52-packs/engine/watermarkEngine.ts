/**
 * Watermark Engine
 *
 * Manages watermark configuration and application to downloads.
 * MVP: watermark metadata only, no actual PDF rewriting.
 */

import { WatermarkConfig, PackShare, ReportPack } from './types';

/**
 * Default watermark positions
 */
export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'diagonal';

/**
 * Default watermark templates
 */
const WATERMARK_TEMPLATES: Record<string, string> = {
  confidential: 'КОНФИДЕНЦИАЛЬНО',
  draft: 'ЧЕРНОВИК',
  copy: 'КОПИЯ',
  recipient: 'Для: {{recipient}}',
  dateRecipient: '{{date}} | Для: {{recipient}}',
  full: 'КОНФИДЕНЦИАЛЬНО | {{date}} | {{recipient}} | ID: {{shareId}}'
};

/**
 * Generate watermark text from template
 */
export function generateWatermarkText(
  template: string,
  variables: Record<string, string>
): string {
  let text = WATERMARK_TEMPLATES[template] || template;

  for (const [key, value] of Object.entries(variables)) {
    text = text.replace(`{{${key}}}`, value);
  }

  return text;
}

/**
 * Create watermark config for share
 */
export function createWatermarkConfig(
  share: PackShare,
  pack: ReportPack
): WatermarkConfig {
  const recipientOrg = pack.recipientJson.org;
  const date = new Date().toLocaleDateString('ru-RU');

  const text = share.watermarkText || generateWatermarkText('dateRecipient', {
    date,
    recipient: recipientOrg,
    shareId: share.tokenPreview || ''
  });

  return {
    enabled: share.watermarkEnabled ?? true,
    text,
    position: 'bottom-right',
    opacity: 0.3
  };
}

/**
 * Get watermark CSS for overlay display
 */
export function getWatermarkCSS(config: WatermarkConfig): Record<string, string> {
  const positionStyles: Record<WatermarkPosition, Record<string, string>> = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'diagonal': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: '48px'
    }
  };

  return {
    position: 'fixed',
    ...positionStyles[config.position as WatermarkPosition],
    opacity: String(config.opacity),
    color: '#94a3b8',
    fontSize: config.position === 'diagonal' ? '48px' : '12px',
    fontFamily: 'Inter, sans-serif',
    pointerEvents: 'none',
    zIndex: '9999',
    userSelect: 'none'
  };
}

/**
 * Generate watermark HTML for overlay
 */
export function generateWatermarkHTML(config: WatermarkConfig): string {
  if (!config.enabled) return '';

  const styles = getWatermarkCSS(config);
  const styleString = Object.entries(styles)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');

  return `<div style="${styleString}">${config.text}</div>`;
}

/**
 * Get watermark metadata for download header
 */
export function getWatermarkMetadata(
  share: PackShare,
  pack: ReportPack
): Record<string, string> {
  const config = createWatermarkConfig(share, pack);

  return {
    'X-Watermark-Enabled': config.enabled ? 'true' : 'false',
    'X-Watermark-Text': config.text,
    'X-Watermark-Position': config.position,
    'X-Confidential-Notice': 'This document is confidential and intended only for the named recipient.',
    'X-Share-Token': share.tokenPreview || '',
    'X-Pack-Name': pack.name,
    'X-Recipient-Org': pack.recipientJson.org
  };
}

/**
 * Validate watermark settings
 */
export function validateWatermarkSettings(config: Partial<WatermarkConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.text && config.text.length > 200) {
    errors.push('Текст водяного знака не должен превышать 200 символов');
  }

  if (config.opacity !== undefined && (config.opacity < 0.1 || config.opacity > 1)) {
    errors.push('Прозрачность должна быть от 0.1 до 1');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get watermark preview text
 */
export function getWatermarkPreview(
  templateKey: string,
  recipientOrg: string,
  shareId?: string
): string {
  return generateWatermarkText(templateKey, {
    date: new Date().toLocaleDateString('ru-RU'),
    recipient: recipientOrg,
    shareId: shareId || 'XXXXXXXX'
  });
}

/**
 * Available watermark templates for UI
 */
export const AVAILABLE_WATERMARK_TEMPLATES = [
  { key: 'confidential', label: 'Конфиденциально', preview: 'КОНФИДЕНЦИАЛЬНО' },
  { key: 'dateRecipient', label: 'Дата и получатель', preview: '01.01.2025 | Для: Организация' },
  { key: 'full', label: 'Полный формат', preview: 'КОНФИДЕНЦИАЛЬНО | 01.01.2025 | Организация | ID: XXXXXXXX' },
  { key: 'draft', label: 'Черновик', preview: 'ЧЕРНОВИК' },
  { key: 'copy', label: 'Копия', preview: 'КОПИЯ' }
];
