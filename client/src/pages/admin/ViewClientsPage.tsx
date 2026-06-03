import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import { formatCurrency } from '../../components/admin/formatters'
import { clientsV2 } from '../../data/mockData'

function ViewClientsPage() {
  return (
    <Panel title="View Clients" subtitle="Read-only client records lookup">
      <DataTable
        headers={['Client Name', 'Unit ID', 'Project', 'Assigned Agent', 'Status', 'Payment Made', 'Balance']}
        rows={clientsV2.map((client) => [
          client.buyer,
          client.unitId,
          'Luntiang Aguinaldo',
          client.agent,
          <Badge key={`${client.unitId}-status`}>{client.accountStatus}</Badge>,
          formatCurrency(client.paymentMade),
          formatCurrency(client.balance),
        ])}
      />
    </Panel>
  )
}

export default ViewClientsPage
