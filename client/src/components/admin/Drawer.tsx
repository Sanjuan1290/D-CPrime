import type { ReactNode } from 'react'
import { X } from './Icons'

type DrawerProps = {
  title: string
  subtitle?: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  actions?: ReactNode
}

function Drawer({ title, subtitle, isOpen, onClose, children, actions }: DrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-label="Close drawer" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-[#E8E4DC] bg-white text-[#111827] shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-[#E8E4DC] bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-[#1A1A2E]">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-[#6B7280] hover:bg-[#F8F7F4] hover:text-[#1A1A2E]" aria-label="Close">
              <X />
            </button>
          </div>
          {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  )
}

export default Drawer
