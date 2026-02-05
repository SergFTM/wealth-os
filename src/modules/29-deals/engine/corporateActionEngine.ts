/**
 * Corporate Action Engine
 * Processes corporate actions like splits, dividends, mergers
 */

// Simple UUID generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface CorporateAction {
  id: string;
  effectiveAt: string;
  assetKey: string;
  assetName: string;
  actionType: 'dividend' | 'split' | 'merger' | 'spin-off' | 'rights-issue' | 'tender';
  termsJson: string;
  status: 'announced' | 'planned' | 'applied' | 'cancelled';
}

export interface Position {
  id: string;
  assetKey: string;
  units: number;
  costBasis: number;
  currency: string;
}

export interface ActionResult {
  updatedPositions: Position[];
  newPositions: Position[];
  transactions: {
    txType: string;
    amount: number;
    units?: number;
    description: string;
  }[];
  auditSummary: string;
}

/**
 * Parse terms JSON safely
 */
function parseTerms(termsJson: string): Record<string, unknown> {
  try {
    return JSON.parse(termsJson);
  } catch {
    return {};
  }
}

/**
 * Apply a stock split
 */
export function applySplit(
  action: CorporateAction,
  positions: Position[]
): ActionResult {
  const terms = parseTerms(action.termsJson);
  const ratio = (terms.ratio as number) || 1;

  const affectedPositions = positions.filter(p => p.assetKey === action.assetKey);
  const updatedPositions: Position[] = [];

  for (const pos of affectedPositions) {
    updatedPositions.push({
      ...pos,
      units: pos.units * ratio,
      costBasis: pos.costBasis / ratio // Adjust cost basis per unit
    });
  }

  return {
    updatedPositions,
    newPositions: [],
    transactions: [],
    auditSummary: `Применен сплит ${ratio}:1 для ${action.assetName}. Обновлено ${affectedPositions.length} позиций.`
  };
}

/**
 * Apply a dividend
 */
export function applyDividend(
  action: CorporateAction,
  positions: Position[]
): ActionResult {
  const terms = parseTerms(action.termsJson);
  const amountPerShare = (terms.amountPerShare as number) || 0;
  const currency = (terms.currency as string) || 'USD';

  const affectedPositions = positions.filter(p => p.assetKey === action.assetKey);
  const transactions: ActionResult['transactions'] = [];
  let totalDividend = 0;

  for (const pos of affectedPositions) {
    const dividendAmount = pos.units * amountPerShare;
    totalDividend += dividendAmount;

    transactions.push({
      txType: 'dividend',
      amount: dividendAmount,
      units: pos.units,
      description: `Дивиденд ${action.assetName}: ${pos.units} x ${amountPerShare} ${currency}`
    });
  }

  return {
    updatedPositions: [],
    newPositions: [],
    transactions,
    auditSummary: `Применены дивиденды для ${action.assetName}. Общая сумма: ${totalDividend.toLocaleString()} ${currency}`
  };
}

/**
 * Apply a merger
 */
export function applyMerger(
  action: CorporateAction,
  positions: Position[]
): ActionResult {
  const terms = parseTerms(action.termsJson);
  const exchangeRatio = (terms.exchangeRatio as number) || 1;
  const newAssetKey = (terms.newAssetKey as string) || action.assetKey;
  const newAssetName = (terms.newAssetName as string) || action.assetName;
  const cashComponent = (terms.cashPerShare as number) || 0;

  const affectedPositions = positions.filter(p => p.assetKey === action.assetKey);
  const newPositions: Position[] = [];
  const transactions: ActionResult['transactions'] = [];

  for (const pos of affectedPositions) {
    // Create new position in merged entity
    newPositions.push({
      id: uuidv4(),
      assetKey: newAssetKey,
      units: pos.units * exchangeRatio,
      costBasis: pos.costBasis, // Carry over cost basis
      currency: pos.currency
    });

    // Cash component if any
    if (cashComponent > 0) {
      transactions.push({
        txType: 'distribution',
        amount: pos.units * cashComponent,
        description: `Денежная составляющая слияния ${action.assetName}: ${pos.units} x ${cashComponent}`
      });
    }
  }

  return {
    updatedPositions: affectedPositions.map(p => ({ ...p, units: 0 })), // Zero out old positions
    newPositions,
    transactions,
    auditSummary: `Применено слияние ${action.assetName} -> ${newAssetName}. Коэффициент обмена: ${exchangeRatio}. Создано ${newPositions.length} новых позиций.`
  };
}

