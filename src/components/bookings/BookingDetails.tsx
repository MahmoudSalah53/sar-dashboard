import { CalendarClock, CircleDollarSign, Contact, MessageCircleMore, Route, UsersRound } from 'lucide-react'

import type { BookingRecord } from '../../types/bookings'
import { formatBookingValue, getFieldValue } from '../../lib/booking-fields'

type BookingDetailsProps = {
  booking: BookingRecord
}

type StatPillProps = {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

function StatPill({ label, value, icon: Icon }: StatPillProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3.5 shadow-[var(--shadow-sm)]">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--color-text-primary)]">{value}</p>
    </div>
  )
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function asRecordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return []
  return value.filter((item) => asRecord(item) !== null) as Record<string, unknown>[]
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''))
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function formatStructuredDetail(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Not provided'
  if (typeof value !== 'object' || Array.isArray(value)) return formatBookingValue(value as never)

  const record = value as Record<string, unknown>
  const name = typeof record.name === 'string' ? record.name : undefined
  const pricePerPassenger = toNumber(record.price_per_passenger)
  const priceAdjustment = toNumber(record.price_adjustment)

  if (name && pricePerPassenger > 0) {
    return name
  }

  if (name && priceAdjustment !== 0) {
    return name
  }

  if (name) return name

  const compact = Object.entries(record)
    .map(([key, raw]) => `${key}: ${formatBookingValue(raw as never)}`)
    .join(' | ')

  return compact || 'Not provided'
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const dateValue = formatBookingValue(getFieldValue(booking, 'date'))
  const whatsappValue = formatBookingValue(getFieldValue(booking, 'whatsapp'))
  const totalPrice = toNumber(getFieldValue(booking, 'total_price') ?? getFieldValue(booking, 'price'))

  const trips = asRecordArray(getFieldValue(booking, 'trip'))
  const passengers = asRecordArray(getFieldValue(booking, 'passengers'))
  const contact = asRecord(getFieldValue(booking, 'contact'))
  const extras = asRecord(getFieldValue(booking, 'extras'))
  const payment = asRecord(getFieldValue(booking, 'payment'))

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
        <div className="mb-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
              Booking Details
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Structured summary without duplicated payload data
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <StatPill label="Date" value={dateValue} icon={CalendarClock} />
          <StatPill label="Total Price" value={`${totalPrice.toLocaleString()} SAR`} icon={CircleDollarSign} />
          <StatPill label="Passengers" value={String(passengers.length)} icon={UsersRound} />
          <StatPill label="Trips" value={String(trips.length)} icon={Route} />
          <StatPill label="WhatsApp" value={whatsappValue} icon={MessageCircleMore} />
        </div>
      </section>

      {trips.length > 0 ? (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
          <div className="mb-4 border-b border-[var(--color-border)] pb-3">
            <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
              Trip Segments
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              From/To, departure, arrival and segment price
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Trip ID</th>
                  <th className="px-3 py-2 text-left font-semibold">Route</th>
                  <th className="px-3 py-2 text-left font-semibold">Time</th>
                  <th className="px-3 py-2 text-left font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={String(trip.id ?? `${trip.from}-${trip.to}-${trip.dep}`)} className="border-t border-[var(--color-border)]">
                    <td className="px-3 py-2">{formatBookingValue(trip.id as never)}</td>
                    <td className="px-3 py-2">
                      {formatBookingValue(trip.from as never)} {'->'} {formatBookingValue(trip.to as never)}
                    </td>
                    <td className="px-3 py-2">
                      {formatBookingValue(trip.dep as never)} - {formatBookingValue(trip.arr as never)}
                    </td>
                    <td className="px-3 py-2">{toNumber(trip.price).toLocaleString()} SAR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {passengers.length > 0 ? (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-md)]">
          <div className="mb-4 border-b border-[var(--color-border)] pb-3">
            <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
              Passengers
            </h3>
          </div>

          <div className="space-y-2">
            {passengers.map((passenger, index) => (
              <div
                key={`${String(passenger.id_number ?? index)}`}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2"
              >
                <span className="font-medium text-[var(--color-text-primary)]">
                  {formatBookingValue(passenger.name as never)}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  ID: {formatBookingValue(passenger.id_number as never)}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoCard
          title="Contact"
          icon={<Contact className="h-4 w-4" />}
          fields={[
            { label: 'Email', value: formatBookingValue(contact?.email as never) },
            { label: 'Phone', value: formatBookingValue(contact?.phone as never) },
          ]}
        />
        <InfoCard
          title="Extras"
          icon={<Route className="h-4 w-4" />}
          fields={[
            { label: 'Meal', value: formatStructuredDetail(extras?.meal) },
            { label: 'Seat Class', value: formatStructuredDetail(extras?.seat_class) },
          ]}
        />
        <InfoCard
          title="Payment"
          icon={<CircleDollarSign className="h-4 w-4" />}
          fields={[
            { label: 'Holder', value: formatBookingValue(payment?.holder as never) },
            { label: 'Card', value: formatBookingValue(payment?.masked_card as never) },
          ]}
        />
      </section>
    </div>
  )
}

type InfoCardProps = {
  title: string
  icon: React.ReactNode
  fields: Array<{ label: string; value: string }>
}

function InfoCard({ title, icon, fields }: InfoCardProps) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
      <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
        {icon}
        {title}
      </h4>
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">{field.label}</span>
            <span className="text-right font-medium text-[var(--color-text-primary)]">{field.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
