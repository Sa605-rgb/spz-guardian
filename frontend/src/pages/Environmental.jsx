import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Wrench, Sparkles, Activity, BarChart3, Info, Share2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import StatusCircle from '../components/StatusCircle'
import EventListCard from '../components/EventListCard'
import { envSharedEquipment, envHighTouch, envMedicalDevices, envQuality } from '../data/dummyData'
import { useDashboardEvents } from '../data/useDashboardEvents'
import { parsePlace } from '../data/placeParse'
import { classifySession } from '../data/classifySession'

function CellStatus({ value, residual }) {
  if (residual) return <StatusCircle residual />
  if (value === null || value === undefined) {
    return <span className="text-slate-400 font-medium">—</span>
  }
  return <StatusCircle ok={!!value} />
}

function DonutStat({ value, label, color, percent }) {
  const data = [
    { name: 'main', value: percent },
    { name: 'rest', value: 100 - percent },
  ]
  return (
    <div className="card px-5 py-4 flex items-center gap-4">
      <div className="relative w-[72px] h-[72px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={24} outerRadius={34} startAngle={90} endAngle={-270} stroke="none">
              <Cell fill={color} />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <div className="text-3xl font-bold leading-none" style={{ color }}>{value}</div>
        <div className="text-sm font-semibold text-slate-800 mt-1.5">{label}</div>
      </div>
    </div>
  )
}

function personByLocation(sessions) {
  const map = new Map()
  for (const s of sessions || []) {
    const cls = classifySession(s)
    const { location } = parsePlace(s.location)
    map.set(location, cls)
  }
  return map
}

