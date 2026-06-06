import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useDashboardSummary } from '../../hooks/useDashboard'

function ReportsPage() {
  const dashboardQuery = useDashboardSummary()

  if (dashboardQuery.isLoading) return <LoadingSkeleton rows={5} />
  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <ErrorState message="Reports could not be loaded from MySQL." onRetry={() => void dashboardQuery.refetch()} />
  }

  const { metrics } = dashboardQuery.data
  const soldLots = dashboardQuery.data.lotStatusData.find((item) => item.name === 'sold')?.count ?? 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales Report" value={formatCurrency(metrics.totalSales)} note="Client unit total contract price" />
        <StatCard label="Collection Report" value={formatCurrency(metrics.verifiedCollections)} note="Verified payments" />
        <StatCard label="Agent Report" value={dashboardQuery.data.agentPerformance.length.toString()} note="Assigned agents with sales" />
        <StatCard label="Project Summary" value={`${soldLots} sold`} note="Inventory status count" />
      </div>
      <Panel title="Available Reports" subtitle="Database-backed report shortcuts">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {['Sales Report', 'Collection Report', 'Commission Report', 'Agent Performance Report', 'Project Summary Report'].map((report) => (
            <button key={report} className="rounded-lg border border-[#E8E4DC] bg-white p-4 text-left text-sm font-bold text-[#374151] hover:border-[#C9A84C] hover:bg-[#FFF8E1]">
              {report}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default ReportsPage
