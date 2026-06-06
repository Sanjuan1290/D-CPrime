import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import StatCard from '../../components/admin/StatCard'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency, formatDate } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useCreateReservation, useReservations, useUpdateReservation, useUsers } from '../../hooks/useAdminResources'
import type { ReservationPayload, ReservationRecord } from '../../hooks/useAdminResources'
import { useClients } from '../../hooks/useClients'
import { useListings } from '../../hooks/useListings'
import { useProjects } from '../../hooks/useProjects'

type EditorState = ReservationRecord | 'new' | null

const reservationStatuses = ['pending', 'confirmed', 'converted', 'cancelled', 'expired']

function ReservationsPage() {
  const toast = useToast()
  const reservationsQuery = useReservations()
  const clientsQuery = useClients()
  const listingsQuery = useListings()
  const projectsQuery = useProjects()
  const usersQuery = useUsers()
  const createReservation = useCreateReservation()
  const updateReservation = useUpdateReservation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editor, setEditor] = useState<EditorState>(null)

  const reservations = reservationsQuery.data?.data ?? []
  const clients = clientsQuery.data?.data ?? []
  const listings = listingsQuery.data?.data ?? []
  const projects = projectsQuery.data?.data ?? []
  const users = usersQuery.data?.data ?? []
  const clientById = useMemo(() => new Map(clients.map((client) => [client.id, client])), [clients])
  const listingById = useMemo(() => new Map(listings.map((listing) => [listing.id, listing])), [listings])
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects])
  const userById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])

  const visibleReservations = useMemo(() => {
    const term = search.trim().toLowerCase()
    return reservations.filter((reservation) => {
      if (statusFilter !== 'all' && reservation.status !== statusFilter) return false
      if (!term) return true
      const client = clientById.get(reservation.client_id)
      const listing = listingById.get(reservation.listing_id)
      const project = listing ? projectById.get(listing.project_id) : null
      return `${client?.buyer_name ?? ''} ${listing?.unit_id ?? ''} ${project?.name ?? ''}`.toLowerCase().includes(term)
    })
  }, [clientById, listingById, projectById, reservations, search, statusFilter])

  const totals = useMemo(() => {
    const active = reservations.filter((reservation) => ['pending', 'confirmed'].includes(reservation.status)).length
    const converted = reservations.filter((reservation) => reservation.status === 'converted').length
    const fees = reservations.reduce((total, reservation) => total + Number(reservation.reservation_fee || 0), 0)
    return { active, converted, fees }
  }, [reservations])

  async function saveReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: ReservationPayload = {
      client_id: Number(formData.get('client_id')),
      listing_id: Number(formData.get('listing_id')),
      reserved_by: Number(formData.get('reserved_by')),
      reservation_fee: Number(formData.get('reservation_fee')) || 0,
      reservation_date: normalizeDateTime(clean(formData.get('reservation_date'))) ?? new Date().toISOString().slice(0, 19).replace('T', ' '),
      expires_at: normalizeDateTime(clean(formData.get('expires_at'))),
      status: String(formData.get('status')) as ReservationRecord['status'],
      remarks: clean(formData.get('remarks')),
    }

    if (!payload.client_id || !payload.listing_id || !payload.reserved_by) {
      toast.error('Client, listing, and reserved-by user are required.')
      return
    }

    try {
      if (editor === 'new') {
        await createReservation.mutateAsync(payload)
      } else if (editor) {
        await updateReservation.mutateAsync({ id: editor.id, ...payload })
      }
      toast.success('Reservation saved.')
      setEditor(null)
    } catch {
      toast.error('Reservation could not be saved.')
    }
  }

  const isLoading = reservationsQuery.isLoading || clientsQuery.isLoading || listingsQuery.isLoading || projectsQuery.isLoading || usersQuery.isLoading
  const isError = reservationsQuery.isError || clientsQuery.isError || listingsQuery.isError || projectsQuery.isError || usersQuery.isError

  if (isLoading) return <LoadingSkeleton rows={8} />
  if (isError) return <ErrorState message="Reservations could not be loaded from MySQL." onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active Reservations" value={totals.active.toString()} note="Pending and confirmed" />
        <StatCard label="Converted" value={totals.converted.toString()} note="Moved into client accounts" />
        <StatCard label="Reservation Fees" value={formatCurrency(totals.fees)} note="Recorded reservation amount" />
      </div>

      <Panel
        title="Reservations"
        subtitle="Editable reservation workflow records stored in MySQL"
        actions={<button onClick={() => setEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Reservation</button>}
      >
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search client, unit, or project..."
          tabs={[{ label: 'All', value: 'all', count: reservations.length }, ...reservationStatuses.map((status) => ({ label: titleCase(status), value: status, count: reservations.filter((reservation) => reservation.status === status).length }))]}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          onReset={() => {
            setSearch('')
            setStatusFilter('all')
          }}
        />

        <DataTable
          searchable={false}
          headers={['Client', 'Unit', 'Project', 'Reserved By', 'Date', 'Fee', 'Status', 'Actions']}
          rows={visibleReservations.map((reservation) => {
            const listing = listingById.get(reservation.listing_id)
            return [
              clientById.get(reservation.client_id)?.buyer_name ?? `Client #${reservation.client_id}`,
              listing?.unit_id ?? `Listing #${reservation.listing_id}`,
              listing ? projectById.get(listing.project_id)?.name ?? '-' : '-',
              userById.get(reservation.reserved_by)?.full_name ?? `User #${reservation.reserved_by}`,
              reservation.reservation_date ? formatDate(reservation.reservation_date) : '-',
              formatCurrency(Number(reservation.reservation_fee || 0)),
              <Badge key={`${reservation.id}-status`}>{titleCase(reservation.status)}</Badge>,
              <button key={reservation.id} onClick={() => setEditor(reservation)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
                Edit
              </button>,
            ]
          })}
        />
      </Panel>

      <ReservationModal
        editor={editor}
        clients={clients}
        listings={listings}
        projects={projects}
        users={users}
        isSaving={createReservation.isPending || updateReservation.isPending}
        onClose={() => setEditor(null)}
        onSubmit={saveReservation}
      />
    </div>
  )
}

