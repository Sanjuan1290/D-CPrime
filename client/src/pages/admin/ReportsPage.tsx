import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency } from '../../components/admin/formatters'
import { agentPerformance, clients, listings, paymentTracker } from '../../data/adminMockData'

function ReportsPage() {
  const collectionTotal = paymentTracker.reduce((total, payment) => total + payment.paymentMade, 0)
  const contractTotal = clients.reduce((total, client) => total + client.totalContractPrice, 0)
  const soldLots = listings.filter((listing) => listing.status === 'Sold').length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sales Report" value={formatCurrency(contractTotal)} note="Master List TCP sample" />
        <StatCard label="Collection Report" value={formatCurrency(collectionTotal)} note="Payment Made Tracker sample" />
        <StatCard label="Agent Report" value={agentPerformance.length.toString()} note="Agents from AGENT sheet" />
        <StatCard label="Project Summary" value={`${soldLots} sold`} note="Inventory status count" />
      </div>
      <Panel title="Available Reports" subtitle="Admin-only report shortcuts">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {['Sales Report', 'Collection Report', 'Commission Report', 'Agent Performance Report', 'Project Summary Report'].map((report) => (
            <button key={report} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-left text-sm font-bold hover:border-amber-400">
              {report}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default ReportsPage
