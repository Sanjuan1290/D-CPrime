import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: string
  note: string
  icon?: ReactNode
}

function StatCard({ label, value, note, icon }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[#E8E4DC] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-[#6B7280]">{label}</p>
        {icon && <div className="rounded-lg bg-[#C9A84C]/15 p-2 text-[#1A1A2E]">{icon}</div>}
      </div>
      <strong className="mt-3 block font-serif text-3xl text-[#1A1A2E] tabular-nums">{value}</strong>
      <p className="mt-2 text-sm text-[#6B7280]">{note}</p>
    </article>
  )
}

export default StatCard
