/* eslint-disable react-hooks/incompatible-library */
import { isValidElement, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import FilterBar from './FilterBar'

type DataTableProps = {
  headers: string[]
  rows: ReactNode[][]
  searchPlaceholder?: string
  searchable?: boolean
}

type TableRow = {
  id: number
  cells: ReactNode[]
  searchText: string
}

function DataTable({ headers, rows, searchPlaceholder, searchable = true }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const handleSearchChange = useCallback((value: string) => {
    setGlobalFilter(value)
  }, [])

  const data = useMemo<TableRow[]>(
    () =>
      rows.map((cells, index) => ({
        id: index,
        cells,
        searchText: cells.map(normalizeCell).join(' ').toLowerCase(),
      })),
    [rows],
  )

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () =>
      headers.map((header, index) => ({
        id: `column-${index}`,
        header,
        accessorFn: (row) => normalizeCell(row.cells[index]),
        cell: ({ row }) => row.original.cells[index],
        sortingFn: 'alphanumeric',
      })),
    [headers],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const term = String(filterValue ?? '').trim().toLowerCase()
      return !term || row.original.searchText.includes(term)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const filteredRows = table.getFilteredRowModel().rows
  const visibleRows = table.getRowModel().rows
  const currentPage = table.getState().pagination.pageIndex + 1
  const pageSize = table.getState().pagination.pageSize
  const totalPages = Math.max(1, table.getPageCount())

  function resetFilters() {
    handleSearchChange('')
    table.setPageIndex(0)
  }

  const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((pageNumber) => {
    return pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1
  })

  return (
    <div className="space-y-3">
      {searchable && (
        <FilterBar
          search={globalFilter}
          onSearchChange={handleSearchChange}
          placeholder={searchPlaceholder}
          onReset={resetFilters}
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
          <h3 className="mt-4 text-lg font-semibold text-[#374151]">
            {globalFilter.trim() ? `No results for "${globalFilter.trim()}"` : 'No results found'}
          </h3>
          <p className="mt-1 text-sm text-[#6B7280]">Try adjusting your search or filters.</p>
          {globalFilter.trim() && (
            <button onClick={resetFilters} className="mt-3 text-sm font-semibold text-[#9A7A22] hover:text-[#C9A84C]">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-[#E8E4DC] bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#F3F0EB] text-[10px] uppercase tracking-widest text-[#374151]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3.5 font-semibold">
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex items-center gap-1 text-left hover:text-[#1A1A2E]"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className={header.column.getIsSorted() ? 'text-[#1A1A2E]' : 'text-gray-300'}>
                            {header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                          </span>
                        </button>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-[#F0EDE8] bg-white">
                {visibleRows.map((row) => (
                  <tr key={row.original.id} className="text-[#111827] hover:bg-[#FAF8F5]">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} records
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={pageSize}
                onChange={(event) => table.setPageSize(Number(event.target.value))}
                className="rounded-md border border-[#E8E4DC] bg-white px-2 py-1.5 font-semibold text-[#374151]"
                aria-label="Rows per page"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-md px-3 py-1.5 font-semibold text-[#374151] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              {paginationPages.map((pageNumber, index) => (
                <span key={pageNumber} className="flex items-center gap-1">
                  {index > 0 && pageNumber - paginationPages[index - 1] > 1 && <span className="px-1 text-[#9CA3AF]">...</span>}
                  <button
                    onClick={() => table.setPageIndex(pageNumber - 1)}
                    className={`rounded-md px-3 py-1.5 font-semibold ${
                      pageNumber === currentPage ? 'bg-[#1A1A2E] text-white' : 'text-[#374151] hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                </span>
              ))}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-md px-3 py-1.5 font-semibold text-[#374151] hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
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
  if (isValidElement(cell)) return normalizeCell((cell.props as { children?: ReactNode }).children)
  return ''
}

export default DataTable
