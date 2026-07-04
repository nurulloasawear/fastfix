// PUBLIC API of the home feature. Pages import ONLY from here
// (`@/features/home`) — never a deep path. ESLint enforces this.
export { homeKeys, useTodoList, useBusinessInsights } from './api/home.queries'

export { useHomeUi } from './stores/home.store'

export { TodoCard } from './components/TodoCard'
export { TrendBadge } from './components/TrendBadge'
export { InsightTabs } from './components/InsightTabs'
export { InsightFilterBar } from './components/InsightFilterBar'
export { MetricCardGrid } from './components/MetricCardGrid'
export { MetricCell } from './components/MetricCell'
export { formatMetricValue } from './components/formatMetric'
export { MetricRows } from './components/MetricRows'
export { TrendChart } from './components/TrendChart'
export { DashboardPanel } from './components/DashboardPanel'
export { CheckCircleIcon } from './components/icons'

export { homeMessages } from './i18n'
export { homeHandlers } from './api/home.mocks'

export { TODO_KINDS, INSIGHT_TABS } from './types/home.types'
export type {
  TodoKind,
  TrendDirection,
  TodoItem,
  TodoListResponse,
  InsightTab,
  InsightMetric,
  InsightChartSeries,
  InsightDashboard,
  InsightMetricRow,
  BusinessInsightsResponse,
} from './types/home.types'
