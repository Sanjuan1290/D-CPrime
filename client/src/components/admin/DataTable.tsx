import { isValidElement, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import FilterBar from './FilterBar'

type DataTableProps = {
  headers: string[]
  rows: ReactNode[][]
  searchPlaceholder?: string
  searchable?: boolean
}

function DataTable({ headers, rows, searchPlaceholder, searchable = true }: DataTableProps) {
  const [sortIndex, setSortIndex] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const pageSize = Number(localStorage.getItem('dcprime_page_size') ?? 20)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const term = search.trim().toLowerCase()
    return rows.filter((row) => row.map(normalizeCell).join(' ').toLowerCase().includes(term))
  }, [rows, search])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  const sortedRows = useMemo(() => {
    if (sortIndex === null) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const aValue = normalizeCell(a[sortIndex])
      const bValue = normalizeCell(b[sortIndex])
      const result = aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
      return sortDirection === 'asc' ? result : -result
    })
  }, [filteredRows, sortDirection, sortIndex])

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

  return (
    <div className="space-y-3">
      {searchable && (
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          placeholder={searchPlaceholder}
          onReset={() => handleSearchChange('')}
        />
      )}

      {filteredRows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E8E4DC] bg-white p-10 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#F3F0EB] text-[#6B7280]">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>
          <h3 className="mt-4 font-serif text-2xl text-[#1A1A2E]">No results found</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#E8E4DC] bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#F3F0EB] text-[10px] uppercase tracking-widest text-[#6B7280]">
                <tr>
                  {headers.map((header, index) => (
                    <th key={header} className="px-4 py-3.5 font-semibold">
                      <button onClick={() => handleSort(index)} className="flex items-center gap-1 text-left hover:text-[#1A1A2E]">
                        {header}
                        {sortIndex === index && <span className="text-[#C9A84C]">{sortDirection === 'asc' ? 'Asc' : 'Desc'}</span>}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8] bg-white">
                {visibleRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="text-[#111827] hover:bg-[#FAF8F5]">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3.5 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#E8E4DC] px-3 py-1.5 font-semibold text-[#1A1A2E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#E8E4DC] px-3 py-1.5 font-semibold text-[#1A1A2E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function normalizeCell(cell: ReactNode): string {
  if (typeof cell === 'string' || typeof cell === 'number') return String(cell)
  if (Array.isArray(cell)) return cell.map(normalizeCell).join(' ')
  if (isValidElement<{ children?: ReactNode }>(cell)) return normalizeCell(cell.props.children)
  return ''
}

export default DataTable
