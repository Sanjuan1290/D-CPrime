import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { accreditedSellers, company, computations } from '../../data/adminMockData'

function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Company Profile" subtitle="From SOA header">
        <div className="space-y-1 text-sm">
          <InfoRow label="Company Name" value={company.name} />
          <InfoRow label="Address" value={company.address} />
          <InfoRow label="Phone" value={company.phone} />
          <InfoRow label="Prepared By" value={company.preparedBy} />
          <InfoRow label="Position" value={company.preparedByPosition} />
        </div>
      </Panel>

      <Panel title="Accredited Sellers" subtitle="Sample from Accredited Sellers sheet">
        <DataTable
          headers={['Status', 'Name', 'Manager', 'Contact', 'Email']}
          rows={accreditedSellers.map((seller) => [
            seller.status,
            seller.name,
            seller.manager,
            seller.contact,
            seller.email,
          ])}
        />
      </Panel>

      <Panel title="Pantihan 4 Computations" subtitle="From the two computation images">
        <div className="grid gap-4">
          {computations.map((item) => (
            <div key={item.name} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
              <h3 className="text-base font-bold">{item.name}</h3>
              <p className="mt-1 text-zinc-500">{item.project}</p>
              <div className="mt-4 space-y-1">
                <InfoRow label="Promo" value={formatCurrency(item.promo)} />
                <InfoRow label="Downpayment" value={formatPercent(item.downpaymentPercent)} />
                <InfoRow label="Reservation Fee" value={formatCurrency(item.reservationFee)} />
                <InfoRow label="Balance" value={formatCurrency(item.balance)} />
                <InfoRow label="3 Years Estimated Monthly" value={formatCurrency(item.estimated3Years)} />
                <InfoRow label="5 Years Estimated Monthly" value={formatCurrency(item.estimated5Years)} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="System Settings" subtitle="Admin-only mock controls">
        <div className="grid gap-3 text-sm">
          {['Commission release thresholds: 20%, 40%, 60%, 75%, retention 25%', 'Document requirements follow Master List status COMPLETE/INC', 'SOA date format uses MM/DD/YYYY', 'Currency shown as PHP to avoid encoding issues'].map((setting) => (
            <div key={setting} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
              {setting}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default SettingsPage
