/**
 * Module 37: Exports and Audit Packs
 *
 * Features:
 * - Audit packs (GL, Net Worth, Private Capital, Payments, Docs)
 * - CSV/XLSX/PDF exports (MVP: CSV + PDF placeholder)
 * - Data lineage: sources, as-of, versions
 * - Client-safe pack variants
 * - Approvals for publishing and sharing
 * - Scheduling (MVP: on demand + saved templates)
 */

export { exportsConfig } from './config';
export * from './engine';
export * from './ui';
