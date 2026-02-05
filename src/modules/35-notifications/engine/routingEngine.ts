/**
 * Notification Routing Engine
 *
 * Determines notification recipients and channels based on rules,
 * user preferences, and organizational structure.
 */

export interface RoutingRule {
  id: string;
  targetRoles?: string[];
  targetUsers?: string[];
  targetGroups?: string[];
  channels: ('inbox' | 'email' | 'sms' | 'push' | 'slack' | 'teams' | 'webhook')[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  bundleInDigest?: boolean;
  digestFrequency?: 'hourly' | 'daily' | 'weekly' | null;
}

export interface UserPrefs {
  userId: string;
  userName: string;
  globalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  quietHoursTimezone: string;
  channelPrefs: {
    inbox?: { enabled: boolean; categories?: string[] };
    email?: { enabled: boolean; address?: string; categories?: string[] };
    sms?: { enabled: boolean; phone?: string; urgentOnly?: boolean };
    push?: { enabled: boolean; categories?: string[] };
    slack?: { enabled: boolean; slackUserId?: string };
    teams?: { enabled: boolean; teamsUserId?: string };
  };
  categoryPrefs: Record<string, {
    enabled: boolean;
    channels?: string[];
    digestOnly?: boolean;
  }>;
  digestPrefs: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
    sendTime?: string;
    channel?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  roles: string[];
  groups: string[];
}

export interface RoutingContext {
  sourceType?: string;
  sourceId?: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigneeId?: string;
  requesterId?: string;
  watcherIds?: string[];
}

export interface RoutingTarget {
  userId: string;
  userName: string;
  channels: string[];
  bundleInDigest: boolean;
  digestFrequency?: 'hourly' | 'daily' | 'weekly' | null;
}

export interface RoutingResult {
  targets: RoutingTarget[];
  skipped: Array<{
    userId: string;
    reason: string;
  }>;
}

/**
 * Resolves target users from roles, groups, and explicit user IDs
 */
export function resolveTargetUsers(
  rule: RoutingRule,
  context: RoutingContext,
  allUsers: User[]
): User[] {
  const userIds = new Set<string>();

  // Add explicitly targeted users
  if (rule.targetUsers) {
    rule.targetUsers.forEach(id => userIds.add(id));
  }

  // Add users by role
  if (rule.targetRoles) {
    for (const user of allUsers) {
      // Special role handling
      if (rule.targetRoles.includes('assignee') && context.assigneeId === user.id) {
        userIds.add(user.id);
      }
      if (rule.targetRoles.includes('requester') && context.requesterId === user.id) {
        userIds.add(user.id);
      }
      if (rule.targetRoles.includes('watcher') && context.watcherIds?.includes(user.id)) {
        userIds.add(user.id);
      }

      // Regular role matching
      for (const role of rule.targetRoles) {
        if (user.roles.includes(role)) {
          userIds.add(user.id);
        }
      }
    }
  }

  // Add users by group
  if (rule.targetGroups) {
    for (const user of allUsers) {
      for (const group of rule.targetGroups) {
        if (user.groups.includes(group)) {
          userIds.add(user.id);
        }
      }
    }
  }

  return allUsers.filter(u => userIds.has(u.id));
}

/**
 * Checks if current time is within quiet hours
 */
export function isInQuietHours(prefs: UserPrefs, now: Date = new Date()): boolean {
  if (!prefs.quietHoursEnabled || !prefs.quietHoursStart || !prefs.quietHoursEnd) {
    return false;
  }

  const [startHour, startMin] = prefs.quietHoursStart.split(':').map(Number);
  const [endHour, endMin] = prefs.quietHoursEnd.split(':').map(Number);

  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentTime = currentHour * 60 + currentMin;
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  // Handle overnight quiet hours (e.g., 22:00 to 07:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  }

  return currentTime >= startTime && currentTime < endTime;
}

/**
 * Filters channels based on user preferences and context
 */
export function filterChannelsByPrefs(
  channels: string[],
  prefs: UserPrefs,
  category: string,
  priority: string
): string[] {
  if (!prefs.globalEnabled) {
    return [];
  }

  // Check category preferences
  const categoryPref = prefs.categoryPrefs[category];
  if (categoryPref && !categoryPref.enabled) {
    return [];
  }

  // If category specifies specific channels, use those
  if (categoryPref?.channels && categoryPref.channels.length > 0) {
    channels = channels.filter(c => categoryPref.channels!.includes(c));
  }

  // Filter by channel preferences
  return channels.filter(channel => {
    const channelPref = prefs.channelPrefs[channel as keyof typeof prefs.channelPrefs];

    if (!channelPref?.enabled) {
      return false;
    }

    // Check SMS urgent-only preference
    if (channel === 'sms' && (channelPref as { urgentOnly?: boolean }).urgentOnly) {
      return priority === 'urgent';
    }

    // Check category filter for channel
    if ('categories' in channelPref && channelPref.categories) {
      return channelPref.categories.includes(category);
    }

    return true;
  });
}

/**
 * Determines if notification should be bundled in digest
 */
export function shouldBundleInDigest(
  rule: RoutingRule,
  prefs: UserPrefs,
  category: string,
  priority: string
): { bundle: boolean; frequency?: 'hourly' | 'daily' | 'weekly' } {
  // Urgent notifications are never bundled
  if (priority === 'urgent') {
    return { bundle: false };
  }

  // Check category digest preference
  const categoryPref = prefs.categoryPrefs[category];
  if (categoryPref?.digestOnly) {
    return {
      bundle: true,
      frequency: prefs.digestPrefs.frequency,
    };
  }

  // Check rule-level digest setting
  if (rule.bundleInDigest) {
    return {
      bundle: true,
      frequency: rule.digestFrequency || prefs.digestPrefs.frequency,
    };
  }

  return { bundle: false };
}

/**
 * Main routing function - determines all targets and their channels
 */
export function routeNotification(
  rule: RoutingRule,
  context: RoutingContext,
  allUsers: User[],
  userPrefsMap: Map<string, UserPrefs>
): RoutingResult {
  const targets: RoutingTarget[] = [];
  const skipped: Array<{ userId: string; reason: string }> = [];

  // Resolve target users
  const targetUsers = resolveTargetUsers(rule, context, allUsers);

  for (const user of targetUsers) {
    const prefs = userPrefsMap.get(user.id);

    // Skip if no preferences found (use defaults)
    if (!prefs) {
      targets.push({
        userId: user.id,
        userName: user.name,
        channels: rule.channels,
        bundleInDigest: rule.bundleInDigest || false,
        digestFrequency: rule.digestFrequency,
      });
      continue;
    }

    // Check global enabled
    if (!prefs.globalEnabled) {
      skipped.push({ userId: user.id, reason: 'Notifications disabled globally' });
      continue;
    }

    // Check quiet hours for non-urgent notifications
    if (context.priority !== 'urgent' && isInQuietHours(prefs)) {
      // During quiet hours, only inbox notifications are allowed
      const filteredChannels = filterChannelsByPrefs(['inbox'], prefs, context.category, context.priority);
      if (filteredChannels.length === 0) {
        skipped.push({ userId: user.id, reason: 'Quiet hours active' });
        continue;
      }

      const digestInfo = shouldBundleInDigest(rule, prefs, context.category, context.priority);
      targets.push({
        userId: user.id,
        userName: prefs.userName,
        channels: filteredChannels,
        bundleInDigest: digestInfo.bundle,
        digestFrequency: digestInfo.frequency,
      });
      continue;
    }

    // Filter channels by preferences
    const filteredChannels = filterChannelsByPrefs(
      rule.channels,
      prefs,
      context.category,
      context.priority
    );

    if (filteredChannels.length === 0) {
      skipped.push({ userId: user.id, reason: 'All channels disabled for this category' });
      continue;
    }

    const digestInfo = shouldBundleInDigest(rule, prefs, context.category, context.priority);

    targets.push({
      userId: user.id,
      userName: prefs.userName,
      channels: filteredChannels,
      bundleInDigest: digestInfo.bundle,
      digestFrequency: digestInfo.frequency,
    });
  }

  return { targets, skipped };
}

/**
 * Gets the effective channel address for a user
 */
export function getChannelAddress(
  channel: string,
  user: User,
  prefs?: UserPrefs
): string | null {
  switch (channel) {
    case 'inbox':
      return user.id;
    case 'email':
      return prefs?.channelPrefs.email?.address || user.email || null;
    case 'sms':
      return prefs?.channelPrefs.sms?.phone || user.phone || null;
    case 'push':
      return user.id;
    case 'slack':
      return prefs?.channelPrefs.slack?.slackUserId || null;
    case 'teams':
      return prefs?.channelPrefs.teams?.teamsUserId || null;
    default:
      return null;
  }
}
