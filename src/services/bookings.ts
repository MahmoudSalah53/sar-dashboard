import axios from 'axios'

import type { BookingRecord } from '../types/bookings'

const configuredApiBase = import.meta.env.VITE_API_BASE_URL ?? ''
const runtimeBaseURL = import.meta.env.DEV ? '/api' : '/api'

const api = axios.create({
  baseURL: runtimeBaseURL,
  timeout: 10_000,
  headers: {
    // Bypass ngrok browser interstitial for API calls.
    'ngrok-skip-browser-warning': 'true',
  },
})

type ApiBooking = {
  booking_id?: string
  from?: string
  to?: string
  dep?: string
  arr?: string
  name?: string
  total_price?: number
  source?: string
  [key: string]: unknown
}

export async function getBookings(): Promise<BookingRecord[]> {
  if (import.meta.env.DEV && !configuredApiBase) {
    throw new Error('VITE_API_BASE_URL is required in development')
  }

  const response = await api.get<ApiBooking[]>('/bookings')
  if (!Array.isArray(response.data)) {
    throw new Error('Invalid API response for /bookings (expected array)')
  }
  return response.data.map(normalizeApiBooking)
}

export async function getBookingById(bookingId: string): Promise<BookingRecord> {
  if (import.meta.env.DEV && !configuredApiBase) {
    throw new Error('VITE_API_BASE_URL is required in development')
  }

  const response = await api.get<ApiBooking>(`/bookings/${bookingId}`)
  if (!response.data || Array.isArray(response.data) || typeof response.data !== 'object') {
    throw new Error(`Invalid API response for /bookings/${bookingId}`)
  }
  return normalizeApiBooking(response.data)
}

function normalizeApiBooking(raw: ApiBooking): BookingRecord {
  const id = typeof raw.booking_id === 'string' && raw.booking_id.trim() ? raw.booking_id : ''
  const normalized: BookingRecord = {
    id: id || crypto.randomUUID(),
    booking_id: raw.booking_id ?? id,
    name: raw.name ?? 'Not provided',
    from: raw.from ?? '',
    to: raw.to ?? '',
    dep: raw.dep ?? '',
    arr: raw.arr ?? '',
    total_price: typeof raw.total_price === 'number' ? raw.total_price : raw.total_price ? Number(raw.total_price) : undefined,
    source: 'whatsapp',
  }

  for (const [key, value] of Object.entries(raw)) {
    if (!(key in normalized)) {
      normalized[key] = value as BookingRecord[string]
    }
  }

  return normalized
}
