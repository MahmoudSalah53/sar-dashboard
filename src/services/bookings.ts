import axios from 'axios'

import type { BookingRecord } from '../types/bookings'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 10_000,
})

function isoDaysAgo(daysAgo: number, hour = 10, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const mockBookings: BookingRecord[] = [
  {
    id: 'bk-1001',
    name: 'Aisha Rahman',
    service: 'Airport Transfer',
    source: 'web',
    date: isoDaysAgo(6, 10, 30),
    status: 'confirmed',
    price: 180,
    customer: {
      email: 'aisha@example.com',
      phone: '+971 55 123 4567',
    },
  },
  {
    id: 'bk-1002',
    customerName: 'Omar Khaled',
    serviceName: 'City Tour',
    channel: 'whatsapp',
    scheduledAt: isoDaysAgo(6, 15, 0),
    guests: 4,
    price: 320,
    notes: 'Prefers Arabic-speaking guide',
  },
  {
    id: 'bk-1003',
    guestName: 'Sophia Martins',
    bookingService: 'Hotel Pickup',
    origin: 'web',
    bookingDate: isoDaysAgo(5, 11, 0),
    paymentStatus: 'pending',
    price: 120,
    addons: ['Child seat', 'Meet and greet'],
  },
  {
    id: 'bk-1004',
    fullName: 'Hassan Ali',
    type: 'VIP Chauffeur',
    platform: 'whatsapp',
    createdAt: isoDaysAgo(5, 18, 15),
    price: 540,
    vehicle: {
      class: 'Executive sedan',
      passengers: 2,
    },
    internalReference: 'SAR-VIP-4421',
  },
  {
    id: 'bk-1005',
    name: 'Lina Nasser',
    service: 'Desert Safari',
    source: 'web',
    date: isoDaysAgo(4, 9, 45),
    status: 'confirmed',
    price: 260,
  },
  {
    id: 'bk-1006',
    customerName: 'Mahmoud Samir',
    serviceName: 'Airport Transfer',
    channel: 'whatsapp',
    scheduledAt: isoDaysAgo(4, 14, 30),
    guests: 2,
    status: 'confirmed',
    price: 170,
  },
  {
    id: 'bk-1007',
    fullName: 'Samer Youssef',
    type: 'City Tour',
    platform: 'whatsapp',
    createdAt: isoDaysAgo(3, 12, 0),
    paymentStatus: 'pending',
    price: 210,
  },
  {
    id: 'bk-1008',
    guestName: 'Noor Adel',
    bookingService: 'Hotel Pickup',
    origin: 'web',
    bookingDate: isoDaysAgo(3, 17, 20),
    status: 'confirmed',
    price: 95,
  },
  {
    id: 'bk-1009',
    name: 'Adam Kareem',
    service: 'VIP Chauffeur',
    source: 'whatsapp',
    date: isoDaysAgo(2, 8, 40),
    status: 'confirmed',
    price: 610,
  },
  {
    id: 'bk-1010',
    customerName: 'Maya Tarek',
    serviceName: 'Desert Safari',
    channel: 'web',
    scheduledAt: isoDaysAgo(2, 16, 10),
    guests: 5,
    status: 'confirmed',
    price: 340,
  },
  {
    id: 'bk-1011',
    fullName: 'Karim Hossam',
    type: 'Airport Transfer',
    platform: 'web',
    createdAt: isoDaysAgo(1, 11, 55),
    status: 'completed',
    price: 150,
  },
  {
    id: 'bk-1012',
    guestName: 'Huda Rashid',
    bookingService: 'City Tour',
    origin: 'whatsapp',
    bookingDate: isoDaysAgo(0, 13, 35),
    paymentStatus: 'paid',
    price: 280,
    addons: ['Photo stop package'],
  },
]

function delay(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

export async function getBookings(): Promise<BookingRecord[]> {
  if (import.meta.env.VITE_USE_REAL_API === 'true') {
    const response = await api.get<BookingRecord[]>('/bookings')
    return response.data
  }

  await delay(450)
  return mockBookings
}

export async function getBookingById(bookingId: string): Promise<BookingRecord> {
  if (import.meta.env.VITE_USE_REAL_API === 'true') {
    const response = await api.get<BookingRecord>(`/bookings/${bookingId}`)
    return response.data
  }

  await delay(250)

  const booking = mockBookings.find((item) => item.id === bookingId)

  if (!booking) {
    throw new Error('Booking not found')
  }

  return booking
}
