// PUBLIC API of the account-health feature. Pages import ONLY from here.

// ── Queries ────────────────────────────────────────────────────────────────────
export {
  accountHealthKeys,
  useAccountHealthSummary,
  useNfrDetail,
  useChatDetail,
} from './api/account-health.queries'

// ── MSW handlers + i18n (must always be exported) ─────────────────────────────
export { accountHealthHandlers } from './api/account-health.mocks'
export { accountHealthMessages } from './i18n'

// ── Components ─────────────────────────────────────────────────────────────────
export { HealthScoreHeader } from './components/HealthScoreHeader'
export { KpiStrip } from './components/KpiStrip'
export { PenaltyPanel } from './components/PenaltyPanel'
export { MetricsTable } from './components/MetricsTable'
export { VerifiedSellerWidget } from './components/VerifiedSellerWidget'
export { IssuesToImprove } from './components/IssuesToImprove'
export { LineChart } from './components/LineChart'
export { DonutChart } from './components/DonutChart'
export { NfrOverviewStrip } from './components/NfrOverviewStrip'
export { NfrAffectedOrdersTable } from './components/NfrAffectedOrdersTable'

// ── Icons ──────────────────────────────────────────────────────────────────────
export {
  ShieldIcon,
  InfoIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CalendarIcon,
  ExternalLinkIcon,
} from './components/icons'

// ── Types ──────────────────────────────────────────────────────────────────────
export type {
  HealthLabel,
  MetricId,
  MetricGroup,
  MetricRow,
  PenaltyConsequence,
  AccountHealthSummary,
  NfrDetailResponse,
  NfrDonutSlice,
  NfrWeeklySnapshot,
  NfrAffectedOrder,
  NfrToggle,
  ChatDetailResponse,
  ChatDaySnapshot,
} from './types/account-health.types'
