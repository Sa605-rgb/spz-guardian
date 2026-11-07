import { PieChart, LayoutList } from 'lucide-react'
import GroupBadge from './GroupBadge'
import { countPct, rollupReporting } from '../data/hhReporting'

function Cell({ n, total, className = '' }) {
  return <td className={`px-3 py-2.5 tabular-nums ${className}`}>{countPct(n, total)}</td>
}

/**
 * Ward + group totals Stephen asked for: compliant, NC split, non-opportunity, recovery.
 */
export default function HhReportingTotals({ rows }) {
  const ward = rollupReporting(rows)

  return (
    <div className="card p-4 mb-4">
      <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
        <LayoutList className="w-4 h-4 text-primary" />
        Group Reporting — Totals &amp; Subtotals
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Non-compliant reasons can stack (M1-03 = dose + coverage + time). Not recognised is outside the six scripts.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <Kpi label="Total events" value={ward.total} />
        <Kpi label="Compliant" value={countPct(ward.compliant, ward.total)} tone="text-compliant" />
        <Kpi
          label="Non-compliant"
          value={countPct(ward.nonCompliant, ward.total)}
          tone="text-danger"
          sub={`Touch ${countPct(ward.directTouch, ward.nonCompliant)} · Dose ${countPct(ward.ineffectiveDose, ward.nonCompliant)} · Coverage ${countPct(ward.ineffectiveCoverage, ward.nonCompliant)} · Time ${countPct(ward.contactTime, ward.nonCompliant)}`}
        />
        <Kpi label="Non-opportunity" value={countPct(ward.nonOpportunity, ward.total)} />
        <Kpi label="Recovery" value={countPct(ward.recovery, ward.total)} tone="text-primary" />
        <Kpi
          label="Not recognised"
          value={countPct(ward.notRecognised, ward.total)}
          tone="text-amber-800"
          sub="Outside M1-01–M1-06 — ignore or missed"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b bg-slate-50">
              <th rowSpan={2} className="px-3 py-2.5 font-semibold align-bottom">Group</th>
              <th rowSpan={2} className="px-3 py-2.5 font-semibold align-bottom">Total</th>
              <th rowSpan={2} className="px-3 py-2.5 font-semibold align-bottom">Compliant</th>
              <th colSpan={5} className="px-3 py-2 text-center font-semibold text-danger border-b border-slate-200">
                Non-compliant
              </th>
              <th rowSpan={2} className="px-3 py-2.5 font-semibold align-bottom">Non-opp.</th>
              <th rowSpan={2} className="px-3 py-2.5 font-semibold align-bottom">Recovery</th>
              <th rowSpan={2} className="px-3 py-2.5 font-semibold align-bottom">Not rec.</th>
            </tr>
            <tr className="text-left text-slate-600 border-b bg-slate-50">
              <th className="px-3 py-2 font-semibold">Total</th>
              <th className="px-3 py-2 font-semibold">Direct touch</th>
              <th className="px-3 py-2 font-semibold">Ineffective dose</th>
              <th className="px-3 py-2 font-semibold">Ineffective coverage</th>
              <th className="px-3 py-2 font-semibold">Contact time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.group} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2.5">
                  <GroupBadge group={r.group} compact />
                </td>
                <td className="px-3 py-2.5 font-semibold tabular-nums">{r.total}</td>
                <Cell n={r.compliant} total={r.total} className="font-semibold text-compliant" />
                <Cell n={r.nonCompliant} total={r.total} className="font-semibold text-danger" />
                <Cell n={r.directTouch} total={r.total} />
                <Cell n={r.ineffectiveDose} total={r.total} />
                <Cell n={r.ineffectiveCoverage} total={r.total} />
                <Cell n={r.contactTime} total={r.total} />
                <Cell n={r.nonOpportunity} total={r.total} />
                <Cell n={r.recovery} total={r.total} className="text-primary font-medium" />
                <Cell n={r.notRecognised} total={r.total} className="text-amber-800" />
              </tr>
            ))}
            <tr className="bg-slate-50 font-semibold">
              <td className="px-3 py-2.5">Ward total</td>
              <td className="px-3 py-2.5 tabular-nums">{ward.total}</td>
              <Cell n={ward.compliant} total={ward.total} className="text-compliant" />
              <Cell n={ward.nonCompliant} total={ward.total} className="text-danger" />
              <Cell n={ward.directTouch} total={ward.total} />
              <Cell n={ward.ineffectiveDose} total={ward.total} />
              <Cell n={ward.ineffectiveCoverage} total={ward.total} />
              <Cell n={ward.contactTime} total={ward.total} />
              <Cell n={ward.nonOpportunity} total={ward.total} />
              <Cell n={ward.recovery} total={ward.total} className="text-primary" />
              <Cell n={ward.notRecognised} total={ward.total} className="text-amber-800" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Kpi({ label, value, tone = 'text-slate-900', sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        <PieChart className="w-3 h-3 text-primary" />
        {label}
      </div>
      <div className={`text-lg font-bold mt-1 leading-tight ${tone}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-1 leading-snug">{sub}</div>}
    </div>
  )
}
