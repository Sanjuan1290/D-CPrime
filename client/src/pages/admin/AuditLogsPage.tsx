import DataTable from '../../components/admin/DataTable'
import Panel from '../../components/admin/Panel'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useAuditLogs } from '../../hooks/useAdminResources'

function AuditLogsPage() {
  const auditLogsQuery = useAuditLogs()
  const auditLogs = auditLogsQuery.data?.data ?? []

  if (auditLogsQuery.isLoading) return <LoadingSkeleton rows={8} />

  if (auditLogsQuery.isError) {
    return <ErrorState message="Audit logs could not be loaded from MySQL." onRetry={() => void auditLogsQuery.refetch()} />
  }

  return (
    <Panel title="Audit Logs" subtitle="Database history of admin changes and API activity">
      <DataTable
        headers={['Date / Time', 'User ID', 'Activity', 'Module', 'Record', 'IP Address']}
        rows={auditLogs.map((log) => [
          formatDateTime(log.created_at),
          log.user_id ?? '-',
          log.action,
          log.module_name ?? '-',
          log.entity_table ? `${log.entity_table} #${log.entity_id ?? '-'}` : '-',
          log.ip_address ?? '-',
        ])}
      />
    </Panel>
  )
}

function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-PH')
}

export default AuditLogsPage
