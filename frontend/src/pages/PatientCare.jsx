import {
  BedDouble,
  User,
  Footprints,
  RefreshCw,
  Stethoscope,
  UtensilsCrossed,
  Info,
  Clock,
  Check,
  X,
} from 'lucide-react'
import { patientCareSections } from '../data/patientCareData'

const sectionIcons = {
  User,
  Footprints,
  RefreshCw,
  BedDouble,
  Stethoscope,
  UtensilsCrossed,
}

function StatusBadge({ status }) {
  if (status === 'on_time') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
        <span className="w-4 h-4 rounded-full bg-compliant flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
        On Time
      </span>
    )
  }
  if (status === 'late') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
        <span className="w-4 h-4 rounded-full bg-danger flex items-center justify-center">
          <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
        Late
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
      <span className="w-4 h-4 rounded-full bg-warning flex items-center justify-center">
        <Clock className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
      </span>
      Missed
    </span>
  )
}

function CareTable({ section }) {
  const Icon = sectionIcons[section.icon] || User
  return (
    <div className="card p-4 mb-4 overflow-hidden">
      <h3 className="font-bold text-primary mb-3 flex items-center gap-2.5 text-base">
        <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-4 h-4 text-white" />
        </span>
        {section.letter}. {section.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-3 py-2.5 font-semibold">Location</th>
              <th className="px-3 py-2.5 font-semibold">Task</th>
              <th className="px-3 py-2.5 font-semibold">Allocated Time</th>
              <th className="px-3 py-2.5 font-semibold">Time to Complete</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((r, i) => (
              <tr
                key={`${section.id}-${r.location}-${r.task}-${i}`}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
              >
                <td className="px-3 py-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                    <BedDouble className="w-3.5 h-3.5 text-primary shrink-0" />
                    {r.location}
                  </span>
                </td>
                <td className="px-3 py-3.5 font-medium text-slate-700">{r.task}</td>
                <td className="px-3 py-3.5 font-medium tabular-nums text-slate-700">{r.allocated}</td>
                <td className="px-3 py-3.5 font-medium tabular-nums text-slate-700">{r.completed}</td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function PatientCare() {
  return (
    <div>
      <h2 className="page-title font-bold">
        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <BedDouble className="w-4 h-4 text-primary" />
        </span>
        Patient Care — Task Management
      </h2>

      {patientCareSections.map((section) => (
        <CareTable key={section.id} section={section} />
      ))}

      <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-5 py-4">
        <h3 className="font-bold text-slate-800 mb-2.5 flex items-center gap-2 text-sm">
          <Info className="w-4 h-4 text-primary" />
          Legend:
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <StatusBadge status="on_time" />
          <StatusBadge status="late" />
          <StatusBadge status="missed" />
        </div>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Quality:</span> Task Done/Not Done (No
          quality measure yet)
        </p>
      </div>
    </div>
  )
}
