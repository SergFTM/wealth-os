/**
 * Action Extractor - Extract action items from meeting notes
 */

export interface MeetingActionItem {
  id: string;
  clientId: string;
  eventId: string;
  title: string;
  description?: string;
  ownerUserId?: string;
  ownerName?: string;
  dueAt?: string;
  status: 'open' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  linkedTaskId?: string;
  linkedDecisionId?: string;
  source: 'manual' | 'ai_extracted' | 'agenda';
  createdAt: string;
  updatedAt: string;
}

export interface CreateActionItemData {
  clientId: string;
  eventId: string;
  title: string;
  description?: string;
  ownerUserId?: string;
  ownerName?: string;
  dueAt?: string;
  priority?: 'low' | 'medium' | 'high';
  source?: 'manual' | 'ai_extracted' | 'agenda';
  linkedDecisionId?: string;
}

export interface ExtractedAction {
  title: string;
  owner?: string;
  dueDescription?: string;
  priority: 'low' | 'medium' | 'high';
}

export function createActionItemData(
  data: CreateActionItemData
): Omit<MeetingActionItem, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: data.clientId,
    eventId: data.eventId,
    title: data.title,
    description: data.description,
    ownerUserId: data.ownerUserId,
    ownerName: data.ownerName,
    dueAt: data.dueAt,
    status: 'open',
    priority: data.priority || 'medium',
    linkedDecisionId: data.linkedDecisionId,
    source: data.source || 'manual',
  };
}

export function markActionInProgress(item: MeetingActionItem): Partial<MeetingActionItem> {
  return {
    status: 'in_progress',
    updatedAt: new Date().toISOString(),
  };
}

export function markActionDone(item: MeetingActionItem): Partial<MeetingActionItem> {
  return {
    status: 'done',
    updatedAt: new Date().toISOString(),
  };
}

export function linkToTask(item: MeetingActionItem, taskId: string): Partial<MeetingActionItem> {
  return {
    linkedTaskId: taskId,
    updatedAt: new Date().toISOString(),
  };
}

export function extractActionsFromText(text: string): ExtractedAction[] {
  const actions: ExtractedAction[] = [];
  const lines = text.split('\n');

  // Patterns for action item detection
  const actionPatterns = [
    /@(\w+):\s*(.+)/,  // @Name: task
    /(\w+)\s*(?:должен|нужно|необходимо|следует)\s*(.+)/i,  // Name должен task
    /(?:action|задача|поручение):\s*(.+)/i,  // Action: task
    /(?:сделать|подготовить|проверить|завершить|создать|отправить)\s+(.+)/i,  // сделать task
  ];

  // Due date patterns
  const duePatterns = [
    /до\s+(\d{1,2}[./]\d{1,2})/,
    /к\s+(\d{1,2}[./]\d{1,2})/,
    /(?:пятниц|понедельник|вторник|сред|четверг|суббот|воскресень)/i,
    /(?:завтра|послезавтра|на этой неделе|на следующей неделе)/i,
  ];

  // Priority patterns
  const highPriorityPatterns = [
    /срочно/i,
    /важно/i,
    /критично/i,
    /asap/i,
    /немедленно/i,
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line looks like an action item
    let isAction = false;
    let title = '';
    let owner: string | undefined;

    // Check @mention pattern
    const mentionMatch = trimmed.match(/@(\w+)[\s:]+(.+)/);
    if (mentionMatch) {
      owner = mentionMatch[1];
      title = mentionMatch[2].trim();
      isAction = true;
    }

    // Check action keywords
    if (!isAction) {
      for (const pattern of actionPatterns) {
        const match = trimmed.match(pattern);
        if (match) {
          title = match[match.length - 1].trim();
          if (match.length > 2) {
            owner = match[1];
          }
          isAction = true;
          break;
        }
      }
    }

    // Also check bullet points with action verbs
    if (!isAction && (trimmed.startsWith('-') || trimmed.startsWith('*'))) {
      const content = trimmed.replace(/^[-*]\s*/, '');
      if (
        content.match(/^(сделать|подготовить|проверить|завершить|создать|отправить|обновить|связаться)/i) ||
        content.includes('@')
      ) {
        title = content;
        isAction = true;

        const innerMention = content.match(/@(\w+)/);
        if (innerMention) {
          owner = innerMention[1];
        }
      }
    }

    if (isAction && title) {
      // Determine priority
      let priority: 'low' | 'medium' | 'high' = 'medium';
      for (const pattern of highPriorityPatterns) {
        if (title.match(pattern)) {
          priority = 'high';
          break;
        }
      }

      // Extract due date description
      let dueDescription: string | undefined;
      for (const pattern of duePatterns) {
        const match = title.match(pattern);
        if (match) {
          dueDescription = match[0];
          break;
        }
      }

      actions.push({
        title: cleanActionTitle(title),
        owner,
        dueDescription,
        priority,
      });
    }
  }

  return actions;
}

function cleanActionTitle(title: string): string {
  return title
    .replace(/@\w+[\s:]*/g, '')
    .replace(/\*\*/g, '')
    .replace(/^\s*[-*]\s*/, '')
    .trim();
}

export function convertExtractedToActionData(
  extracted: ExtractedAction,
  clientId: string,
  eventId: string,
  userMap?: Record<string, { userId: string; name: string }>
): Omit<MeetingActionItem, 'id' | 'createdAt' | 'updatedAt'> {
  let ownerUserId: string | undefined;
  let ownerName: string | undefined;

  if (extracted.owner && userMap && userMap[extracted.owner.toLowerCase()]) {
    const user = userMap[extracted.owner.toLowerCase()];
    ownerUserId = user.userId;
    ownerName = user.name;
  } else if (extracted.owner) {
    ownerName = extracted.owner;
  }

  return {
    clientId,
    eventId,
    title: extracted.title,
    ownerUserId,
    ownerName,
    status: 'open',
    priority: extracted.priority,
    source: 'ai_extracted',
  };
}

export function getActionItemsForEvent(items: MeetingActionItem[], eventId: string): MeetingActionItem[] {
  return items.filter(item => item.eventId === eventId);
}

export function getOpenActionItems(items: MeetingActionItem[]): MeetingActionItem[] {
  return items.filter(item => item.status !== 'done');
}

export function getOverdueActionItems(items: MeetingActionItem[]): MeetingActionItem[] {
  const now = new Date();
  return items.filter(item => {
    if (item.status === 'done' || !item.dueAt) return false;
    return new Date(item.dueAt) < now;
  });
}

export function getDueSoon(items: MeetingActionItem[], days: number = 7): MeetingActionItem[] {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return items.filter(item => {
    if (item.status === 'done' || !item.dueAt) return false;
    const due = new Date(item.dueAt);
    return due >= now && due <= future;
  });
}

export function createTaskFromAction(
  action: MeetingActionItem,
  taskDefaults?: { assigneeId?: string; projectId?: string }
): Record<string, unknown> {
  return {
    title: action.title,
    description: action.description || `От встречи: ${action.eventId}`,
    assigneeId: action.ownerUserId || taskDefaults?.assigneeId,
    dueDate: action.dueAt,
    priority: action.priority,
    status: 'open',
    linkedMeetingActionItemId: action.id,
    projectId: taskDefaults?.projectId,
  };
}
