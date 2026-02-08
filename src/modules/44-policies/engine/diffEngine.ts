export interface DiffLine {
  type: 'unchanged' | 'added' | 'removed';
  lineNumber: number;
  content: string;
}

export interface DiffResult {
  lines: DiffLine[];
  addedCount: number;
  removedCount: number;
  changedCount: number;
  totalLines: number;
}

export function computeLineDiff(oldText: string, newText: string): DiffResult {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  const result: DiffLine[] = [];
  let addedCount = 0;
  let removedCount = 0;

  const maxLen = Math.max(oldLines.length, newLines.length);
  let lineNumber = 1;

  // Simple line-by-line comparison (MVP approach)
  // For production, consider using a proper diff algorithm like Myers
  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);

  // Find removed lines (in old but not in new)
  for (const line of oldLines) {
    if (!newSet.has(line)) {
      result.push({
        type: 'removed',
        lineNumber: lineNumber++,
        content: line,
      });
      removedCount++;
    }
  }

  // Reset line number for new content
  lineNumber = 1;

  // Process new lines
  for (const line of newLines) {
    if (!oldSet.has(line)) {
      result.push({
        type: 'added',
        lineNumber: lineNumber,
        content: line,
      });
      addedCount++;
    } else {
      result.push({
        type: 'unchanged',
        lineNumber: lineNumber,
        content: line,
      });
    }
    lineNumber++;
  }

  // Sort by line number, with removed lines first at their position
  result.sort((a, b) => {
    if (a.lineNumber !== b.lineNumber) return a.lineNumber - b.lineNumber;
    if (a.type === 'removed') return -1;
    if (b.type === 'removed') return 1;
    return 0;
  });

  return {
    lines: result,
    addedCount,
    removedCount,
    changedCount: Math.min(addedCount, removedCount),
    totalLines: newLines.length,
  };
}

export function computeContextualDiff(
  oldText: string,
  newText: string,
  contextLines: number = 3
): DiffResult {
  const diff = computeLineDiff(oldText, newText);

  // Filter to show only changed lines with context
  const changedIndices = new Set<number>();

  diff.lines.forEach((line, index) => {
    if (line.type !== 'unchanged') {
      // Add context around changed lines
      for (let i = Math.max(0, index - contextLines); i <= Math.min(diff.lines.length - 1, index + contextLines); i++) {
        changedIndices.add(i);
      }
    }
  });

  const filteredLines = diff.lines.filter((_, index) => changedIndices.has(index));

  return {
    ...diff,
    lines: filteredLines,
  };
}

export function formatDiffForDisplay(diff: DiffResult): string {
  return diff.lines
    .map(line => {
      const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
      return `${prefix} ${line.content}`;
    })
    .join('\n');
}

export function getDiffSummary(diff: DiffResult): string {
  const parts: string[] = [];
  if (diff.addedCount > 0) {
    parts.push(`+${diff.addedCount} добавлено`);
  }
  if (diff.removedCount > 0) {
    parts.push(`-${diff.removedCount} удалено`);
  }
  if (parts.length === 0) {
    return 'Без изменений';
  }
  return parts.join(', ');
}

export function hasDifferences(diff: DiffResult): boolean {
  return diff.addedCount > 0 || diff.removedCount > 0;
}
