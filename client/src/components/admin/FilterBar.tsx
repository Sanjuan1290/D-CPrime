import { useEffect, useState } from 'react'
import { Search, X } from './Icons'

type FilterTab = {
  label: string
  value: string
  count?: number
}

type FilterBarProps = {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  tabs?: FilterTab[]
  activeTab?: string
  onTabChange?: (value: string) => void
  onReset?: () => void
}

function FilterBar({
  search,
  onSearchChange,
  placeholder = 'Search by name, unit ID, reference...',
  tabs = [],
  activeTab,
  onTabChange,
  onReset,
}: FilterBarProps) {
  const [draft, setDraft] = useState(search)

  useEffect(() => {
    const timer = window.setTimeout(() => onSearchChange(draft), 300)
    return () => window.clearTimeout(timer)
  }, [draft, onSearchChange])

  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-[#E8E4DC] bg-white py-2.5 pl-10 pr-10 text-sm text-[#111827] outline-none transition focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20"
        />
        {draft && (
          <button
            onClick={() => setDraft('')}
            className="absolute right-2 top-1/2 rounded-lg p-1.5 text-[#6B7280] hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabs.length > 0 && (
          <div className="inline-flex flex-wrap gap-1">
            {tabs.map((tab) => {
              const isActive = tab.value === activeTab
              return (
                <button
                  key={tab.value}
                  onClick={() => onTabChange?.(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    isActive ? 'bg-[#1A1A2E] font-semibold text-white' : 'border border-transparent text-[#6B7280] hover:bg-[#1A1A2E]/5'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && <span className="ml-1 opacity-75">({tab.count})</span>}
                </button>
              )
            })}
          </div>
        )}
        <button
          onClick={() => {
            setDraft('')
            onReset?.()
          }}
          className="rounded-lg border border-[#1A1A2E]/20 px-3 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-[#1A1A2E]/5"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default FilterBar
