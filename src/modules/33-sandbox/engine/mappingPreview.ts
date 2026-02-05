/**
 * Mapping Preview Engine
 * Apply mapping rules and transformations to data
 */

export interface MappingRule {
  sourceField: string;
  targetField: string;
  required?: boolean;
  defaultValue?: unknown;
}

export type TransformType =
  | 'toNumber'
  | 'toDate'
  | 'toString'
  | 'toBoolean'
  | 'normalizeCurrency'
  | 'uppercase'
  | 'lowercase'
  | 'trim'
  | 'split'
  | 'join'
  | 'lookup'
  | 'calculate';

export interface TransformRule {
  field: string;
  transform: TransformType;
  params?: Record<string, unknown>;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'notNull' | 'positive' | 'email' | 'date' | 'number' | 'minLength' | 'maxLength';
  params?: Record<string, unknown>;
}

export interface MappingPreviewResult {
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}

export interface MappingValidationResult {
  valid: boolean;
  errors: Array<{ field: string; rule: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}

// Get nested value from object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// Set nested value in object using dot notation
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;

  let current = obj;
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[lastKey] = value;
}

// Transform functions
const transforms: Record<TransformType, (value: unknown, params?: Record<string, unknown>) => unknown> = {
  toNumber: (value, params) => {
    const num = Number(value);
    if (params?.divideBy) {
      return num / (params.divideBy as number);
    }
    if (params?.multiplyBy) {
      return num * (params.multiplyBy as number);
    }
    return num;
  },

  toDate: (value, params) => {
    if (!value) return null;
    const date = new Date(value as string);
    if (params?.format === 'YYYY-MM-DD') {
      return date.toISOString().split('T')[0];
    }
    return date.toISOString();
  },

  toString: (value) => String(value ?? ''),

  toBoolean: (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  },

  normalizeCurrency: (value, params) => {
    const num = Number(value);
    const currency = params?.currency || 'USD';
    return { amount: num, currency };
  },

  uppercase: (value) => String(value ?? '').toUpperCase(),

  lowercase: (value) => String(value ?? '').toLowerCase(),

  trim: (value) => String(value ?? '').trim(),

  split: (value, params) => {
    const delimiter = (params?.delimiter as string) || ',';
    return String(value ?? '').split(delimiter);
  },

  join: (value, params) => {
    if (!Array.isArray(value)) return value;
    const delimiter = (params?.delimiter as string) || ',';
    return value.join(delimiter);
  },

  lookup: (value, params) => {
    const table = params?.table as Record<string, unknown> | undefined;
    if (table && value !== undefined) {
      return table[String(value)] ?? value;
    }
    return value;
  },

  calculate: (value, params) => {
    const formula = params?.formula as string | undefined;
    if (formula === 'abs') {
      return Math.abs(Number(value));
    }
    if (formula === 'round') {
      return Math.round(Number(value));
    }
    return value;
  },
};

// Validation functions
const validators: Record<ValidationRule['rule'], (value: unknown, params?: Record<string, unknown>) => boolean> = {
  required: (value) => value !== undefined && value !== null && value !== '',
  notNull: (value) => value !== null && value !== undefined,
  positive: (value) => typeof value === 'number' && value > 0,
  email: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  date: (value) => !isNaN(Date.parse(String(value))),
  number: (value) => typeof value === 'number' && !isNaN(value),
  minLength: (value, params) => String(value ?? '').length >= (params?.min as number ?? 0),
  maxLength: (value, params) => String(value ?? '').length <= (params?.max as number ?? Infinity),
};

export function applyMapping(
  input: Record<string, unknown>,
  rules: MappingRule[],
  transformRules: TransformRule[] = []
): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  // Apply mapping rules
  for (const rule of rules) {
    let value = getNestedValue(input, rule.sourceField);

    if (value === undefined && rule.defaultValue !== undefined) {
      value = rule.defaultValue;
    }

    if (value !== undefined) {
      setNestedValue(output, rule.targetField, value);
    }
  }

  // Apply transforms
  for (const transformRule of transformRules) {
    const currentValue = getNestedValue(output, transformRule.field);
    if (currentValue !== undefined) {
      const transformFn = transforms[transformRule.transform];
      if (transformFn) {
        const transformedValue = transformFn(currentValue, transformRule.params);
        setNestedValue(output, transformRule.field, transformedValue);
      }
    }
  }

  return output;
}

export function validateMapping(
  data: Record<string, unknown>,
  validationRules: ValidationRule[]
): MappingValidationResult {
  const result: MappingValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  for (const rule of validationRules) {
    const value = getNestedValue(data, rule.field);
    const validator = validators[rule.rule];

    if (validator && !validator(value, rule.params)) {
      result.valid = false;
      result.errors.push({
        field: rule.field,
        rule: rule.rule,
        message: `Validation failed: ${rule.field} - ${rule.rule}`,
      });
    }
  }

  return result;
}

export function previewMapping(
  input: Record<string, unknown>,
  rules: MappingRule[],
  transformRules: TransformRule[] = [],
  validationRules: ValidationRule[] = []
): MappingPreviewResult {
  const output = applyMapping(input, rules, transformRules);
  const validation = validateMapping(output, validationRules);

  return {
    input,
    output,
    errors: validation.errors.map(e => ({ field: e.field, message: e.message })),
    warnings: validation.warnings,
  };
}

export function generateSampleInput(entityType: string): Record<string, unknown> {
  const samples: Record<string, Record<string, unknown>> = {
    transactions: {
      txn_id: 'TXN-2024-00001',
      txn_date: '2024-01-15',
      amount_cents: 150000,
      currency: 'usd',
      description: 'Stock purchase',
    },
    positions: {
      position_id: 'POS-001',
      security_id: 'AAPL',
      quantity: 100,
      market_value: 18500.00,
    },
    invoices: {
      invoice_no: 'INV-2024-00001',
      vendor_name: 'Service Provider LLC',
      total_amount: 5000.00,
      due_date: '2024-02-15',
    },
    accounts: {
      account_number: '1234567890',
      account_name: 'Main Trading Account',
      currency_code: 'usd',
    },
  };

  return samples[entityType] || samples.transactions;
}
