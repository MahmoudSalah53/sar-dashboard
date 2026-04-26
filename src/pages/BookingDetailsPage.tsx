import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { AppShell } from '../components/AppShell'
import { BookingDetails } from '../components/bookings/BookingDetails'
import { ErrorState } from '../components/bookings/StateViews'
import { Skeleton } from '../components/ui/skeleton'
import { getFieldValue, formatBookingValue } from '../lib/booking-fields'
import { useBooking } from '../hooks/useBookings'

function DetailsSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <Skeleton className="h-5 w-48" />
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  )
}

export function BookingDetailsPage() {
  const { bookingId } = useParams()
  const { data: booking, error, isError, isLoading } = useBooking(bookingId)
  const title = booking
    ? formatBookingValue(getFieldValue(booking, 'name') ?? booking.id)
    : 'Booking details'
  const reference = booking ? String(booking.id) : ''

  return (
    <AppShell>
      <div className="space-y-5">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to bookings
        </Link>

        <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Booking details
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Dedicated profile view for this booking.
              </p>
            </div>
            {reference ? (
              <span className="self-start rounded-full bg-[var(--color-primary-soft)] px-3 py-1 font-mono text-xs font-semibold text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20">
                #{reference}
              </span>
            ) : null}
          </div>
        </header>

        {isLoading ? <DetailsSkeleton /> : null}

        {isError ? (
          <ErrorState message={error instanceof Error ? error.message : undefined} />
        ) : null}

        {!isLoading && !isError && booking ? <BookingDetails booking={booking} /> : null}
      </div>
    </AppShell>
  )
}
