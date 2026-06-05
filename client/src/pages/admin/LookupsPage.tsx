import { useState } from 'react'
import type { FormEvent } from 'react'
import Badge from '../../components/admin/Badge'
import DataTable from '../../components/admin/DataTable'
import FormField from '../../components/admin/FormField'
import Modal from '../../components/admin/Modal'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import {
  mockDbClientStatuses,
  mockDbCommissionTypes,
  mockDbListingStatuses,
  mockDbLotTypes,
  mockDbPaymentMethods,
  mockDbPaymentModes,
  mockDbPaymentTypes,
  mockDbUserRoles,
} from '../../data/adminMockData'
import type { MockDbActiveStatus } from '../../data/adminMockData'

type LookupKey =
  | 'lot_types'
  | 'payment_methods'
  | 'payment_types'
  | 'payment_modes'
  | 'commission_types'
  | 'user_roles'
  | 'client_statuses'
  | 'listing_statuses'

type LookupRecord = {
  id: number
  name: string
  display_name: string
  status: MockDbActiveStatus
  sort_order: number
  color_hex?: string
  description?: string | null
}

type EditingState = {
  mode: 'add' | 'edit'
  record: LookupRecord
}

const lookupMeta: Array<{ key: LookupKey; label: string; hasColor?: boolean }> = [
  { key: 'lot_types', label: 'Lot Types' },
  { key: 'payment_methods', label: 'Payment Methods' },
  { key: 'payment_types', label: 'Payment Types' },
  { key: 'payment_modes', label: 'Payment Modes' },
  { key: 'commission_types', label: 'Commission Types' },
  { key: 'user_roles', label: 'User Roles' },
  { key: 'client_statuses', label: 'Client Statuses', hasColor: true },
  { key: 'listing_statuses', label: 'Listing Statuses', hasColor: true },
]

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}

