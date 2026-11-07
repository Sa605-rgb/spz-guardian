import { useState } from 'react'
import { Bell, Hand, Droplet, Monitor, ChevronRight, AlertTriangle, Info } from 'lucide-react'
import { alerts } from '../data/dummyData'

const severityMeta = {
  critical: {
    bar: 'bg-danger',
    iconBg: 'bg-red-100',
    iconColor: 'text-danger',
    Icon: Hand,
    filter: 'border-red-300 text-danger',
  },
  warning: {
    bar: 'bg-highrisk',
    iconBg: 'bg-orange-100',
    iconColor: 'text-highrisk',
    Icon: Droplet,
    filter: 'border-orange-300 text-highrisk',
  },
  info: {
    bar: 'bg-primary',
    iconBg: 'bg-blue-100',
    iconColor: 'text-primary',
    Icon: Monitor,
    filter: 'border-blue-300 text-primary',
  },
}

const filters = [
  { key: 'critical', label: 'Critical', Icon: AlertTriangle },
  { key: 'warning', label: 'Warning', Icon: AlertTriangle },
  { key: 'info', label: 'Info', Icon: Info },
]

export default function Alerts() {
  const [filter, setFilter] = useState(null)
  const list = filter ? alerts.filter((a) => a.severity === filter) : alerts

  return (
    <div>
      <h2 className="page-title">
        <Bell className="w-5 h-5 text-primary" />
        Alerts — Real-time Notifications
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => {
          const meta = severityMeta[f.key]
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(active ? null : f.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${meta.filter} ${
                active ? 'bg-slate-50 ring-1 ring-current' : 'bg-white'
              }`}
            >
              <f.Icon className="w-3.5 h-3.5" />
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-slate-100">
          {list.map((a) => {
            const meta = severityMeta[a.severity]
            const Icon = meta.Icon
            return (
              <div key={a.id} className="flex items-stretch hover:bg-slate-50 cursor-pointer">
                <div className={`w-1.5 shrink-0 ${meta.bar}`} />
                <div className="flex-1 flex items-center gap-3 px-4 py-4">
                  <div className={`w-10 h-10 rounded-full ${meta.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${meta.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 text-sm">{a.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.detail}</div>
                    <div className={`text-xs mt-1 font-medium ${meta.iconColor}`}>{a.status}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-4 py-3 border-t bg-slate-50 flex flex-wrap gap-4 text-sm">
          <span>
            Total Alerts: <strong className="text-primary">3</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Critical: <strong className="text-danger">1</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Warning: <strong className="text-highrisk">1</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Info: <strong className="text-primary">1</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
