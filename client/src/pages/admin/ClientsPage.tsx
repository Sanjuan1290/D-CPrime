import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import DataTable from '../../components/admin/DataTable'
import FilterBar from '../../components/admin/FilterBar'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import { formatCurrency } from '../../components/admin/formatters'
import ErrorState from '../../components/shared/ErrorState'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'
import { useBalances } from '../../hooks/useBalances'
import { useClients, useCreateClient, useUpdateClient } from '../../hooks/useClients'
import type { ClientPayload, ClientRecord } from '../../hooks/useClients'

type ClientEditorState = ClientRecord | 'new' | null

function ClientsPage() {
  const toast = useToast()
  const clientsQuery = useClients()
  const balancesQuery = useBalances()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<ClientEditorState>(null)

  const clients = clientsQuery.data?.data ?? []
  const balanceByClient = useMemo(() => {
    const map = new Map<string, { units: number; balance: number }>()

    for (const balance of balancesQuery.data?.data ?? []) {
      const current = map.get(balance.buyer_name) ?? { units: 0, balance: 0 }
      current.units += 1
      current.balance += Number(balance.balance || 0)
      map.set(balance.buyer_name, current)
    }

    return map
  }, [balancesQuery.data?.data])

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase()

    return clients
      .filter((client) => {
        if (!term) return true
        return `${client.buyer_name} ${client.email ?? ''} ${client.contact_no ?? ''} ${client.address ?? ''}`.toLowerCase().includes(term)
      })
      .sort((a, b) => a.buyer_name.localeCompare(b.buyer_name))
  }, [clients, search])

  async function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const payload: ClientPayload = {
      buyer_name: String(formData.get('buyer_name')).trim(),
      spouse_co_owner_name: cleanFormValue(formData.get('spouse_co_owner_name')),
      aif_administrator_name: cleanFormValue(formData.get('aif_administrator_name')),
      email: cleanFormValue(formData.get('email')),
      contact_no: cleanFormValue(formData.get('contact_no')),
      age: Number(formData.get('age')) || null,
      address: cleanFormValue(formData.get('address')),
    }

    if (!payload.buyer_name) {
      toast.error('Client name is required.')
      return
    }

    try {
      if (editor === 'new') {
        await createClient.mutateAsync(payload)
        toast.success('Client created.')
      } else if (editor) {
        await updateClient.mutateAsync({ id: editor.id, ...payload })
        toast.success('Client updated.')
      }
      setEditor(null)
    } catch {
      toast.error('Client could not be saved.')
    }
  }

  if (clientsQuery.isLoading || balancesQuery.isLoading) {
    return <LoadingSkeleton rows={8} />
  }

  if (clientsQuery.isError || balancesQuery.isError) {
    return (
      <ErrorState
        message="Client records could not be loaded from MySQL."
        onRetry={() => {
          void clientsQuery.refetch()
          void balancesQuery.refetch()
        }}
      />
    )
  }

  return (
    <Panel
      title="Client Master List"
      subtitle="Live client records imported from company files and editable in MySQL"
      actions={
        <button onClick={() => setEditor('new')} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
          Add Client
        </button>
      }
    >
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search client name, email, contact, or address..."
        onReset={() => setSearch('')}
      />

      <DataTable
        searchable={false}
        headers={['Client Name', 'Email', 'Contact', 'Units', 'Balance', 'Address', 'Actions']}
        rows={filteredClients.map((client) => {
          const balance = balanceByClient.get(client.buyer_name) ?? { units: 0, balance: 0 }
          return [
            <span key={`${client.id}-name`} className="font-semibold text-[#1A1A2E]">
              {client.buyer_name}
            </span>,
            client.email ?? '-',
            client.contact_no ?? '-',
            balance.units,
            formatCurrency(balance.balance),
            client.address ?? '-',
            <div key={`${client.id}-actions`} className="flex flex-wrap gap-2">
              <button onClick={() => setEditor(client)} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
                Edit
              </button>
            </div>,
          ]
        })}
      />

      <ClientModal
        editor={editor}
        isSaving={createClient.isPending || updateClient.isPending}
        onClose={() => setEditor(null)}
        onSubmit={saveClient}
      />
    </Panel>
  )
}

function ClientModal({
  editor,
  isSaving,
  onClose,
  onSubmit,
}: {
  editor: ClientEditorState
  isSaving: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const client = editor === 'new' ? null : editor

  return (
    <Modal title={editor === 'new' ? 'Add Client' : 'Edit Client'} isOpen={editor !== null} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label="Client Name" name="buyer_name" defaultValue={client?.buyer_name ?? ''} required />
        <FormField label="Spouse / Co-owner" name="spouse_co_owner_name" defaultValue={client?.spouse_co_owner_name ?? ''} />
        <FormField label="AIF / Administrator" name="aif_administrator_name" defaultValue={client?.aif_administrator_name ?? ''} />
        <FormField label="Email" name="email" type="email" defaultValue={client?.email ?? ''} />
        <FormField label="Contact No." name="contact_no" defaultValue={client?.contact_no ?? ''} />
        <FormField label="Age" name="age" type="number" defaultValue={client?.age ? String(client.age) : ''} />
        <FormField label="Address" name="address" defaultValue={client?.address ?? ''} textarea className="md:col-span-2" />
        <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
            Cancel
          </button>
          <button disabled={isSaving} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E] disabled:cursor-not-allowed disabled:opacity-60">
            {isSaving ? 'Saving...' : 'Save Client'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function cleanFormValue(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return text || null
}

export default ClientsPage
