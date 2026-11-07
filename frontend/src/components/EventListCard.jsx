import { ClipboardList, Trash2 } from 'lucide-react'
import GroupBadge from './GroupBadge'
import StatusCircle from './StatusCircle'
import { coachForCode } from '../data/placeParse.js'

/**
 * Shared event table with delete — used on HH and Environmental.
 */
export default function EventListCard({ events, onDelete, title = 'Events' }) {
  return (
    <div className="card p-4 mb-4">
      <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-primary" />
        {title}
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Delete here or on Testing — counts stay in sync across dashboards.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b bg-slate-50">
              <th className="px-3 py-2.5 font-semibold">Event</th>
              <th className="px-3 py-2.5 font-semibold">Location</th>
              <th className="px-3 py-2.5 font-semibold">Role</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5 font-semibold">How to comply</th>
              <th className="px-3 py-2.5 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {events.length ? (
              events.map((e) => {
                const code = e.code || e.scenario
                const residual = ['M1-03', 'M1-04', 'M1-05'].includes(code)
                return (
                  <tr key={e.key} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3 font-mono font-bold text-primary whitespace-nowrap">{code}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{e.location}</td>
                    <td className="px-3 py-3">
                      <GroupBadge role={e.role} compact />
                    </td>
                    <td className="px-3 py-3">
                      <StatusCircle
                        ok={e.compliant}
                        residual={residual}
                        unknown={code === 'NR'}
                        neutral={code === 'M1-02'}
                      />
                    </td>
                    <td className="px-3 py-3 text-slate-700">{coachForCode(code)}</td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete event ${code}?`)) onDelete(e)
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-danger hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                  No events left in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
