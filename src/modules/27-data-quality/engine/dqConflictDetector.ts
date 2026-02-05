/**
 * Data Quality Conflict Detector
 * Detects duplicates, mismatches, and data conflicts
 */

import { DqConflict, DqConflictCreateInput, ConflictRef } from '../schema/dqConflict';
import { DqConflictType, DqSeverity } from '../config';

export interface ConflictDetectionResult {
  conflicts: DqConflictCreateInput[];
  recordsScanned: number;
}

function createConflictRef(
  collection: string,
  record: Record<string, unknown>,
  keyFields: string[]
): ConflictRef {
  const keys: Record<string, unknown> = {};
  for (const field of keyFields) {
    keys[field] = record[field];
  }
  return {
    collection,
    recordId: record.id as string,
    displayLabel: (record.title || record.name || record.id) as string,
    keyFields: keys,
  };
}

export function detectDuplicates(
  collection: string,
  records: Record<string, unknown>[],
  keyFields: string[]
): ConflictDetectionResult {
  const conflicts: DqConflictCreateInput[] = [];
  const seen = new Map<string, Record<string, unknown>>();

  for (const record of records) {
    const key = keyFields.map(f => String(record[f] || '')).join('|');

    if (seen.has(key)) {
      const existing = seen.get(key)!;
      conflicts.push({
        conflictType: 'duplicate_tx',
        severity: 'warning',
        title: `Возможный дубликат в ${collection}`,
        description: `Записи с одинаковыми ключами: ${key}`,
        leftRef: createConflictRef(collection, existing, keyFields),
        rightRef: createConflictRef(collection, record, keyFields),
      });
    } else {
      seen.set(key, record);
    }
  }

  return { conflicts, recordsScanned: records.length };
}

export function detectCurrencyMismatch(
  records: Record<string, unknown>[],
  collection: string,
  accountField: string = 'accountId'
): ConflictDetectionResult {
  const conflicts: DqConflictCreateInput[] = [];
  const byAccount = new Map<string, Record<string, unknown>[]>();

  for (const record of records) {
    const accountId = record[accountField] as string;
    if (accountId) {
      if (!byAccount.has(accountId)) {
        byAccount.set(accountId, []);
      }
      byAccount.get(accountId)!.push(record);
    }
  }

  for (const [accountId, accountRecords] of byAccount) {
    const currencies = new Set(accountRecords.map(r => r.currency as string));
    if (currencies.size > 1) {
      const currencyArr = Array.from(currencies);
      const first = accountRecords.find(r => r.currency === currencyArr[0])!;
      const second = accountRecords.find(r => r.currency === currencyArr[1])!;

      conflicts.push({
        conflictType: 'currency_mismatch',
        severity: 'critical',
        title: `Несовпадение валют для счёта ${accountId}`,
        description: `Обнаружены транзакции в разных валютах: ${currencyArr.join(', ')}`,
        leftRef: createConflictRef(collection, first, ['id', 'currency']),
        rightRef: createConflictRef(collection, second, ['id', 'currency']),
      });
    }
  }

  return { conflicts, recordsScanned: records.length };
}

export function detectMissingOwner(
  records: Record<string, unknown>[],
  collection: string,
  ownerField: string = 'ownerId'
): ConflictDetectionResult {
  const conflicts: DqConflictCreateInput[] = [];

  for (const record of records) {
    const owner = record[ownerField];
    if (!owner) {
      conflicts.push({
        conflictType: 'owner_missing',
        severity: 'warning',
        title: `Отсутствует владелец`,
        description: `Запись ${record.id} не имеет назначенного владельца`,
        leftRef: createConflictRef(collection, record, ['id']),
        rightRef: {
          collection: 'users',
          recordId: 'unassigned',
          displayLabel: 'Не назначен',
          keyFields: {},
        },
      });
    }
  }

  return { conflicts, recordsScanned: records.length };
}

export function detectPositionMismatch(
  positions: Record<string, unknown>[],
  statements: Record<string, unknown>[]
): ConflictDetectionResult {
  const conflicts: DqConflictCreateInput[] = [];

  const positionMap = new Map<string, Record<string, unknown>>();
  for (const pos of positions) {
    const key = `${pos.securityId}|${pos.accountId}`;
    positionMap.set(key, pos);
  }

  for (const stmt of statements) {
    const key = `${stmt.securityId}|${stmt.accountId}`;
    const position = positionMap.get(key);

    if (position) {
      const posQty = position.quantity as number || 0;
      const stmtQty = stmt.quantity as number || 0;

      if (Math.abs(posQty - stmtQty) > 0.001) {
        conflicts.push({
          conflictType: 'position_mismatch',
          severity: 'critical',
          title: `Расхождение позиции`,
          description: `Позиция: ${posQty}, Выписка: ${stmtQty}`,
          leftRef: {
            collection: 'positions',
            recordId: position.id as string,
            displayLabel: `Позиция ${position.securityId}`,
            keyFields: { quantity: posQty },
          },
          rightRef: {
            collection: 'statements',
            recordId: stmt.id as string,
            displayLabel: `Выписка ${stmt.securityId}`,
            keyFields: { quantity: stmtQty },
          },
        });
      }
    }
  }

  return { conflicts, recordsScanned: positions.length + statements.length };
}

export function runConflictDetection(
  dataByCollection: Record<string, Record<string, unknown>[]>
): DqConflictCreateInput[] {
  const allConflicts: DqConflictCreateInput[] = [];

  // Detect duplicates in transactions
  if (dataByCollection.glTransactions) {
    const result = detectDuplicates(
      'glTransactions',
      dataByCollection.glTransactions,
      ['date', 'amount', 'accountId', 'description']
    );
    allConflicts.push(...result.conflicts);
  }

  // Detect currency mismatches
  if (dataByCollection.glTransactions) {
    const result = detectCurrencyMismatch(dataByCollection.glTransactions, 'glTransactions');
    allConflicts.push(...result.conflicts);
  }

  // Detect missing owners in documents
  if (dataByCollection.documents) {
    const result = detectMissingOwner(dataByCollection.documents, 'documents', 'ownerId');
    allConflicts.push(...result.conflicts);
  }

  // Detect position mismatches
  if (dataByCollection.positions && dataByCollection.statements) {
    const result = detectPositionMismatch(
      dataByCollection.positions,
      dataByCollection.statements
    );
    allConflicts.push(...result.conflicts);
  }

  return allConflicts;
}
