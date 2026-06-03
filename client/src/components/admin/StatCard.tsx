type StatCardProps = {
  label: string
  value: string
  note: string
}

function StatCard({ label, value, note }: StatCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#111111] p-5 shadow-sm shadow-black/20">
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      <strong className="mt-3 block text-3xl font-bold text-white">{value}</strong>
      <p className="mt-2 text-sm text-zinc-500">{note}</p>
    </article>
  )
}

export default StatCard
