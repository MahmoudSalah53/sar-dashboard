import {
  CalendarCheck2,
  CircleDollarSign,
  Globe,
  MessageCircleMore,
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

import { getFieldValue } from '../../lib/booking-fields'
import type { BookingRecord } from '../../types/bookings'
import { StatCard } from '../ui/stat-card'

type TrendPoint = {
  key: string
  label: string
  total: number
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''))
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function getSource(booking: BookingRecord) {
  const raw = getFieldValue(booking, 'source')
  return typeof raw === 'string' ? raw.toLowerCase() : 'unknown'
}

function getDateKey(value: unknown) {
  if (typeof value !== 'string') return ''
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildTrendBuckets(bookings: BookingRecord[]): TrendPoint[] {
  const counts = new Map<string, number>()
  const data: TrendPoint[] = []

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - offset)
    const label = day.toLocaleDateString(undefined, { weekday: 'short' })
    const key = getDateKey(day.toISOString())
    counts.set(key, 0)
    data.push({ label, total: 0, key })
  }

  bookings.forEach((b) => {
    const rawDate = getFieldValue(b, 'date')
    const key = getDateKey(rawDate)
    if (!key) return
    const index = data.findIndex((d) => d.key === key)
    if (index !== -1) data[index].total += 1
  })

  return data
}

export function AnalyticsOverview({ bookings }: { bookings: BookingRecord[] }) {
  const totalBookings = bookings.length
  const whatsappCount = bookings.filter((b) => getSource(b).includes('whatsapp')).length
  const webCount = bookings.filter((b) => getSource(b).includes('web')).length
  
  const estimatedRevenue = bookings.reduce((sum, b) => sum + toNumber(getFieldValue(b, 'price')), 0)
  const trendData = buildTrendBuckets(bookings)

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bookings" value={totalBookings} icon={CalendarCheck2} accent="primary" />
        <StatCard label="Revenue" value={`$${estimatedRevenue.toLocaleString()}`} icon={CircleDollarSign} accent="success" />
        <StatCard label="Web" value={webCount} icon={Globe} accent="accent" />
        <StatCard label="WhatsApp" value={whatsappCount} icon={MessageCircleMore} accent="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Activity Overview</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Daily booking performance</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-accent)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-70"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]"></span>
              </span>
              LIVE DATA
            </div>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--color-text-muted)', fontSize: 12}}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-primary)"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="mb-5 text-base font-semibold text-[var(--color-text-primary)]">
              Traffic Sources
            </h3>
            <div className="space-y-7">
              <SourceItem label="WhatsApp" count={whatsappCount} total={totalBookings} color="bg-[var(--color-accent)]" />
              <SourceItem label="Direct Web" count={webCount} total={totalBookings} color="bg-[var(--color-primary)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type SourceItemProps = {
  label: string
  count: number
  total: number
  color: string
}

function SourceItem({ label, count, total, color }: SourceItemProps) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
        <span className="text-sm font-bold">{percentage}%</span>
      </div>
      <div className="h-3 w-full bg-[var(--color-surface-soft)] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}