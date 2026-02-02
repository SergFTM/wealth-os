// Types
export interface Client {
  id: string;
  name: string;
  type: string;
  totalNetWorth: number;
  entities: number;
  accounts: number;
  status: string;
}

export interface Task {
  id: string;
  title: string;
  client: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  type: string;
}

export interface Alert {
  id: string;
  title: string;
  client: string;
  severity: 'info' | 'warning' | 'critical';
  category: string;
  timestamp: string;
  description: string;
}

export interface Document {
  id: string;
  name: string;
  client: string;
  type: string;
  status: string;
  uploadedAt: string;
  size: string;
}

export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  issuedDate: string;
}

export interface IpsBreach {
  id: string;
  client: string;
  rule: string;
  current: string;
  threshold: string;
  severity: 'info' | 'warning' | 'critical';
  detectedAt: string;
}

export interface SyncJob {
  id: string;
  provider: string;
  client: string;
  status: 'success' | 'error' | 'warning';
  lastSync: string;
  recordsProcessed: number;
  errors: number;
}

export interface Approval {
  id: string;
  title: string;
  client: string;
  type: string;
  requestedBy: string;
  status: string;
  amount: number | null;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  client: string;
  entity: string;
  type: string;
  custodian: string;
  balance: number;
  currency: string;
}

export interface Entity {
  id: string;
  name: string;
  client: string;
  type: string;
  jurisdiction: string;
  taxId: string;
  status: string;
}

export type UserRole = 'admin' | 'cio' | 'cfo' | 'operations' | 'compliance' | 'rm' | 'advisor' | 'client';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

// Data imports
import clientsData from '@/data/clients.json';
import tasksData from '@/data/tasks.json';
import alertsData from '@/data/alerts.json';
import documentsData from '@/data/documents.json';
import invoicesData from '@/data/invoices.json';
import ipsBreachesData from '@/data/ips-breaches.json';
import syncJobsData from '@/data/sync-jobs.json';
import approvalsData from '@/data/approvals.json';
import accountsData from '@/data/accounts.json';
import entitiesData from '@/data/entities.json';

// Typed data exports
export const clients: Client[] = clientsData as Client[];
export const tasks: Task[] = tasksData as Task[];
export const alerts: Alert[] = alertsData as Alert[];
export const documents: Document[] = documentsData as Document[];
export const invoices: Invoice[] = invoicesData as Invoice[];
export const ipsBreaches: IpsBreach[] = ipsBreachesData as IpsBreach[];
export const syncJobs: SyncJob[] = syncJobsData as SyncJob[];
export const approvals: Approval[] = approvalsData as Approval[];
export const accounts: Account[] = accountsData as Account[];
export const entities: Entity[] = entitiesData as Entity[];

// Helper functions
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getOpenTasks(): Task[] {
  return tasks.filter(t => t.status !== 'completed');
}

export function getPendingApprovals(): Approval[] {
  return approvals.filter(a => a.status === 'pending');
}

export function getOverdueInvoices(): Invoice[] {
  return invoices.filter(i => i.status === 'overdue');
}

export function getSyncErrors(): SyncJob[] {
  return syncJobs.filter(s => s.status === 'error');
}

export function getTotalNetWorth(): number {
  return clients.reduce((sum, c) => sum + c.totalNetWorth, 0);
}

export function getCriticalAlerts(): Alert[] {
  return alerts.filter(a => a.severity === 'critical');
}

export function getRecentDocuments(limit = 5): Document[] {
  return [...documents]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, limit);
}

export function getTasksByPriority(priority: Task['priority']): Task[] {
  return tasks.filter(t => t.priority === priority);
}

export function getSyncHealthPercentage(): number {
  const successful = syncJobs.filter(s => s.status === 'success').length;
  return Math.round((successful / syncJobs.length) * 100);
}
