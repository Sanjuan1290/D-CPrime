import { useState } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { clients } from '../../data/adminMockData'

type Filter = 'All' | 'CASH' | 'INSTALLMENT' | 'COMPLETE' | 'INC'

function ClientsPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const visibleClients = clients.filter((client) => {
    if (filter === 'All') return true
    if (filter === 'CASH' || filter === 'INSTALLMENT') return client.paymentMode === filter
    return client.documentStatus === filter
  })

  return (
    <Panel title="Client Master List" subtitle="Rows from CLIENT MASTERLIST sample">
      <div className="mb-5 flex flex-wrap gap-2">
        {(['All', 'CASH', 'INSTALLMENT', 'COMPLETE', 'INC'] as Filter[]).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
              filter === item ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-300 bg-white text-zinc-700'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <DataTable
        headers={['Buyer', 'Unit', 'Agent', 'Manager', 'TCP', 'Paid', 'Balance', 'Mode', 'Docs', 'Contact']}
        rows={visibleClients.map((client) => [
          client.buyer,
          client.unitId,
          client.agent,
          client.manager,
          formatCurrency(client.totalContractPrice),
          formatCurrency(client.paymentMade),
          formatCurrency(client.balance),
          <Badge key={`${client.unitId}-mode`}>{client.paymentMode}</Badge>,
          <Badge key={`${client.unitId}-docs`}>{client.documentStatus}</Badge>,
          `${client.contactNo ?? '-'} / ${client.email ?? '-'}`,
        ])}
      />
      <p className="mt-4 text-sm text-zinc-500">
        Payment percentages shown in the workbook range from {formatPercent(0.568425)} to {formatPercent(1.1)} in this sample.
      </p>
    </Panel>
  )
}

export default ClientsPage
