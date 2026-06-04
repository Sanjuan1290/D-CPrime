type BadgeProps = {
  children: string
}

const styles: Record<string, string> = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Verified: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Released: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  COMPLETE: 'border-blue-200 bg-blue-50 text-blue-800',
  Complete: 'border-blue-200 bg-blue-50 text-blue-800',
  'COMPLETE PAID': 'border-blue-200 bg-blue-50 text-blue-800',
  Available: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Sold: 'border-blue-200 bg-blue-50 text-blue-800',
  Rejected: 'border-red-200 bg-red-50 text-red-800',
  Hold: 'border-gray-300 bg-gray-100 text-gray-700',
  Reserved: 'border-amber-200 bg-amber-50 text-amber-800',
  Pending: 'border-amber-200 bg-amber-50 text-amber-800',
  New: 'border-blue-200 bg-blue-50 text-blue-800',
  Closed: 'border-gray-300 bg-gray-100 text-gray-700',
  Submitted: 'border-amber-200 bg-amber-50 text-amber-800',
  'Pending Verification': 'border-amber-200 bg-amber-50 text-amber-800',
  'Not Submitted': 'border-gray-300 bg-gray-100 text-gray-700',
  INSTALLMENT: 'border-violet-200 bg-violet-50 text-violet-800',
  Installment: 'border-violet-200 bg-violet-50 text-violet-800',
  CASH: 'border-teal-200 bg-teal-50 text-teal-800',
  Cash: 'border-teal-200 bg-teal-50 text-teal-800',
  INC: 'border-orange-200 bg-orange-50 text-orange-800',
  Incomplete: 'border-orange-200 bg-orange-50 text-orange-800',
  INACTIVE: 'border-gray-300 bg-gray-100 text-gray-600',
  Inactive: 'border-gray-300 bg-gray-100 text-gray-600',
  Suspended: 'border-red-200 bg-red-50 text-red-800',
  'On Leave': 'border-amber-200 bg-amber-50 text-amber-800',
  'No Account': 'border-gray-300 bg-gray-100 text-gray-700',
  'Has Access': 'border-blue-200 bg-blue-50 text-blue-800',
  'PARTIALLY PAID': 'border-amber-200 bg-amber-50 text-amber-800',
  'FOR REVIEW': 'border-orange-200 bg-orange-50 text-orange-800',
  'GOOD SALE': 'border-emerald-200 bg-emerald-50 text-emerald-800',
}

function Badge({ children }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[children] ?? styles.Active}`}>
      {children}
    </span>
  )
}

export default Badge
