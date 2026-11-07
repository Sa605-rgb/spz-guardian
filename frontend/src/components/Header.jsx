import { useEffect, useState } from 'react'
import { MapPin, Clock } from 'lucide-react'
import { LOCATION } from '../data/dummyData'
import DatePicker from './DatePicker'

const periods = ['Today', 'This Week', 'This Month']

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default function Header({ period, setPeriod }) {
  const [now, setNow] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="mb-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <h1 className="text-xl font-bold text-slate-900">SPZ Guardian</h1>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{LOCATION}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="font-medium tabular-nums">{formatTime(now)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`btn-period ${period === p ? 'active' : ''}`}
          >
            {p}
          </button>
        ))}
      </div>
    </header>
  )
}
