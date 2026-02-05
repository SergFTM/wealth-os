/**
 * Inbox Scoring Engine
 *
 * AI-based scoring and prioritization of notifications in the inbox.
 * Assigns importance scores, tags, and sorting recommendations.
 */

export interface Notification {
  id: string;
  clientId: string;
  userId: string;
  title: string;
  body?: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: string;
  sourceType?: string;
  sourceId?: string;
  sourceName?: string;
  ruleId?: string | null;
  escalationId?: string | null;
  createdAt: string;
  readAt?: string | null;
  aiScore?: number | null;
  aiTags?: string[];
}

export interface ScoringContext {
  userRole: string;
  userGroups: string[];
  recentActivity: {
    readNotificationIds: string[];
    ignoredCategories: string[];
    engagementByCategory: Record<string, number>;
  };
  organizationContext?: {
    criticalClients: string[];
    highPriorityTasks: string[];
    activeEscalations: string[];
  };
}

export interface ScoringResult {
  notificationId: string;
  score: number; // 0-100
  tags: string[];
  factors: ScoringFactor[];
}

export interface ScoringFactor {
  name: string;
  weight: number;
  value: number;
  contribution: number;
}

/**
 * Base priority scores
 */
const PRIORITY_BASE_SCORES: Record<string, number> = {
  urgent: 90,
  high: 70,
  normal: 50,
  low: 30,
};

/**
 * Category importance weights
 */
const CATEGORY_WEIGHTS: Record<string, number> = {
  escalation: 1.5,
  compliance: 1.4,
  approval: 1.3,
  alert: 1.2,
  task: 1.1,
  message: 1.0,
  report: 0.9,
  reminder: 0.8,
  system: 0.7,
};

/**
 * Keywords that indicate high importance
 */
const HIGH_IMPORTANCE_KEYWORDS: Record<string, string[]> = {
  ru: ['срочно', 'критично', 'немедленно', 'важно', 'просрочен', 'нарушение', 'ошибка', 'сбой'],
  en: ['urgent', 'critical', 'immediately', 'important', 'overdue', 'violation', 'error', 'failure'],
};

/**
 * Keywords that indicate low importance
 */
const LOW_IMPORTANCE_KEYWORDS: Record<string, string[]> = {
  ru: ['информация', 'обновление', 'напоминание', 'еженедельный', 'ежемесячный'],
  en: ['info', 'update', 'reminder', 'weekly', 'monthly'],
};

/**
 * Calculates the base score from priority
 */
function calculatePriorityScore(priority: string): ScoringFactor {
  const baseScore = PRIORITY_BASE_SCORES[priority] || 50;
  return {
    name: 'priority',
    weight: 0.3,
    value: baseScore,
    contribution: baseScore * 0.3,
  };
}

/**
 * Calculates category-based score adjustment
 */
function calculateCategoryScore(category: string): ScoringFactor {
  const weight = CATEGORY_WEIGHTS[category] || 1.0;
  const value = weight * 50;
  return {
    name: 'category',
    weight: 0.2,
    value,
    contribution: value * 0.2,
  };
}

/**
 * Analyzes text content for importance keywords
 */
function analyzeTextContent(
  title: string,
  body?: string,
  locale: string = 'ru'
): ScoringFactor {
  const text = `${title} ${body || ''}`.toLowerCase();
  const highKeywords = HIGH_IMPORTANCE_KEYWORDS[locale] || HIGH_IMPORTANCE_KEYWORDS.en;
  const lowKeywords = LOW_IMPORTANCE_KEYWORDS[locale] || LOW_IMPORTANCE_KEYWORDS.en;

  let keywordScore = 50;

  // Check for high importance keywords
  for (const keyword of highKeywords) {
    if (text.includes(keyword)) {
      keywordScore += 10;
    }
  }

  // Check for low importance keywords
  for (const keyword of lowKeywords) {
    if (text.includes(keyword)) {
      keywordScore -= 5;
    }
  }

  // Clamp to 0-100
  keywordScore = Math.max(0, Math.min(100, keywordScore));

  return {
    name: 'textAnalysis',
    weight: 0.15,
    value: keywordScore,
    contribution: keywordScore * 0.15,
  };
}

