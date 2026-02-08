/**
 * Generator: creates README.md for each module M01–M55
 * Run: node docs/wiki/04-modules/_generate-readmes.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

const modules = [
  // ── Core Wealth, Accounting, Investments ───────────────────────
  {
    n: 1, slug: "unified-net-worth", name: "Unified Net Worth",
    codeSlug: "net-worth",
    ruLabel: "Единый баланс и агрегация капитала",
    purpose: `Агрегирует все активы (liquid, illiquid, private, real estate, personal) и обязательства клиента/группы в единый баланс.\n- Основной пользователь: CIO, Owner, RM\n- Используется как «точка входа» для Net Worth drill-down\n- Результат: консолидированный баланс, разбивка по классам, динамика`,
    outcomes: ["Single source of truth for total wealth", "Cross-entity / cross-custodian aggregation", "Historical net worth tracking"],
    collections: ["netWorthSnapshots", "assetAllocations", "liabilityItems", "valuationOverrides"],
    entities: [
      { name: "NetWorthSnapshot", fields: "id, householdId, asOf, totalAssets, totalLiabilities, netWorth, currency, breakdown[]" },
      { name: "AssetAllocation", fields: "id, snapshotId, assetClass, subClass, marketValue, percentage, sourceRef" },
    ],
    routes: ["/m/net-worth", "/m/net-worth/list", "/m/net-worth/snapshot/[id]"],
    related: { sources: "M14 Integrations, M03 Performance", consumers: "M19 Reporting, M55 Portal", governance: "M46 Data Governance" },
  },
  {
    n: 2, slug: "general-ledger-accounting", name: "General Ledger and Accounting",
    codeSlug: "general-ledger",
    ruLabel: "Интегрированная главная книга IFRS/GAAP",
    purpose: `Ведение главной книги для семейных структур с поддержкой IFRS/GAAP.\n- Основной пользователь: CFO, Controller, бухгалтерия\n- Журнал проводок, план счетов, закрытие периодов\n- Результат: оборотно-сальдовая ведомость, баланс, P&L`,
    outcomes: ["Unified chart of accounts across entities", "Multi-entity consolidation", "Period close automation"],
    collections: ["chartOfAccounts", "journalEntries", "trialBalance", "periodCloses"],
    entities: [
      { name: "JournalEntry", fields: "id, date, entityId, debitAccount, creditAccount, amount, currency, memo, status, sourceRef" },
      { name: "ChartOfAccount", fields: "id, code, name, type, parentId, entityId, isActive" },
    ],
    routes: ["/m/general-ledger", "/m/general-ledger/list", "/m/general-ledger/entry/[id]"],
    related: { sources: "M14 Integrations, M06 Payments", consumers: "M05 Reporting, M13 Fees", governance: "M46 Data Governance" },
  },
  {
    n: 3, slug: "portfolio-performance-attribution", name: "Portfolio Performance and Attribution",
    codeSlug: "performance",
    ruLabel: "Эффективность портфеля, атрибуция, бенчмарки",
    purpose: `Расчёт доходности портфелей (TWR, MWR), атрибуция, сравнение с бенчмарками.\n- Основной пользователь: CIO, Portfolio Manager, RM\n- Drill-down по стратегиям, классам, менеджерам\n- Результат: performance reports, attribution waterfall, peer comparison`,
    outcomes: ["Accurate TWR/MWR across custodians", "Multi-level attribution (asset class, sector, manager)", "Benchmark comparison with custom composites"],
    collections: ["performanceSeries", "benchmarks", "attributionResults", "composites"],
    entities: [
      { name: "PerformanceSeries", fields: "id, portfolioId, period, twr, mwr, benchmarkReturn, alpha, inception, asOf" },
      { name: "AttributionResult", fields: "id, seriesId, level, factor, allocation, selection, interaction, total" },
    ],
    routes: ["/m/performance", "/m/performance/list", "/m/performance/portfolio/[id]"],
    related: { sources: "M14 Integrations, M01 Net Worth", consumers: "M19 Reporting, M09 IPS", governance: "M46 Data Governance" },
  },
  {
    n: 4, slug: "private-markets-alternatives", name: "Private Markets and Alternatives",
    codeSlug: "private-capital",
    ruLabel: "Private equity, VC, real estate funds, commitments, calls, distributions",
    purpose: `Учёт альтернативных инвестиций: PE, VC, хедж-фонды, RE funds.\n- Основной пользователь: CIO, Investment Team\n- Commitments, capital calls, distributions, NAV tracking\n- Результат: commitment tracker, IRR/TVPI/DPI, cash flow forecasts`,
    outcomes: ["Full commitment lifecycle tracking", "IRR/TVPI/DPI/RVPI metrics", "Capital call and distribution forecasting"],
    collections: ["commitments", "capitalCalls", "distributions", "fundNAVs", "privateHoldings"],
    entities: [
      { name: "Commitment", fields: "id, fundName, vintage, committed, called, distributed, nav, irr, tvpi, dpi, status" },
      { name: "CapitalCall", fields: "id, commitmentId, callDate, amount, dueDate, status, noticeRef" },
    ],
    routes: ["/m/private-capital", "/m/private-capital/list", "/m/private-capital/commitment/[id]"],
    related: { sources: "M14 Integrations", consumers: "M01 Net Worth, M03 Performance, M11 Tax", governance: "M46 Data Governance" },
  },
  {
    n: 5, slug: "document-vault-records", name: "Document Vault and Records",
    codeSlug: "documents",
    ruLabel: "Хранилище документов, версии, доказательства, аудит",
    purpose: `Централизованное хранилище документов с версионированием и контролем доступа.\n- Основной пользователь: все роли\n- Загрузка, версионирование, тегирование, evidence packs\n- Результат: единая библиотека документов, audit trail доступа`,
    outcomes: ["Secure document storage with version control", "Evidence pack assembly for audits", "Role-based access and client-safe sharing"],
    collections: ["documents", "documentVersions", "docTags", "docShares"],
    entities: [
      { name: "Document", fields: "id, title, type, entityRef, uploadedBy, uploadedAt, currentVersion, tags[], status" },
      { name: "DocumentVersion", fields: "id, documentId, version, fileRef, uploadedBy, uploadedAt, notes" },
    ],
    routes: ["/m/documents", "/m/documents/list", "/m/documents/document/[id]"],
    related: { sources: "All modules (attachments)", consumers: "M19 Reporting, M38 Audit, M55 Portal", governance: "M35 Policies" },
  },
  {
    n: 6, slug: "payments-bill-pay", name: "Payments and Bill Pay",
    codeSlug: "billpay-checks",
    ruLabel: "Оплата счетов, чеки, approvals, банк-интеграции",
    purpose: `Управление платежами, оплата счетов, выписка чеков.\n- Основной пользователь: CFO, Operations, бухгалтерия\n- Утверждение платежей, банковские интеграции\n- Результат: платёжный журнал, статусы, reconciliation`,
    outcomes: ["Automated bill pay with approval workflow", "Multi-bank payment execution", "Payment reconciliation with GL entries"],
    collections: ["payments", "invoices", "paymentApprovals", "bankAccounts"],
    entities: [
      { name: "Payment", fields: "id, payee, amount, currency, dueDate, status, approvedBy, paidDate, bankRef" },
      { name: "Invoice", fields: "id, vendor, amount, currency, dueDate, status, documentRef, paymentId" },
    ],
    routes: ["/m/billpay-checks", "/m/billpay-checks/list", "/m/billpay-checks/payment/[id]"],
    related: { sources: "M14 Integrations", consumers: "M02 GL, M20 Liquidity", governance: "M07 Workflow" },
  },
  {
    n: 7, slug: "workflow-approvals", name: "Workflow and Approvals",
    codeSlug: "workflow",
    ruLabel: "Процессы, задачи, approvals, SLA",
    purpose: `Движок процессов и согласований для всех модулей.\n- Основной пользователь: все роли\n- Конструктор workflow, approvals, SLA policies\n- Результат: единый центр задач и согласований`,
    outcomes: ["Configurable multi-step approval workflows", "SLA monitoring and escalation", "Cross-module task orchestration"],
    collections: ["workflows", "approvals", "tasks", "slaPolicies"],
    entities: [
      { name: "Approval", fields: "id, objectRef, objectType, requestedBy, approvers[], status, decidedBy, decidedAt, comments" },
      { name: "Task", fields: "id, title, assignee, module, objectRef, dueDate, priority, status, slaPolicy" },
    ],
    routes: ["/m/workflow", "/m/workflow/list", "/m/workflow/task/[id]"],
    related: { sources: "All modules (triggers)", consumers: "M22 Task Board, M38 Audit", governance: "M17 Security" },
  },
  {
    n: 8, slug: "client-onboarding-kyc", name: "Client Onboarding and KYC KYB AML",
    codeSlug: "onboarding",
    ruLabel: "Intake, screening, risk score, evidence pack",
    purpose: `Онбординг новых клиентов, KYC/KYB/AML проверки.\n- Основной пользователь: Compliance, RM, Operations\n- Intake forms, screening, risk scoring, evidence pack\n- Результат: полный кейс онбординга, compliance clearance`,
    outcomes: ["Structured client intake with configurable forms", "Automated screening (sanctions, PEP, adverse media)", "Risk-scored onboarding cases with evidence packs"],
    collections: ["onboardingCases", "screeningChecks", "intakeForms", "evidencePacks"],
    entities: [
      { name: "OnboardingCase", fields: "id, clientName, type, status, riskScore, assignee, startDate, completedDate, evidencePackId" },
      { name: "ScreeningCheck", fields: "id, caseId, checkType, provider, result, matchCount, reviewedBy, reviewedAt" },
    ],
    routes: ["/m/onboarding", "/m/onboarding/list", "/m/onboarding/case/[id]"],
    related: { sources: "External screening APIs", consumers: "M17 Security, M38 Audit", governance: "M34 Consents" },
  },
  {
    n: 9, slug: "investment-policy-statement", name: "Investment Policy Statement and Constraints",
    codeSlug: "ips",
    ruLabel: "IPS, лимиты, breaches, waivers, комитет",
    purpose: `Управление инвестиционными политиками и ограничениями.\n- Основной пользователь: CIO, Compliance, Investment Committee\n- IPS документы, constraints, breach monitoring, waivers\n- Результат: compliance dashboard, breach alerts, waiver log`,
    outcomes: ["Digital IPS with versioning", "Automated constraint monitoring and breach detection", "Waiver workflow with committee approval"],
    collections: ["ipsPolicies", "ipsConstraints", "ipsBreaches", "ipsWaivers", "ipsVersions"],
    entities: [
      { name: "IpsPolicy", fields: "id, name, portfolioId, version, status, effectiveDate, constraints[], approvedBy" },
      { name: "IpsBreach", fields: "id, policyId, constraintId, severity, detectedAt, currentValue, limit, status, resolution" },
    ],
    routes: ["/m/ips", "/m/ips/list", "/m/ips/policy/[id]"],
    related: { sources: "M03 Performance, M01 Net Worth", consumers: "M10 Risk, M38 Audit", governance: "M28 Committee" },
  },
  {
    n: 10, slug: "risk-exposure-oversight", name: "Risk and Exposure Oversight",
    codeSlug: "risk",
    ruLabel: "Концентрации, стресс-тесты, VaR UI, breach actions",
    purpose: `Мониторинг рисков и экспозиций портфеля.\n- Основной пользователь: CIO, Risk Officer, Compliance\n- Концентрации, VaR, стресс-тесты, breach actions\n- Результат: risk dashboard, alerts, action plans`,
    outcomes: ["Real-time concentration monitoring", "VaR and stress test scenarios", "Automated risk breach escalation"],
    collections: ["riskExposures", "riskConcentrations", "riskMetrics", "riskScores", "riskAlerts", "riskActions"],
    entities: [
      { name: "RiskExposure", fields: "id, portfolioId, dimension, name, value, percentage, limit, breached, asOf" },
      { name: "RiskAlert", fields: "id, type, severity, portfolioId, metric, threshold, currentValue, status, assignee" },
    ],
    routes: ["/m/risk", "/m/risk/list", "/m/risk/exposure/[id]"],
    related: { sources: "M03 Performance, M14 Integrations", consumers: "M09 IPS, M19 Reporting", governance: "M17 Security" },
  },
  {
    n: 11, slug: "tax-center-tax-lots", name: "Tax Center and Tax Lots",
    codeSlug: "tax",
    ruLabel: "Лоты, harvesting, дедлайны, advisor pack",
    purpose: `Управление налоговым учётом: tax lots, harvesting, дедлайны.\n- Основной пользователь: CFO, Tax Advisor, Operations\n- Tax lot tracking, gain/loss, harvesting opportunities, deadlines\n- Результат: tax pack для advisors, harvesting suggestions, deadline calendar`,
    outcomes: ["Accurate tax lot tracking with cost basis methods", "Tax loss harvesting opportunity detection", "Advisor-ready tax pack generation"],
    collections: ["taxLots", "taxGains", "taxHarvesting", "taxDeadlines", "taxProfiles", "taxAdvisorPacks"],
    entities: [
      { name: "TaxLot", fields: "id, securityId, acquiredDate, quantity, costBasis, method, holdingPeriod, unrealizedGain" },
      { name: "TaxHarvesting", fields: "id, portfolioId, securityId, unrealizedLoss, estimatedSaving, replacementSecurity, status" },
    ],
    routes: ["/m/tax", "/m/tax/list", "/m/tax/lot/[id]"],
    related: { sources: "M14 Integrations, M03 Performance", consumers: "M19 Reporting, M52 Packs", governance: "M35 Policies" },
  },
  {
    n: 12, slug: "trust-estate-administration", name: "Trust and Estate Administration",
    codeSlug: "trusts",
    ruLabel: "Трасты, бенефициары, полномочия, события, документы",
    purpose: `Администрирование трастов и наследственных структур.\n- Основной пользователь: Trust Officer, Legal, Estate Planner\n- Trust records, beneficiaries, distributions, powers, events\n- Результат: trust dashboard, distribution history, event timeline`,
    outcomes: ["Comprehensive trust record management", "Beneficiary and distribution tracking", "Trust event and power administration"],
    collections: ["trusts", "trustees", "beneficiaries", "trustDistributions", "trustPowers", "trustEvents", "trustCalendars"],
    entities: [
      { name: "Trust", fields: "id, name, type, jurisdiction, settlorId, trusteeIds[], beneficiaryIds[], status, inceptionDate" },
      { name: "TrustDistribution", fields: "id, trustId, beneficiaryId, amount, type, date, approvedBy, status" },
    ],
    routes: ["/m/trusts", "/m/trusts/list", "/m/trusts/trust/[id]"],
    related: { sources: "M01 Net Worth, M05 Documents", consumers: "M19 Reporting, M38 Audit", governance: "M34 Consents" },
  },
  {
    n: 13, slug: "fees-billing-invoicing", name: "Fees Billing and Invoicing",
    codeSlug: "fee-billing",
    ruLabel: "Комиссии, договоры, счета, AR, revenue analytics",
    purpose: `Биллинг, расчёт комиссий и управление счетами.\n- Основной пользователь: CFO, Operations, Billing\n- Fee schedules, contracts, invoicing, AR tracking\n- Результат: счета клиентам, revenue dashboard, AR aging`,
    outcomes: ["Automated fee calculation based on AUM/performance", "Configurable fee schedules and contracts", "Revenue analytics and AR aging reports"],
    collections: ["feeSchedules", "feeContracts", "feeRuns", "feeInvoices", "feePolicies"],
    entities: [
      { name: "FeeSchedule", fields: "id, name, type, tiers[], minimumFee, currency, effectiveDate" },
      { name: "FeeInvoice", fields: "id, clientId, period, amount, status, dueDate, paidDate, lineItems[]" },
    ],
    routes: ["/m/fee-billing", "/m/fee-billing/list", "/m/fee-billing/invoice/[id]"],
    related: { sources: "M01 Net Worth, M03 Performance", consumers: "M02 GL, M06 Payments", governance: "M26 Contracts" },
  },
  {
    n: 14, slug: "data-integrations-connectors", name: "Data Integrations and Connectors",
    codeSlug: "integrations",
    ruLabel: "Коннекторы, маппинг, sync jobs, data quality, conflicts",
    purpose: `Центр интеграций: коннекторы к банкам, кастодианам, market data.\n- Основной пользователь: IT, Operations, Data Team\n- Connectors, field mapping, sync jobs, error handling\n- Результат: единая шина данных, статусы синхронизации`,
    outcomes: ["Pre-built connectors for major custodians and banks", "Configurable field mapping and transformation", "Automated sync with error handling and retry"],
    collections: ["connectors", "connectorCredentials", "mappings", "syncJobs", "syncRuns", "connections"],
    entities: [
      { name: "Connector", fields: "id, name, type, provider, status, lastSync, errorCount, config" },
      { name: "SyncJob", fields: "id, connectorId, schedule, lastRun, nextRun, status, recordsProcessed, errors" },
    ],
    routes: ["/m/integrations", "/m/integrations/list", "/m/integrations/connector/[id]"],
    related: { sources: "External APIs, SFTP", consumers: "All modules", governance: "M46 Data Governance" },
  },
  {
    n: 15, slug: "secure-communications", name: "Secure Communications and Client Requests",
    codeSlug: "comms",
    ruLabel: "Защищённые треды, запросы, вложения, SLA",
    purpose: `Защищённая коммуникация с клиентами и внутри команды.\n- Основной пользователь: RM, Client, Operations\n- Encrypted threads, client requests, attachments, SLA tracking\n- Результат: secure inbox, request tracker, SLA dashboard`,
    outcomes: ["Encrypted client-advisor communication", "Structured client request lifecycle", "SLA monitoring for response times"],
    collections: ["commThreads", "commMessages", "commAttachments", "commParticipants", "commSlaPolicies", "commThreadPins"],
    entities: [
      { name: "CommThread", fields: "id, subject, participants[], status, priority, createdAt, lastMessageAt, slaPolicy" },
      { name: "CommMessage", fields: "id, threadId, senderId, body, attachments[], sentAt, readBy[]" },
    ],
    routes: ["/m/comms", "/m/comms/list", "/m/comms/thread/[id]"],
    related: { sources: "M55 Portal (client requests)", consumers: "M22 Task Board, M38 Audit", governance: "M34 Consents" },
  },
  {
    n: 16, slug: "ai-copilot-narratives", name: "AI Copilot and Narratives",
    codeSlug: "ai",
    ruLabel: "Explain, drafts, summaries, triage, guardrails",
    purpose: `AI-ассистент для генерации текстов, объяснений и triage.\n- Основной пользователь: все роли\n- Explain, Draft, Summarize, Triage режимы\n- Результат: AI-generated narratives с sources и confidence`,
    outcomes: ["Context-aware explanations of financial data", "Automated draft generation for reports and letters", "Intelligent triage and prioritization suggestions"],
    collections: ["aiNarratives", "aiDrafts", "aiFeedback", "aiPolicies", "aiEvents", "aiTriageItems"],
    entities: [
      { name: "AiNarrative", fields: "id, mode, prompt, response, sources[], confidence, asOf, module, objectRef, lang" },
      { name: "AiPolicy", fields: "id, name, guardrails[], allowedModes[], clientSafeRules, active" },
    ],
    routes: ["/m/ai", "/m/ai/list", "/m/ai/narrative/[id]"],
    related: { sources: "All modules (context)", consumers: "M19 Reporting, M55 Portal", governance: "M34 Consents, M35 Policies" },
  },
  {
    n: 17, slug: "security-iam-center", name: "Security and IAM Center",
    codeSlug: "security",
    ruLabel: "RBAC, MFA, sessions, incidents, access reviews",
    purpose: `Управление безопасностью: RBAC, MFA, сессии, инциденты.\n- Основной пользователь: IT Admin, Security Officer, Compliance\n- Роли, права, MFA enrollment, session management, incidents\n- Результат: security dashboard, access reviews, incident log`,
    outcomes: ["Granular RBAC with scope-based access control", "MFA enforcement with multiple factors", "Security incident tracking and response"],
    collections: ["roles", "roleBindings", "permissions", "mfaEnrollments", "sessions", "securityIncidents", "securitySettings", "accessRequests"],
    entities: [
      { name: "Role", fields: "id, name, permissions[], scope, isDefault, createdBy" },
      { name: "SecurityIncident", fields: "id, type, severity, description, detectedAt, status, assignee, resolution" },
    ],
    routes: ["/m/security", "/m/security/list", "/m/security/incident/[id]"],
    related: { sources: "All modules (auth)", consumers: "M38 Audit, M17 Security", governance: "M34 Consents" },
  },
  // ── Operations and Service Delivery ────────────────────────────
  {
    n: 18, slug: "portfolio-dashboard-home", name: "Portfolio Dashboard and Home",
    codeSlug: "dashboard-home",
    ruLabel: "Единый home, saved views, drill-down",
    purpose: `Главная страница платформы с агрегированным обзором.\n- Основной пользователь: все роли\n- KPI overview, saved views, quick actions, drill-down\n- Результат: персонализированный dashboard`,
    outcomes: ["Personalized home screen with role-based widgets", "Saved views and custom layouts", "Quick drill-down to any module"],
    collections: ["savedViews", "quickActions", "userNotificationPrefs"],
    entities: [
      { name: "SavedView", fields: "id, userId, name, module, filters, columns, sortBy, isDefault" },
      { name: "QuickAction", fields: "id, label, module, route, icon, roles[]" },
    ],
    routes: ["/m/dashboard-home"],
    related: { sources: "All modules (KPIs)", consumers: "—", governance: "M17 Security (RBAC)" },
  },
  {
    n: 19, slug: "reporting-studio-exports", name: "Reporting Studio and Exports",
    codeSlug: "reports",
    ruLabel: "Report builder, packs, PDF/Excel exports, scheduled reporting",
    purpose: `Конструктор отчётов, пакеты, экспорт и расписания.\n- Основной пользователь: RM, CFO, Compliance\n- Report templates, packs, PDF/Excel, scheduled delivery\n- Результат: отчёты для клиентов, регулятора, внутренние`,
    outcomes: ["Drag-and-drop report builder", "Multi-format export (PDF, Excel, web)", "Scheduled report generation and delivery"],
    collections: ["reportTemplates", "reportPacks", "reportPackSections", "reportExports", "reportShares", "reportLibraryItems"],
    entities: [
      { name: "ReportTemplate", fields: "id, name, type, sections[], parameters[], format, createdBy" },
      { name: "ReportPack", fields: "id, name, clientId, period, status, sections[], approvedBy, publishedAt" },
    ],
    routes: ["/m/reports", "/m/reports/list", "/m/reports/pack/[id]"],
    related: { sources: "All modules (data sources)", consumers: "M55 Portal, M52 Packs", governance: "M35 Policies" },
  },
  {
    n: 20, slug: "liquidity-cash-management", name: "Liquidity and Cash Management",
    codeSlug: "liquidity",
    ruLabel: "Кэш-позиции, прогнозы, cash ladder, alerts",
    purpose: `Управление ликвидностью и прогнозирование денежных потоков.\n- Основной пользователь: CFO, Treasury, Operations\n- Cash positions, forecasts, scenarios, stress tests, alerts\n- Результат: cash dashboard, liquidity ladder, alert system`,
    outcomes: ["Real-time cash position aggregation", "Multi-scenario cash flow forecasting", "Liquidity stress testing and early warning alerts"],
    collections: ["cashAccounts", "cashForecast", "liquidityBuckets", "liquidityAlerts", "cashFlows", "cashPositions", "cashScenarios", "cashStressTests", "cashForecasts"],
    entities: [
      { name: "CashAccount", fields: "id, bankName, accountNumber, currency, balance, asOf, type" },
      { name: "CashForecast", fields: "id, scenarioId, period, inflows, outflows, netCash, cumulativeCash" },
    ],
    routes: ["/m/liquidity", "/m/liquidity/list", "/m/liquidity/forecast/[id]", "/m/liquidity/scenario/[id]", "/m/liquidity/stress/[id]", "/m/liquidity/alert/[id]"],
    related: { sources: "M14 Integrations, M06 Payments", consumers: "M01 Net Worth, M19 Reporting", governance: "M10 Risk" },
  },
  {
    n: 21, slug: "reconciliation-close", name: "Reconciliation and Close",
    codeSlug: "reconciliation",
    ruLabel: "Сверки, close checklist, IBOR/ABOR, bank rec",
    purpose: `Сверка позиций, закрытие периодов, IBOR/ABOR reconciliation.\n- Основной пользователь: Operations, Controller\n- Bank rec, custodian rec, close checklist, exception handling\n- Результат: rec dashboard, break report, close status`,
    outcomes: ["Automated position reconciliation (IBOR vs ABOR)", "Bank and custodian statement matching", "Period close checklist with audit trail"],
    collections: ["reconciliations", "reconciliationBreaks", "closeChecklists", "closePeriods"],
    entities: [
      { name: "Reconciliation", fields: "id, type, sourceA, sourceB, asOf, status, matchCount, breakCount, completedAt" },
      { name: "ReconciliationBreak", fields: "id, recId, field, valueA, valueB, difference, status, resolution" },
    ],
    routes: ["/m/reconciliation", "/m/reconciliation/list", "/m/reconciliation/rec/[id]"],
    related: { sources: "M14 Integrations", consumers: "M02 GL, M38 Audit", governance: "M39 Data Quality" },
  },
  {
    n: 22, slug: "task-board-sla", name: "Task Board and SLA Operations",
    codeSlug: "platform",
    ruLabel: "Workboard, queues, escalations, SLA policies",
    purpose: `Единый центр задач, очередей и SLA мониторинга.\n- Основной пользователь: Operations Manager, Team Leads\n- Task board, queues, escalations, SLA policies\n- Результат: operations dashboard, SLA compliance, workload metrics`,
    outcomes: ["Unified task board across all modules", "SLA policy enforcement with auto-escalation", "Workload balancing and team performance metrics"],
    collections: ["tasks", "escalations", "slaPolicies", "complianceTasks"],
    entities: [
      { name: "Task", fields: "id, title, module, assignee, queue, priority, dueDate, slaDeadline, status, escalationLevel" },
      { name: "SlaPolicy", fields: "id, name, module, priority, responseTime, resolutionTime, escalationRules[]" },
    ],
    routes: ["/m/platform", "/m/platform/list", "/m/platform/task/[id]"],
    related: { sources: "All modules (tasks)", consumers: "M19 Reporting, M38 Audit", governance: "M07 Workflow" },
  },
  {
    n: 23, slug: "calendar-meetings", name: "Calendar and Meetings",
    codeSlug: "calendar",
    ruLabel: "Встречи, дедлайны, напоминания, интеграция",
    purpose: `Календарь встреч, дедлайнов и напоминаний.\n- Основной пользователь: RM, CIO, Operations\n- Встречи, дедлайны из всех модулей, напоминания\n- Результат: unified calendar, meeting notes, deadline tracker`,
    outcomes: ["Unified calendar aggregating deadlines from all modules", "Meeting scheduling with agenda and notes", "Automated reminders and follow-up tracking"],
    collections: ["calendarEvents", "meetingNotes", "reminders"],
    entities: [
      { name: "CalendarEvent", fields: "id, title, type, startDate, endDate, participants[], module, objectRef, location" },
      { name: "MeetingNote", fields: "id, eventId, content, decisions[], actionItems[], createdBy" },
    ],
    routes: ["/m/calendar", "/m/calendar/list", "/m/calendar/event/[id]"],
    related: { sources: "All modules (deadlines)", consumers: "M07 Workflow, M24 Notes", governance: "—" },
  },
  {
    n: 24, slug: "notes-decision-log", name: "Notes and Decision Log",
    codeSlug: "committee",
    ruLabel: "Заметки, решения, комитеты, протоколы, audit",
    purpose: `Журнал заметок, решений и протоколов комитетов.\n- Основной пользователь: CIO, Committee Members, Legal\n- Notes, decisions, committee meetings, votes, follow-ups\n- Результат: decision log, committee minutes, action tracker`,
    outcomes: ["Structured decision log with rationale and evidence", "Committee meeting minutes with voting records", "Action item tracking with follow-up reminders"],
    collections: ["committeeDecisions", "committeeMeetings", "committeeVotes", "committeeFollowUps", "committeeAgendaItems", "committeeTemplates", "researchNotes"],
    entities: [
      { name: "CommitteeDecision", fields: "id, meetingId, title, rationale, outcome, votesFor, votesAgainst, status" },
      { name: "CommitteeMeeting", fields: "id, title, date, attendees[], agendaItems[], status, minutesRef" },
    ],
    routes: ["/m/committee", "/m/committee/list", "/m/committee/meeting/[id]"],
    related: { sources: "M09 IPS, M31 Deals", consumers: "M38 Audit, M05 Documents", governance: "M17 Security" },
  },
  {
    n: 25, slug: "vendor-advisor-management", name: "Vendor and Advisor Management",
    codeSlug: "vendors",
    ruLabel: "Поставщики услуг, advisors, контракты, оценка",
    purpose: `Управление поставщиками услуг и внешними advisors.\n- Основной пользователь: COO, Procurement, Compliance\n- Vendor registry, contracts, SLAs, scorecards, incidents\n- Результат: vendor dashboard, performance scores, contract tracker`,
    outcomes: ["Centralized vendor and advisor registry", "SLA monitoring with performance scorecards", "Contract lifecycle management"],
    collections: ["vdVendors", "vdContracts", "vdSlas", "vdScorecards", "vdIncidents", "vdInvoices"],
    entities: [
      { name: "Vendor", fields: "id, name, type, category, status, contractIds[], riskTier, lastReview" },
      { name: "VdContract", fields: "id, vendorId, title, startDate, endDate, value, autoRenew, status" },
    ],
    routes: ["/m/vendors", "/m/vendors/list", "/m/vendors/vendor/[id]"],
    related: { sources: "M14 Integrations", consumers: "M13 Fees, M26 Contracts", governance: "M38 Audit" },
  },
  {
    n: 26, slug: "contracts-obligations", name: "Contracts and Obligations",
    codeSlug: "obligations",
    ruLabel: "Договоры, обязательства, сроки, renewals, evidence",
    purpose: `Учёт договоров и обязательств с отслеживанием сроков.\n- Основной пользователь: Legal, Operations, CFO\n- Contract registry, obligations, renewals, evidence\n- Результат: obligation tracker, renewal calendar, compliance matrix`,
    outcomes: ["Centralized contract repository with metadata", "Obligation tracking with deadline alerts", "Automated renewal reminders"],
    collections: ["obligations", "documentLinks"],
    entities: [
      { name: "Obligation", fields: "id, title, type, counterparty, startDate, endDate, value, status, renewalDate, linkedDocs[]" },
    ],
    routes: ["/m/obligations", "/m/obligations/list", "/m/obligations/obligation/[id]"],
    related: { sources: "M05 Documents, M25 Vendors", consumers: "M23 Calendar, M38 Audit", governance: "M35 Policies" },
  },
  {
    n: 27, slug: "insurance-policies", name: "Insurance and Policies",
    codeSlug: "policies",
    ruLabel: "Life, property, casualty, claims, renewals",
    purpose: `Управление страховыми полисами и claims.\n- Основной пользователь: CFO, Risk, Insurance Broker\n- Policy registry, claims, renewals, coverage analysis\n- Результат: insurance dashboard, coverage gaps, renewal calendar`,
    outcomes: ["Comprehensive insurance policy registry", "Claims tracking and resolution", "Coverage gap analysis and renewal management"],
    collections: ["insurancePolicies", "insuranceClaims", "insuranceRenewals"],
    entities: [
      { name: "InsurancePolicy", fields: "id, type, provider, policyNumber, coverageAmount, premium, startDate, endDate, status" },
      { name: "InsuranceClaim", fields: "id, policyId, claimDate, amount, description, status, resolution" },
    ],
    routes: ["/m/policies", "/m/policies/list", "/m/policies/policy/[id]"],
    related: { sources: "M05 Documents", consumers: "M01 Net Worth, M23 Calendar", governance: "M26 Contracts" },
  },
  {
    n: 28, slug: "real-estate-private-assets", name: "Real Estate and Private Assets",
    codeSlug: "private-assets",
    ruLabel: "Недвижимость и личные активы, оценки, документы",
    purpose: `Учёт недвижимости и личных активов с оценками.\n- Основной пользователь: Owner, CFO, Property Manager\n- Property registry, valuations, documents, income/expenses\n- Результат: real estate dashboard, valuation history, income tracker`,
    outcomes: ["Real estate and personal asset registry", "Periodic valuation tracking with audit trail", "Income and expense tracking per property"],
    collections: ["realEstateProperties", "assetValuations", "propertyIncomeExpenses"],
    entities: [
      { name: "RealEstateProperty", fields: "id, name, type, address, purchaseDate, purchasePrice, currentValue, valuationDate, status" },
      { name: "AssetValuation", fields: "id, assetId, date, value, method, appraiser, notes" },
    ],
    routes: ["/m/private-assets", "/m/private-assets/list", "/m/private-assets/property/[id]"],
    related: { sources: "M05 Documents", consumers: "M01 Net Worth, M11 Tax", governance: "M46 Data Governance" },
  },
  {
    n: 29, slug: "entity-management-corporate", name: "Entity Management and Corporate Records",
    codeSlug: "entities",
    ruLabel: "Юрлица, структуры, регистрационные данные",
    purpose: `Управление юридическими лицами и корпоративными записями.\n- Основной пользователь: Legal, Compliance, Admin\n- Entity registry, corporate structure, filings, registered agents\n- Результат: entity tree, compliance calendar, filing tracker`,
    outcomes: ["Hierarchical entity structure visualization", "Corporate filing and compliance tracking", "Registered agent and officer management"],
    collections: ["entities", "entityFilings", "entityOfficers"],
    entities: [
      { name: "Entity", fields: "id, name, type, jurisdiction, parentId, status, incorporationDate, taxId" },
      { name: "EntityFiling", fields: "id, entityId, type, dueDate, filedDate, status, documentRef" },
    ],
    routes: ["/m/entities", "/m/entities/list", "/m/entities/entity/[id]"],
    related: { sources: "M05 Documents", consumers: "M47 Ownership, M12 Trusts", governance: "M38 Audit" },
  },
  {
    n: 30, slug: "capital-calls-distributions", name: "Capital Calls and Distributions Operations",
    codeSlug: "capital-ops",
    ruLabel: "Операционный контур PE: calls, notices, allocations",
    purpose: `Операционное управление capital calls и distributions для PE/VC.\n- Основной пользователь: Operations, Fund Admin\n- Call notices, allocation, payment tracking, distribution processing\n- Результат: call tracker, allocation waterfall, distribution ledger`,
    outcomes: ["Automated capital call notice processing", "LP allocation waterfall calculations", "Distribution processing with tax lot integration"],
    collections: ["capitalCalls", "capitalDistributions", "callNotices", "allocationWaterfalls"],
    entities: [
      { name: "CapitalCall", fields: "id, fundId, callDate, totalAmount, lpAllocations[], dueDate, status, noticeRef" },
      { name: "CapitalDistribution", fields: "id, fundId, distributionDate, totalAmount, type, lpAllocations[], status" },
    ],
    routes: ["/m/capital-ops", "/m/capital-ops/list", "/m/capital-ops/call/[id]"],
    related: { sources: "M04 Private Markets", consumers: "M02 GL, M20 Liquidity", governance: "M07 Workflow" },
  },
  {
    n: 31, slug: "deal-pipeline-investment-committee", name: "Deal Pipeline and Investment Committee",
    codeSlug: "deals",
    ruLabel: "Сделки, due diligence, committee workflow",
    purpose: `Pipeline сделок от идеи до закрытия.\n- Основной пользователь: CIO, Deal Team, Committee\n- Deal stages, due diligence, committee workflow, approvals\n- Результат: deal pipeline board, committee dossier, decision log`,
    outcomes: ["Visual deal pipeline with stage tracking", "Structured due diligence checklists", "Investment committee workflow with voting"],
    collections: ["deals", "dealStages", "dealDocuments", "dealApprovals", "dealTransactions"],
    entities: [
      { name: "Deal", fields: "id, name, type, stage, leadPM, targetSize, expectedClose, status, committeeDecision" },
      { name: "DealStage", fields: "id, dealId, stage, enteredAt, exitedAt, assignee, checklist[], status" },
    ],
    routes: ["/m/deals", "/m/deals/list", "/m/deals/deal/[id]"],
    related: { sources: "M04 Private Markets", consumers: "M24 Notes, M38 Audit", governance: "M09 IPS" },
  },
  {
    n: 32, slug: "portfolio-modeling-scenario", name: "Portfolio Modeling and Scenario Analysis",
    codeSlug: "planning",
    ruLabel: "Симуляции, сценарии, стресс-тесты, allocation",
    purpose: `Моделирование портфелей и сценарный анализ.\n- Основной пользователь: CIO, Investment Team\n- Asset allocation modeling, what-if scenarios, optimization\n- Результат: proposed allocations, scenario comparison, efficient frontier`,
    outcomes: ["What-if portfolio scenario analysis", "Mean-variance optimization and efficient frontier", "Proposed vs current allocation comparison"],
    collections: ["scenarios", "planningRuns", "assumptions", "planActualLinks"],
    entities: [
      { name: "Scenario", fields: "id, name, type, assumptions[], proposedAllocation[], expectedReturn, expectedRisk, sharpe" },
      { name: "PlanningRun", fields: "id, scenarioId, runDate, method, result, status" },
    ],
    routes: ["/m/planning", "/m/planning/list", "/m/planning/scenario/[id]"],
    related: { sources: "M03 Performance, M10 Risk", consumers: "M09 IPS, M24 Notes", governance: "—" },
  },
  {
    n: 33, slug: "trading-oversight-orders", name: "Trading Oversight and Order Management",
    codeSlug: "trading",
    ruLabel: "Контроль ордеров, compliance checks, execution log",
    purpose: `Контроль торговых операций и исполнения ордеров.\n- Основной пользователь: Trader, CIO, Compliance\n- Order management, pre-trade compliance, execution log\n- Результат: order blotter, compliance check log, execution analytics`,
    outcomes: ["Pre-trade compliance checking against IPS constraints", "Order lifecycle tracking from initiation to settlement", "Execution quality analysis and broker comparison"],
    collections: ["orders", "executions", "preTradeChecks", "brokerAllocations"],
    entities: [
      { name: "Order", fields: "id, securityId, side, quantity, orderType, limitPrice, status, placedBy, filledQty, avgPrice" },
      { name: "Execution", fields: "id, orderId, execDate, quantity, price, broker, venue, commission, settlementDate" },
    ],
    routes: ["/m/trading", "/m/trading/list", "/m/trading/order/[id]"],
    related: { sources: "M09 IPS (constraints)", consumers: "M21 Reconciliation, M02 GL", governance: "M10 Risk" },
  },
  // ── Governance, Data Trust, External Sharing ───────────────────
  {
    n: 34, slug: "consents-data-sharing", name: "Consents and Data Sharing",
    codeSlug: "consents",
    ruLabel: "Согласия, доступы, цели, сроки",
    purpose: `Управление согласиями клиентов на обработку данных.\n- Основной пользователь: Compliance, DPO, Legal\n- Consent collection, purpose tracking, expiry management\n- Результат: consent registry, compliance dashboard, revocation log`,
    outcomes: ["Granular consent collection and tracking", "Purpose-based data access control", "Automated expiry and renewal workflows"],
    collections: ["consents", "consentPurposes", "consentRevocations"],
    entities: [
      { name: "Consent", fields: "id, clientId, purpose, scope, grantedAt, expiresAt, status, evidenceRef" },
    ],
    routes: ["/m/consents", "/m/consents/list", "/m/consents/consent/[id]"],
    related: { sources: "M08 Onboarding", consumers: "M54 Consent Center, M35 Policies", governance: "M17 Security" },
  },
  {
    n: 35, slug: "policies-retention", name: "Policies and Retention",
    codeSlug: "policies-retention",
    ruLabel: "Retention, legal hold, privacy, export controls",
    purpose: `Политики хранения данных, legal hold, privacy controls.\n- Основной пользователь: DPO, Legal, Compliance\n- Retention policies, legal hold, data classification, export controls\n- Результат: policy dashboard, retention schedule, hold tracker`,
    outcomes: ["Configurable data retention policies", "Legal hold management with scope tracking", "Data classification and export control enforcement"],
    collections: ["dataPolicies", "sharingPolicies", "policyBanners"],
    entities: [
      { name: "DataPolicy", fields: "id, name, type, retentionPeriod, classification, scope, status, effectiveDate" },
      { name: "SharingPolicy", fields: "id, name, allowedRecipients[], restrictions[], approvalRequired, active" },
    ],
    routes: ["/m/policies-retention", "/m/policies-retention/list", "/m/policies-retention/policy/[id]"],
    related: { sources: "M34 Consents", consumers: "M05 Documents, M37 External Sharing", governance: "M38 Audit" },
  },
  {
    n: 36, slug: "case-management-tickets", name: "Case Management and Service Tickets",
    codeSlug: "cases",
    ruLabel: "Запросы клиентов, кейсы, статусы, SLA",
    purpose: `Управление кейсами и тикетами клиентских запросов.\n- Основной пользователь: Operations, RM, Support\n- Case creation, assignment, SLA tracking, templates\n- Результат: case board, SLA dashboard, resolution analytics`,
    outcomes: ["Structured case lifecycle management", "SLA compliance tracking with escalation", "Case templates for common request types"],
    collections: ["cases", "caseComments", "caseLinks", "caseReports", "caseTemplates"],
    entities: [
      { name: "Case", fields: "id, title, type, clientId, assignee, priority, status, slaDeadline, createdAt, resolvedAt" },
      { name: "CaseComment", fields: "id, caseId, author, body, isInternal, createdAt" },
    ],
    routes: ["/m/cases", "/m/cases/list", "/m/cases/case/[id]"],
    related: { sources: "M55 Portal (client requests)", consumers: "M22 Task Board, M15 Communications", governance: "M07 Workflow" },
  },
  {
    n: 37, slug: "external-sharing-secure-links", name: "External Sharing and Secure Links",
    codeSlug: "exports",
    ruLabel: "Shares, tokens, TTL, watermark, access logs",
    purpose: `Безопасный обмен документами с внешними сторонами.\n- Основной пользователь: RM, Legal, Operations\n- Secure links, TTL, watermark, access logging\n- Результат: share tracker, access log, expiry management`,
    outcomes: ["Time-limited secure sharing links", "Watermarked document distribution", "Comprehensive access logging for compliance"],
    collections: ["exportTemplates", "exportRuns", "exportFiles", "exportShares", "exportPacks", "exportSchedules"],
    entities: [
      { name: "ExportShare", fields: "id, documentRef, recipientEmail, token, expiresAt, watermark, accessCount, createdBy" },
      { name: "ExportRun", fields: "id, templateId, runDate, format, status, outputRef, schedule" },
    ],
    routes: ["/m/exports", "/m/exports/list", "/m/exports/share/[id]"],
    related: { sources: "M05 Documents, M19 Reporting", consumers: "M38 Audit", governance: "M35 Policies" },
  },
  {
    n: 38, slug: "audit-compliance-pack", name: "Audit and Compliance Pack",
    codeSlug: "audit",
    ruLabel: "Аудит, evidence, SOC-style readiness",
    purpose: `Единый audit trail и compliance readiness.\n- Основной пользователь: Compliance, Internal Audit, External Auditor\n- Audit events, evidence packs, compliance checks, SOC readiness\n- Результат: audit log viewer, evidence pack generator, compliance dashboard`,
    outcomes: ["Comprehensive audit trail across all modules", "Evidence pack assembly for regulatory audits", "SOC-style compliance readiness dashboard"],
    collections: ["auditEvents", "auditLogViews", "evidencePacks", "accessReviews", "reviewAttestations"],
    entities: [
      { name: "AuditEvent", fields: "id, timestamp, actor, action, objectRef, objectType, module, before, after, ipAddress" },
      { name: "EvidencePack", fields: "id, name, scope, period, items[], status, generatedAt, generatedBy" },
    ],
    routes: ["/m/audit", "/m/audit/list", "/m/audit/event/[id]"],
    related: { sources: "All modules (audit events)", consumers: "External auditors, Regulators", governance: "M17 Security" },
  },
  {
    n: 39, slug: "data-quality-exceptions", name: "Data Quality and Exceptions",
    codeSlug: "data-quality",
    ruLabel: "Единый центр исключений, triage, rules",
    purpose: `Мониторинг качества данных и управление исключениями.\n- Основной пользователь: Data Team, Operations, Compliance\n- Data quality rules, exception triage, resolution workflow\n- Результат: DQ dashboard, exception queue, quality score`,
    outcomes: ["Automated data quality rule execution", "Centralized exception triage and resolution", "Data quality scoring and trend analysis"],
    collections: ["dqRules", "dqRuns", "dqMetrics", "dqExceptions", "dqConflicts", "dqReconChecks", "dqSyncJobs", "dataQualityIssues"],
    entities: [
      { name: "DqRule", fields: "id, name, collection, field, ruleType, threshold, severity, active" },
      { name: "DqException", fields: "id, ruleId, recordRef, expectedValue, actualValue, severity, status, assignee" },
    ],
    routes: ["/m/data-quality", "/m/data-quality/list", "/m/data-quality/exception/[id]"],
    related: { sources: "M14 Integrations, M21 Reconciliation", consumers: "M48 Exception Center", governance: "M46 Data Governance" },
  },
  {
    n: 40, slug: "master-data-management", name: "Master Data Management",
    codeSlug: "mdm",
    ruLabel: "MDM, справочники, golden records, merging",
    purpose: `Управление мастер-данными: golden records, дедупликация.\n- Основной пользователь: Data Steward, Operations\n- Entity/person/asset/account master, duplicate detection, merge\n- Результат: golden record dashboard, steward queue, merge log`,
    outcomes: ["Single golden record per entity across systems", "Automated duplicate detection and merge suggestions", "Data steward workflow for manual resolution"],
    collections: ["mdmEntities", "mdmPeople", "mdmAssets", "mdmAccounts", "mdmDuplicates", "mdmMergeJobs", "mdmRules", "mdmStewardQueue"],
    entities: [
      { name: "MdmEntity", fields: "id, type, goldenRecord, sourceRecords[], confidence, lastMerge, stewardStatus" },
      { name: "MdmDuplicate", fields: "id, entityType, recordA, recordB, matchScore, status, resolvedBy" },
    ],
    routes: ["/m/mdm", "/m/mdm/list", "/m/mdm/entity/[id]"],
    related: { sources: "M14 Integrations", consumers: "All modules (master data)", governance: "M46 Data Governance" },
  },
  {
    n: 41, slug: "benchmark-market-data", name: "Benchmark and Market Data",
    codeSlug: "market-data",
    ruLabel: "Market data, previous close, pricing jobs",
    purpose: `Управление рыночными данными и бенчмарками.\n- Основной пользователь: CIO, Data Team, Portfolio Managers\n- Market data feeds, pricing, benchmark indices, FX rates\n- Результат: pricing dashboard, benchmark library, data freshness monitor`,
    outcomes: ["Centralized market data and pricing service", "Benchmark index library with custom composites", "Data freshness monitoring and stale price alerts"],
    collections: ["benchmarkIndices", "pricingJobs", "marketDataFeeds", "fxRates"],
    entities: [
      { name: "BenchmarkIndex", fields: "id, name, provider, ticker, currency, lastValue, lastDate, frequency" },
      { name: "PricingJob", fields: "id, schedule, sources[], lastRun, status, recordsUpdated, staleCount" },
    ],
    routes: ["/m/market-data", "/m/market-data/list", "/m/market-data/benchmark/[id]"],
    related: { sources: "External data providers", consumers: "M03 Performance, M10 Risk", governance: "M46 Data Governance" },
  },
  {
    n: 42, slug: "partnership-accounting", name: "Partnership Accounting",
    codeSlug: "partnerships",
    ruLabel: "Партнёрства, allocations, capital accounts",
    purpose: `Учёт партнёрств и распределение доходов между участниками.\n- Основной пользователь: CFO, Fund Admin\n- Partnership structures, capital accounts, allocations, K-1\n- Результат: capital account statements, allocation waterfall, K-1 package`,
    outcomes: ["Partnership capital account management", "Automated income/loss allocation calculations", "K-1 and tax reporting preparation"],
    collections: ["partnerships", "partnerCapitalAccounts", "partnerAllocations", "partnerK1s"],
    entities: [
      { name: "Partnership", fields: "id, name, type, partners[], fiscalYearEnd, status" },
      { name: "PartnerCapitalAccount", fields: "id, partnershipId, partnerId, balance, contributions, distributions, allocations" },
    ],
    routes: ["/m/partnerships", "/m/partnerships/list", "/m/partnerships/partnership/[id]"],
    related: { sources: "M02 GL, M04 Private Markets", consumers: "M11 Tax, M19 Reporting", governance: "M38 Audit" },
  },
  {
    n: 43, slug: "multi-currency-fx", name: "Multi Currency and FX",
    codeSlug: "fx",
    ruLabel: "FX rates, conversions, reporting currency",
    purpose: `Управление мультивалютными операциями и FX.\n- Основной пользователь: Treasury, CFO, Operations\n- FX rates, currency conversion, reporting currency management\n- Результат: FX dashboard, conversion log, reporting currency P&L`,
    outcomes: ["Automated FX rate feeds and historical rates", "Multi-currency P&L with translation adjustments", "Configurable reporting currency per entity"],
    collections: ["fxRates", "currencyConversions", "reportingCurrencySettings"],
    entities: [
      { name: "FxRate", fields: "id, baseCurrency, quoteCurrency, rate, date, source, type" },
      { name: "CurrencyConversion", fields: "id, fromCurrency, toCurrency, amount, convertedAmount, rate, date, purpose" },
    ],
    routes: ["/m/fx", "/m/fx/list", "/m/fx/rate/[id]"],
    related: { sources: "M41 Market Data", consumers: "M01 Net Worth, M02 GL, M03 Performance", governance: "M46 Data Governance" },
  },
  {
    n: 44, slug: "analytics-insights-hub", name: "Analytics and Insights Hub",
    codeSlug: "analytics",
    ruLabel: "Кросс-модульная аналитика, KPI library",
    purpose: `Кросс-модульная аналитика и библиотека KPI.\n- Основной пользователь: CIO, COO, Owner\n- Cross-module analytics, KPI library, custom dashboards\n- Результат: analytics dashboard, KPI scorecards, trend analysis`,
    outcomes: ["Cross-module KPI aggregation and scoring", "Custom analytics dashboard builder", "Trend analysis and anomaly detection"],
    collections: ["kpiDefinitions", "kpiSnapshots", "analyticsDashboards", "analyticsWidgets"],
    entities: [
      { name: "KpiDefinition", fields: "id, name, module, formula, unit, target, direction, frequency" },
      { name: "KpiSnapshot", fields: "id, kpiId, value, period, trend, status, asOf" },
    ],
    routes: ["/m/analytics", "/m/analytics/list", "/m/analytics/kpi/[id]"],
    related: { sources: "All modules (KPI sources)", consumers: "M19 Reporting, M55 Portal", governance: "—" },
  },
  {
    n: 45, slug: "client-safe-publishing", name: "Client Safe Publishing",
    codeSlug: "portal",
    ruLabel: "Публикации, что доступно в portal, snapshots",
    purpose: `Управление публикациями для клиентского портала.\n- Основной пользователь: RM, Operations\n- Publication rules, snapshots, client-safe filtering\n- Результат: publication queue, snapshot viewer, access rules`,
    outcomes: ["Controlled publication of reports to client portal", "Point-in-time snapshots for audit trail", "Granular field-level client-safe filtering"],
    collections: ["portalConfigs", "clientSubscriptions", "clientPreferences"],
    entities: [
      { name: "PortalConfig", fields: "id, module, publishedFields[], hiddenFields[], clientRoles[], refreshFrequency" },
      { name: "ClientSubscription", fields: "id, clientId, module, viewType, frequency, lastPublished" },
    ],
    routes: ["/p/dashboard", "/p/reports", "/p/documents"],
    related: { sources: "All modules (published data)", consumers: "M55 Portal", governance: "M34 Consents, M35 Policies" },
  },
  {
    n: 46, slug: "data-governance-lineage", name: "Data Governance and Lineage",
    codeSlug: "governance-data",
    ruLabel: "Why this number, lineage, recon views",
    purpose: `Data governance: lineage, quality scoring, «why this number».\n- Основной пользователь: Data Steward, CIO, Compliance\n- Data lineage graphs, quality scores, reconciliation views\n- Результат: lineage explorer, quality dashboard, «why this number» panel`,
    outcomes: ["End-to-end data lineage visualization", "Data quality scoring across all collections", "\"Why this number\" drill-through for any data point"],
    collections: ["dataLineageNodes", "dataLineageEdges", "dataQualityScores"],
    entities: [
      { name: "DataLineageNode", fields: "id, collection, recordId, field, sourceSystem, transformations[], asOf" },
      { name: "DataQualityScore", fields: "id, collection, dimension, score, issues, lastChecked" },
    ],
    routes: ["/m/governance-data", "/m/governance-data/list", "/m/governance-data/lineage/[id]"],
    related: { sources: "M14 Integrations, M39 DQ", consumers: "All modules (lineage)", governance: "M40 MDM" },
  },
  // ── Advanced Modules 47–55 ─────────────────────────────────────
  {
    n: 47, slug: "ownership-map-ubo", name: "Ownership Map and UBO",
    codeSlug: "ownership",
    ruLabel: "Граф владения, конечные бенефициары, snapshots",
    purpose: `Визуализация структуры владения и выявление UBO.\n- Основной пользователь: Compliance, Legal, RM\n- Ownership graph, UBO detection, historical snapshots\n- Результат: ownership tree, UBO register, change log`,
    outcomes: ["Interactive ownership graph visualization", "Automated UBO detection with threshold rules", "Historical ownership snapshots for compliance"],
    collections: ["ownershipNodes", "ownershipLinks", "ownershipUbo", "ownershipViews", "ownershipChanges"],
    entities: [
      { name: "OwnershipNode", fields: "id, name, type, jurisdiction, parentLinks[], childLinks[], ownershipPct" },
      { name: "OwnershipUbo", fields: "id, personId, entities[], totalOwnership, detectionMethod, verifiedAt" },
    ],
    routes: ["/m/ownership", "/m/ownership/list", "/m/ownership/node/[id]"],
    related: { sources: "M29 Entity Management, M12 Trusts", consumers: "M08 Onboarding, M38 Audit", governance: "M34 Consents" },
  },
  {
    n: 48, slug: "exception-center", name: "Exception Center",
    codeSlug: "exceptions",
    ruLabel: "Единая очередь исключений, SLA, triage, rules",
    purpose: `Единый центр обработки исключений из всех модулей.\n- Основной пользователь: Operations Manager, Data Team\n- Unified exception queue, SLA policies, triage rules, clustering\n- Результат: exception dashboard, triage queue, resolution analytics`,
    outcomes: ["Unified exception queue aggregating all modules", "Automated triage with configurable rules", "SLA tracking with escalation for unresolved exceptions"],
    collections: ["exceptions", "exceptionRules", "exceptionClusters", "exceptionSlaPolicies"],
    entities: [
      { name: "Exception", fields: "id, source, module, type, severity, description, status, assignee, slaDeadline, resolvedAt" },
      { name: "ExceptionRule", fields: "id, name, sourceModule, condition, autoAssignee, priority, active" },
    ],
    routes: ["/m/exceptions", "/m/exceptions/list", "/m/exceptions/exception/[id]"],
    related: { sources: "M39 DQ, M21 Reconciliation, M14 Integrations", consumers: "M22 Task Board, M38 Audit", governance: "M07 Workflow" },
  },
  {
    n: 49, slug: "philanthropy-foundations", name: "Philanthropy and Foundations",
    codeSlug: "philanthropy",
    ruLabel: "Фонды, гранты, комплаенс, impact",
    purpose: `Управление филантропией и благотворительными фондами.\n- Основной пользователь: Owner, Foundation Director, Compliance\n- Foundation management, grant tracking, impact measurement\n- Результат: philanthropy dashboard, grant pipeline, impact reports`,
    outcomes: ["Foundation and donor-advised fund management", "Grant lifecycle tracking from pledge to impact", "Impact measurement and reporting"],
    collections: ["foundations", "grants", "grantPayments", "impactMetrics"],
    entities: [
      { name: "Foundation", fields: "id, name, type, assets, annualBudget, mission, status, boardMembers[]" },
      { name: "Grant", fields: "id, foundationId, grantee, purpose, amount, disbursed, status, impactMetrics[]" },
    ],
    routes: ["/m/philanthropy", "/m/philanthropy/list", "/m/philanthropy/grant/[id]"],
    related: { sources: "M01 Net Worth, M06 Payments", consumers: "M11 Tax, M19 Reporting", governance: "M38 Audit" },
  },
  {
    n: 50, slug: "banking-credit-management", name: "Banking and Credit Management",
    codeSlug: "credit",
    ruLabel: "Банки, кредиты, ковенанты, залоги, LTV",
    purpose: `Управление банковскими отношениями и кредитными линиями.\n- Основной пользователь: CFO, Treasury, RM\n- Credit facilities, loans, covenants, collateral, LTV monitoring\n- Результат: credit dashboard, covenant compliance, LTV alerts`,
    outcomes: ["Credit facility and loan lifecycle management", "Automated covenant compliance monitoring", "Collateral and LTV tracking with alerts"],
    collections: ["creditFacilities", "creditLoans", "creditCovenants", "creditCollateral", "creditPayments", "creditSchedules", "creditCalendar", "creditBanks"],
    entities: [
      { name: "CreditFacility", fields: "id, bankId, type, limit, drawn, available, maturityDate, rate, covenants[], status" },
      { name: "CreditCovenant", fields: "id, facilityId, name, type, threshold, currentValue, compliant, testedAt" },
    ],
    routes: ["/m/credit", "/m/credit/list", "/m/credit/facility/[id]"],
    related: { sources: "M01 Net Worth, M20 Liquidity", consumers: "M02 GL, M10 Risk", governance: "M26 Contracts" },
  },
  {
    n: 51, slug: "data-governance-why-this-number", name: "Data Governance and Why This Number",
    codeSlug: "governance-data",
    ruLabel: "Lineage, quality score, reconciliation, overrides",
    purpose: `Расширенная data governance: трассировка чисел и override management.\n- Основной пользователь: CIO, Data Steward, Operations\n- Number lineage, manual overrides, quality scoring, recon views\n- Результат: «why this number» panel, override log, quality trends`,
    outcomes: ["Drill-through \"why this number\" for any metric", "Manual override management with audit trail", "Data quality trend monitoring and alerting"],
    collections: ["overrides", "overrideApprovals", "qualityTrends"],
    entities: [
      { name: "Override", fields: "id, collection, recordId, field, originalValue, overrideValue, reason, approvedBy, expiresAt" },
      { name: "QualityTrend", fields: "id, collection, dimension, scores[], period, trend, alert" },
    ],
    routes: ["/m/governance-data", "/m/governance-data/list", "/m/governance-data/override/[id]"],
    related: { sources: "M46 Data Governance, M39 DQ", consumers: "All modules", governance: "M38 Audit" },
  },
  {
    n: 52, slug: "advisor-packs-reporting", name: "Advisor Packs and One Click Reporting",
    codeSlug: "packs",
    ruLabel: "Пакеты, approvals, shares, download logs",
    purpose: `Формирование и отправка пакетов для advisors одним кликом.\n- Основной пользователь: RM, Operations\n- Pack templates, assembly, approval, secure sharing, download tracking\n- Результат: pack dashboard, one-click assembly, delivery confirmation`,
    outcomes: ["One-click advisor pack assembly from templates", "Multi-step approval workflow before delivery", "Secure sharing with download tracking"],
    collections: ["packTemplates", "packItems", "packApprovals", "packShares", "packDownloads"],
    entities: [
      { name: "PackTemplate", fields: "id, name, sections[], modules[], format, defaultRecipients[]" },
      { name: "PackShare", fields: "id, packId, recipientEmail, sharedAt, expiresAt, downloadCount, status" },
    ],
    routes: ["/m/packs", "/m/packs/list", "/m/packs/pack/[id]"],
    related: { sources: "M19 Reporting, M05 Documents", consumers: "M55 Portal, M37 External Sharing", governance: "M35 Policies" },
  },
  {
    n: 53, slug: "relationship-hub-crm", name: "Relationship Hub and CRM",
    codeSlug: "relationships",
    ruLabel: "Контакты, взаимодействия, coverage, VIP",
    purpose: `CRM для wealth management: отношения, coverage, VIP.\n- Основной пользователь: RM, Head of Client Relations\n- Contact management, interaction log, coverage model, VIP tracking\n- Результат: relationship dashboard, interaction timeline, coverage matrix`,
    outcomes: ["360-degree client relationship view", "Interaction logging and coverage tracking", "VIP client management with priority alerts"],
    collections: ["relRelationships", "relInteractions", "relHouseholds", "relCoverage", "relInitiatives", "relVipViews"],
    entities: [
      { name: "Relationship", fields: "id, type, primaryContact, entities[], rm, status, tier, lastInteraction" },
      { name: "Interaction", fields: "id, relationshipId, type, date, participants[], summary, followUps[], sentiment" },
    ],
    routes: ["/m/relationships", "/m/relationships/list", "/m/relationships/relationship/[id]"],
    related: { sources: "M08 Onboarding, M15 Communications", consumers: "M55 Portal, M19 Reporting", governance: "M34 Consents" },
  },
  {
    n: 54, slug: "consent-privacy-center", name: "Consent and Privacy Center",
    codeSlug: "consent",
    ruLabel: "Согласия, политики, conflicts, access reviews",
    purpose: `Единый центр управления согласиями и приватностью.\n- Основной пользователь: DPO, Compliance, Legal\n- Consent management, privacy policies, conflicts, access reviews\n- Результат: consent dashboard, conflict resolver, access review workflow`,
    outcomes: ["Centralized consent and privacy management", "Automated conflict detection between consents", "Periodic access review campaigns"],
    collections: ["consents", "privacyPolicies", "consentConflicts", "consentRequests", "accessReviews", "revocations"],
    entities: [
      { name: "Consent", fields: "id, subjectId, type, purpose, scope, status, grantedAt, expiresAt, evidenceRef" },
      { name: "ConsentConflict", fields: "id, consentA, consentB, conflictType, severity, resolution, resolvedBy" },
    ],
    routes: ["/m/consent", "/m/consent/list", "/m/consent/consent/[id]"],
    related: { sources: "M34 Consents, M17 Security", consumers: "M38 Audit, M35 Policies", governance: "M46 Data Governance" },
  },
  {
    n: 55, slug: "client-portal", name: "Client Portal",
    codeSlug: "client-portal",
    ruLabel: "Client-safe контур, requests, messages, audit-lite",
    purpose: `Клиентский портал — безопасный внешний контур для клиентов.\n- Основной пользователь: Client (external), RM (admin)\n- Client dashboard, requests, messages, documents, reports\n- Результат: клиентский self-service портал с audit trail`,
    outcomes: ["Secure client self-service portal", "Request and message management", "Client-safe document and report viewing"],
    collections: ["portalUsers", "portalSessions", "portalViews", "portalRequests", "portalAnnouncements"],
    entities: [
      { name: "PortalUser", fields: "id, clientId, email, name, role, status, lastLogin, mfaEnabled" },
      { name: "PortalRequest", fields: "id, userId, type, subject, body, status, assignee, createdAt, resolvedAt" },
    ],
    routes: ["/portal", "/portal/requests", "/portal/documents", "/portal/reports", "/portal/messages", "/portal/profile"],
    related: { sources: "M45 Client Safe Publishing, M52 Packs", consumers: "M15 Communications, M36 Cases", governance: "M17 Security, M34 Consents" },
  },
];

// ── Template ──────────────────────────────────────────────────────
function generateReadme(m) {
  const num = String(m.n).padStart(2, "0");
  const collectionsBlock = m.collections.map(c => `- \`${c}\``).join("\n");
  const entitiesBlock = m.entities.map(e =>
    `**${e.name}**\n- Поля: ${e.fields}\n- Связи: через objectRef / foreignKey`
  ).join("\n\n");
  const routesBlock = m.routes.map(r => `- \`${r}\``).join("\n");
  const outcomesBlock = m.outcomes.map(o => `- ${o}`).join("\n");

  return `# M${num} ${m.name}

## 1. Назначение модуля
${m.purpose}

**Value outcomes:**
${outcomesBlock}

---

## 2. Границы MVP
### Включено в MVP
- [ ] Dashboard с KPI strip
- [ ] List с фильтрами и сортировкой
- [ ] Detail view с вкладками
- [ ] CRUD через Collections API
- [ ] Audit trail (auditEvents)
- [ ] RBAC scope ограничения

### Не включено в MVP
- [ ] Real-time push notifications
- [ ] Advanced analytics / ML
- [ ] External API integrations (beyond mock)
- [ ] Mobile-specific UI

---

## 3. Пользователи и роли
| Роль | Права | Ограничения client-safe |
|---|---|---|
| Owner/Admin | Полный доступ | — |
| CIO | Чтение + аналитика | Скрыты внутренние комментарии |
| CFO/Controller | Чтение + финансовые операции | Скрыты персональные данные |
| Operations | CRUD в рамках scope | Скрыты стратегические данные |
| Compliance | Чтение + audit + reviews | Скрыты коммерческие данные |
| RM | Чтение + клиентские данные | Скрыты внутренние операции |
| External Advisor | Только опубликованные данные | client-safe фильтрация |
| Client (Portal) | Только свои данные | Полная client-safe фильтрация |

---

## 4. Экранная модель
### Маршруты
${routesBlock}

### Экран: Dashboard
**Блоки:**
- KPI strip: 6–10 метрик
- Preview tables: 2–3 таблицы
- Alerts panel: уведомления и предупреждения
- AI panel: explain / summarize
- Actions bar: основные действия

**Клики:**
- KPI → list с предустановленным фильтром
- Preview row → detail page
- Actions → modal / wizard

### Экран: List
**Фильтры:**
- Status
- Period (daterange)
- Search (полнотекстовый)
- Scope switcher (household / entity / portfolio)

**Таблица:**
- Колонки с сортировкой, sticky header
- Row actions: Open, Edit, Archive
- Bulk actions (если применимо)

### Экран: Detail
**Вкладки:**
- Overview — summary cards, key metrics
- Data — полные данные, editable fields
- Documents — прикреплённые файлы
- Activity — timeline событий
- Audit — history changes

---

## 5. Данные и сущности
### Коллекции FileDB (локальный MVP)
${collectionsBlock}
- \`auditEvents\` (обязательно)

### Сущности (логическая модель)
${entitiesBlock}

### Source and As-of
- Все финансовые поля должны иметь \`asOf\` timestamp
- \`sourceRef\` указывает на источник данных (connector, manual, calculation)
- Правила source-first: внешний источник имеет приоритет над ручным вводом

---

## 6. CRUD и Actions
### Collections API (универсальный контракт)
- \`GET /api/collections/<collection>\` — список записей
- \`GET /api/collections/<collection>/{id}\` — одна запись
- \`POST /api/collections/<collection>\` — создание
- \`PUT /api/collections/<collection>/{id}\` — обновление
- \`DELETE /api/collections/<collection>/{id}\` — удаление

### Actions API (процедурные операции)
- \`POST /api/actions/m${num}/<actionKey>\`
  - Вход: payload JSON
  - Выход: \`{ ok, result, linkedObjects, warnings, auditEventId }\`

**Список actions в модуле:**
- \`refresh\`: Обновить данные из источников
- \`export\`: Экспортировать в PDF/Excel
- \`archive\`: Архивировать запись

---

## 7. Workflow и Approvals
- Триггеры: создание/изменение ключевых сущностей
- Статусы: draft → pending_review → approved → published
- Правила: «Human in the loop» для критичных решений
- Уведомления: email + in-app при смене статуса

---

## 8. Документы и Evidence
- Прикрепление документов через \`documentRef\`
- Версионирование: автоматическое при перезаливке
- Client-safe: публикация через M45 Client Safe Publishing
- Audit: логирование всех операций с документами

---

## 9. RBAC и client-safe правила
### RBAC
- Scope: household → entity → portfolio → account
- Каждая коллекция привязана к scope через \`scopeRef\`
- Роли определяют допустимые операции (read / write / delete / approve)

### Client-safe
- Скрытие внутренних полей: \`internalNotes\`, \`costBasis\`, \`marginNotes\`
- Snapshot публикации: point-in-time данные
- External advisor: ограниченный набор полей

---

## 10. Audit trail
**События, которые обязаны писаться в auditEvents:**
- create / update / delete ключевых сущностей
- approval decisions (approve / reject / escalate)
- publish / share / revoke
- downloads / views для shares и portal

Формат:
- \`objectRef\`: ссылка на объект (collection/id)
- \`action\`: тип действия
- \`actor\`: userId
- \`before / after\`: diff данных
- \`timestamp\`: ISO 8601

---

## 11. AI Copilot в модуле
### Режимы
- **Explain**: объяснить показатель или изменение
- **Draft**: подготовить текст, запрос, письмо
- **Summarize**: резюмировать данные, треды, документы
- **Triage**: предложить приоритеты задач и исключений

### Обязательные требования к ответу AI
- RU по умолчанию (переключаемый язык)
- \`sources[]\` — ссылки на объекты (objectRef)
- \`asOf\` — дата актуальности данных
- \`confidence\` — уровень уверенности (high / medium / low)
- \`assumptions[]\` — допущения
- Guardrails: если sources нет → «Недостаточно данных»
- Client-safe enforcement: AI не раскрывает скрытые поля

---

## 12. Дисклеймеры
- Данные носят информационный характер
- Не является финансовой / налоговой / юридической консультацией
- AI-выводы требуют проверки человеком
- Актуальность данных определяется полем \`asOf\`

---

## 13. Demo Data
### Seed данные
- Файл: \`src/db/seed/seed-module-${num}.json\`
- Коллекции: ${m.collections.map(c => `\`${c}\``).join(", ")}
- Связи: cross-references через id

### Demo сценарии
- Типовой workflow от создания до завершения
- Edge cases: просроченные, отклонённые, escalated
- Мульти-entity данные для демонстрации scope

---

## 14. Критерии приёмки
- [ ] Dashboard открывается, KPI кликаются
- [ ] List фильтруется и сортируется
- [ ] Detail открывается, вкладки работают
- [ ] Create / Edit сохраняет и пишет audit
- [ ] Actions выполняются и пишут audit
- [ ] RBAC ограничивает данные по scope
- [ ] Client-safe скрывает внутренние поля
- [ ] i18n: RU / EN / UK для ключей
- [ ] AI панель отвечает с sources и asOf

---

## 15. Ошибки и обработка исключений
- Ошибки валидации → inline сообщение
- Ошибки sync → exception в M48 Exception Center
- Ошибки бизнес-логики → уведомление + audit event
- Network errors → retry с exponential backoff

---

## 16. Ссылки на связанные модули
- **Sources:** ${m.related.sources}
- **Consumers:** ${m.related.consumers}
- **Governance:** ${m.related.governance}
`;
}

// ── Generate all files ───────────────────────────────────────────
let created = 0;
for (const m of modules) {
  const num = String(m.n).padStart(2, "0");
  const dirName = `M${num}-${m.slug}`;
  const dirPath = join(BASE, dirName);
  mkdirSync(dirPath, { recursive: true });
  const filePath = join(dirPath, "README.md");
  writeFileSync(filePath, generateReadme(m), "utf-8");
  created++;
  console.log(`✓ ${dirName}/README.md`);
}
console.log(`\nDone: ${created} README files created.`);
