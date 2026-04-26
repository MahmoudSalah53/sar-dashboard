import { AlertTriangle, Inbox } from 'lucide-react'

import { Skeleton } from '../ui/skeleton'

export function BookingListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:block">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function EmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-8 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]">
        <Inbox className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">
        No bookings found
      </h2>
      <p className="mt-1.5 max-w-md text-sm text-[var(--color-text-secondary)]">
        New bookings will appear here as soon as they are available from the data source.
      </p>
    </div>
  )
}

type ErrorStateProps = {
  message?: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-[var(--color-danger)]/20 bg-[var(--color-danger-soft)] p-4 text-[var(--color-danger)]"
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-danger)]/10">
        <AlertTriangle className="h-4 w-4" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold">Unable to load bookings</p>
        <p className="text-sm opacity-90">
          {message ?? 'Please try again or check the API connection.'}
        </p>
      </div>
    </div>
  )
}
