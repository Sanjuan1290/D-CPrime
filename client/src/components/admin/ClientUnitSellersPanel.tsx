import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import Badge from './Badge'
import Panel from './Panel'
import { useToast } from './Toast'
import { getNextMockId, getUserRole, getUserRoleId } from '../../data/adminMockData'
import type { MockDbClientUnitSeller, MockDbSellerRole, MockDbUser } from '../../data/adminMockData'

type ClientUnitSellersPanelProps = {
  clientUnitId: number
  users: MockDbUser[]
  sellers: MockDbClientUnitSeller[]
  setSellers: Dispatch<SetStateAction<MockDbClientUnitSeller[]>>
  currentUserRole?: 'admin' | 'manager' | string
}

const roles: MockDbSellerRole[] = ['agent', 'broker', 'manager']

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function ClientUnitSellersPanel({
  clientUnitId,
  users,
  sellers,
  setSellers,
  currentUserRole = localStorage.getItem('dcprime_role') ?? 'admin',
}: ClientUnitSellersPanelProps) {
  const toast = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const assigned = sellers.filter((seller) => seller.client_unit_id === clientUnitId)
  const initialDraft = useMemo(
    () => Object.fromEntries(roles.map((role) => [role, String(assigned.find((seller) => seller.role === role)?.user_id ?? '')])) as Record<MockDbSellerRole, string>,
    [assigned],
  )
  const [draft, setDraft] = useState<Record<MockDbSellerRole, string>>(initialDraft)
  const canEdit = currentUserRole === 'admin' || currentUserRole === 'manager'

  function startEdit() {
    setDraft(initialDraft)
    setIsEditing(true)
  }

  function roleUsers(role: MockDbSellerRole) {
    return users.filter((user) => user.role === role && user.status === 'active')
  }

  function userName(userId: number) {
    return users.find((user) => user.id === userId)?.full_name ?? 'Unknown user'
  }

  function save() {
    setSellers((current) => {
      const withoutUnitRoles = current.filter((seller) => !(seller.client_unit_id === clientUnitId && roles.includes(seller.role)))
      let nextId = getNextMockId(current)
      const nextRows = roles
        .filter((role) => draft[role])
        .map((role) => {
          const existing = current.find((seller) => seller.client_unit_id === clientUnitId && seller.role === role)
          if (existing) return { ...existing, user_id: Number(draft[role]), assigned_at: timestamp() }
          const row: MockDbClientUnitSeller = {
            id: nextId,
            client_unit_id: clientUnitId,
            user_id: Number(draft[role]),
            role,
            assigned_at: timestamp(),
          }
          nextId += 1
          return row
        })
      return [...withoutUnitRoles, ...nextRows]
    })
    setIsEditing(false)
    toast.success('Sales team updated')
  }

  return (
    <Panel
      title="Sales Team"
      actions={
        canEdit && !isEditing ? (
          <button onClick={startEdit} className="rounded-lg border border-[#1A1A2E]/20 bg-white px-3 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-[#F8F7F4]">
            Edit
          </button>
        ) : null
      }
    >
      <div className="space-y-3">
        {roles.map((role) => {
          const seller = assigned.find((item) => item.role === role)
          const user = seller ? users.find((item) => item.id === seller.user_id) : null
          const roleLabel = getUserRole(getUserRoleId(role)).display_name

          return (
            <div key={role} className="grid gap-2 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3 md:grid-cols-[120px_1fr_160px] md:items-center">
              <div className="text-sm font-semibold text-[#374151]">{roleLabel}</div>
              {isEditing ? (
                <select
                  value={draft[role]}
                  onChange={(event) => setDraft((current) => ({ ...current, [role]: event.target.value }))}
                  className="rounded-lg border border-[#E8E4DC] bg-white px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#C9A84C]"
                >
                  <option value="">Not assigned</option>
                  {roleUsers(role).map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.full_name}
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <p className={user ? 'text-sm font-semibold text-[#111827]' : 'text-sm text-[#9CA3AF]'}>
                    {user ? userName(user.id) : '- Not assigned -'}
                  </p>
                  {seller && <p className="mt-0.5 text-xs text-[#6B7280]">Assigned {seller.assigned_at}</p>}
                </div>
              )}
              <Badge>{roleLabel}</Badge>
            </div>
          )
        })}
      </div>

      {isEditing && (
        <div className="mt-4 flex justify-end gap-2 border-t border-[#F0EDE8] pt-4">
          <button onClick={() => setIsEditing(false)} className="rounded-lg border border-[#E8E4DC] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F8F7F4]">
            Cancel
          </button>
          <button onClick={save} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
            Save
          </button>
        </div>
      )}
    </Panel>
  )
}

export default ClientUnitSellersPanel