function LookupsPage() {
  const toast = useToast()
  const [activeKey, setActiveKey] = useState<LookupKey>('lot_types')
  const [tables, setTables] = useState<Record<LookupKey, LookupRecord[]>>({
    lot_types: mockDbLotTypes,
    payment_methods: mockDbPaymentMethods,
    payment_types: mockDbPaymentTypes,
    payment_modes: mockDbPaymentModes,
    commission_types: mockDbCommissionTypes,
    user_roles: mockDbUserRoles,
    client_statuses: mockDbClientStatuses,
    listing_statuses: mockDbListingStatuses,
  })
  const [editing, setEditing] = useState<EditingState | null>(null)
  const activeMeta = lookupMeta.find((item) => item.key === activeKey) ?? lookupMeta[0]
  const activeRows = [...tables[activeKey]].sort((a, b) => a.sort_order - b.sort_order)

  function openAdd() {
    const rows = tables[activeKey]
    setEditing({
      mode: 'add',
      record: {
        id: Math.max(0, ...rows.map((row) => row.id)) + 1,
        display_name: '',
        name: '',
        status: 'active',
        sort_order: rows.length + 1,
        color_hex: activeMeta.hasColor ? '#2563EB' : undefined,
        description: activeKey === 'user_roles' ? '' : undefined,
      },
    })
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing) return
    const formData = new FormData(event.currentTarget)
    const row: LookupRecord = {
      ...editing.record,
      display_name: String(formData.get('display_name')),
      name: slugify(String(formData.get('name')) || String(formData.get('display_name'))),
      color_hex: activeMeta.hasColor ? String(formData.get('color_hex') || '#2563EB') : undefined,
      sort_order: Number(formData.get('sort_order')),
    }

    setTables((current) => ({
      ...current,
      [activeKey]: editing.mode === 'add'
        ? [...current[activeKey], row]
        : current[activeKey].map((item) => (item.id === row.id ? row : item)),
    }))
    setEditing(null)
    toast.success('Lookup saved.')
  }

  function toggleStatus(row: LookupRecord) {
    setTables((current) => ({
      ...current,
      [activeKey]: current[activeKey].map((item) =>
        item.id === row.id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item,
      ),
    }))
    toast.success('Lookup status updated.')
  }

  function move(row: LookupRecord, direction: -1 | 1) {
    const rows = activeRows
    const index = rows.findIndex((item) => item.id === row.id)
    const target = rows[index + direction]
    if (!target) return
    setTables((current) => ({
      ...current,
      [activeKey]: current[activeKey].map((item) => {
        if (item.id === row.id) return { ...item, sort_order: target.sort_order }
        if (item.id === target.id) return { ...item, sort_order: row.sort_order }
        return item
      }),
    }))
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl border border-[#E8E4DC] bg-white p-3 shadow-sm">
        <div className="space-y-1">
          {lookupMeta.map((item) => {
            const activeCount = tables[item.key].filter((row) => row.status === 'active').length
            return (
              <button
                key={item.key}
                onClick={() => setActiveKey(item.key)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                  activeKey === item.key ? 'bg-[#1A1A2E] text-white' : 'text-[#374151] hover:bg-[#F8F7F4]'
                }`}
              >
                <span>{item.label}</span>
                {activeCount === 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">0 active</span>}
              </button>
            )
          })}
        </div>
      </aside>

      <Panel
        title={activeMeta.label}
        subtitle="Manage dropdown options without hard deletes"
        actions={
          <button onClick={openAdd} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
            Add
          </button>
        }
      >
        {activeRows.filter((row) => row.status === 'active').length === 0 && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            This lookup has no active entries.
          </div>
        )}

        <DataTable
          searchable={false}
          headers={['', 'Display Name', 'Slug', 'Color', 'Sort Order', 'Status', 'Actions']}
          rows={activeRows.map((row) => [
            <div key={`${row.id}-move`} className="flex items-center gap-1 text-[#9CA3AF]">
              <span className="font-mono text-xs">::</span>
              <button onClick={() => move(row, -1)} className="rounded border border-[#E8E4DC] px-2 py-1 text-xs text-[#374151] hover:bg-[#F8F7F4]">Up</button>
              <button onClick={() => move(row, 1)} className="rounded border border-[#E8E4DC] px-2 py-1 text-xs text-[#374151] hover:bg-[#F8F7F4]">Down</button>
            </div>,
            row.display_name,
            row.name,
            activeMeta.hasColor ? <span key={`${row.id}-color`} className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: row.color_hex }} />{row.color_hex}</span> : '-',
            row.sort_order,
            <Badge key={`${row.id}-status`}>{row.status === 'active' ? 'Active' : 'Inactive'}</Badge>,
            <div key={`${row.id}-actions`} className="flex gap-2">
              <button onClick={() => setEditing({ mode: 'edit', record: row })} className="rounded-md border border-[#1A1A2E]/20 px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5">
                Edit
              </button>
              <button onClick={() => toggleStatus(row)} className="rounded-md border border-[#E8E4DC] px-3 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F8F7F4]">
                Toggle
              </button>
            </div>,
          ])}
        />
      </Panel>

      <Modal title={editing?.mode === 'add' ? `Add ${activeMeta.label}` : `Edit ${activeMeta.label}`} isOpen={editing !== null} onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Display Name"
              name="display_name"
              value={editing.record.display_name}
              onChange={(event) => {
                const displayName = event.target.value
                setEditing((current) =>
                  current
                    ? {
                        ...current,
                        record: {
                          ...current.record,
                          display_name: displayName,
                          name: current.mode === 'add' ? slugify(displayName) : current.record.name,
                        },
                      }
                    : current,
                )
              }}
              required
            />
            <FormField label="Slug" name="name" value={editing.record.name} onChange={(event) => setEditing((current) => current ? { ...current, record: { ...current.record, name: event.target.value } } : current)} required />
            {activeMeta.hasColor && (
              <FormField label="Color Hex" name="color_hex" value={editing.record.color_hex ?? '#2563EB'} onChange={(event) => setEditing((current) => current ? { ...current, record: { ...current.record, color_hex: event.target.value } } : current)} />
            )}
            <FormField label="Sort Order" name="sort_order" type="number" value={String(editing.record.sort_order)} onChange={(event) => setEditing((current) => current ? { ...current, record: { ...current.record, sort_order: Number(event.target.value) } } : current)} required />
            <div className="flex justify-end gap-2 border-t border-[#E8E4DC] pt-4 md:col-span-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
                Cancel
              </button>
              <button className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
                Save Lookup
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default LookupsPage
