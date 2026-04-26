import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '../hooks/useTheme'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative min-h-screen text-[var(--color-text-primary)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--color-bg-glow-top)_0%,_var(--color-bg)_45%,_var(--color-bg-glow-bottom)_100%)]"
      />

      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/bookings" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] shadow-[var(--shadow-sm)]">
              <span className="text-xs font-bold tracking-wide">SA</span>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
                SAR Dashboard
              </span>
              <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                Bookings Analytics
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
