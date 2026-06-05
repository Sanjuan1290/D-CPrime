import { useMemo, useState } from 'react'
import Panel from '../../components/admin/Panel'
import { useToast } from '../../components/admin/Toast'
import {
  createMockDbAuditLog,
  getNextMockId,
  mockDbAuditLogs,
  mockDbSettings,
  mockDbUsers,
} from '../../data/adminMockData'
import type { MockDbAuditLog, MockDbSetting } from '../../data/adminMockData'

const selectOptionsByKey: Record<string, Array<{ label: string; value: string }>> = {
  reservation_expiry_policy: [
    { label: 'Calendar days', value: 'calendar_days' },
    { label: 'Business days', value: 'business_days' },
  ],
}

function timestamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function SettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<MockDbSetting[]>(mockDbSettings)
  const [, setAuditLogs] = useState<MockDbAuditLog[]>(mockDbAuditLogs)
  const [drafts, setDrafts] = useState<Record<number, string>>(() =>
    Object.fromEntries(mockDbSettings.map((setting) => [setting.id, setting.setting_value])),
  )

  const groups = useMemo(() => {
    return Array.from(new Set(settings.map((setting) => setting.module_group))).map((moduleGroup) => ({
      moduleGroup,
      rows: settings.filter((setting) => setting.module_group === moduleGroup),
    }))
  }, [settings])

  function updateDraft(settingId: number, value: string) {
    setDrafts((current) => ({ ...current, [settingId]: value }))
  }

  function saveGroup(moduleGroup: string) {
    const now = timestamp()
    setSettings((current) =>
      current.map((setting) =>
        setting.module_group === moduleGroup
          ? { ...setting, setting_value: drafts[setting.id] ?? setting.setting_value, updated_by: 1, updated_at: now }
          : setting,
      ),
    )
    setAuditLogs((current) => [
      createMockDbAuditLog('Settings saved', 'Settings', `${moduleGroup} settings updated.`, getNextMockId(current)),
      ...current,
    ])
    toast.success('Settings saved')
  }

  function renderField(setting: MockDbSetting) {
    const value = drafts[setting.id] ?? setting.setting_value
    if (setting.input_type === 'boolean') {
      return (
        <button
          type="button"
          onClick={() => updateDraft(setting.id, value === 'true' ? 'false' : 'true')}
          className={`h-7 w-12 rounded-full p-1 transition ${value === 'true' ? 'bg-[#1A1A2E]' : 'bg-[#D1D5DB]'}`}
          aria-label={setting.display_label}
        >
          <span className={`block h-5 w-5 rounded-full bg-white transition ${value === 'true' ? 'translate-x-5' : ''}`} />
        </button>
      )
    }

    if (setting.input_type === 'select') {
      return (
        <select
          value={value}
          onChange={(event) => updateDraft(setting.id, event.target.value)}
          className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#C9A84C]"
        >
          {(selectOptionsByKey[setting.setting_key] ?? []).map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={setting.input_type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(event) => updateDraft(setting.id, event.target.value)}
        className="w-full rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#C9A84C]"
      />
    )
  }

  function updatedByName(rows: MockDbSetting[]) {
    const lastUpdated = [...rows].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    return mockDbUsers.find((user) => user.id === lastUpdated?.updated_by)?.full_name ?? 'System'
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {groups.map(({ moduleGroup, rows }) => {
        const lastUpdated = [...rows].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
        return (
          <Panel
            key={moduleGroup}
            title={moduleGroup}
            subtitle={`Updated ${lastUpdated?.updated_at ?? 'never'} by ${updatedByName(rows)}`}
            actions={
              <button onClick={() => saveGroup(moduleGroup)} className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-bold text-white hover:bg-[#2A2A4E]">
                Save
              </button>
            }
          >
            <div className="space-y-3">
              {rows.map((setting) => (
                <div key={setting.id} className="grid gap-2 rounded-lg border border-[#E8E4DC] bg-[#F8F7F4] p-3 md:grid-cols-[220px_1fr] md:items-center">
                  <div>
                    <p className="text-sm font-semibold text-[#374151]">{setting.display_label}</p>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">{setting.setting_key}</p>
                  </div>
                  {renderField(setting)}
                </div>
              ))}
            </div>
          </Panel>
        )
      })}
    </div>
  )
}

export default SettingsPage
