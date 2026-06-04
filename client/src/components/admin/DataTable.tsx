import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type DataTableProps = {
  headers: string[]
  rows: ReactNode[][]
}

function DataTable({ headers, rows }: DataTableProps) {
  const [sortIndex, setSortIndex] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const pageSize = Number(localStorage.getItem('dcprime_page_size') ?? 20)
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  const sortedRows = useMemo(() => {
    if (sortIndex === null) return rows

    return [...rows].sort((a, b) => {
      const aValue = normalizeCell(a[sortIndex])
      const bValue = normalizeCell(b[sortIndex])
      const result = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
      return sortDirection === 'asc' ? result : -result
    })
  }, [rows, sortDirection, sortIndex])

  const visibleRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleSort(index: number) {
    setPage(1)
    if (sortIndex === index) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortIndex(index)
    setSortDirection('asc')
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-[#111111] p-8 text-center text-sm text-zinc-400">
        No records found.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-black text-zinc-300">
            <tr>
              {headers.map((header, index) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  <button onClick={() => handleSort(index)} className="flex items-center gap-1 text-left hover:text-[#C9A84C]">
                    {header}
                    {sortIndex === index && <span className="text-[#C9A84C]">{sortDirection === 'asc' ? 'Asc' : 'Desc'}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-[#111111]">
            {visibleRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-zinc-200 hover:bg-[#C9A84C]/10">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, rows.length)} of {rows.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-white/10 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-white/10 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function normalizeCell(cell: ReactNode) {
  if (typeof cell === 'string' || typeof cell === 'number') return String(cell)
  return ''
}

export default DataTable
