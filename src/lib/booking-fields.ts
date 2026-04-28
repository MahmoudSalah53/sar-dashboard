import type { BookingDisplayField, BookingRecord, BookingValue } from '../types/bookings'

const commonFieldCandidates: Record<string, string[]> = {
  name: ['name', 'customerName', 'clientName', 'guestName', 'fullName'],
  service: ['service', 'serviceName', 'bookingService', 'type'],
  source: ['source', 'channel', 'origin', 'platform'],
  date: ['date', 'bookingDate', 'scheduledAt', 'createdAt', 'startTime'],
  from: ['from', 'originCity', 'departureCity'],
  to: ['to', 'destinationCity', 'arrivalCity'],
  dep: ['dep', 'departure', 'departureTime'],
  arr: ['arr', 'arrival', 'arrivalTime'],
  destination: ['destination', 'destnation', 'dest', 'to', 'city', 'location', 'service'],
  price: ['price', 'total_price', 'amount', 'total', 'fare', 'cost'],
}

const preferredTableFields = ['name', 'service', 'source', 'date']

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[\s_-]/g, '')
}

export function getBookingId(booking: BookingRecord) {
  return String(booking.id)
}

export function formatLabel(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function formatBookingValue(value: BookingValue): string {
  if (value === null || value === undefined || value === '') {
    return 'Not provided'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'number') {
    return new Intl.NumberFormat().format(value)
  }

  if (typeof value === 'string') {
    const timestamp = Date.parse(value)
    const looksLikeDate = /\d{4}-\d{2}-\d{2}|T\d{2}:\d{2}/.test(value)

    if (looksLikeDate && Number.isFinite(timestamp)) {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: value.includes('T') ? 'short' : undefined,
      }).format(new Date(timestamp))
    }

    return value
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'None'
    }

    return value.map((item) => formatBookingValue(item)).join(', ')
  }

  return JSON.stringify(value)
}

export function findFieldKey(booking: BookingRecord, fieldName: string) {
  const candidates = commonFieldCandidates[fieldName] ?? [fieldName]
  const keys = Object.keys(booking)

  return keys.find((key) =>
    candidates.some((candidate) => normalizeKey(candidate) === normalizeKey(key)),
  )
}

export function getFieldValue(booking: BookingRecord, fieldName: string) {
  const key = findFieldKey(booking, fieldName)

  return key ? booking[key] : undefined
}

export function getSummaryFields(booking: BookingRecord): BookingDisplayField[] {
  return preferredTableFields.map((fieldName) => {
    const key = findFieldKey(booking, fieldName) ?? fieldName

    return {
      key,
      label: formatLabel(fieldName),
      value: formatBookingValue(booking[key]),
    }
  })
}

export function getDynamicColumnKeys(bookings: BookingRecord[], maxColumns = 6) {
  const discoveredKeys = new Set<string>()

  for (const fieldName of preferredTableFields) {
    const matchingKey = bookings.map((booking) => findFieldKey(booking, fieldName)).find(Boolean)

    if (matchingKey) {
      discoveredKeys.add(matchingKey)
    }
  }

  for (const booking of bookings) {
    for (const key of Object.keys(booking)) {
      const value = booking[key]
      const isDisplayable = !Array.isArray(value) && (typeof value !== 'object' || value === null)

      if (key !== 'id' && isDisplayable) {
        discoveredKeys.add(key)
      }

      if (discoveredKeys.size >= maxColumns) {
        return Array.from(discoveredKeys)
      }
    }
  }

  return Array.from(discoveredKeys)
}

export function getAllDisplayFields(booking: BookingRecord): BookingDisplayField[] {
  return Object.entries(booking).map(([key, value]) => ({
    key,
    label: formatLabel(key),
    value: formatBookingValue(value),
  }))
}
