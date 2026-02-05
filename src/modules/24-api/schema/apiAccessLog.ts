/**
 * API Access Log Schema
 * Logs all API calls for auditing
 */

export interface ApiAccessLog {
  id: string;
  clientId?: string;
  apiKeyId: string;
  apiKeyName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  statusCode: number;
  latencyMs: number;
  scopeType?: string;
  scopeId?: string;
  requestParams?: Record<string, string>;
  responseSize?: number;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ApiAccessLogCreateInput {
  apiKeyId: string;
  apiKeyName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  statusCode: number;
  latencyMs: number;
  clientId?: string;
  scopeType?: string;
  scopeId?: string;
  requestParams?: Record<string, string>;
  responseSize?: number;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ApiAccessLogFilters {
  apiKeyId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  clientId?: string;
  fromDate?: string;
  toDate?: string;
}
