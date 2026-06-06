import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import { mockDbAuditLogs, mockStorageKeys, readMockStorage } from '../../data/adminMockData'

function AuditLogsPage() {
  const auditLogs = readMockStorage(mockStorageKeys.auditLogs, mockDbAuditLogs)
  return (
    <Panel title="Audit Logs" subtitle="Mock history of local CRUD operations">
      <DataTable
        headers={['Date / Time', 'User ID', 'Activity', 'Module']}
        rows={auditLogs.map((log) => [log.created_at, log.user_id ?? '-', log.action, log.module_name ?? '-'])}
      />
    </Panel>
  )
}

export default AuditLogsPage
