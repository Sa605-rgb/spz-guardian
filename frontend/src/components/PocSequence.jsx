import { HelpCircle, ListOrdered } from 'lucide-react'
import { NOT_RECOGNISED, POC_SCENARIOS, pocCounts } from '../data/pocScenarios.js'

function expectedClass(expected) {
  if (expected === 'C' || expected === 'Non-opp') return 'text-compliant'
  if (expected === 'NC') return 'text-danger'
  return 'text-amber-700'
}

/**
 * Workbook M1-01…M1-06 counts plus Not recognised.
 */
export default function PocSequence({ events = [], title = 'POC workbook sequence' }) {
  const counts = pocCounts(events)
  const unmatched = counts.NR || 0

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
        <ListOrdered className="w-4 h-4 text-primary" />
        {title}
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Same six scripts, this order. Anything else is Not recognised — not Non-opportunity.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b bg-slate-50">
              <th className="px-3 py-2.5 font-semibold">Code</th>
              <th className="px-3 py-2.5 font-semibold">Script</th>
              <th className="px-3 py-2.5 font-semibold">Expected</th>
              <th className="px-3 py-2.5 font-semibold">Observed</th>
              <th className="px-3 py-2.5 font-semibold">Failure reason</th>
            </tr>
          </thead>
          <tbody>
            {POC_SCENARIOS.map((s) => (
              <tr key={s.code} className="border-b border-slate-100">
                <td className="px-3 py-2.5 font-mono font-bold text-primary whitespace-nowrap">{s.code}</td>
                <td className="px-3 py-2.5 text-slate-700">{s.script}</td>
                <td className={`px-3 py-2.5 font-semibold ${expectedClass(s.expected)}`}>{s.expected}</td>
                <td className="px-3 py-2.5 font-bold tabular-nums">{counts[s.code] || 0}</td>
                <td className="px-3 py-2.5 text-slate-600">{s.failures.join('; ') || '—'}</td>
              </tr>
            ))}
            <tr className="bg-amber-50 border-b border-amber-100">
              <td className="px-3 py-2.5 font-mono font-bold text-amber-800 whitespace-nowrap inline-flex items-center gap-1">
                <HelpCircle className="w-4 h-4" />
                NR
              </td>
              <td className="px-3 py-2.5 text-amber-900">{NOT_RECOGNISED.script}</td>
              <td className="px-3 py-2.5 font-semibold text-amber-800">Review</td>
              <td className="px-3 py-2.5 font-bold tabular-nums text-amber-800">{unmatched}</td>
              <td className="px-3 py-2.5 text-amber-900">{NOT_RECOGNISED.failures[0]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
