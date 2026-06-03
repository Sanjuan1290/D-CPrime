import { useState } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { clientsV2 } from '../../data/adminMockData'
import type { ClientRecord } from '../../data/adminMockData'

type Filter = 'All' | 'CASH' | 'INSTALLMENT' | 'COMPLETE' | 'INC'

function ClientsPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null)
  const visibleClients = clientsV2.filter((client) => {
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
              filter === item ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-white/10 bg-[#111111] text-zinc-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <DataTable
        headers={['Buyer', 'Unit', 'Agent', 'Manager', 'TCP', 'Paid', 'Balance', 'Mode', 'Docs', 'Action']}
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
          <button
            key={`${client.unitId}-view`}
            onClick={() => setSelectedClient(client)}
            className="rounded-md border border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/10"
          >
            View
          </button>,
        ])}
      />
      <p className="mt-4 text-sm text-zinc-500">
        Payment percentages shown in the workbook range from {formatPercent(0.568425)} to {formatPercent(1.1)} in this sample.
      </p>
      <Modal title="Client Record" isOpen={selectedClient !== null} onClose={() => setSelectedClient(null)}>
        {selectedClient && (
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <InfoRow label="Buyer" value={selectedClient.buyer} />
            <InfoRow label="Spouse" value={selectedClient.spouse ?? '-'} />
            <InfoRow label="Unit" value={selectedClient.unitId} />
            <InfoRow label="Relocated Unit" value={selectedClient.relocatedUnit ?? '-'} />
            <InfoRow label="Agent" value={selectedClient.agent} />
            <InfoRow label="Manager" value={selectedClient.manager} />
            <InfoRow label="Contact" value={selectedClient.contactNo ?? '-'} />
            <InfoRow label="Email" value={selectedClient.email ?? '-'} />
            <InfoRow label="Address" value={selectedClient.address ?? '-'} />
            <InfoRow label="Total Contract Price" value={formatCurrency(selectedClient.totalContractPrice)} />
            <InfoRow label="Payment Made" value={formatCurrency(selectedClient.paymentMade)} />
            <InfoRow label="Balance" value={formatCurrency(selectedClient.balance)} />
          </div>
        )}
      </Modal>
    </Panel>
  )
}

export default ClientsPage
