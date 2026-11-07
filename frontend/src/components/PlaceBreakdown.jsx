import { MapPin } from 'lucide-react'
import StatusCircle from './StatusCircle'

function Rows({ rows }) {
  return (
    <tbody>
      {rows.length ? (
        rows.map((r) => (
          <tr key={r.name} className="border-b border-slate-100 hover:bg-slate-50">
            <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.name}</td>
            <td className="px-3 py-3 tabular-nums">{r.total}</td>
            <td className="px-3 py-3 font-semibold text-compliant tabular-nums">{r.compliant}</td>
            <td className="px-3 py-3 font-semibold text-danger tabular-nums">{r.missed}</td>
            <td className="px-3 py-3 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                {r.quality}
                {r.residual ? <StatusCircle residual /> : null}
              </span>
            </td>
            <td className="px-3 py-3 text-slate-700">{r.coach || '—'}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
            No events in this view.
          </td>
        </tr>
      )}
    </tbody>
  )
}

function Block({ title, rows }) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b bg-slate-50">
              <th className="px-3 py-2.5 font-semibold">Place</th>
              <th className="px-3 py-2.5 font-semibold">Total</th>
              <th className="px-3 py-2.5 font-semibold">Did well</th>
              <th className="px-3 py-2.5 font-semibold">Missed opportunity</th>
              <th className="px-3 py-2.5 font-semibold">Quality shortfall</th>
              <th className="px-3 py-2.5 font-semibold">How to comply</th>
            </tr>
          </thead>
          <Rows rows={rows} />
        </table>
      </div>
    </div>
  )
}

export default function PlaceBreakdown({ ward, bays, spzs }) {
  return (
    <div className="card p-4 mb-4">
      <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        Missed opportunity vs quality shortfall
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Missed = no hand hygiene before contact (M1-01). Quality shortfall = pumps / coverage / time (M1-03 to M1-05) —
        orange dash means residual risk, still time to coach the next visit.
      </p>
      <Block title="Ward" rows={ward} />
      <Block title="Bay" rows={bays} />
      <Block title="SPZ" rows={spzs} />
    </div>
  )
}
