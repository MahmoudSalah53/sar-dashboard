import type { ComponentProps } from 'react'

import { cn } from '../../lib/utils'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-[var(--color-surface-soft)]', className)}
      {...props}
    />
  )
}

export { Skeleton }
