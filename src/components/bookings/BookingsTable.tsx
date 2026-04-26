import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type CellContext,
  type ColumnDef,
} from '@tanstack/react-table'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  formatBookingValue,
  formatLabel,
  getBookingId,
  getDynamicColumnKeys,
  getFieldValue,
} from '../../lib/booking-fields'
import type { BookingRecord } from '../../types/bookings'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

type BookingsTableProps = {
  bookings: BookingRecord[]
}

function isSourceKey(key: string) {
  return /source|channel|origin|platform/i.test(key)
}

function getSourceTone(value: string) {
  const lowered = value.toLowerCase()
  if (lowered.includes('whatsapp')) return 'success' as const
  if (lowered.includes('web')) return 'default' as const
  if (lowered.includes('phone') || lowered.includes('call')) return 'warning' as const
  return 'neutral' as const
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const canonicalKeys = new Set(['name', 'service', 'source', 'date', 'status', 'price'])

  const canonicalColumns: ColumnDef<BookingRecord>[] = Array.from(canonicalKeys).map((key) => ({
    id: key,
    header: formatLabel(key),
    cell: ({ row }: CellContext<BookingRecord, unknown>) => {
      const raw = getFieldValue(row.original, key)
      const formatted = formatBookingValue(raw)

      if (isSourceKey(key) && typeof raw === 'string' && raw.trim()) {
        return <Badge tone={getSourceTone(raw)}>{formatted}</Badge>
      }

      return (
        <span className="line-clamp-1 text-[var(--color-text-primary)]">{formatted}</span>
      )
    },
  }))

  const extraColumns: ColumnDef<BookingRecord>[] = getDynamicColumnKeys(bookings)
    .filter((key) => !canonicalKeys.has(key))
    .map((key) => ({
      accessorKey: key,
      header: formatLabel(key),
      cell: ({ row }: CellContext<BookingRecord, unknown>) => (
        <span className="line-clamp-1 text-[var(--color-text-primary)]">
          {formatBookingValue(row.original[key])}
        </span>
      ),
    }))

  const columns: ColumnDef<BookingRecord>[] = [
    ...canonicalColumns,
    ...extraColumns,
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button asChild size="sm" variant="ghost" className="text-xs">
            <Link to={`/bookings/${getBookingId(row.original)}`}>
              View
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] md:block">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
