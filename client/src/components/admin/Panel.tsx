import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

function Panel({ title, subtitle, children }: PanelProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#111111] p-5 shadow-sm shadow-black/20">
      <div className="mb-5 flex flex-col gap-1 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-zinc-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

export default Panel
