import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../../lib/utils'

type Trend = {
  value: string
  direction: 'up' | 'down' | 'neutral'
}

type StatCardProps = {
  label: string
  value: ReactNode
  helper?: ReactNode
  icon?: LucideIcon
  trend?: Trend
  accent?: 'primary' | 'accent' | 'success' | 'warning' | 'neutral'
  className?: string
}

const accentStyles: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary:
    'bg-[var(--color-primary-soft)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/15',
  accent:
    'bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20',
  success:
    'bg-[var(--color-success-soft)] text-[var(--color-success)] ring-1 ring-[var(--color-success)]/20',
  warning:
    'bg-[var(--color-warning-soft)] text-[var(--color-warning)] ring-1 ring-[var(--color-warning)]/20',
  neutral: 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]',
}

const trendStyles: Record<Trend['direction'], string> = {
  up: 'text-[var(--color-success)]',
  down: 'text-[var(--color-danger)]',
  neutral: 'text-[var(--color-text-muted)]',
}

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  trend,
  accent = 'neutral',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {value}
          </p>
        </div>
        {Icon ? (
          <span
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
              accentStyles[accent],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>

      {(helper || trend) && (
        <div className="mt-4 flex items-center justify-between gap-2 text-xs">
          {helper ? (
            <span className="text-[var(--color-text-secondary)]">{helper}</span>
          ) : (
            <span />
          )}
          {trend ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-soft)] px-2 py-0.5 font-medium',
                trendStyles[trend.direction],
              )}
            >
              {trend.direction === 'up' ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : trend.direction === 'down' ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : null}
              {trend.value}
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
