import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { paymentTracker } from '../../data/adminMockData'

function BalancesPage() {
  const totalBalance = paymentTracker.reduce((total, payment) => total + payment.balance, 0)
  const totalPaid = paymentTracker.reduce((total, payment) => total + payment.paymentMade, 0)
  const installmentAccounts = paymentTracker.filter((payment) => payment.mode === 'INSTALLMENT').length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Balance" value={formatCurrency(totalBalance)} note="From Payment Made Tracker balance column" />
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} note="Sample payment made total" />
        <StatCard label="Installment Accounts" value={installmentAccounts.toString()} note="Accounts with due day schedules" />
      </div>

      <Panel title="Client Balances" subtitle="Admin view of client-side Balance / SOA feature">
        <DataTable
          headers={['Unit ID', 'Buyer', 'Mode', 'Due Day', 'Payment Made', 'Total Contract Price', 'Balance', 'Payment %']}
          rows={paymentTracker.map((payment) => [
            payment.unitId,
            payment.buyer,
            <Badge key={`${payment.unitId}-mode`}>{payment.mode}</Badge>,
            payment.dueDay ?? '-',
            formatCurrency(payment.paymentMade),
            formatCurrency(payment.totalContractPrice),
            formatCurrency(payment.balance),
            formatPercent(payment.paymentPercentage),
          ])}
        />
      </Panel>
    </div>
  )
}

export default BalancesPage