/**
 * Apply a spin-off
 */
export function applySpinOff(
  action: CorporateAction,
  positions: Position[]
): ActionResult {
  const terms = parseTerms(action.termsJson);
  const spinOffRatio = (terms.ratio as number) || 0.1; // Units of new stock per old stock
  const newAssetKey = (terms.newAssetKey as string) || `${action.assetKey}-SPINOFF`;
  const newAssetName = (terms.newAssetName as string) || `${action.assetName} SpinOff`;
  const costBasisAllocation = (terms.costBasisAllocation as number) || 0.1; // % of cost basis to allocate

  const affectedPositions = positions.filter(p => p.assetKey === action.assetKey);
  const updatedPositions: Position[] = [];
  const newPositions: Position[] = [];

  for (const pos of affectedPositions) {
    // Update original position cost basis
    updatedPositions.push({
      ...pos,
      costBasis: pos.costBasis * (1 - costBasisAllocation)
    });

    // Create spin-off position
    newPositions.push({
      id: uuidv4(),
      assetKey: newAssetKey,
      units: pos.units * spinOffRatio,
      costBasis: pos.costBasis * costBasisAllocation,
      currency: pos.currency
    });
  }

  return {
    updatedPositions,
    newPositions,
    transactions: [],
    auditSummary: `Применен спин-офф ${action.assetName} -> ${newAssetName}. Коэффициент: ${spinOffRatio}. Создано ${newPositions.length} новых позиций.`
  };
}

/**
 * Main function to apply any corporate action
 */
export function applyCorporateAction(
  action: CorporateAction,
  positions: Position[]
): ActionResult {
  switch (action.actionType) {
    case 'split':
      return applySplit(action, positions);
    case 'dividend':
      return applyDividend(action, positions);
    case 'merger':
      return applyMerger(action, positions);
    case 'spin-off':
      return applySpinOff(action, positions);
    case 'rights-issue':
    case 'tender':
      // Placeholder for other action types
      return {
        updatedPositions: [],
        newPositions: [],
        transactions: [],
        auditSummary: `Корпоративное действие ${action.actionType} требует ручной обработки.`
      };
    default:
      return {
        updatedPositions: [],
        newPositions: [],
        transactions: [],
        auditSummary: `Неизвестный тип действия: ${action.actionType}`
      };
  }
}

/**
 * Validate corporate action before applying
 */
export function validateCorporateAction(action: CorporateAction): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!action.assetKey) {
    errors.push('Не указан актив');
  }

  if (!action.effectiveAt) {
    errors.push('Не указана дата вступления в силу');
  }

  const terms = parseTerms(action.termsJson);

  switch (action.actionType) {
    case 'split':
      if (!terms.ratio || (terms.ratio as number) <= 0) {
        errors.push('Для сплита требуется корректный коэффициент (ratio > 0)');
      }
      break;
    case 'dividend':
      if (!terms.amountPerShare || (terms.amountPerShare as number) <= 0) {
        errors.push('Для дивиденда требуется сумма на акцию (amountPerShare > 0)');
      }
      break;
    case 'merger':
      if (!terms.exchangeRatio) {
        errors.push('Для слияния требуется коэффициент обмена (exchangeRatio)');
      }
      if (!terms.newAssetKey) {
        errors.push('Для слияния требуется новый актив (newAssetKey)');
      }
      break;
    case 'spin-off':
      if (!terms.ratio) {
        errors.push('Для спин-оффа требуется коэффициент (ratio)');
      }
      if (!terms.newAssetKey) {
        errors.push('Для спин-оффа требуется новый актив (newAssetKey)');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get upcoming corporate actions
 */
export function getUpcomingActions(
  actions: CorporateAction[],
  daysAhead: number = 30
): CorporateAction[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return actions.filter(a => {
    if (a.status === 'cancelled' || a.status === 'applied') return false;
    const effectiveDate = new Date(a.effectiveAt);
    return effectiveDate >= now && effectiveDate <= futureDate;
  }).sort((a, b) => new Date(a.effectiveAt).getTime() - new Date(b.effectiveAt).getTime());
}
