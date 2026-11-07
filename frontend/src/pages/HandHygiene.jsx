import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Droplets,
  BarChart3,
  MapPin,
  ClipboardCheck,
  Beaker,
  Info,
  Clock,
  User,
} from 'lucide-react'
import { reportFromSessions } from '../data/hhReporting'
import { hhTablesFromSessions } from '../data/hhFromLive'
import { placeBreakdown } from '../data/hhBreakdown'
import { useDashboardEvents } from '../data/useDashboardEvents'
import GroupBadge from '../components/GroupBadge'
import StatusCircle from '../components/StatusCircle'
import HhReportingTotals from '../components/HhReportingTotals'
import PocSequence from '../components/PocSequence'
import PlaceBreakdown from '../components/PlaceBreakdown'
import EventListCard from '../components/EventListCard'

/** Medical latex-glove silhouette (Lucide has no gloves icon) */
function GlovesIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* cuff */}
      <path d="M7 21h8.5" />
      <path d="M7.5 21v-5.5c0-.8.3-1.5.8-2l1.2-1.3" />
      {/* thumb */}
      <path d="M5.2 12.2c-.9-.4-1.5-1.3-1.5-2.3 0-1.2 1-2.2 2.2-2.2.7 0 1.3.3 1.7.8" />
      {/* fingers */}
      <path d="M9.5 12.2V5.8a1.35 1.35 0 0 1 2.7 0V11" />
      <path d="M12.2 11V4.6a1.35 1.35 0 0 1 2.7 0V11" />
      <path d="M14.9 11V5.4a1.35 1.35 0 0 1 2.7 0v7.8c0 .7.2 1.3.6 1.8l.8.9c.4.5.6 1.1.6 1.7V21" />
      <path d="M9.5 12.5l1.5 1.4c.5.5.8 1.2.8 1.9V21" />
    </svg>
  )
}

function Mark({ ok, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
      {label}
      <StatusCircle ok={ok} neutral={label === '—'} />
    </span>
  )
}

