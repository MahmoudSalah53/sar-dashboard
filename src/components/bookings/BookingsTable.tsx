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
  getBookingId,
  getFieldValue,
} from '../../lib/booking-fields'
import type { BookingRecord, BookingValue } from '../../types/bookings'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

type BookingsTableProps = { bookings: BookingRecord[] }

function getChannelLabel(value: BookingValue) {
  const raw = String(value ?? '').toLowerCase()
  if (raw.includes('whatsapp')) return 'WhatsApp'
  if (raw.includes('web')) return 'Website'
  return 'Other'
}

function getChannelTone(label: string) {
  if (label === 'WhatsApp') return 'success' as const
  if (label === 'Website') return 'default' as const
  return 'neutral' as const
}

function formatRoute(from: BookingValue, to: BookingValue) {
  const fromValue = formatBookingValue(from)
  const toValue = formatBookingValue(to)
  return `${fromValue} -> ${toValue}`
}

function formatTimeRange(dep: BookingValue, arr: BookingValue) {
  const depValue = typeof dep === 'string' && dep.trim() ? dep : formatBookingValue(dep)
  const arrValue = typeof arr === 'string' && arr.trim() ? arr : formatBookingValue(arr)
  return `${depValue} - ${arrValue}`
}

function formatSarPrice(value: BookingValue) {
  if (typeof value === 'number') return `${new Intl.NumberFormat().format(value)} SAR`
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''))
    if (Number.isFinite(parsed)) return `${new Intl.NumberFormat().format(parsed)} SAR`
  }
  return formatBookingValue(value)
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const columns: ColumnDef<BookingRecord>[] = [
    {
      id: 'index',
      header: '#',
      cell: ({ row }: CellContext<BookingRecord, unknown>) => (
        <span className="block text-center font-medium text-[var(--color-text-secondary)]">
          {row.index + 1}
        </span>
      ),
    },
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }: CellContext<BookingRecord, unknown>) => (
        <span className="block line-clamp-1 text-center font-medium text-[var(--color-text-primary)]">
          {formatBookingValue(getFieldValue(row.original, 'name'))}
        </span>
      ),
    },
    {
      id: 'date',
      header: 'Route',
      cell: ({ row }: CellContext<BookingRecord, unknown>) => {
        const from = getFieldValue(row.original, 'from')
        const to = getFieldValue(row.original, 'to')
        return (
          <span className="block line-clamp-1 text-center text-[var(--color-text-primary)]">
            {formatRoute(from, to)}
          </span>
        )
      },
    },
    {
      id: 'time',
      header: 'Time (24h)',
      cell: ({ row }: CellContext<BookingRecord, unknown>) => {
        const dep = getFieldValue(row.original, 'dep')
        const arr = getFieldValue(row.original, 'arr')
        return (
        <span className="block line-clamp-1 text-center text-[var(--color-text-primary)]">
            {formatTimeRange(dep, arr)}
        </span>
        )
      },
    },
    {
      id: 'channel',
      header: 'Channel',
      cell: ({ row }: CellContext<BookingRecord, unknown>) => {
        const label = getChannelLabel(getFieldValue(row.original, 'source'))
        return (
          <span className="flex justify-center">
            <Badge tone={getChannelTone(label)}>{label}</Badge>
          </span>
        )
      },
    },
    {
      id: 'price',
      header: 'Price',
      cell: ({ row }: CellContext<BookingRecord, unknown>) => (
        <span className="block line-clamp-1 text-center text-[var(--color-text-primary)]">
          {formatSarPrice(getFieldValue(row.original, 'price'))}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-center">
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
                <TableHead key={header.id} className="text-center">
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
                <TableCell key={cell.id} className="text-center">
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
