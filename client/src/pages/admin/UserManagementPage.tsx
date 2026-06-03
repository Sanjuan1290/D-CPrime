import { useState } from 'react'
import Badge from '../../components/admin/Badge'
import Field from '../../components/admin/Field'
import Panel from '../../components/admin/Panel'
import { featureKeys, featureLabels, rolePresets, users as initialUsers } from '../../data/adminMockData'
import type { AdminUser, Role, UserStatus } from '../../data/adminMockData'

function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [selectedId, setSelectedId] = useState(initialUsers[1].id)
  const selectedUser = users.find((user) => user.id === selectedId) ?? users[0]

  function updateSelected(updates: Partial<AdminUser>) {
    setUsers((current) => current.map((user) => (user.id === selectedUser.id ? { ...user, ...updates } : user)))
  }

  function applyPreset(role: Exclude<Role, 'admin'>) {
    updateSelected({ role, permissions: { ...rolePresets[role] } })
  }

  function addUser() {
    const nextId = Math.max(...users.map((user) => user.id)) + 1
    const user: AdminUser = {
      id: nextId,
      fullName: 'NEW ACCREDITED SELLER',
      email: `seller${nextId}@dcprime.test`,
      password: 'Auto123!',
      role: 'agent',
      assignedProjects: ['Gen. Emilio Aguinaldo, Cavite'],
      status: 'Active',
      permissions: { ...rolePresets.agent },
    }
    setUsers((current) => [...current, user])
    setSelectedId(nextId)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.45fr]">
      <Panel title="Users" subtitle="Admin can create, edit, and deactivate">
        <button onClick={addUser} className="mb-4 rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950">
          Add User
        </button>
        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedId(user.id)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                selectedId === user.id ? 'border-amber-400 bg-amber-50' : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{user.fullName}</p>
                  <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
                </div>
                <Badge>{user.status}</Badge>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{user.role}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Profile And Feature Permissions" subtitle="Per-user JSON toggle set">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name" value={selectedUser.fullName} onChange={(value) => updateSelected({ fullName: value })} />
          <Field label="Email" value={selectedUser.email} onChange={(value) => updateSelected({ email: value })} />
          <Field label="Password" value={selectedUser.password} onChange={(value) => updateSelected({ password: value })} />
          <label className="block text-sm font-semibold text-zinc-700">
            Role
            <select
              value={selectedUser.role}
              onChange={(event) => updateSelected({ role: event.target.value as Role })}
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-3"
            >
              <option value="admin">admin</option>
              <option value="agent">agent</option>
              <option value="treasury">treasury</option>
              <option value="client">client</option>
            </select>
          </label>
          <Field
            label="Assigned Project(s)"
            value={selectedUser.assignedProjects.join(', ')}
            onChange={(value) =>
              updateSelected({ assignedProjects: value.split(',').map((project) => project.trim()).filter(Boolean) })
            }
          />
          <label className="block text-sm font-semibold text-zinc-700">
            Status
            <select
              value={selectedUser.status}
              onChange={(event) => updateSelected({ status: event.target.value as UserStatus })}
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-3"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => applyPreset('agent')} className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold">Apply Agent Defaults</button>
          <button onClick={() => applyPreset('treasury')} className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold">Apply Treasury Defaults</button>
          <button onClick={() => applyPreset('client')} className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold">Apply Client Defaults</button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featureKeys.map((key) => (
            <label key={key} className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
              <span className="text-sm font-semibold text-zinc-700">{featureLabels[key]}</span>
              <input
                type="checkbox"
                checked={selectedUser.permissions[key]}
                onChange={(event) =>
                  updateSelected({ permissions: { ...selectedUser.permissions, [key]: event.target.checked } })
                }
                className="h-5 w-5 accent-amber-500"
              />
            </label>
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default UserManagementPage
