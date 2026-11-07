import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function formatDisplay(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(new Date(value.getFullYear(), value.getMonth(), 1))
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) setView(new Date(value.getFullYear(), value.getMonth(), 1))
  }, [open, value])

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm hover:border-slate-300 transition"
      >
        <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
        <span className="whitespace-nowrap">{formatDisplay(value)}</span>
        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-slate-100"
              onClick={() => setView(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-800">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-slate-100"
              onClick={() => setView(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-medium text-slate-400 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) =>
              day ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(day)
                    setOpen(false)
                  }}
                  className={`h-8 rounded-lg text-sm transition ${
                    sameDay(day, value)
                      ? 'bg-primary text-white font-semibold'
                      : sameDay(day, today)
                        ? 'bg-blue-50 text-primary font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {day.getDate()}
                </button>
              ) : (
                <div key={i} />
              )
            )}
          </div>

          <button
            type="button"
            className="mt-3 w-full text-sm text-primary font-medium py-1.5 rounded-lg hover:bg-blue-50"
            onClick={() => {
              const t = new Date()
              onChange(new Date(t.getFullYear(), t.getMonth(), t.getDate()))
              setOpen(false)
            }}
          >
            Today
          </button>
        </div>
      )}
    </div>
  )
}
