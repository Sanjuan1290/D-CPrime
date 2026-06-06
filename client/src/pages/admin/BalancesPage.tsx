import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useBalances } from '../../hooks/useBalances'

function BalancesPage() {
  const balancesQuery = useBalances()

  if (balancesQuery.isLoading) return <LoadingSkeleton rows={6} />
  if (balancesQuery.isError || !balancesQuery.data) {
    return <ErrorState message="Client balances could not be loaded from MySQL." onRetry={() => void balancesQuery.refetch()} />
  }

  const balances = balancesQuery.data.data
  const totalBalance = balances.reduce((total, payment) => total + Number(payment.balance || 0), 0)
  const totalPaid = balances.reduce((total, payment) => total + Number(payment.total_paid || 0), 0)
  const installmentAccounts = balances.filter((payment) => payment.mode_of_payment === 'installment').length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Balance" value={formatCurrency(totalBalance)} note="From verified payments and client unit TCP" />
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} note="Verified payment total" />
        <StatCard label="Installment Accounts" value={installmentAccounts.toString()} note="Accounts marked installment" />
      </div>

      <Panel title="Client Balances" subtitle="Live client-unit balances from MySQL">
        <DataTable
          headers={['Unit ID', 'Buyer', 'Project', 'Mode', 'Paid', 'Total Contract Price', 'Balance', 'Payment %']}
          rows={balances.map((payment) => {
            const total = Number(payment.total_contract_price || 0)
            const paid = Number(payment.total_paid || 0)
            return [
              payment.unit_id,
              payment.buyer_name,
              payment.project_name,
              <Badge key={`${payment.client_unit_id}-mode`}>{payment.mode_of_payment}</Badge>,
              formatCurrency(paid),
              formatCurrency(total),
              formatCurrency(Number(payment.balance || 0)),
              formatPercent(total > 0 ? paid / total : 0),
            ]
          })}
        />
      </Panel>
    </div>
  )
}

export default BalancesPage
