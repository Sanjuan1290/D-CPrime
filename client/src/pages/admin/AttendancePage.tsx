import { useMemo, useState } from 'react'
import { FiDownload, FiEdit2 } from 'react-icons/fi'
import { HiOutlineClock } from 'react-icons/hi'
import { MdQrCodeScanner } from 'react-icons/md'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import BarcodeScanner from '../../components/shared/BarcodeScanner'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useAttendance, useScanAttendance, useUpdateAttendance } from '../../hooks/useAttendance'
import type { AttendanceLog, AttendanceType } from '../../types'

type AttendanceRow = {
  key: string
  employee: string
  role: string
  avatar?: string | null
  timeIn?: AttendanceLog
  timeOut?: AttendanceLog
  notes?: string | null
}

function AttendancePage() {
  const toast = useToast()
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [typeFilter, setTypeFilter] = useState<'all' | AttendanceType>('all')
  const [scannerMode, setScannerMode] = useState<AttendanceType | null>(null)
  const [lastScan, setLastScan] = useState<AttendanceLog | null>(null)
  const [editingLog, setEditingLog] = useState<AttendanceLog | null>(null)
  const [editScannedAt, setEditScannedAt] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const attendanceQuery = useAttendance({
    date,
    type: typeFilter === 'all' ? undefined : typeFilter,
    limit: 100,
  })
  const scanMutation = useScanAttendance()
  const updateMutation = useUpdateAttendance()

  const logs = useMemo(() => attendanceQuery.data?.data ?? [], [attendanceQuery.data?.data])
  const rows = useMemo(() => groupAttendanceRows(logs), [logs])

  async function handleScan(barcodeValue: string) {
    if (!scannerMode) return

    try {
      const response = await scanMutation.mutateAsync({ barcode_value: barcodeValue, type: scannerMode })
      setLastScan(response.log)
      toast.success(`${response.user.full_name} ${scannerMode === 'time_in' ? 'timed in' : 'timed out'}.`)
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null
      toast.error(message ?? 'Unable to record attendance scan.')
    } finally {
      setScannerMode(null)
    }
  }

  function openEdit(log: AttendanceLog) {
    setEditingLog(log)
    setEditScannedAt(toDateTimeLocal(log.scanned_at ?? log.scannedAt ?? ''))
    setEditNotes(log.notes ?? '')
  }

  async function saveEdit() {
    if (!editingLog) return

    try {
      await updateMutation.mutateAsync({
        id: editingLog.id,
        scanned_at: editScannedAt ? `${editScannedAt.replace('T', ' ')}:00` : undefined,
        notes: editNotes,
      })
      toast.success('Attendance log updated.')
      setEditingLog(null)
    } catch {
      toast.error('Unable to update attendance log.')
    }
  }

  function exportCsv() {
    const header = ['Employee', 'Role', 'Type', 'Scanned At', 'Notes']
    const body = logs.map((log) => [
      log.user?.full_name ?? '',
      log.user?.role ?? '',
      log.type,
      formatDateTime(log.scanned_at),
      log.notes ?? '',
    ])
    const csv = [header, ...body].map((row) => row.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `attendance-${date}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--role-primary)]">People</p>
          <h1 className="mt-1 font-serif text-3xl text-[#1A1A2E]">Attendance Tracker</h1>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-[#E8E4DC] bg-white px-4 py-2 text-sm font-bold text-[#374151] shadow-sm hover:bg-[#F8F7F4]"
        >
          <FiDownload className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ScanCard
          title="Time In"
          tone="emerald"
          disabled={scanMutation.isPending}
          onClick={() => setScannerMode('time_in')}
        />
        <ScanCard
          title="Time Out"
          tone="rose"
          disabled={scanMutation.isPending}
          onClick={() => setScannerMode('time_out')}
        />
      </div>

      {lastScan && (
        <Panel title="Last Scan" subtitle={`${lastScan.user?.full_name ?? 'Employee'} | ${formatAttendanceType(lastScan.type)} | ${formatDateTime(lastScan.scanned_at)}`}>
          <div className="flex items-center gap-4">
            {lastScan.user?.avatar_url ? (
              <img src={lastScan.user.avatar_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-[var(--role-primary-light)] font-bold text-[var(--role-primary)]">
                {(lastScan.user?.full_name ?? 'U').slice(0, 1)}
              </div>
            )}
            <div>
              <p className="font-bold text-[#1A1A2E]">{lastScan.user?.full_name}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge>{lastScan.user?.role ?? 'employee'}</Badge>
                <span className="text-sm text-[#6B7280]">{formatDateTime(lastScan.scanned_at)}</span>
              </div>
            </div>
          </div>
        </Panel>
      )}

      <Panel title="Today's Log" subtitle="Filter, export, and correct attendance records">
        <div className="mb-4 grid gap-3 md:grid-cols-[180px_180px_1fr]">
          <label className="text-sm font-semibold text-[#374151]">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-2 w-full rounded-md border border-[#E8E4DC] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--role-primary)] focus:ring-2 focus:ring-[var(--role-primary-light)]"
            />
          </label>
          <label className="text-sm font-semibold text-[#374151]">
            Status
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as 'all' | AttendanceType)}
              className="mt-2 w-full rounded-md border border-[#E8E4DC] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--role-primary)] focus:ring-2 focus:ring-[var(--role-primary-light)]"
            >
              <option value="all">All scans</option>
              <option value="time_in">Time in</option>
              <option value="time_out">Time out</option>
            </select>
          </label>
        </div>

        {attendanceQuery.isLoading ? (
          <LoadingSkeleton rows={5} />
        ) : attendanceQuery.isError ? (
          <ErrorState onRetry={() => void attendanceQuery.refetch()} message="Attendance records could not be loaded." />
        ) : (
          <DataTable
            headers={['Employee', 'Role', 'Time In', 'Time Out', 'Duration', 'Edit']}
            rows={rows.map((row) => [
              <EmployeeCell key="employee" row={row} />,
              <Badge key="role">{row.role}</Badge>,
              <TimeCell key="in" log={row.timeIn} onEdit={openEdit} />,
              <TimeCell key="out" log={row.timeOut} onEdit={openEdit} />,
              calculateDuration(row.timeIn, row.timeOut),
              <div key="edit" className="flex gap-2">
                {row.timeIn && <EditButton label="Edit time in" onClick={() => openEdit(row.timeIn as AttendanceLog)} />}
                {row.timeOut && <EditButton label="Edit time out" onClick={() => openEdit(row.timeOut as AttendanceLog)} />}
              </div>,
            ])}
            searchPlaceholder="Search employee or role"
          />
        )}
      </Panel>

      {scannerMode && <BarcodeScanner mode={scannerMode} onCancel={() => setScannerMode(null)} onScan={handleScan} />}

      {editingLog && (
        <Modal title="Edit Attendance Time" isOpen={Boolean(editingLog)} onClose={() => setEditingLog(null)}>
          <div className="space-y-4">
            <div className="rounded-md border border-[#E8E4DC] bg-[#F8F7F4] p-3 text-sm text-[#374151]">
              <p className="font-bold">{editingLog.user?.full_name}</p>
              <p className="mt-1 text-[#6B7280]">{formatAttendanceType(editingLog.type)}</p>
              {editingLog.original_time && (
                <p className="mt-2 text-xs text-[#9CA3AF]">Originally: {formatDateTime(editingLog.original_time)}</p>
              )}
            </div>
            <label className="block text-sm font-semibold text-[#374151]">
              Scanned At
              <input
                type="datetime-local"
                value={editScannedAt}
                onChange={(event) => setEditScannedAt(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#E8E4DC] px-3 py-2 text-sm outline-none focus:border-[var(--role-primary)] focus:ring-2 focus:ring-[var(--role-primary-light)]"
              />
            </label>
            <label className="block text-sm font-semibold text-[#374151]">
              Notes
              <textarea
                value={editNotes}
                onChange={(event) => setEditNotes(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-md border border-[#E8E4DC] px-3 py-2 text-sm outline-none focus:border-[var(--role-primary)] focus:ring-2 focus:ring-[var(--role-primary-light)]"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingLog(null)} className="rounded-md border border-[#E8E4DC] px-4 py-2 text-sm font-bold text-[#374151]">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={updateMutation.isPending}
                className="rounded-md bg-[var(--role-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ScanCard({
  title,
  tone,
  disabled,
  onClick,
}: {
  title: string
  tone: 'emerald' | 'rose'
  disabled?: boolean
  onClick: () => void
}) {
  const toneClass =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-rose-200 bg-rose-50 text-rose-800'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-36 items-center justify-between rounded-lg border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Scan Barcode</p>
        <h2 className="mt-2 text-2xl font-black">{title}</h2>
      </div>
      <div className="grid h-14 w-14 place-items-center rounded-lg bg-white/80">
        <MdQrCodeScanner className="h-8 w-8" />
      </div>
    </button>
  )
}

function EmployeeCell({ row }: { row: AttendanceRow }) {
  return (
    <div className="flex items-center gap-3">
      {row.avatar ? (
        <img src={row.avatar} alt="" className="h-10 w-10 rounded-lg object-cover" />
      ) : (
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--role-primary-light)] text-sm font-bold text-[var(--role-primary)]">
          {row.employee.slice(0, 1)}
        </div>
      )}
      <div>
        <p className="font-bold text-[#111827]">{row.employee}</p>
        {row.notes && <p className="mt-0.5 text-xs text-[#6B7280]">{row.notes}</p>}
      </div>
    </div>
  )
}

function TimeCell({ log, onEdit }: { log?: AttendanceLog; onEdit: (log: AttendanceLog) => void }) {
  if (!log) return <span className="text-[#9CA3AF]">-</span>

  return (
    <button onClick={() => onEdit(log)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#374151] hover:text-[var(--role-primary)]">
      <HiOutlineClock className="h-4 w-4" />
      {formatTime(log.scanned_at)}
    </button>
  )
}

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-md border border-[#E8E4DC] text-[#6B7280] hover:border-[var(--role-primary)] hover:text-[var(--role-primary)]"
      aria-label={label}
      title={label}
    >
      <FiEdit2 className="h-4 w-4" />
    </button>
  )
}

function groupAttendanceRows(logs: AttendanceLog[]): AttendanceRow[] {
  const grouped = new Map<number, AttendanceRow>()

  for (const log of logs) {
    const userId = log.user_id ?? log.userId ?? log.id
    const current = grouped.get(userId) ?? {
      key: String(userId),
      employee: log.user?.full_name ?? 'Unknown employee',
      role: log.user?.role ?? 'employee',
      avatar: log.user?.avatar_url,
      notes: log.notes,
    }

    if (log.type === 'time_in' && (!current.timeIn || new Date(log.scanned_at) < new Date(current.timeIn.scanned_at))) {
      current.timeIn = log
    }

    if (log.type === 'time_out' && (!current.timeOut || new Date(log.scanned_at) > new Date(current.timeOut.scanned_at))) {
      current.timeOut = log
    }

    if (log.notes) current.notes = log.notes
    grouped.set(userId, current)
  }

  return Array.from(grouped.values()).sort((a, b) => a.employee.localeCompare(b.employee))
}

function calculateDuration(timeIn?: AttendanceLog, timeOut?: AttendanceLog) {
  if (!timeIn || !timeOut) return '-'

  const minutes = Math.max(0, Math.round((new Date(timeOut.scanned_at).getTime() - new Date(timeIn.scanned_at).getTime()) / 60000))
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60

  return `${hours}h ${remainder}m`
}

function formatAttendanceType(type: AttendanceType) {
  return type === 'time_in' ? 'Time In' : 'Time Out'
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function toDateTimeLocal(value: string) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

function csvCell(value: string) {
  return `"${String(value).replaceAll('"', '""')}"`
}

export default AttendancePage