/**
 * Calculates age-based score decay
 */
function calculateAgeFactor(createdAt: string, now: Date = new Date()): ScoringFactor {
  const created = new Date(createdAt);
  const ageHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  // Score decays over time, but very recent items get a boost
  let ageScore: number;
  if (ageHours < 1) {
    ageScore = 100; // Very recent - high priority
  } else if (ageHours < 4) {
    ageScore = 80;
  } else if (ageHours < 24) {
    ageScore = 60;
  } else if (ageHours < 72) {
    ageScore = 40;
  } else {
    ageScore = 20;
  }

  return {
    name: 'age',
    weight: 0.1,
    value: ageScore,
    contribution: ageScore * 0.1,
  };
}

/**
 * Calculates escalation factor
 */
function calculateEscalationFactor(notification: Notification): ScoringFactor {
  const hasEscalation = !!notification.escalationId;
  const value = hasEscalation ? 100 : 0;

  return {
    name: 'escalation',
    weight: 0.15,
    value,
    contribution: value * 0.15,
  };
}

/**
 * Calculates user engagement factor based on historical behavior
 */
function calculateEngagementFactor(
  notification: Notification,
  context: ScoringContext
): ScoringFactor {
  const { recentActivity } = context;

  // Check if user typically ignores this category
  if (recentActivity.ignoredCategories.includes(notification.category)) {
    return {
      name: 'engagement',
      weight: 0.1,
      value: 30,
      contribution: 3,
    };
  }

  // Check engagement rate for this category
  const engagementRate = recentActivity.engagementByCategory[notification.category] || 0.5;
  const value = engagementRate * 100;

  return {
    name: 'engagement',
    weight: 0.1,
    value,
    contribution: value * 0.1,
  };
}

/**
 * Generates AI tags based on notification content
 */
