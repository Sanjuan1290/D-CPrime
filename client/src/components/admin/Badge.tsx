type BadgeProps = {
  children: string
}

const styles: Record<string, string> = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Released: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  COMPLETE: 'border-blue-200 bg-blue-50 text-blue-700',
  'COMPLETE PAID': 'border-blue-200 bg-blue-50 text-blue-700',
  Available: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Sold: 'border-blue-200 bg-blue-50 text-blue-700',
  Rejected: 'border-red-200 bg-red-50 text-red-700',
  Hold: 'border-gray-200 bg-gray-100 text-gray-600',
  Reserved: 'border-amber-200 bg-amber-50 text-amber-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  New: 'border-blue-200 bg-blue-50 text-blue-700',
  Closed: 'border-gray-200 bg-gray-100 text-gray-600',
  Submitted: 'border-amber-200 bg-amber-50 text-amber-700',
  'Pending Verification': 'border-amber-200 bg-amber-50 text-amber-700',
  'Not Submitted': 'border-gray-200 bg-gray-100 text-gray-600',
  INSTALLMENT: 'border-amber-200 bg-amber-50 text-amber-700',
  CASH: 'border-gray-200 bg-gray-100 text-gray-600',
  INC: 'border-orange-200 bg-orange-50 text-orange-700',
  INACTIVE: 'border-gray-200 bg-gray-100 text-gray-500',
  Inactive: 'border-gray-200 bg-gray-100 text-gray-500',
  'PARTIALLY PAID': 'border-amber-200 bg-amber-50 text-amber-700',
  'FOR REVIEW': 'border-orange-200 bg-orange-50 text-orange-700',
  'GOOD SALE': 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

function Badge({ children }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[children] ?? styles.Active}`}>
      {children}
    </span>
  )
}

export default Badge
