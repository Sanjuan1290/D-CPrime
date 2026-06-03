import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { commissions } from '../../data/adminMockData'

function CommissionsPage() {
  return (
    <Panel title="Commission Tracker" subtitle="Manager and agent commission rows from workbook">
      <DataTable
        headers={['Buyer', 'Unit', 'Agent', 'Manager', 'Net Selling Price', 'Manager Commission', 'Agent Commission', 'Released']}
        rows={commissions.map((commission) => [
          commission.buyer,
          commission.unitId,
          commission.agent,
          commission.manager,
          formatCurrency(commission.netSellingPrice),
          formatCurrency(commission.managerCommission),
          formatCurrency(commission.agentCommission),
          formatPercent(commission.releasedPercent),
        ])}
      />
    </Panel>
  )
}

export default CommissionsPage