export default function Environmental() {
  const { period } = useOutletContext()
  const { events, sessions, liveOk, liveLoading, removeEvent } = useDashboardEvents(period)
  const people = useMemo(() => personByLocation(sessions), [sessions])

  const residualCount = [...envSharedEquipment, ...envHighTouch, ...envMedicalDevices, ...envQuality].filter(
    (r) => r.residual,
  ).length
  const ncCount = [...envHighTouch, ...envQuality].filter((r) => !r.ok && !r.residual).length
  const okPct = Math.max(0, 100 - residualCount * 12 - ncCount * 18)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="page-title font-bold text-slate-900 mb-0">Environmental Dashboard — Hygiene & residual risk</h2>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
          {period}
          {liveOk ? ' · Live ward feed' : liveLoading ? ' · Connecting…' : ' · Local demo'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DonutStat value={`${okPct}%`} label="On track" color="#22C55E" percent={okPct} />
        <DonutStat value={String(residualCount)} label="Medium residual — intervene" color="#F97316" percent={Math.min(100, residualCount * 20)} />
        <div className="card px-5 py-4 flex items-center gap-4">
          <div className="w-[72px] h-[72px] shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
            <Share2 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold leading-none text-primary">{events.length}</div>
            <div className="text-sm font-semibold text-slate-800 mt-1.5">Linked HH events</div>
          </div>
        </div>
      </div>

      <EventListCard events={events} onDelete={removeEvent} title="Linked events (same list as Testing / HH)" />

      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          Shared devices — by patient zone / bay
        </h3>
        <p className="text-xs text-slate-500 mb-3">Need: clean on entry, before contact, after use. Person C/NC is the last hand-hygiene result in that zone.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Zone / bay</th>
                <th className="px-3 py-2.5 font-semibold">Person</th>
                <th className="px-3 py-2.5 font-semibold">Clean entry</th>
                <th className="px-3 py-2.5 font-semibold">Pre-contact</th>
                <th className="px-3 py-2.5 font-semibold">Post-use</th>
                <th className="px-3 py-2.5 font-semibold">How to comply</th>
              </tr>
            </thead>
            <tbody>
              {envSharedEquipment.map((r) => {
                const person = people.get(r.location)
                return (
                  <tr key={r.location} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.location}</td>
                    <td className="px-3 py-3">
                      {person ? (
                        <StatusCircle
                          ok={person.compliant}
                          residual={['M1-03', 'M1-04', 'M1-05'].includes(person.code)}
                          unknown={person.code === 'NR'}
                          neutral={person.code === 'M1-02'}
                        />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3"><CellStatus value={r.cleanEntry} /></td>
                    <td className="px-3 py-3"><CellStatus value={r.preContact} residual={r.residual && !r.preContact} /></td>
                    <td className="px-3 py-3"><CellStatus value={r.postUse} /></td>
                    <td className="px-3 py-3 text-slate-700">{r.coach}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          High-touch zones / bay — scheduled disinfection
        </h3>
        <p className="text-xs text-slate-500 mb-3">Orange dash = still time. Red = overdue. Green = on time.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Zone / bay</th>
                <th className="px-3 py-2.5 font-semibold">Surface</th>
                <th className="px-3 py-2.5 font-semibold">Due</th>
                <th className="px-3 py-2.5 font-semibold">Done</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">How to comply</th>
              </tr>
            </thead>
            <tbody>
              {envHighTouch.map((r) => (
                <tr key={`${r.location}-${r.task}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold whitespace-nowrap">{r.location}</td>
                  <td className="px-3 py-3">{r.task}</td>
                  <td className="px-3 py-3 tabular-nums">{r.schedule}</td>
                  <td className="px-3 py-3 tabular-nums">{r.completed}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <StatusCircle ok={r.ok} residual={r.residual} />
                      <span className={r.residual ? 'text-orange-600' : r.ok ? 'text-compliant' : 'text-danger'}>
                        {r.residual ? 'Intervene' : r.ok ? 'Compliant' : 'Non-comp.'}
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{r.coach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Devices — disposable vs reusable
        </h3>
        <p className="text-xs text-slate-500 mb-3">Reusable must be disinfected before they touch the patient.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Zone / bay</th>
                <th className="px-3 py-2.5 font-semibold">Device</th>
                <th className="px-3 py-2.5 font-semibold">Kind</th>
                <th className="px-3 py-2.5 font-semibold">Wiped before patient</th>
                <th className="px-3 py-2.5 font-semibold">How to comply</th>
              </tr>
            </thead>
            <tbody>
              {envMedicalDevices.map((r) => (
                <tr key={`${r.location}-${r.device}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold whitespace-nowrap">{r.location}</td>
                  <td className="px-3 py-3">{r.device}</td>
                  <td className="px-3 py-3">{r.kind}</td>
                  <td className="px-3 py-3">
                    {r.kind === 'Disposable' ? (
                      <span className="text-slate-500">N/A — single use</span>
                    ) : (
                      <CellStatus value={r.preTouch} residual={r.residual} />
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate-700">{r.coach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Environmental quality — wipes × sequence × contact time
        </h3>
        <p className="text-xs text-slate-500 mb-3">Right number of wipes, right order, enough wet time.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Zone / bay</th>
                <th className="px-3 py-2.5 font-semibold">Wipes (dose)</th>
                <th className="px-3 py-2.5 font-semibold">Sequence</th>
                <th className="px-3 py-2.5 font-semibold">Contact time</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">How to comply</th>
              </tr>
            </thead>
            <tbody>
              {envQuality.map((r) => (
                <tr key={r.location} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold whitespace-nowrap">{r.location}</td>
                  <td className="px-3 py-3 font-semibold">{r.wipes}</td>
                  <td className="px-3 py-3"><StatusCircle ok={r.sequence} /></td>
                  <td className="px-3 py-3">{r.contact}</td>
                  <td className="px-3 py-3">
                    <StatusCircle ok={r.ok} residual={r.residual} />
                  </td>
                  <td className="px-3 py-3 text-slate-700">{r.coach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-5 py-4">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
          <Info className="w-4 h-4 text-primary" />
          Legend
        </h3>
        <div className="text-sm text-slate-700 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5"><StatusCircle ok /> Compliant</span>
          <span className="inline-flex items-center gap-1.5"><StatusCircle residual /> Medium residual — act now</span>
          <span className="inline-flex items-center gap-1.5"><StatusCircle ok={false} /> Non-compliant</span>
        </div>
      </div>
    </div>
  )
}
