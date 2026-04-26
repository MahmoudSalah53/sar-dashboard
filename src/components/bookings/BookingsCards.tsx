import type { BookingRecord } from '../../types/bookings'
import { BookingCard } from './BookingCard'

type BookingsCardsProps = {
  bookings: BookingRecord[]
}

export function BookingsCards({ bookings }: BookingsCardsProps) {
  return (
    <div className="space-y-4 md:hidden">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}
