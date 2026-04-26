import { CalendarClock, CircleDollarSign, CircleEllipsis, Globe, Layers, UserRound } from 'lucide-react'
import type { ComponentType } from 'react'

import type { BookingRecord, BookingValue } from '../../types/bookings'
import { findFieldKey, formatBookingValue, formatLabel, getFieldValue } from '../../lib/booking-fields'

type BookingDetailsProps = {
  booking: BookingRecord
}

type DetailValueProps = {
  label: string
  value: BookingValue
}

type SnapshotItemProps = {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
}

function DetailValue({ label, value }: DetailValueProps) {
  if (Array.isArray(value)) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/60 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          {label}
        </p>
        <div className="mt-3 space-y-2">
          {value.length === 0 ? (
            <span className="text-sm text-[var(--color-text-secondary)]">None</span>
          ) : (
            value.map((item, index) => (
              <DetailValue
                key={`${label}-${index}`}
                label={`Item ${index + 1}`}
                value={item}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]/60 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          {label}
        </p>
        <div className="mt-3 grid gap-2 border-l border-[var(--color-border)] pl-3">
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <DetailValue
              key={nestedKey}
              label={formatLabel(nestedKey)}
              value={nestedValue}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 sm:grid-cols-3 sm:gap-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="col-span-2 text-sm font-medium text-[var(--color-text-primary)]">
        {formatBookingValue(value)}
      </dd>
    </div>
  )
}

function SnapshotItem({ label, value, icon: Icon }: SnapshotItemProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-sm)]">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--color-text-primary)]">{value}</p>
    </div>
  )
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const nameValue = formatBookingValue(getFieldValue(booking, 'name'))
  const serviceValue = formatBookingValue(getFieldValue(booking, 'service'))
  const sourceValue = formatBookingValue(getFieldValue(booking, 'source'))
  const dateValue = formatBookingValue(getFieldValue(booking, 'date'))
  const statusValue = formatBookingValue(getFieldValue(booking, 'status'))
  const priceValue = formatBookingValue(getFieldValue(booking, 'price'))
  const summaryKeys = new Set<string>(['id'])

  ;['name', 'service', 'source', 'date', 'status', 'price'].forEach((field) => {
    const resolvedKey = findFieldKey(booking, field)
    if (resolvedKey) {
      summaryKeys.add(resolvedKey)
    }
  })

  const payloadEntries = Object.entries(booking).filter(([key]) => !summaryKeys.has(key))

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
              Booking Snapshot
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Quick overview before diving into full payload
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
            ID: {String(booking.id)}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <SnapshotItem label="Customer" value={nameValue} icon={UserRound} />
          <SnapshotItem label="Service" value={serviceValue} icon={Layers} />
          <SnapshotItem label="Source" value={sourceValue} icon={Globe} />
          <SnapshotItem label="Booking Time" value={dateValue} icon={CalendarClock} />
          <SnapshotItem label="Status" value={statusValue} icon={CircleEllipsis} />
          <SnapshotItem label="Price" value={priceValue} icon={CircleDollarSign} />
        </div>
      </section>

      {payloadEntries.length > 0 ? (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
          <div className="mb-4 border-b border-[var(--color-border)] pb-3">
            <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
              Complete Booking Payload
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Additional fields from API response
            </p>
          </div>

          <dl className="grid gap-3">
            {payloadEntries.map(([key, value]) => (
              <DetailValue key={key} label={formatLabel(key)} value={value} />
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  )
}
