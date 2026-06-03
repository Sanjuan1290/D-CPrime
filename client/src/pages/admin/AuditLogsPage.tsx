import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import { auditLogs } from '../../data/adminMockData'

function AuditLogsPage() {
  return (
    <Panel title="Audit Logs" subtitle="Mock history of provided-file data loading">
      <DataTable headers={['Date / Time', 'User', 'Activity', 'Module']} rows={auditLogs} />
    </Panel>
  )
}

export default AuditLogsPage
