import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { AppShell } from '../components/AppShell'
import { BookingDetails } from '../components/bookings/BookingDetails'
import { ErrorState } from '../components/bookings/StateViews'
import { Skeleton } from '../components/ui/skeleton'
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

        {isLoading ? <DetailsSkeleton /> : null}

        {isError ? (
          <ErrorState message={error instanceof Error ? error.message : undefined} />
        ) : null}

        {!isLoading && !isError && booking ? <BookingDetails booking={booking} /> : null}
      </div>
    </AppShell>
  )
}
