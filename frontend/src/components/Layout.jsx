import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [period, setPeriod] = useState('Today')

  return (
    <div className="flex min-h-screen bg-[#f3f5f9]">
      <Sidebar />
      <main className="flex-1 p-5 md:p-6 overflow-x-hidden">
        <Header period={period} setPeriod={setPeriod} />
        <Outlet context={{ period }} />
      </main>
    </div>
  )
}
