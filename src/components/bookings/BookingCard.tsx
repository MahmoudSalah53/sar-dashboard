import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getBookingId, getSummaryFields } from '../../lib/booking-fields'
import type { BookingRecord } from '../../types/bookings'
import { Badge } from '../ui/badge'

type BookingCardProps = {
  booking: BookingRecord
}

function getSourceTone(value: string) {
  const lowered = value.toLowerCase()
  if (lowered.includes('whatsapp')) return 'success' as const
  if (lowered.includes('web')) return 'default' as const
  if (lowered.includes('phone') || lowered.includes('call')) return 'warning' as const
  return 'neutral' as const
}

export function BookingCard({ booking }: BookingCardProps) {
  const fields = getSummaryFields(booking)
  const title = fields[0]?.value ?? getBookingId(booking)
  const sourceField = fields.find((field) => field.label === 'Source')
  const remainingFields = fields.slice(1).filter((field) => field.label !== 'Source')

  return (
    <Link
      to={`/bookings/${getBookingId(booking)}`}
      className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--color-primary)]/40 hover:shadow-[var(--shadow-md)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            Booking
          </p>
          <h3 className="text-base font-semibold leading-tight text-[var(--color-text-primary)]">
            {title}
          </h3>
        </div>
        {sourceField?.value && sourceField.value !== 'Not provided' ? (
          <Badge tone={getSourceTone(sourceField.value)}>{sourceField.value}</Badge>
        ) : null}
      </div>

      <dl className="mt-4 space-y-2.5 border-t border-[var(--color-border)]/60 pt-4">
        {remainingFields.map((field) => (
          <div key={field.key} className="flex items-start justify-between gap-4 text-sm">
            <dt className="text-[var(--color-text-muted)]">{field.label}</dt>
            <dd className="max-w-[60%] text-right font-medium text-[var(--color-text-primary)]">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center justify-end text-xs font-medium text-[var(--color-primary)] opacity-80 transition-opacity group-hover:opacity-100">
        View details
        <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
