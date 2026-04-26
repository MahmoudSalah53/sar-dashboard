export type BookingValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | BookingValue[]
  | { [key: string]: BookingValue }

export type BookingRecord = Record<string, BookingValue> & {
  id: string
}

export type BookingSummaryField = 'name' | 'service' | 'source' | 'date'

export type BookingDisplayField = {
  key: string
  label: string
  value: string
}
