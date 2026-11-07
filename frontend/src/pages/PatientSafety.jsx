import {
  ShieldPlus,
  ShieldCheck,
  ShieldX,
  Bell,
  PersonStanding,
  Pill,
  Bug,
  MoreHorizontal,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { safetyEvents, safetyAlerts, sparkline } from '../data/dummyData'

const eventIcons = { PersonStanding, Pill, Bug, MoreHorizontal }

const alertStyles = {
  warning: { bg: 'bg-yellow-100', color: 'text-yellow-600', Icon: AlertTriangle },
  caution: { bg: 'bg-orange-100', color: 'text-orange-600', Icon: AlertTriangle },
  info: { bg: 'bg-blue-100', color: 'text-primary', Icon: Info },
}

export default function PatientSafety() {
  return (
    <div>
      <h2 className="page-title">
        <ShieldPlus className="w-5 h-5 text-primary" />
        Patient Safety — Live Compliance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard
          icon={ShieldCheck}
          value="88%"
          valueColor="text-compliant"
          label="Overall Compliance"
          sparkData={sparkline.up}
        />
        <StatCard
          icon={ShieldX}
          iconBg="bg-red-50"
          iconColor="text-danger"
          value="12%"
          valueColor="text-danger"
          label="Non-Compliant"
          sparkData={sparkline.down}
          sparkStroke="#EF4444"
        />
        <StatCard
          icon={Bell}
          iconBg="bg-yellow-50"
          iconColor="text-warning"
          value="3"
          valueColor="text-warning"
          label="Alerts"
          sparkData={sparkline.flat}
          sparkStroke="#F59E0B"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Safety Events</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {safetyEvents.map((e) => {
            const Icon = eventIcons[e.icon]
            return (
              <div
                key={e.label}
                className="card px-4 py-3 flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${e.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: e.color }} />
                </div>
                <span className="text-sm font-medium text-slate-800">
                  {e.count} {e.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold text-slate-800 mb-3">Alerts</h3>
        <div className="space-y-3">
          {safetyAlerts.map((a) => {
            const style = alertStyles[a.type]
            const Icon = style.Icon
            return (
              <div
                key={a.title}
                className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
              >
                <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${style.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-slate-800">{a.title}</div>
                  <div className="text-xs text-slate-500">{a.detail}</div>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{a.time}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-right">
          <Link to="/alerts" className="text-sm text-primary font-medium hover:underline">
            View all alerts →
          </Link>
        </div>
      </div>
    </div>
  )
}
