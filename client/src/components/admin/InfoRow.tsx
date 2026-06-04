import type { ReactNode } from 'react'

type InfoRowProps = {
  label: string
  value: ReactNode
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-[#6B7280]">{label}</span>
      <span className="text-right font-semibold text-[#111827] tabular-nums">{value}</span>
    </div>
  )
}

export default InfoRow
