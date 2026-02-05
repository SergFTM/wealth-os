/**
 * Notification Digest Engine
 *
 * Aggregates notifications into periodic digests (hourly, daily, weekly).
 * Handles digest scheduling, content generation, and delivery.
 */

export interface Notification {
  id: string;
  clientId: string;
  userId: string;
  userName: string;
  title: string;
  body?: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: string;
  status: string;
  sourceType?: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  createdAt: string;
}

export interface DigestPrefs {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  sendTime?: string;
  sendDay?: number; // 0-6 for weekly, day of week
  channel?: string;
}

export interface DigestSummary {
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  highlights: string[];
}

export interface Digest {
  id: string;
  clientId: string;
  userId: string;
  userName: string;
  title: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  periodStart: string;
  periodEnd: string;
  notificationIds: string[];
  notificationCount: number;
  summary: DigestSummary;
  channel: string;
  templateId?: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  scheduledFor?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Gets the period boundaries for a digest
 */
export function getDigestPeriod(
  frequency: 'hourly' | 'daily' | 'weekly',
  referenceTime: Date = new Date()
): { start: Date; end: Date } {
  const end = new Date(referenceTime);
  const start = new Date(referenceTime);

  switch (frequency) {
    case 'hourly':
      // Last hour
      end.setMinutes(0, 0, 0);
      start.setTime(end.getTime() - 60 * 60 * 1000);
      break;
    case 'daily':
      // Last 24 hours (midnight to midnight)
      end.setHours(0, 0, 0, 0);
      start.setTime(end.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      // Last 7 days
      end.setHours(0, 0, 0, 0);
      start.setTime(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
  }

  return { start, end };
}

/**
 * Filters notifications for a digest period
 */
export function filterNotificationsForDigest(
  notifications: Notification[],
  userId: string,
  periodStart: Date,
  periodEnd: Date
): Notification[] {
  return notifications.filter(n => {
    if (n.userId !== userId) return false;

    const createdAt = new Date(n.createdAt);
    return createdAt >= periodStart && createdAt < periodEnd;
  });
}

/**
 * Generates a summary of notifications
 */
export function generateDigestSummary(notifications: Notification[]): DigestSummary {
  const byCategory: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  const highlights: string[] = [];

  for (const notif of notifications) {
    // Count by category
    byCategory[notif.category] = (byCategory[notif.category] || 0) + 1;

    // Count by priority
    byPriority[notif.priority] = (byPriority[notif.priority] || 0) + 1;

    // Add high/urgent notifications to highlights
    if (notif.priority === 'high' || notif.priority === 'urgent') {
      highlights.push(notif.title);
    }
  }

  // Limit highlights to top 5
  return {
    byCategory,
    byPriority,
    highlights: highlights.slice(0, 5),
  };
}

/**
 * Generates digest title based on frequency and date
 */
export function generateDigestTitle(
  frequency: 'hourly' | 'daily' | 'weekly',
  periodStart: Date,
  periodEnd: Date,
  locale: string = 'ru'
): string {
  const formatDate = (d: Date) => d.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
  });

  const titles: Record<string, Record<string, string>> = {
    ru: {
      hourly: `Дайджест за последний час`,
      daily: `Ежедневный дайджест за ${formatDate(periodStart)}`,
      weekly: `Еженедельный дайджест: ${formatDate(periodStart)} - ${formatDate(periodEnd)}`,
    },
    en: {
      hourly: `Hourly digest`,
      daily: `Daily digest for ${formatDate(periodStart)}`,
      weekly: `Weekly digest: ${formatDate(periodStart)} - ${formatDate(periodEnd)}`,
    },
  };

  return titles[locale]?.[frequency] || titles.en[frequency];
}

/**
 * Creates a digest from notifications
 */
export function createDigest(
  userId: string,
  userName: string,
  clientId: string,
  notifications: Notification[],
  prefs: DigestPrefs,
  locale: string = 'ru'
): Omit<Digest, 'id' | 'createdAt' | 'updatedAt'> {
  const { start, end } = getDigestPeriod(prefs.frequency);
  const filteredNotifications = filterNotificationsForDigest(notifications, userId, start, end);

  const summary = generateDigestSummary(filteredNotifications);
  const title = generateDigestTitle(prefs.frequency, start, end, locale);

  // Calculate scheduled send time
  let scheduledFor: string | null = null;
  if (prefs.sendTime) {
    const [hours, minutes] = prefs.sendTime.split(':').map(Number);
    const scheduled = new Date();
    scheduled.setHours(hours, minutes, 0, 0);

    // If time already passed today, schedule for tomorrow
    if (scheduled <= new Date()) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    scheduledFor = scheduled.toISOString();
  }

  return {
    clientId,
    userId,
    userName,
    title,
    frequency: prefs.frequency,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    notificationIds: filteredNotifications.map(n => n.id),
    notificationCount: filteredNotifications.length,
    summary,
    channel: prefs.channel || 'email',
    templateId: getDigestTemplateId(prefs.frequency),
    status: 'pending',
    sentAt: null,
    deliveredAt: null,
    readAt: null,
    scheduledFor,
  };
}

/**
 * Gets the appropriate template ID for a digest frequency
 */
function getDigestTemplateId(frequency: 'hourly' | 'daily' | 'weekly'): string {
  switch (frequency) {
    case 'hourly':
      return 'tpl-digest-hourly';
    case 'daily':
      return 'tpl-digest-daily';
    case 'weekly':
      return 'tpl-digest-weekly';
  }
}

/**
 * Checks if it's time to send a digest based on preferences
 */
export function isDigestDue(
  prefs: DigestPrefs,
  lastDigestAt: Date | null,
  now: Date = new Date()
): boolean {
  if (!prefs.enabled) {
    return false;
  }

  // Check send time
  if (prefs.sendTime) {
    const [hours, minutes] = prefs.sendTime.split(':').map(Number);
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Not yet at send time
    if (currentHours < hours || (currentHours === hours && currentMinutes < minutes)) {
      return false;
    }
  }

  // Check if already sent in current period
  if (lastDigestAt) {
    const { start } = getDigestPeriod(prefs.frequency, now);
    if (lastDigestAt >= start) {
      return false;
    }
  }

  // For weekly, check day of week
  if (prefs.frequency === 'weekly' && prefs.sendDay !== undefined) {
    if (now.getDay() !== prefs.sendDay) {
      return false;
    }
  }

  return true;
}

/**
 * Gets users who should receive digests now
 */
export function getUsersForDigestBatch(
  userPrefs: Array<{ userId: string; userName: string; clientId: string; prefs: DigestPrefs }>,
  lastDigestTimes: Map<string, Date>,
  now: Date = new Date()
): Array<{ userId: string; userName: string; clientId: string; prefs: DigestPrefs }> {
  return userPrefs.filter(({ userId, prefs }) => {
    const lastDigestAt = lastDigestTimes.get(userId) || null;
    return isDigestDue(prefs, lastDigestAt, now);
  });
}

/**
 * Formats digest content for display
 */
export function formatDigestContent(digest: Digest, locale: string = 'ru'): string {
  const labels: Record<string, Record<string, string>> = {
    ru: {
      total: 'Всего уведомлений',
      byCategory: 'По категориям',
      byPriority: 'По приоритету',
      highlights: 'Важное',
    },
    en: {
      total: 'Total notifications',
      byCategory: 'By category',
      byPriority: 'By priority',
      highlights: 'Highlights',
    },
  };

  const l = labels[locale] || labels.en;

  let content = `${digest.title}\n\n`;
  content += `${l.total}: ${digest.notificationCount}\n\n`;

  if (Object.keys(digest.summary.byCategory).length > 0) {
    content += `${l.byCategory}:\n`;
    for (const [cat, count] of Object.entries(digest.summary.byCategory)) {
      content += `  • ${cat}: ${count}\n`;
    }
    content += '\n';
  }

  if (digest.summary.highlights.length > 0) {
    content += `${l.highlights}:\n`;
    for (const highlight of digest.summary.highlights) {
      content += `  • ${highlight}\n`;
    }
  }

  return content;
}
