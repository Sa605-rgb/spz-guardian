import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TestingDashboard from './pages/TestingDashboard'
import HandHygiene from './pages/HandHygiene'
import Environmental from './pages/Environmental'
import Heatmap from './pages/Heatmap'
import PatientCare from './pages/PatientCare'
import PatientSafety from './pages/PatientSafety'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'
import Devices from './pages/Devices'
import Users from './pages/Users'
import Settings from './pages/Settings'

import PasswordGate from './components/PasswordGate'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <PasswordGate>
      <BrowserRouter basename={basename || undefined}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TestingDashboard />} />
          <Route path="/hand-hygiene" element={<HandHygiene />} />
          <Route path="/environmental" element={<Environmental />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/patient-care" element={<PatientCare />} />
          <Route path="/patient-safety" element={<PatientSafety />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </PasswordGate>
  )
}
