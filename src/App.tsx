import { Navigate, Route, Routes } from 'react-router-dom'

import { BookingDetailsPage } from './pages/BookingDetailsPage'
import { BookingsPage } from './pages/BookingsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/bookings" replace />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/bookings/:bookingId" element={<BookingDetailsPage />} />
      <Route path="*" element={<Navigate to="/bookings" replace />} />
    </Routes>
  )
}

export default App
