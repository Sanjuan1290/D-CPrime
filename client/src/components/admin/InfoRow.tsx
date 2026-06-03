import type { ReactNode } from 'react'

type InfoRowProps = {
  label: string
  value: ReactNode
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-semibold text-zinc-100">{value}</span>
    </div>
  )
}

export default InfoRow
