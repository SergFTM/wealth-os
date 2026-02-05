/**
 * Data Quality Metrics Schema
 * Health scores and metrics by domain
 */

import { DqDomain } from '../config';

export interface DomainIssue {
  title: string;
  severity: string;
  count: number;
}

export interface DqMetric {
  id: string;
  clientId?: string;
  scopeType: 'global' | 'household' | 'entity' | 'account';
  scopeId: string;
  domain: DqDomain;
  score: number;
  previousScore?: number;
  trend?: 'up' | 'down' | 'stable';
  openExceptionsCount: number;
  criticalCount: number;
  warningCount: number;
  topIssues: DomainIssue[];
  staleSourcesCount?: number;
  lastComputedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DqMetricCreateInput {
  clientId?: string;
  scopeType: DqMetric['scopeType'];
  scopeId: string;
  domain: DqDomain;
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'emerald';
  if (score >= 70) return 'amber';
  if (score >= 50) return 'orange';
  return 'red';
}

export function getScoreLabel(score: number, lang: 'ru' | 'en' | 'uk' = 'ru'): string {
  const labels = {
    excellent: { ru: 'Отлично', en: 'Excellent', uk: 'Відмінно' },
    good: { ru: 'Хорошо', en: 'Good', uk: 'Добре' },
    fair: { ru: 'Удовлетв.', en: 'Fair', uk: 'Задов.' },
    poor: { ru: 'Плохо', en: 'Poor', uk: 'Погано' },
  };
  if (score >= 90) return labels.excellent[lang];
  if (score >= 70) return labels.good[lang];
  if (score >= 50) return labels.fair[lang];
  return labels.poor[lang];
}

export function getTrendIcon(trend?: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') return '↑';
  if (trend === 'down') return '↓';
  return '→';
}

export function computeOverallScore(metrics: DqMetric[]): number {
  if (metrics.length === 0) return 100;
  const total = metrics.reduce((sum, m) => sum + m.score, 0);
  return Math.round(total / metrics.length);
}