function ReservationModal({
  editor,
  clients,
  listings,
  projects,
  users,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: EditorState
  clients: Array<{ id: number; buyer_name: string }>
  listings: Array<{ id: number; project_id: number; unit_id: string }>
  projects: Array<{ id: number; name: string }>
  users: Array<{ id: number; full_name: string; role: string }>
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const reservation = editor === 'new' ? null : editor
  const projectById = new Map(projects.map((project) => [project.id, project.name]))
  const sellers = users.filter((user) => ['owner', 'admin', 'manager', 'broker', 'agent'].includes(user.role))

  return (
    <Modal title={editor === 'new' ? 'Add Reservation' : 'Edit Reservation'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Client" name="client_id" defaultValue={String(reservation?.client_id ?? clients[0]?.id ?? '')} selectOptions={clients.map((client) => ({ label: client.buyer_name, value: String(client.id) }))} required />
        <FormField label="Listing" name="listing_id" defaultValue={String(reservation?.listing_id ?? listings[0]?.id ?? '')} selectOptions={listings.map((listing) => ({ label: `${listing.unit_id} | ${projectById.get(listing.project_id) ?? 'Project'}`, value: String(listing.id) }))} required />
        <FormField label="Reserved By" name="reserved_by" defaultValue={String(reservation?.reserved_by ?? sellers[0]?.id ?? '')} selectOptions={sellers.map((user) => ({ label: `${user.full_name} (${titleCase(user.role)})`, value: String(user.id) }))} required />
        <FormField label="Reservation Fee" name="reservation_fee" type="number" defaultValue={String(reservation?.reservation_fee ?? 0)} />
        <FormField label="Reservation Date" name="reservation_date" type="datetime-local" defaultValue={toDateTimeLocal(reservation?.reservation_date) || new Date().toISOString().slice(0, 16)} />
        <FormField label="Expires At" name="expires_at" type="datetime-local" defaultValue={toDateTimeLocal(reservation?.expires_at)} />
        <FormField label="Status" name="status" defaultValue={reservation?.status ?? 'pending'} selectOptions={reservationStatuses.map((status) => ({ label: titleCase(status), value: status }))} />
        <FormField label="Remarks" name="remarks" defaultValue={reservation?.remarks ?? ''} textarea />
        <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
            Cancel
          </button>
          <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Reservation'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return ''
  return value.replace(' ', 'T').slice(0, 16)
}

function normalizeDateTime(value?: string | null) {
  return value ? value.replace('T', ' ') : null
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

export default ReservationsPage
