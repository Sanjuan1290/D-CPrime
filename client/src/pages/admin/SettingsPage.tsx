import { useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatPercent } from '../../components/admin/formatters'
import { accreditedSellers, company, computations } from '../../data/mockData'

function SettingsPage() {
  const toast = useToast()
  const [pageSize, setPageSize] = useState(localStorage.getItem('dcprime_page_size') ?? '20')

  function saveSystemSettings() {
    localStorage.setItem('dcprime_page_size', pageSize)
    toast.success('System settings saved.')
  }

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
            <div key={item.name} className="rounded-lg border border-white/10 bg-black p-4 text-sm">
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
          {['Commission release thresholds: 20%, 40%, 60%, 75%, retention 25%', 'Document requirements follow Master List status COMPLETE/INC', 'SOA date format uses MM/DD/YYYY', 'Currency fixed to Philippine Peso'].map((setting) => (
            <div key={setting} className="rounded-md border border-white/10 bg-black px-3 py-2 text-zinc-300">
              {setting}
            </div>
          ))}
          <label className="block rounded-md border border-white/10 bg-black px-3 py-2 text-zinc-300">
            <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-500">Pagination Size</span>
            <select
              value={pageSize}
              onChange={(event) => setPageSize(event.target.value)}
              className="mt-2 w-full rounded-md border border-white/10 bg-[#111111] px-3 py-2 text-white"
            >
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
          </label>
          <button onClick={saveSystemSettings} className="rounded-md bg-[#C9A84C] px-4 py-2 text-sm font-bold text-black">
            Save Changes
          </button>
        </div>
      </Panel>
    </div>
  )
}

export default SettingsPage
