import { useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import InfoRow from '../../components/admin/InfoRow'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { accreditedSellers, auditLogsV2, company } from '../../data/mockData'

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

      <Panel title="System Settings" subtitle="Admin-only mock controls">
        <div className="grid gap-3 text-sm">
          {['Commission release thresholds: 20%, 40%, 60%, 75%, retention 25%', 'Document requirements follow Master List status COMPLETE/INC', 'SOA date format uses MM/DD/YYYY', 'Currency fixed to Philippine Peso'].map((setting) => (
            <div key={setting} className="rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] px-3 py-2 text-[#374151]">
              {setting}
            </div>
          ))}
          <label className="block rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] px-3 py-2 text-[#374151]">
            <span className="block text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Pagination Size</span>
            <select
              value={pageSize}
              onChange={(event) => setPageSize(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-[#111827] outline-none focus:border-[#C9A84C]"
            >
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
          </label>
          <button onClick={saveSystemSettings} className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-bold text-[#1A1A2E] shadow-sm hover:bg-[#B9973C]">
            Save Changes
          </button>
        </div>
      </Panel>

      <Panel title="Audit Logs" subtitle="Admin activity history moved from the sidebar into Settings">
        <DataTable
          headers={['Date / Time', 'User', 'Role', 'Action', 'Details', 'IP']}
          rows={auditLogsV2.map((log) => [
            log.timestamp,
            log.userName,
            log.role,
            log.action,
            log.details,
            log.ipAddress,
          ])}
        />
      </Panel>
    </div>
  )
}

export default SettingsPage
