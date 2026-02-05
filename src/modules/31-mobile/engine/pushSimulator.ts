/**
 * Push notification simulator for Mobile module
 * MVP: In-app simulation without real Web Push API
 */

export type PushTopic = 'approvals' | 'reports' | 'risk' | 'invoices' | 'messages' | 'tasks' | 'alerts' | 'documents';

export interface PushSubscription {
  id: string;
  clientId: string;
  deviceId: string;
  userId: string;
  topicsJson: PushTopic[];
  status: 'active' | 'paused' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface PushMessage {
  id: string;
  clientId: string;
  userId: string;
  deviceId?: string;
  topic: PushTopic;
  title: string;
  body: string;
  deepLink: string;
  status: 'unread' | 'read';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  readAt?: string;
}

export function getAvailableTopics(): { value: PushTopic; label: { ru: string; en: string; uk: string }; audience: 'staff' | 'client' | 'both' }[] {
  return [
    { value: 'approvals', label: { ru: 'Согласования', en: 'Approvals', uk: 'Погодження' }, audience: 'staff' },
    { value: 'reports', label: { ru: 'Отчеты', en: 'Reports', uk: 'Звіти' }, audience: 'both' },
    { value: 'risk', label: { ru: 'Риски', en: 'Risk Alerts', uk: 'Ризики' }, audience: 'staff' },
    { value: 'invoices', label: { ru: 'Счета', en: 'Invoices', uk: 'Рахунки' }, audience: 'client' },
    { value: 'messages', label: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' }, audience: 'both' },
    { value: 'tasks', label: { ru: 'Задачи', en: 'Tasks', uk: 'Задачі' }, audience: 'staff' },
    { value: 'alerts', label: { ru: 'Системные', en: 'System Alerts', uk: 'Системні' }, audience: 'both' },
    { value: 'documents', label: { ru: 'Документы', en: 'Documents', uk: 'Документи' }, audience: 'both' },
  ];
}

export function generateDemoPush(userId: string, clientId: string): Omit<PushMessage, 'id'> {
  const demoMessages = [
    {
      topic: 'approvals' as PushTopic,
      title: 'Новый запрос на согласование',
      body: 'Wire transfer $25,000 ожидает подтверждения',
      deepLink: '/m/tasks/item/demo-task',
      priority: 'high' as const,
    },
    {
      topic: 'reports' as PushTopic,
      title: 'Отчет готов',
      body: 'Monthly Performance Report доступен для просмотра',
      deepLink: '/m/reports/item/demo-report',
      priority: 'normal' as const,
    },
    {
      topic: 'risk' as PushTopic,
      title: 'Risk Alert',
      body: 'Превышен лимит концентрации в секторе Technology',
      deepLink: '/m/risk/item/demo-alert',
      priority: 'urgent' as const,
    },
    {
      topic: 'messages' as PushTopic,
      title: 'Новое сообщение',
      body: 'Advisor отправил вам сообщение',
      deepLink: '/m/comms/thread/demo-thread',
      priority: 'normal' as const,
    },
  ];

  const demo = demoMessages[Math.floor(Math.random() * demoMessages.length)];
  
  return {
    clientId,
    userId,
    topic: demo.topic,
    title: demo.title,
    body: demo.body,
    deepLink: demo.deepLink,
    status: 'unread',
    priority: demo.priority,
    createdAt: new Date().toISOString(),
  };
}

export function getPriorityLabel(priority: PushMessage['priority'], locale: 'ru' | 'en' | 'uk' = 'ru') {
  const labels = {
    low: { ru: 'Низкий', en: 'Low', uk: 'Низький' },
    normal: { ru: 'Обычный', en: 'Normal', uk: 'Звичайний' },
    high: { ru: 'Высокий', en: 'High', uk: 'Високий' },
    urgent: { ru: 'Срочный', en: 'Urgent', uk: 'Терміновий' },
  };
  return labels[priority][locale];
}

export function getPriorityColor(priority: PushMessage['priority']): string {
  const colors = {
    low: 'text-stone-500 bg-stone-100',
    normal: 'text-blue-600 bg-blue-100',
    high: 'text-amber-600 bg-amber-100',
    urgent: 'text-red-600 bg-red-100',
  };
  return colors[priority];
}

export function getTopicIcon(topic: PushTopic): string {
  const icons: Record<PushTopic, string> = {
    approvals: 'CheckCircle',
    reports: 'FileText',
    risk: 'AlertTriangle',
    invoices: 'CreditCard',
    messages: 'MessageSquare',
    tasks: 'ListTodo',
    alerts: 'Bell',
    documents: 'File',
  };
  return icons[topic];
}

export function filterMessagesByTopic(messages: PushMessage[], topic: PushTopic | null): PushMessage[] {
  if (!topic) return messages;
  return messages.filter(m => m.topic === topic);
}

export function filterUnreadMessages(messages: PushMessage[]): PushMessage[] {
  return messages.filter(m => m.status === 'unread');
}

export function getUnreadCount(messages: PushMessage[]): number {
  return messages.filter(m => m.status === 'unread').length;
}
