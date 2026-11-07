import {
  LayoutGrid,
  BedDouble,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  Minus,
  Check,
  CircleAlert,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import ProgressBar from '../components/ProgressBar'
import {
  heatmapBays,
  heatmapStats,
  heatmapResidualDonut,
  heatmapIsolationList,
  heatmapCleaning,
  heatmapBayCompliance,
  heatmapAlerts,
  VERSION,
} from '../data/dummyData'

function bedBorder(bed) {
  if (bed.isolation) {
    return { border: '3px solid #DC2626', boxShadow: '0 0 0 2px rgba(220,38,38,0.2)' }
  }
  if (bed.highRiskResidual) {
    return { border: '3px dashed #DC2626' }
  }
  if (bed.residualActive) {
    return { border: '2px solid #EF4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.18)' }
  }
  return { border: '1.5px solid #E2E8F0' }
}

function KpiCard({ iconBg, icon, value, valueColor, title, sub }) {
  return (
    <div className="card px-4 py-3.5 flex items-center gap-3.5">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className={`text-2xl font-bold leading-none ${valueColor}`}>{value}</div>
        <div className="text-sm font-semibold text-slate-800 mt-1">{title}</div>
        {sub && <div className="text-xs font-medium text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

function BedCard({ bed }) {
  return (
    <div
      className="rounded-lg p-2 bg-white relative min-h-[88px]"
      style={bedBorder(bed)}
      title={`${bed.id} · ${bed.vulnLabel} · Residual ${bed.residualLabel} (${bed.residualScore})`}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] font-bold text-slate-700">{bed.id.replace('SPZ-', 'SPZ')}</span>
        <BedDouble
          className="w-3.5 h-3.5"
          style={{ color: bed.vulnerability === '#ffffff' ? '#94A3B8' : bed.vulnerability }}
        />
      </div>
      <div className="text-[10px] font-semibold text-slate-500 mb-1.5">{bed.vulnLabel}</div>
      <div className="flex items-center gap-1">
        <span
          className="w-2.5 h-2.5 rounded-full border border-slate-300"
          style={{ backgroundColor: bed.vulnerability }}
          title="Patient Vulnerability"
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: bed.residual }}
          title="Residual Risk"
        />
      </div>
      {(bed.isolation || bed.highRiskResidual) && (
        <div className="mt-1 text-[9px] font-bold text-danger leading-tight">
          {bed.isolation ? 'Infection' : 'High Risk'}
        </div>
      )}
    </div>
  )
}

export default function Heatmap() {
  const s = heatmapStats
  const row1 = heatmapBays.slice(0, 2)
  const row2 = heatmapBays.slice(2, 4)

  return (
    <div>
      <h2 className="page-title font-bold mb-4">
        <LayoutGrid className="w-5 h-5 text-primary" />
        Ward Compliance & Residual Status Heatmap
      </h2>

      {/* Top KPIs — pic jaisi icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <KpiCard
          iconBg="bg-blue-50"
          icon={<BedDouble className="w-6 h-6 text-primary" />}
          value={s.totalBeds}
          valueColor="text-primary"
          title="Total Beds"
          sub="(4 Bays × 6 Beds)"
        />
        <KpiCard
          iconBg="bg-green-50"
          icon={
            <span className="w-7 h-7 rounded-full bg-compliant flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </span>
          }
          value={s.compliantBeds}
          valueColor="text-compliant"
          title="Compliant Beds"
          sub={s.compliantPct}
        />
        <KpiCard
          iconBg="bg-amber-50"
          icon={<AlertTriangle className="w-6 h-6 text-warning" />}
          value={s.warningZones}
          valueColor="text-warning"
          title="Warning Zones"
          sub={s.warningPct}
        />
        <KpiCard
          iconBg="bg-red-50"
          icon={<CircleAlert className="w-6 h-6 text-danger" />}
          value={s.highRiskBeds}
          valueColor="text-danger"
          title="High Risk Beds"
          sub={s.highRiskPct}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 mb-4">
        <div className="space-y-3">
          {[row1, row2].map((row, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {row.map((bay) => (
                <div key={bay.label} className="card p-3">
                  <h3 className="text-xs font-bold text-slate-800 mb-2">
                    {bay.label}{' '}
                    <span className="font-medium text-slate-400">({bay.range})</span>
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {bay.beds.map((bed) => (
                      <BedCard key={bed.id} bed={bed} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="card p-3">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Residual Risk Summary</h3>
            <div className="flex items-center gap-3">
              <div className="relative w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={heatmapResidualDonut}
                      dataKey="value"
                      innerRadius={28}
                      outerRadius={40}
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {heatmapResidualDonut.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="text-xs space-y-1 font-medium">
                {heatmapResidualDonut.map((d) => (
                  <li key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}: {d.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card p-3">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Isolation / High Risk</h3>
            <div className="space-y-2">
              {heatmapIsolationList.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-xs border-b border-slate-100 pb-1.5 last:border-0"
                >
                  <span className="font-mono font-bold text-danger">{r.id}</span>
                  <span className="font-medium text-slate-600">{r.reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-3">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Cleaning Task Completion</h3>
            <div className="space-y-2">
              {heatmapCleaning.map((c) => (
                <div key={c.task} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{c.task}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-compliant">
                    {c.pct}%
                    {c.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3 text-warning" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-3">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Compliance by Bay</h3>
            <div className="space-y-2.5">
              {heatmapBayCompliance.map((b) => (
                <div key={b.bay}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{b.bay}</span>
                    <span style={{ color: b.color }}>{b.pct}%</span>
                  </div>
                  <ProgressBar value={b.pct} color={b.color} height="h-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-3">
            <h3 className="text-xs font-bold text-slate-800 mb-2">
              Active Alerts ({heatmapAlerts.length})
            </h3>
            <div className="space-y-2">
              {heatmapAlerts.map((a) => (
                <div key={a.text} className="flex gap-2 text-xs">
                  <ShieldAlert
                    className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      a.level === 'high' ? 'text-danger' : 'text-warning'
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-slate-800 leading-snug">{a.text}</div>
                    <div className="text-slate-400 font-medium">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-primary/15 bg-blue-50/50 p-4 mb-3">
        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">
              Patient Vulnerability <span className="text-slate-500 font-medium">(Bed Colours)</span>
            </h4>
            <ul className="space-y-1.5 font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <BedDouble className="w-3.5 h-3.5 text-slate-400" /> Standard
              </li>
              <li className="flex items-center gap-2">
                <BedDouble className="w-3.5 h-3.5 text-yellow-500" /> Increased
              </li>
              <li className="flex items-center gap-2">
                <BedDouble className="w-3.5 h-3.5 text-orange-500" /> High
              </li>
              <li className="flex items-center gap-2">
                <BedDouble className="w-3.5 h-3.5 text-red-500" /> Infection
              </li>
              <li className="flex items-center gap-2">
                <BedDouble className="w-3.5 h-3.5 text-critical" /> Alert Org.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">
              Residual Risk <span className="text-slate-500 font-medium">(Zone Colours)</span>
            </h4>
            <ul className="space-y-1.5 font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-compliant" /> Compliant
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400" /> Warning
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-danger" /> Non-Compliant
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Isolation Indicators</h4>
            <ul className="space-y-1.5 font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-8 h-5 rounded border-[3px] border-danger bg-white" /> Isolation Room
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-5 rounded border-[3px] border-dashed border-danger bg-white" />{' '}
                High Residual Risk
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-primary text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        <span>Total Beds: 24 · SPZ Range: SPZ001–SPZ024</span>
        <span>Residual Risk active on SPZ-001</span>
        <span className="opacity-90">Last update: 25 Jul 2026 | 14:30 · {VERSION}</span>
      </div>
    </div>
  )
}
