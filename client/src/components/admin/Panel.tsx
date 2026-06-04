import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

function Panel({ title, subtitle, actions, children }: PanelProps) {
  return (
    <section className="rounded-xl border border-[#E8E4DC] bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 border-b border-[#F0EDE8] pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-serif text-2xl text-[#1A1A2E]">{title}</h2>
          {subtitle && <p className="mt-1 text-sm font-medium text-[#6B7280]">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {children}
    </section>
  )
}

export default Panel
