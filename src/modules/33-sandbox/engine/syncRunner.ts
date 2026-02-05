/**
 * Sync Runner Engine
 * Execute sync jobs in sandbox environment
 */

import { generateMockPayload, shouldInjectError, type ConnectorKey, type EntityType, type ErrorInjection } from './connectorMocks';
import { applyMapping, type MappingRule, type TransformRule } from './mappingPreview';
import { logToSandbox } from './sbLogging';

export type JobType = 'pull' | 'push' | 'sync' | 'validate';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface SyncJobConfig {
  envId: string;
  connectorId: string;
  connectorKey: ConnectorKey;
  jobType: JobType;
  entityType: EntityType;
  batchSize?: number;
  mappingId?: string;
  mappingRules?: MappingRule[];
  transforms?: TransformRule[];
  errorInjection?: ErrorInjection;
}

export interface SyncJobResult {
  jobId: string;
  status: JobStatus;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  errorCount: number;
  payloadIds: string[];
  durationMs: number;
  errors: Array<{ code: string; message: string }>;
}

export interface JobProgress {
  jobId: string;
  status: JobStatus;
  progress: number; // 0-100
  recordsProcessed: number;
  currentPhase: 'initializing' | 'fetching' | 'mapping' | 'validating' | 'saving' | 'complete';
}

// Generate unique IDs
function generateJobId(): string {
  return `sbjob-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

function generatePayloadId(): string {
  return `sbpl-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}

// Simulate async delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runSyncJob(
  config: SyncJobConfig,
  onProgress?: (progress: JobProgress) => void
): Promise<SyncJobResult> {
  const jobId = generateJobId();
  const startTime = Date.now();
  const batchSize = config.batchSize || 100;

  const result: SyncJobResult = {
    jobId,
    status: 'running',
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    errorCount: 0,
    payloadIds: [],
    durationMs: 0,
    errors: [],
  };

  const reportProgress = (phase: JobProgress['currentPhase'], progress: number) => {
    if (onProgress) {
      onProgress({
        jobId,
        status: result.status,
        progress,
        recordsProcessed: result.recordsProcessed,
        currentPhase: phase,
      });
    }
  };

  try {
    // Initialize
    reportProgress('initializing', 0);
    await logToSandbox({
      envId: config.envId,
      level: 'info',
      source: 'job',
      message: `Starting ${config.jobType} job for ${config.entityType}`,
      refs: { jobId, connectorId: config.connectorId },
    });

    await delay(100);

    // Check for error injection
    if (config.errorInjection) {
      const errorCheck = shouldInjectError(config.errorInjection);
      if (errorCheck.inject) {
        result.status = 'failed';
        result.errorCount = 1;
        result.errors.push({
          code: errorCheck.errorType?.toUpperCase() || 'INJECTED_ERROR',
          message: `Simulated ${errorCheck.errorType} error`,
        });
        result.durationMs = Date.now() - startTime;

        await logToSandbox({
          envId: config.envId,
          level: 'error',
          source: 'job',
          message: `Job failed: ${errorCheck.errorType}`,
          refs: { jobId },
        });

        return result;
      }
    }

    // Fetch data (generate mock)
    reportProgress('fetching', 20);
    const mockPayload = generateMockPayload(
      config.connectorKey,
      config.entityType,
      batchSize
    );

    await delay(200);

    // Save payload
    const payloadId = generatePayloadId();
    result.payloadIds.push(payloadId);

    // Apply mapping if configured
    reportProgress('mapping', 40);
    let mappedRecords = mockPayload.records;

    if (config.mappingRules && config.mappingRules.length > 0) {
      mappedRecords = mockPayload.records.map(record =>
        applyMapping(record, config.mappingRules!, config.transforms || [])
      );

      await logToSandbox({
        envId: config.envId,
        level: 'info',
        source: 'mapping',
        message: `Applied mapping rules to ${mappedRecords.length} records`,
        refs: { jobId, payloadId, mappingId: config.mappingId },
      });
    }

    await delay(150);

    // Validate
    reportProgress('validating', 60);
    let validCount = 0;
    let invalidCount = 0;

    for (const record of mappedRecords) {
      // Simple validation: check for required id field
      if (record && typeof record === 'object' && ('id' in record || 'txn_id' in record || 'position_id' in record)) {
        validCount++;
      } else {
        invalidCount++;
      }
    }

    await delay(100);

    // Save records
    reportProgress('saving', 80);
    result.recordsProcessed = mappedRecords.length;
    result.recordsCreated = Math.floor(validCount * 0.95);
    result.recordsUpdated = Math.floor(validCount * 0.05);
    result.errorCount = invalidCount;

    if (invalidCount > 0) {
      result.errors.push({
        code: 'VALIDATION_ERROR',
        message: `${invalidCount} records failed validation`,
      });
    }

    await delay(100);

    // Complete
    reportProgress('complete', 100);
    result.status = invalidCount > mappedRecords.length / 2 ? 'failed' : 'completed';
    result.durationMs = Date.now() - startTime;

    await logToSandbox({
      envId: config.envId,
      level: result.status === 'completed' ? 'info' : 'warn',
      source: 'job',
      message: `Job ${result.status}: processed ${result.recordsProcessed}, created ${result.recordsCreated}, errors ${result.errorCount}`,
      refs: { jobId },
    });

  } catch (error) {
    result.status = 'failed';
    result.errorCount++;
    result.errors.push({
      code: 'RUNTIME_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    result.durationMs = Date.now() - startTime;

    await logToSandbox({
      envId: config.envId,
      level: 'error',
      source: 'job',
      message: `Job failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      refs: { jobId },
    });
  }

  return result;
}

export async function cancelJob(jobId: string): Promise<boolean> {
  // In MVP, cancellation is simulated
  console.log(`Cancelling job ${jobId}`);
  return true;
}

export async function retryJob(originalJobId: string, config: SyncJobConfig): Promise<SyncJobResult> {
  // Simply re-run with same config
  return runSyncJob(config);
}
