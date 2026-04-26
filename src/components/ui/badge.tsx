import type { ComponentProps } from 'react'

import { cn } from '../../lib/utils'

type BadgeProps = ComponentProps<'span'> & {
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'neutral'
}

const toneClasses: Record<NonNullable<BadgeProps['tone']>, string> = {
  default:
    'bg-[var(--color-primary-soft)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/15',
  success:
    'bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/20',
  warning:
    'bg-[var(--color-warning-soft)] text-[var(--color-warning)] ring-1 ring-[var(--color-warning)]/20',
  danger:
    'bg-[var(--color-danger-soft)] text-[var(--color-danger)] ring-1 ring-[var(--color-danger)]/20',
  neutral:
    'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] ring-1 ring-[var(--color-border)]',
}

function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
