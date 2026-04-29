import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

import { AppShell } from '../components/AppShell'
import { BookingsCards } from '../components/bookings/BookingsCards'
import { BookingsTable } from '../components/bookings/BookingsTable'
import { BookingListSkeleton, EmptyState, ErrorState } from '../components/bookings/StateViews'
import { Button } from '../components/ui/button'
import { useBookings } from '../hooks/useBookings'

const AnalyticsOverview = lazy(() =>
  import('../components/bookings/AnalyticsOverview').then((module) => ({
    default: module.AnalyticsOverview,
  })),
)

function getVisiblePages(current: number, total: number) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5]
  }

  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total]
  }

  return [current - 2, current - 1, current, current + 1, current + 2]
}

export function BookingsPage() {
  const PAGE_SIZE = 8
  const { data: bookings = [], dataUpdatedAt, error, isError, isFetching, isLoading, refetch } =
    useBookings()
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedBookings = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return bookings.slice(startIndex, startIndex + PAGE_SIZE)
  }, [bookings, safeCurrentPage])

  const visiblePages = getVisiblePages(safeCurrentPage, totalPages)

  const updatedAt =
    dataUpdatedAt > 0
      ? new Date(dataUpdatedAt).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '--:--'

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            {/* <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-sm)]">
              <Activity className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              Live workspace
            </span> */}
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Bookings overview
            </h1>
            {/* <p className="max-w-2xl text-sm text-[var(--color-text-secondary)]">
              Track performance across channels and dive into individual bookings — all rendered
              flexibly from a changing API.
            </p> */}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[var(--color-text-muted)] sm:inline">
              Updated {updatedAt}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing' : 'Refresh'}
            </Button>
          </div>
        </header>

        {!isLoading && !isError && bookings.length > 0 ? (
          <Suspense fallback={<BookingListSkeleton />}>
            <AnalyticsOverview bookings={bookings} />
          </Suspense>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                Recent bookings
              </h2>
              {/* <p className="text-xs text-[var(--color-text-muted)]">
                Click any row to inspect the full booking data
              </p> */}
            </div>
            {/* {bookings.length > 0 ? (
              <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]">
                {startItem}-{endItem} of {bookings.length}
              </span>
            ) : null} */}
          </div>

          {isLoading ? <BookingListSkeleton /> : null}

          {isError ? (
            <ErrorState message={error instanceof Error ? error.message : undefined} />
          ) : null}

          {!isLoading && !isError && bookings.length === 0 ? <EmptyState /> : null}

          {!isLoading && !isError && bookings.length > 0 ? (
            <>
              <BookingsTable bookings={paginatedBookings} />
              <BookingsCards bookings={paginatedBookings} />

              <div
                aria-label="Pagination"
                className="overflow-x-auto rounded-xl p-2"
              >
                <div className="flex min-w-max items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))
                      }
                      disabled={safeCurrentPage === 1}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-45"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {visiblePages[0] > 1 ? (
                      <>
                        <PageButton
                          page={1}
                          isActive={safeCurrentPage === 1}
                          onSelect={setCurrentPage}
                        />
                        {visiblePages[0] > 2 ? (
                          <span className="px-1 text-xs text-[var(--color-text-muted)]">...</span>
                        ) : null}
                      </>
                    ) : null}

                    {visiblePages.map((page) => (
                      <PageButton
                        key={page}
                        page={page}
                        isActive={safeCurrentPage === page}
                        onSelect={setCurrentPage}
                      />
                    ))}

                    {visiblePages[visiblePages.length - 1] < totalPages ? (
                      <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 ? (
                          <span className="px-1 text-xs text-[var(--color-text-muted)]">...</span>
                        ) : null}
                        <PageButton
                          page={totalPages}
                          isActive={safeCurrentPage === totalPages}
                          onSelect={setCurrentPage}
                        />
                      </>
                    ) : null}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, Math.min(page, totalPages) + 1))
                      }
                      disabled={safeCurrentPage === totalPages}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-45"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </AppShell>
  )
}

type PageButtonProps = {
  page: number
  isActive: boolean
  onSelect: (page: number) => void
}

function PageButton({ page, isActive, onSelect }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(page)}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-colors ${
        isActive
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </button>
  )
}
