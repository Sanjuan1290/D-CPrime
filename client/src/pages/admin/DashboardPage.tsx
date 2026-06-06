import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { BarChart3, Building2, CreditCard, FileText, Home, Percent, TrendingUp, Users, Wallet } from '../../components/admin/Icons'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useDashboardSummary } from '../../hooks/useDashboard'

const statusColors: Record<string, string> = {
  sold: '#1F7A4D',
  reserved: '#C9A84C',
  available: '#3B82F6',
  hold: '#6B7280',
  inactive: '#9CA3AF',
}

function DashboardPage() {
  const dashboardQuery = useDashboardSummary()

  if (dashboardQuery.isLoading) {
    return <LoadingSkeleton rows={8} />
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <ErrorState message="Dashboard data could not be loaded from MySQL." onRetry={() => void dashboardQuery.refetch()} />
  }

  const { metrics } = dashboardQuery.data
  const collectionProgress = metrics.totalSales > 0 ? metrics.totalPaid / metrics.totalSales : 0
  const lotStatusData = dashboardQuery.data.lotStatusData.map((item) => ({
    ...item,
    label: formatStatus(item.name),
    color: statusColors[item.name] ?? '#6B7280',
  }))
  const agentChartData = dashboardQuery.data.agentPerformance.map((agent) => ({
    ...agent,
    label: agent.agent.split(' ').slice(0, 2).join(' '),
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatCurrency(metrics.totalSales)} note="Total contract price from client units" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Pending Sales" value={formatCurrency(metrics.totalBalance)} note="Open balance from verified payments" icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Listed Lot Value" value={formatCurrency(metrics.totalListedValue)} note={`${metrics.listings} units in MySQL`} icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Available Lot Value" value={formatCurrency(metrics.availableValue)} note={`${metrics.availableListings} units still available`} icon={<Home className="h-5 w-5" />} />
        <StatCard label="Sold Lot Value" value={formatCurrency(metrics.soldValue)} note="Value of sold inventory" icon={<CreditCard className="h-5 w-5" />} />
        <StatCard label="Reserved Lot Value" value={formatCurrency(metrics.reservedValue)} note="Value of reserved inventory" icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard label="Tracked Collections" value={formatCurrency(metrics.verifiedCollections)} note="Verified payment records" icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Collection Progress" value={formatPercent(collectionProgress)} note={`${formatCurrency(metrics.totalPaid)} paid against client TCP`} icon={<Percent className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Clients" value={metrics.clients.toString()} note="Client records from MySQL" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Pending Documents" value={metrics.pendingDocuments.toString()} note="Not submitted, pending, or rejected" icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Active Reservations" value={metrics.activeReservations.toString()} note="Pending and confirmed reservations" icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Commission Payable" value={formatCurrency(metrics.commissionPayable)} note="Imported and active commission records" />
        <StatCard label="Commission Released" value={formatCurrency(metrics.commissionReleased)} note="Released commission records" />
        <StatCard label="Commission Remaining" value={formatCurrency(metrics.commissionRemaining)} note="Pending and partially released records" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Lot Value By Status" subtitle="Total listed value grouped by database status">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={lotStatusData} innerRadius={68} outerRadius={106} paddingAngle={3} dataKey="value" nameKey="label">
                  {lotStatusData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {lotStatusData.map((item) => (
              <div key={item.name} className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">{item.label}</span>
                </div>
                <p className="mt-2 font-serif text-xl text-[#1A1A2E]">{formatCurrency(item.value)}</p>
                <p className="text-xs text-[#6B7280]">{item.count} units</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top Agent Sales" subtitle="Highest assigned client-unit sales from MySQL">
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentChartData} layout="vertical" margin={{ top: 8, right: 16, left: 48, bottom: 8 }}>
                <CartesianGrid stroke="#EEE8DD" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${Number(value) / 1000000}M`} stroke="#9CA3AF" fontSize={11} />
                <YAxis type="category" dataKey="label" width={86} stroke="#6B7280" fontSize={11} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="totalSales" fill="#C9A84C" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Database Health" subtitle="Records currently powering this dashboard">
          <div className="grid gap-3">
            {[
              ['Clients', metrics.clients],
              ['Listings', metrics.listings],
              ['Verified Payments', formatCurrency(metrics.verifiedCollections)],
              ['Pending Payments', metrics.pendingPayments],
              ['Pending Documents', metrics.pendingDocuments],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] px-4 py-3">
                <span className="text-sm font-semibold text-[#374151]">{label}</span>
                <span className="font-serif text-lg text-[#1A1A2E]">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Agent Performance"
        subtitle="Sales, active accounts, cancelled accounts, and net totals from assigned client units"
        actions={<Badge>LIVE DB</Badge>}
      >
        <DataTable
          headers={['Agent', 'Total Sales', 'Active', 'Cancelled', 'Net']}
          rows={dashboardQuery.data.agentPerformance.map((agent) => [
            agent.agent,
            formatCurrency(agent.totalSales),
            agent.active,
            agent.cancelled,
            formatCurrency(agent.net),
          ])}
        />
      </Panel>
    </div>
  )
}

function formatStatus(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default DashboardPage
