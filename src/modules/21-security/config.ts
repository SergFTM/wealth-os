import { ModuleConfig } from '../types';

export const securityConfig: ModuleConfig = {
  id: 'security',
  slug: 'security',
  icon: 'shield',
  order: 25,
  title: {
    en: 'Security',
    ru: 'Безопасность',
    uk: 'Безпека',
  },
  description: {
    en: 'IAM, RBAC, MFA, access reviews, incidents, audit logs',
    ru: 'IAM, RBAC, MFA, ревью доступов, инциденты, аудит логи',
    uk: 'IAM, RBAC, MFA, ревью доступів, інциденти, аудит логи',
  },
  disclaimer: {
    en: 'Security settings affect all users. Changes require administrator approval.',
    ru: 'Настройки безопасности влияют на всех пользователей. Изменения требуют одобрения администратора.',
    uk: 'Налаштування безпеки впливають на всіх користувачів. Зміни потребують схвалення адміністратора.',
  },
  kpis: [
    { key: 'activeUsers', title: { en: 'Active Users', ru: 'Активные пользователи', uk: 'Активні користувачі' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'noMfa', title: { en: 'Users without MFA', ru: 'Пользователи без MFA', uk: 'Користувачі без MFA' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'activeSessions', title: { en: 'Active Sessions', ru: 'Активные сессии', uk: 'Активні сесії' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'suspiciousSessions', title: { en: 'Suspicious 7d', ru: 'Подозрительные 7д', uk: 'Підозрілі 7д' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'openIncidents', title: { en: 'Open Incidents', ru: 'Открытые инциденты', uk: 'Відкриті інциденти' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'reviewsDue', title: { en: 'Reviews Due 30d', ru: 'Ревью через 30д', uk: 'Ревью через 30д' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'policyViolations', title: { en: 'Policy Violations', ru: 'Нарушения политик', uk: 'Порушення політик' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'auditEvents24h', title: { en: 'Audit Events 24h', ru: 'События аудита 24ч', uk: 'Події аудиту 24г' }, format: 'number', status: 'ok', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { en: 'Name', ru: 'Имя', uk: 'Ім\'я' } },
    { key: 'email', header: { en: 'Email', ru: 'Email', uk: 'Email' } },
    { key: 'role', header: { en: 'Role', ru: 'Роль', uk: 'Роль' } },
    { key: 'mfaStatus', header: { en: 'MFA', ru: 'MFA', uk: 'MFA' }, type: 'badge' },
    { key: 'status', header: { en: 'Status', ru: 'Статус', uk: 'Статус' }, type: 'status' },
    { key: 'lastLogin', header: { en: 'Last Login', ru: 'Последний вход', uk: 'Останній вхід' }, type: 'date' },
  ],
  actions: [
    { key: 'createUser', label: { en: 'Create User', ru: 'Создать пользователя', uk: 'Створити користувача' }, variant: 'primary' },
    { key: 'createRole', label: { en: 'Create Role', ru: 'Создать роль', uk: 'Створити роль' }, variant: 'secondary' },
    { key: 'bindRole', label: { en: 'Bind Role', ru: 'Привязать роль', uk: 'Прив\'язати роль' }, variant: 'secondary' },
    { key: 'exportAudit', label: { en: 'Export Audit', ru: 'Экспорт аудита', uk: 'Експорт аудиту' }, variant: 'ghost' },
  ],
  adminOnly: true,
  clientSafeHidden: true,
};

export default securityConfig;