export default function HandHygiene() {
  const { period } = useOutletContext()
  const { events, sessions, liveOk, liveLoading, removeEvent } = useDashboardEvents(period)
  const isLive = liveOk
  const data = useMemo(() => hhTablesFromSessions(sessions), [sessions])
  const reporting = useMemo(() => reportFromSessions(sessions), [sessions])
  const places = useMemo(() => placeBreakdown(sessions), [sessions])
  const { groupSummary, locationObs, qualityCriteria, dispenserStats, gloves } = data
  const pocEvents = events

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="page-title font-bold mb-0">
          <Droplets className="w-5 h-5 text-primary" />
          Hand Hygiene Dashboard — Quality & Compliance
        </h2>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
          Showing: {period}
          {isLive ? ' · Live ward feed' : liveLoading ? ' · Connecting…' : ' · Local demo'}
        </span>
      </div>

      <HhReportingTotals rows={reporting} />

      <PocSequence events={pocEvents} title="POC workbook sequence" />

      <PlaceBreakdown ward={places.ward} bays={places.bays} spzs={places.spzs} />

      <EventListCard events={events} onDelete={removeEvent} title="Hand hygiene events" />

      {/* 1. Top Summary */}
      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Top Summary — Group-wise Compliance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Group</th>
                <th className="px-3 py-2.5 font-semibold">Total Events</th>
                <th className="px-3 py-2.5 font-semibold">Moment 1 Comp.</th>
                <th className="px-3 py-2.5 font-semibold">Moment 1 Non-Comp.</th>
                <th className="px-3 py-2.5 font-semibold">Non-Opp.</th>
                <th className="px-3 py-2.5 font-semibold">Not rec.</th>
              </tr>
            </thead>
            <tbody>
              {groupSummary.map((g) => (
                <tr key={g.group} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <GroupBadge group={g.group} />
                  </td>
                  <td className="px-3 py-3 font-medium">{g.total}</td>
                  <td className="px-3 py-3 font-semibold text-compliant">{g.moment1Comp}</td>
                  <td className="px-3 py-3 font-semibold text-danger">{g.moment1Non}</td>
                  <td className="px-3 py-3 font-medium text-slate-600">{g.nonOpp}</td>
                  <td className="px-3 py-3 font-medium text-amber-800">{g.notRec ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Observation by Location */}
      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Observation by Location
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Location</th>
                <th className="px-3 py-2.5 font-semibold">Moment 1 Comp.</th>
                <th className="px-3 py-2.5 font-semibold">Moment 1 Non-Comp.</th>
                <th className="px-3 py-2.5 font-semibold">Non-Opp.</th>
                <th className="px-3 py-2.5 font-semibold">Not rec.</th>
                <th className="px-3 py-2.5 font-semibold">Failure Reason</th>
              </tr>
            </thead>
            <tbody>
              {locationObs.length ? (
                locationObs.map((r) => (
                  <tr key={r.location} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.location}</td>
                    <td className="px-3 py-3 font-semibold text-compliant">{r.moment1Comp}</td>
                    <td className="px-3 py-3 font-semibold text-danger">{r.moment1Non}</td>
                    <td className="px-3 py-3 font-medium">{r.nonOpp}</td>
                    <td className="px-3 py-3 font-medium text-amber-800">{r.notRec ?? 0}</td>
                    <td className="px-3 py-3 font-medium text-slate-700">{r.failure}</td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                    No live observations in this period yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Quality Criteria */}
      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          Quality Criteria — Dose, Coverage, Contact Time
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Group</th>
                <th className="px-3 py-2.5 font-semibold">Dose (2/1/0)</th>
                <th className="px-3 py-2.5 font-semibold">Coverage (Yes/No)</th>
                <th className="px-3 py-2.5 font-semibold">Contact Time</th>
                <th className="px-3 py-2.5 font-semibold">Patient Touch</th>
              </tr>
            </thead>
            <tbody>
              {qualityCriteria.map((r) => (
                <tr key={r.group} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <GroupBadge group={r.group} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark ok={r.doseOk} label={r.dose} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark ok={r.coverageOk} label={r.coverage} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark ok={r.contactOk} label={r.contact} />
                  </td>
                  <td className="px-3 py-3">
                    <Mark ok={r.touchOk} label={r.touch} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Dispenser Stats */}
      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Beaker className="w-4 h-4 text-primary" />
          Dispenser Stats — Total Dispenses, Volume, Price
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Location</th>
                <th className="px-3 py-2.5 font-semibold">Total Disp.</th>
                <th className="px-3 py-2.5 font-semibold">Volume (ml)</th>
                <th className="px-3 py-2.5 font-semibold">Price (£)</th>
              </tr>
            </thead>
            <tbody>
              {dispenserStats.length ? (
                dispenserStats.map((r) => (
                  <tr key={r.location} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3 font-semibold text-slate-800 whitespace-nowrap">{r.location}</td>
                    <td className="px-3 py-3 font-medium">{r.totalDisp}</td>
                    <td className="px-3 py-3 font-medium">{r.volumeMl}</td>
                    <td className="px-3 py-3 font-semibold text-primary">{r.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                    {isLive ? 'No dispenser counts on the live feed yet.' : 'No dispenser data.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Gloves */}
      <div className="card p-4 mb-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <GlovesIcon className="w-4 h-4 text-primary" />
          Gloves — Moment 2 &amp; 3 Compliance by Group
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b bg-slate-50">
                <th className="px-3 py-2.5 font-semibold">Group</th>
                <th className="px-3 py-2.5 font-semibold">Moment 2 Comp.</th>
                <th className="px-3 py-2.5 font-semibold">Moment 3 Comp.</th>
                <th className="px-3 py-2.5 font-semibold">Misuse</th>
              </tr>
            </thead>
            <tbody>
              {gloves.length ? (
                gloves.map((r) => (
                  <tr key={r.group} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-3">
                      <GroupBadge group={r.group} />
                    </td>
                    <td className="px-3 py-3 font-semibold text-compliant">{r.moment2}</td>
                    <td className="px-3 py-3 font-semibold text-compliant">{r.moment3}</td>
                    <td className="px-3 py-3 font-semibold text-danger">{r.misuse}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                    {isLive ? 'No Moment 2 / 3 glove data on the live feed yet.' : 'No glove data.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-5 py-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
          <Info className="w-4 h-4 text-primary" />
          Legend:
        </h3>

        <div className="space-y-2.5 text-sm text-slate-800">
          <div className="flex items-center gap-2.5 flex-wrap">
            <StatusCircle ok /> <span>Did well</span>
            <StatusCircle residual /> <span>Quality shortfall / residual — coach the next visit</span>
            <StatusCircle ok={false} /> <span>Missed opportunity</span>
            <StatusCircle neutral /> <span>No opportunity</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Droplets className="w-4 h-4 text-primary shrink-0" />
            <p>
              <span className="font-semibold">Dose:</span>{' '}
              <span className="inline-flex items-center gap-1">2 <StatusCircle ok /></span> Compliant
              <span className="text-slate-300 mx-1.5">|</span>
              <span className="inline-flex items-center gap-1">1 <StatusCircle ok={false} /></span> Non-Compliant
              <span className="text-slate-300 mx-1.5">|</span>
              <span className="inline-flex items-center gap-1">0 <StatusCircle ok={false} /></span> Non-Comp.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <p>
              <span className="font-semibold">Contact Time:</span>{' '}
              <span className="inline-flex items-center gap-1">&gt;20s <StatusCircle ok /></span>
              <span className="text-slate-300 mx-1.5">|</span>
              <span className="inline-flex items-center gap-1">&lt;20s <StatusCircle ok={false} /></span>
              <span className="text-slate-300 mx-1.5">|</span>
              <span className="inline-flex items-center gap-1">No Rub <StatusCircle ok={false} /></span>
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-primary shrink-0" />
            <p>
              <span className="font-semibold">Patient Touch:</span>{' '}
              <span className="inline-flex items-center gap-1">After HH <StatusCircle ok /></span>
              <span className="text-slate-300 mx-1.5">|</span>
              <span className="inline-flex items-center gap-1">Before HH <StatusCircle ok={false} /></span>
            </p>
          </div>
          <p className="text-slate-700 pl-7">
            <span className="font-semibold">Reporting totals:</span> M1-01 to M1-06 follow the POC workbook. Not recognised = event did not match those six scripts (do not treat as Non-opportunity). Failure reasons can stack.
          </p>
        </div>
      </div>
    </div>
  )
}
