import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatCurrency(totalSales)} note="Total contract price from client records" />
        <StatCard label="Pending Sales" value={formatCurrency(totalPendingSales)} note="Open balances from partially paid clients" />
        <StatCard label="Listed Lot Value" value={formatCurrency(totalListedValue)} note={`${listingsV2.length} lots across mock projects`} />
        <StatCard label="Available Lot Value" value={formatCurrency(availableValue)} note={`${availableLots.length} lots still available`} />
        <StatCard label="Sold Lot Value" value={formatCurrency(soldValue)} note={`${soldLots.length} lots marked sold`} />
        <StatCard label="Reserved Lot Value" value={formatCurrency(reservedValue)} note={`${reservedLots.length} lots marked reserved`} />
        <StatCard label="Tracked Collections" value={formatCurrency(totalCollections)} note="Payment Made Tracker sample total" />
        <StatCard label="Collection Progress" value={formatPercent(collectionProgress)} note={`${formatCurrency(totalPaid)} paid against client TCP`} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Clients Sample" value={clientsV2.length.toString()} note="Rows pulled from Master List and mock additions" />
        <StatCard label="Pending Documents" value={pendingDocuments.toString()} note="INC document status records" />
        <StatCard label="SOA Prepared By" value="Kirsten Rioja" note="Administration Head from SOA file" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Commission Payable" value={formatCurrency(commissionPayable)} note="Manager + agent commission" />
        <StatCard label="Commission Released" value={formatCurrency(commissionReleased)} note="1st to 4th release stages" />
        <StatCard label="Commission Remaining" value={formatCurrency(commissionRemaining)} note="Remaining from tracker" />
        <StatCard label="Retention" value={formatCurrency(retentionTotal)} note="25% retention column" />
        <StatCard label="Cash Advance" value={formatCurrency(cashAdvanceTotal)} note="Manager + agent advances" />
      </div>

      <section className="rounded-lg border border-white/10 bg-[#111111] p-5 shadow-sm shadow-black/20">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold">Agent Performance</h2>
          <Badge>ACTIVE</Badge>
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
      </section>
    </div>
  )
}

export default DashboardPage
