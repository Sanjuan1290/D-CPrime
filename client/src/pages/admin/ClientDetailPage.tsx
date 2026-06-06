import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useClientUnits, useCreateClientUnit, useUpdateClientUnit, useUsers } from '../../hooks/useAdminResources'
import type { ClientUnitPayload, ClientUnitRecord } from '../../hooks/useAdminResources'
import { useBalances } from '../../hooks/useBalances'
import { useClients, useCreateClient, useUpdateClient } from '../../hooks/useClients'
import type { ClientPayload, ClientRecord } from '../../hooks/useClients'
import { useListings } from '../../hooks/useListings'
import { useProjects } from '../../hooks/useProjects'

type ClientDetailPageProps = {
  mode?: 'new' | 'edit'
}

type UnitEditorState = ClientUnitRecord | 'new' | null

const accountStatuses = ['active', 'cancelled', 'closed']
const paymentStatuses = ['unpaid', 'partially_paid', 'complete_paid']
const salesStatuses = ['good_sale', 'bad_sale', 'cancelled']

function ClientDetailPage({ mode }: ClientDetailPageProps) {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const clientsQuery = useClients()
  const listingsQuery = useListings()
  const projectsQuery = useProjects()
  const usersQuery = useUsers()
  const balancesQuery = useBalances()
  const clientUnitsQuery = useClientUnits(clientId && mode !== 'new' ? { client_id: Number(clientId) } : undefined)
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const createClientUnit = useCreateClientUnit()
  const updateClientUnit = useUpdateClientUnit()
  const [unitEditor, setUnitEditor] = useState<UnitEditorState>(null)

  const client = mode === 'new' ? null : clientsQuery.data?.data.find((item) => item.id === Number(clientId))
  const clientUnits = clientUnitsQuery.data?.data ?? []
  const listings = listingsQuery.data?.data ?? []
  const projects = projectsQuery.data?.data ?? []
  const users = usersQuery.data?.data ?? []
  const listingById = useMemo(() => new Map(listings.map((listing) => [listing.id, listing])), [listings])
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects])
  const userById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])
  const balanceByClientUnit = useMemo(() => new Map((balancesQuery.data?.data ?? []).map((balance) => [balance.client_unit_id, balance])), [balancesQuery.data?.data])

  async function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: ClientPayload = {
      buyer_name: String(formData.get('buyer_name')).trim(),
      spouse_co_owner_name: clean(formData.get('spouse_co_owner_name')),
      aif_administrator_name: clean(formData.get('aif_administrator_name')),
      email: clean(formData.get('email')),
      contact_no: clean(formData.get('contact_no')),
      age: Number(formData.get('age')) || null,
      address: clean(formData.get('address')),
    }

    if (!payload.buyer_name) {
      toast.error('Client name is required.')
      return
    }

    try {
      if (mode === 'new') {
        const created = await createClient.mutateAsync(payload)
        toast.success('Client created.')
        navigate(`/admin/clients/${created.id}`)
      } else if (client) {
        await updateClient.mutateAsync({ id: client.id, ...payload })
        toast.success('Client saved.')
      }
    } catch {
      toast.error('Client could not be saved.')
    }
  }

  async function saveClientUnit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!client) return
    const formData = new FormData(event.currentTarget)
    const listing = listings.find((item) => item.id === Number(formData.get('listing_id')))
    const payload: ClientUnitPayload = {
      client_id: client.id,
      listing_id: Number(formData.get('listing_id')),
      reservation_id: numberOrNull(formData.get('reservation_id')),
      assigned_agent_id: numberOrNull(formData.get('assigned_agent_id')),
      assigned_manager_id: numberOrNull(formData.get('assigned_manager_id')),
      reservation_date: clean(formData.get('reservation_date')),
      contract_date: clean(formData.get('contract_date')),
      mode_of_payment: String(formData.get('mode_of_payment')) as ClientUnitPayload['mode_of_payment'],
      contract_price: numberOrNull(formData.get('contract_price')) ?? Number(listing?.net_selling_price || 0),
      legal_misc_fee: numberOrNull(formData.get('legal_misc_fee')) ?? Number(listing?.legal_misc_fee || 0),
      total_contract_price: numberOrNull(formData.get('total_contract_price')) ?? Number(listing?.total_contract_price || 0),
      payment_terms_months: numberOrNull(formData.get('payment_terms_months')),
      monthly_amortization: numberOrNull(formData.get('monthly_amortization')),
      due_day: numberOrNull(formData.get('due_day')),
      document_status: String(formData.get('document_status')) as ClientUnitPayload['document_status'],
      account_status: String(formData.get('account_status')) as ClientUnitPayload['account_status'],
      payment_status: String(formData.get('payment_status')) as ClientUnitPayload['payment_status'],
      sales_status: String(formData.get('sales_status')) as ClientUnitPayload['sales_status'],
      remarks: clean(formData.get('remarks')),
    }

    if (!payload.listing_id || !payload.mode_of_payment) {
      toast.error('Listing and mode of payment are required.')
      return
    }

    try {
      if (unitEditor === 'new') {
        await createClientUnit.mutateAsync(payload)
      } else if (unitEditor) {
        await updateClientUnit.mutateAsync({ id: unitEditor.id, ...payload })
      }
      toast.success('Client account saved.')
      setUnitEditor(null)
      await clientUnitsQuery.refetch()
      await balancesQuery.refetch()
    } catch {
      toast.error('Client account could not be saved.')
    }
  }

  const isLoading =
    clientsQuery.isLoading || listingsQuery.isLoading || projectsQuery.isLoading || usersQuery.isLoading || balancesQuery.isLoading || (mode !== 'new' && clientUnitsQuery.isLoading)
  const isError =
    clientsQuery.isError || listingsQuery.isError || projectsQuery.isError || usersQuery.isError || balancesQuery.isError || (mode !== 'new' && clientUnitsQuery.isError)

  if (isLoading) return <LoadingSkeleton rows={8} />
  if (isError) return <ErrorState message="Client profile could not be loaded from MySQL." onRetry={() => window.location.reload()} />
  if (mode !== 'new' && !client) return <ErrorState message="Client was not found in MySQL." onRetry={() => navigate('/admin/clients')} />

  const formClient = client ?? null

  return (
    <div className="space-y-6">
      <Panel title={mode === 'new' ? 'New Client' : client?.buyer_name ?? 'Client'} subtitle="Editable client record stored in MySQL">
        <form onSubmit={saveClient} className="grid gap-4 md:grid-cols-2">
          <ClientFields client={formClient} />
          <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
            <button type="button" onClick={() => navigate('/admin/clients')} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
              Back
            </button>
            <button disabled={createClient.isPending || updateClient.isPending} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
              {createClient.isPending || updateClient.isPending ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </Panel>

      {client && (
        <Panel
          title="Client Accounts"
          subtitle="Editable unit purchases and account status"
          actions={<button onClick={() => setUnitEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white">Add Account</button>}
        >
          <DataTable
            headers={['Unit', 'Project', 'Agent', 'Mode', 'TCP', 'Paid', 'Balance', 'Account', 'Actions']}
            rows={clientUnits.map((unit) => {
              const listing = listingById.get(unit.listing_id)
              const balance = balanceByClientUnit.get(unit.id)
              return [
                listing?.unit_id ?? `Listing #${unit.listing_id}`,
                listing ? projectById.get(listing.project_id)?.name ?? '-' : '-',
                unit.assigned_agent_id ? userById.get(unit.assigned_agent_id)?.full_name ?? `User #${unit.assigned_agent_id}` : '-',
                titleCase(unit.mode_of_payment),
                formatCurrency(Number(unit.total_contract_price || 0)),
                formatCurrency(Number(balance?.total_paid || 0)),
                formatCurrency(Number(balance?.balance || 0)),
                <Badge key={`${unit.id}-status`}>{titleCase(unit.account_status)}</Badge>,
                <div key={`${unit.id}-actions`} className="flex flex-wrap gap-2">
                  <Link to={`/admin/payments/soa/${unit.id}`} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#374151]">
                    SOA
                  </Link>
                  <button onClick={() => setUnitEditor(unit)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E]">
                    Edit
                  </button>
                </div>,
              ]
            })}
          />
        </Panel>
      )}

      <ClientUnitModal
        editor={unitEditor}
        listings={listings}
        projects={projects}
        users={users}
        isSaving={createClientUnit.isPending || updateClientUnit.isPending}
        onClose={() => setUnitEditor(null)}
        onSubmit={saveClientUnit}
      />
    </div>
  )
}

function ClientFields({ client }: { client: ClientRecord | null }) {
  return (
    <>
      <FormField label="Client Name" name="buyer_name" defaultValue={client?.buyer_name ?? ''} required />
      <FormField label="Spouse / Co-owner" name="spouse_co_owner_name" defaultValue={client?.spouse_co_owner_name ?? ''} />
      <FormField label="AIF / Administrator" name="aif_administrator_name" defaultValue={client?.aif_administrator_name ?? ''} />
      <FormField label="Email" name="email" type="email" defaultValue={client?.email ?? ''} />
      <FormField label="Contact No." name="contact_no" defaultValue={client?.contact_no ?? ''} />
      <FormField label="Age" name="age" type="number" defaultValue={client?.age ? String(client.age) : ''} />
      <FormField label="Address" name="address" defaultValue={client?.address ?? ''} textarea />
    </>
  )
}

function ClientUnitModal({
  editor,
  listings,
  projects,
  users,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: UnitEditorState
  listings: Array<{ id: number; project_id: number; unit_id: string; total_contract_price?: number | null }>
  projects: Array<{ id: number; name: string }>
  users: Array<{ id: number; full_name: string; role: string }>
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const unit = editor === 'new' ? null : editor
  const projectById = new Map(projects.map((project) => [project.id, project.name]))
  const sellerOptions = [{ label: 'Unassigned', value: '' }, ...users.filter((user) => ['agent', 'broker', 'manager'].includes(user.role)).map((user) => ({ label: `${user.full_name} (${titleCase(user.role)})`, value: String(user.id) }))]

  return (
    <Modal title={editor === 'new' ? 'Add Client Account' : 'Edit Client Account'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Listing"
          name="listing_id"
          defaultValue={unit?.listing_id ? String(unit.listing_id) : String(listings[0]?.id ?? '')}
          selectOptions={listings.map((listing) => ({ label: `${listing.unit_id} | ${projectById.get(listing.project_id) ?? 'Project'}`, value: String(listing.id) }))}
          required
        />
        <FormField label="Mode Of Payment" name="mode_of_payment" defaultValue={unit?.mode_of_payment ?? 'installment'} selectOptions={['cash', 'installment'].map((item) => ({ label: titleCase(item), value: item }))} />
        <FormField label="Assigned Agent" name="assigned_agent_id" defaultValue={unit?.assigned_agent_id ? String(unit.assigned_agent_id) : ''} selectOptions={sellerOptions} />
        <FormField label="Assigned Manager" name="assigned_manager_id" defaultValue={unit?.assigned_manager_id ? String(unit.assigned_manager_id) : ''} selectOptions={sellerOptions} />
        <FormField label="Reservation ID" name="reservation_id" type="number" defaultValue={unit?.reservation_id ? String(unit.reservation_id) : ''} />
        <FormField label="Reservation Date" name="reservation_date" type="date" defaultValue={normalizeDate(unit?.reservation_date)} />
        <FormField label="Contract Date" name="contract_date" type="date" defaultValue={normalizeDate(unit?.contract_date)} />
        <FormField label="Contract Price" name="contract_price" type="number" defaultValue={String(unit?.contract_price ?? 0)} />
        <FormField label="Legal / Misc Fee" name="legal_misc_fee" type="number" defaultValue={String(unit?.legal_misc_fee ?? 0)} />
        <FormField label="Total Contract Price" name="total_contract_price" type="number" defaultValue={String(unit?.total_contract_price ?? 0)} />
        <FormField label="Payment Terms Months" name="payment_terms_months" type="number" defaultValue={unit?.payment_terms_months ? String(unit.payment_terms_months) : ''} />
        <FormField label="Monthly Amortization" name="monthly_amortization" type="number" defaultValue={unit?.monthly_amortization ? String(unit.monthly_amortization) : ''} />
        <FormField label="Due Day" name="due_day" type="number" defaultValue={unit?.due_day ? String(unit.due_day) : ''} />
        <FormField label="Document Status" name="document_status" defaultValue={unit?.document_status ?? 'incomplete'} selectOptions={['complete', 'incomplete'].map((item) => ({ label: titleCase(item), value: item }))} />
        <FormField label="Account Status" name="account_status" defaultValue={unit?.account_status ?? 'active'} selectOptions={accountStatuses.map((item) => ({ label: titleCase(item), value: item }))} />
        <FormField label="Payment Status" name="payment_status" defaultValue={unit?.payment_status ?? 'unpaid'} selectOptions={paymentStatuses.map((item) => ({ label: titleCase(item), value: item }))} />
        <FormField label="Sales Status" name="sales_status" defaultValue={unit?.sales_status ?? 'good_sale'} selectOptions={salesStatuses.map((item) => ({ label: titleCase(item), value: item }))} />
        <FormField label="Remarks" name="remarks" defaultValue={unit?.remarks ?? ''} textarea />
        <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151]">
            Cancel
          </button>
          <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Account'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function titleCase(value?: string | null) {
  return String(value ?? '-').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function normalizeDate(value?: string | null) {
  return value ? value.slice(0, 10) : ''
}

function clean(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

function numberOrNull(value: FormDataEntryValue | null) {
  const number = Number(value)
  return Number.isFinite(number) && String(value ?? '').trim() ? number : null
}

export default ClientDetailPage