function generateTags(notification: Notification, locale: string = 'ru'): string[] {
  const tags: string[] = [];
  const text = `${notification.title} ${notification.body || ''}`.toLowerCase();

  // Priority tags
  if (notification.priority === 'urgent') {
    tags.push(locale === 'ru' ? 'срочно' : 'urgent');
  }
  if (notification.priority === 'high') {
    tags.push(locale === 'ru' ? 'важно' : 'important');
  }

  // Category-based tags
  const categoryTags: Record<string, Record<string, string>> = {
    task: { ru: 'задача', en: 'task' },
    approval: { ru: 'одобрение', en: 'approval' },
    alert: { ru: 'оповещение', en: 'alert' },
    compliance: { ru: 'комплаенс', en: 'compliance' },
    escalation: { ru: 'эскалация', en: 'escalation' },
  };

  if (categoryTags[notification.category]) {
    tags.push(categoryTags[notification.category][locale] || categoryTags[notification.category].en);
  }

  // Content-based tags
  const contentTagPatterns: Array<{ pattern: RegExp; tag: Record<string, string> }> = [
    { pattern: /отчёт|report/i, tag: { ru: 'отчётность', en: 'reporting' } },
    { pattern: /документ|document/i, tag: { ru: 'документ', en: 'document' } },
    { pattern: /дедлайн|deadline|срок/i, tag: { ru: 'дедлайн', en: 'deadline' } },
    { pattern: /клиент|client/i, tag: { ru: 'клиент', en: 'client' } },
    { pattern: /аудит|audit/i, tag: { ru: 'аудит', en: 'audit' } },
  ];

  for (const { pattern, tag } of contentTagPatterns) {
    if (pattern.test(text)) {
      tags.push(tag[locale] || tag.en);
    }
  }

  // Escalation tag
  if (notification.escalationId) {
    tags.push(locale === 'ru' ? 'эскалировано' : 'escalated');
  }

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Main scoring function - calculates AI score for a notification
 */
export function scoreNotification(
  notification: Notification,
  context: ScoringContext,
  locale: string = 'ru'
): ScoringResult {
  const factors: ScoringFactor[] = [];

  // Calculate all factors
  factors.push(calculatePriorityScore(notification.priority));
  factors.push(calculateCategoryScore(notification.category));
  factors.push(analyzeTextContent(notification.title, notification.body, locale));
  factors.push(calculateAgeFactor(notification.createdAt));
  factors.push(calculateEscalationFactor(notification));
  factors.push(calculateEngagementFactor(notification, context));

  // Sum contributions
  const totalScore = factors.reduce((sum, f) => sum + f.contribution, 0);

  // Clamp final score to 0-100
  const finalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

  // Generate tags
  const tags = generateTags(notification, locale);

  return {
    notificationId: notification.id,
    score: finalScore,
    tags,
    factors,
  };
}

/**
 * Scores multiple notifications and returns sorted results
 */
export function scoreAndSortNotifications(
  notifications: Notification[],
  context: ScoringContext,
  locale: string = 'ru'
): Array<Notification & { aiScore: number; aiTags: string[] }> {
  const scored = notifications.map(n => {
    const result = scoreNotification(n, context, locale);
    return {
      ...n,
      aiScore: result.score,
      aiTags: result.tags,
    };
  });

  // Sort by score descending
  return scored.sort((a, b) => b.aiScore - a.aiScore);
}

/**
 * Gets scoring explanation for a notification
 */
export function explainScore(result: ScoringResult, locale: string = 'ru'): string {
  const factorLabels: Record<string, Record<string, string>> = {
    priority: { ru: 'Приоритет', en: 'Priority' },
    category: { ru: 'Категория', en: 'Category' },
    textAnalysis: { ru: 'Анализ текста', en: 'Text analysis' },
    age: { ru: 'Возраст', en: 'Age' },
    escalation: { ru: 'Эскалация', en: 'Escalation' },
    engagement: { ru: 'Вовлечённость', en: 'Engagement' },
  };

  const lines = [`Итоговый балл: ${result.score}/100`, ''];

  for (const factor of result.factors) {
    const label = factorLabels[factor.name]?.[locale] || factor.name;
    lines.push(`${label}: ${factor.value.toFixed(0)} (вклад: ${factor.contribution.toFixed(1)})`);
  }

  if (result.tags.length > 0) {
    lines.push('', `Теги: ${result.tags.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Detects anomalies in notification patterns
 */
export function detectAnomalies(
  notifications: Notification[],
  context: ScoringContext
): Array<{ type: string; description: string; notificationIds: string[] }> {
  const anomalies: Array<{ type: string; description: string; notificationIds: string[] }> = [];

  // Check for unusual volume
  const recentNotifications = notifications.filter(n => {
    const age = Date.now() - new Date(n.createdAt).getTime();
    return age < 60 * 60 * 1000; // Last hour
  });

  if (recentNotifications.length > 20) {
    anomalies.push({
      type: 'high_volume',
      description: `Необычно высокий объём уведомлений за последний час: ${recentNotifications.length}`,
      notificationIds: recentNotifications.map(n => n.id),
    });
  }

  // Check for repeated escalations
  const escalatedNotifications = notifications.filter(n => n.escalationId);
  if (escalatedNotifications.length > 5) {
    anomalies.push({
      type: 'many_escalations',
      description: `Много активных эскалаций: ${escalatedNotifications.length}`,
      notificationIds: escalatedNotifications.map(n => n.id),
    });
  }

  // Check for ignored high-priority notifications
  const ignoredHighPriority = notifications.filter(n =>
    (n.priority === 'high' || n.priority === 'urgent') &&
    !n.readAt &&
    Date.now() - new Date(n.createdAt).getTime() > 4 * 60 * 60 * 1000
  );

  if (ignoredHighPriority.length > 0) {
    anomalies.push({
      type: 'ignored_urgent',
      description: `Непрочитанные срочные уведомления старше 4 часов: ${ignoredHighPriority.length}`,
      notificationIds: ignoredHighPriority.map(n => n.id),
    });
  }

  return anomalies;
}
