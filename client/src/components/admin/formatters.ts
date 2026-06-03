export function formatCurrency(value: number) {
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatPercent(value: number) {
  return `${(value * 100).toLocaleString('en-PH', {
    maximumFractionDigits: 2,
  })}%`
}
