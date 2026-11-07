import { Smartphone } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import { devices } from '../data/dummyData'

function complianceColor(value) {
  if (value == null) return null
  if (value >= 85) return '#22C55E'
  if (value >= 80) return '#EAB308'
  return '#F97316'
}

export default function Devices() {
  const active = devices.filter((d) => d.status === 'Active').length
  const offline = devices.filter((d) => d.status === 'Offline').length

  return (
    <div>
      <h2 className="page-title">
        <Smartphone className="w-5 h-5 text-primary" />
        Devices — Guardian Units
      </h2>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="px-4 py-3 font-medium">Device ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="border-b border-slate-100">
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{d.id}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          d.status === 'Active' ? 'bg-compliant' : 'bg-danger'
                        }`}
                      />
                      <span
                        className={
                          d.status === 'Active' ? 'text-compliant' : 'text-danger'
                        }
                      >
                        {d.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{d.location}</td>
                  <td className="px-4 py-3.5">
                    {d.compliance == null ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="flex-1">
                          <ProgressBar
                            value={d.compliance}
                            color={complianceColor(d.compliance)}
                          />
                        </div>
                        <span className="text-xs font-medium w-8">{d.compliance}%</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t bg-slate-50 flex flex-wrap gap-4 text-sm">
          <span>
            Total Devices: <strong className="text-primary">{devices.length}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Active: <strong className="text-compliant">{active}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Offline: <strong className="text-danger">{offline}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
