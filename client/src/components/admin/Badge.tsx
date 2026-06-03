type BadgeProps = {
  children: string
}

const styles: Record<string, string> = {
  ACTIVE: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  Active: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  Approved: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  COMPLETE: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  'COMPLETE PAID': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  Available: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  Sold: 'border-red-400/30 bg-red-400/10 text-red-300',
  Rejected: 'border-red-400/30 bg-red-400/10 text-red-300',
  Hold: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  Reserved: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
  Pending: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
  INSTALLMENT: 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
  CASH: 'border-zinc-400/30 bg-zinc-400/10 text-zinc-300',
  INC: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
  INACTIVE: 'border-zinc-400/30 bg-zinc-400/10 text-zinc-400',
  Inactive: 'border-zinc-400/30 bg-zinc-400/10 text-zinc-400',
  'PARTIALLY PAID': 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
}

function Badge({ children }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${styles[children] ?? styles.Active}`}>
      {children}
    </span>
  )
}

export default Badge
