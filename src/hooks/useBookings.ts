import { useQuery } from '@tanstack/react-query'

import { getBookingById, getBookings } from '../services/bookings'

export const bookingKeys = {
  all: ['bookings'] as const,
  detail: (bookingId: string) => ['bookings', bookingId] as const,
}

export function useBookings() {
  return useQuery({
    queryKey: bookingKeys.all,
    queryFn: getBookings,
  })
}

export function useBooking(bookingId: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId ?? ''),
    queryFn: () => getBookingById(bookingId ?? ''),
    enabled: Boolean(bookingId),
  })
}
