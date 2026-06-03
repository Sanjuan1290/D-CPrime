import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency } from '../../components/admin/formatters'
import { agentPerformance, clients, documents, listings, paymentTracker } from '../../data/adminMockData'

function DashboardPage() {
  const sold = listings.filter((listing) => listing.status === 'Sold').length
  const available = listings.filter((listing) => listing.status === 'Available').length
  const reserved = listings.filter((listing) => listing.status === 'Reserved').length
  const totalCollections = paymentTracker.reduce((total, payment) => total + payment.paymentMade, 0)
  const pendingDocuments = documents.filter((document) => document.documentStatus === 'INC').length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Project Source" value="Gen. Emilio Aguinaldo" note="From SOA and Master List property address" />
        <StatCard label="Listings Sample" value={listings.length.toString()} note={`${available} available / ${reserved} reserved / ${sold} sold`} />
        <StatCard label="Clients Sample" value={clients.length.toString()} note="Rows pulled from Master List" />
        <StatCard label="Tracked Collections" value={formatCurrency(totalCollections)} note="Payment Made Tracker sample total" />
        <StatCard label="Pending Documents" value={pendingDocuments.toString()} note="INC document status records" />
        <StatCard label="SOA Prepared By" value="Kirsten Rioja" note="Administration Head from SOA file" />
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between border-b border-zinc-100 pb-4">
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
