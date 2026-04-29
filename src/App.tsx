import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const BookingsPage = lazy(() =>
  import('./pages/BookingsPage').then((module) => ({ default: module.BookingsPage })),
)
const BookingDetailsPage = lazy(() =>
  import('./pages/BookingDetailsPage').then((module) => ({ default: module.BookingDetailsPage })),
)

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[var(--color-text-secondary)]">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/bookings" replace />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:bookingId" element={<BookingDetailsPage />} />
        <Route path="*" element={<Navigate to="/bookings" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
