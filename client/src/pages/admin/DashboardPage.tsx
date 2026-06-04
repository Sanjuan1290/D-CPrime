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
import { agentPerformance, clientsV2, documents, listingsV2, paymentTracker } from '../../data/adminMockData'
import { commissionDetails } from '../../data/sourceDetails'

function DashboardPage() {
  const soldLots = listingsV2.filter((listing) => listing.status === 'Sold')
  const availableLots = listingsV2.filter((listing) => listing.status === 'Available')
  const reservedLots = listingsV2.filter((listing) => listing.status === 'Reserved')
  const totalListedValue = listingsV2.reduce((total, listing) => total + listing.sellingPrice, 0)
  const availableValue = availableLots.reduce((total, listing) => total + listing.sellingPrice, 0)
  const soldValue = soldLots.reduce((total, listing) => total + listing.sellingPrice, 0)
  const reservedValue = reservedLots.reduce((total, listing) => total + listing.sellingPrice, 0)
  const totalSales = clientsV2.reduce((total, client) => total + client.totalContractPrice, 0)
  const totalPendingSales = clientsV2.reduce((total, client) => total + client.balance, 0)
  const totalPaid = clientsV2.reduce((total, client) => total + client.paymentMade, 0)
  const totalCollections = paymentTracker.reduce((total, payment) => total + payment.paymentMade, 0)
  const pendingDocuments = documents.filter((document) => document.documentStatus === 'INC').length
  const collectionProgress = totalSales > 0 ? totalPaid / totalSales : 0
  const commissionPayable = commissionDetails.reduce((total, detail) => total + detail.manager.commission + detail.agent.commission, 0)
  const commissionReleased = commissionDetails.reduce(
    (total, detail) =>
      total +
      detail.manager.firstRelease20 +
      detail.manager.secondRelease40 +
      detail.manager.thirdRelease60 +
      detail.manager.fourthRelease75 +
      detail.agent.firstRelease20 +
      detail.agent.secondRelease40 +
      detail.agent.thirdRelease60 +
      detail.agent.fourthRelease75,
    0,
  )
  const commissionRemaining = commissionDetails.reduce((total, detail) => total + detail.manager.totalRemaining + detail.agent.totalRemaining, 0)
  const retentionTotal = commissionDetails.reduce((total, detail) => total + detail.manager.retention25 + detail.agent.retention25, 0)
  const cashAdvanceTotal = commissionDetails.reduce((total, detail) => total + detail.manager.cashAdvance + detail.agent.cashAdvance, 0)
  const lotStatusData = [
    { name: 'Sold', value: soldValue, count: soldLots.length, color: '#1F7A4D' },
    { name: 'Reserved', value: reservedValue, count: reservedLots.length, color: '#C9A84C' },
    { name: 'Available', value: availableValue, count: availableLots.length, color: '#3B82F6' },
  ]
  const agentChartData = [...agentPerformance]
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 8)
    .map((agent) => ({
      agent: agent.agent.split(' ').slice(0, 2).join(' '),
      totalSales: agent.totalSales,
      net: agent.net,
    }))
  const commissionReleaseData = [
    {
      stage: '1st',
      value: commissionDetails.reduce((total, detail) => total + detail.manager.firstRelease20 + detail.agent.firstRelease20, 0),
    },
    {
      stage: '2nd',
      value: commissionDetails.reduce((total, detail) => total + detail.manager.secondRelease40 + detail.agent.secondRelease40, 0),
    },
    {
      stage: '3rd',
      value: commissionDetails.reduce((total, detail) => total + detail.manager.thirdRelease60 + detail.agent.thirdRelease60, 0),
    },
    {
      stage: '4th',
      value: commissionDetails.reduce((total, detail) => total + detail.manager.fourthRelease75 + detail.agent.fourthRelease75, 0),
    },
    { stage: 'Retention', value: retentionTotal },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatCurrency(totalSales)} note="Total contract price from client records" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Pending Sales" value={formatCurrency(totalPendingSales)} note="Open balances from partially paid clients" icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Listed Lot Value" value={formatCurrency(totalListedValue)} note={`${listingsV2.length} lots across mock projects`} icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Available Lot Value" value={formatCurrency(availableValue)} note={`${availableLots.length} lots still available`} icon={<Home className="h-5 w-5" />} />
        <StatCard label="Sold Lot Value" value={formatCurrency(soldValue)} note={`${soldLots.length} lots marked sold`} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard label="Reserved Lot Value" value={formatCurrency(reservedValue)} note={`${reservedLots.length} lots marked reserved`} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard label="Tracked Collections" value={formatCurrency(totalCollections)} note="Payment Made Tracker sample total" icon={<Wallet className="h-5 w-5" />} />
        <StatCard label="Collection Progress" value={formatPercent(collectionProgress)} note={`${formatCurrency(totalPaid)} paid against client TCP`} icon={<Percent className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Clients Sample" value={clientsV2.length.toString()} note="Rows pulled from Master List and mock additions" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Pending Documents" value={pendingDocuments.toString()} note="INC document status records" icon={<FileText className="h-5 w-5" />} />
        <StatCard label="SOA Prepared By" value="Kirsten Rioja" note="Administration Head from SOA file" icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Commission Payable" value={formatCurrency(commissionPayable)} note="Manager + agent commission" />
        <StatCard label="Commission Released" value={formatCurrency(commissionReleased)} note="1st to 4th release stages" />
        <StatCard label="Commission Remaining" value={formatCurrency(commissionRemaining)} note="Remaining from tracker" />
        <StatCard label="Retention" value={formatCurrency(retentionTotal)} note="25% retention column" />
        <StatCard label="Cash Advance" value={formatCurrency(cashAdvanceTotal)} note="Manager + agent advances" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Lot Value By Status" subtitle="Total listed value grouped by current lot status">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={lotStatusData} innerRadius={68} outerRadius={106} paddingAngle={3} dataKey="value" nameKey="name">
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
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">{item.name}</span>
                </div>
                <p className="mt-2 font-serif text-xl text-[#1A1A2E]">{formatCurrency(item.value)}</p>
                <p className="text-xs text-[#6B7280]">{item.count} lots</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top Agent Sales" subtitle="Highest sales from the master list sample">
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentChartData} layout="vertical" margin={{ top: 8, right: 16, left: 48, bottom: 8 }}>
                <CartesianGrid stroke="#EEE8DD" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${Number(value) / 1000000}M`} stroke="#9CA3AF" fontSize={11} />
                <YAxis type="category" dataKey="agent" width={86} stroke="#6B7280" fontSize={11} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="totalSales" fill="#C9A84C" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Commission Releases" subtitle="1st to 4th releases plus retained commission">
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionReleaseData} margin={{ top: 10, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="#EEE8DD" vertical={false} />
                <XAxis dataKey="stage" stroke="#6B7280" fontSize={11} />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000000}M`} stroke="#9CA3AF" fontSize={11} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#1A1A2E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Agent Performance"
        subtitle="Sales, active accounts, cancelled accounts, and net totals"
        actions={<Badge>ACTIVE</Badge>}
      >
        <div className="mb-4 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] px-4 py-3 text-sm text-[#6B7280]">
          Values are calculated from the normalized mock master list so the dashboard and agent table stay in sync.
        </div>
        <DataTable
          headers={['Agent', 'Total Sales', 'Active', 'Cancelled', 'Net']}
          rows={agentPerformance.map((agent) => [
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

export default DashboardPage
