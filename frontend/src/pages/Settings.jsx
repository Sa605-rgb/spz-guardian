import { Settings as SettingsIcon, Bell, Moon, Globe, Shield } from 'lucide-react'

const toggles = [
  { icon: Bell, label: 'Email notifications', desc: 'Receive alert emails', on: true },
  { icon: Moon, label: 'Dark mode', desc: 'Use dark theme (coming soon)', on: false },
  { icon: Globe, label: 'Auto-refresh', desc: 'Refresh dashboards every 30s', on: true },
  { icon: Shield, label: 'Audit logging', desc: 'Log all staff actions', on: true },
]

export default function Settings() {
  return (
    <div>
      <h2 className="page-title">
        <SettingsIcon className="w-5 h-5 text-primary" />
        Settings
      </h2>

      <div className="card p-4 max-w-2xl space-y-1">
        {toggles.map((t) => (
          <div
            key={t.label}
            className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <t.icon className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">{t.label}</div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </div>
            </div>
            <button
              type="button"
              className={`relative w-11 h-6 rounded-full transition ${
                t.on ? 'bg-primary' : 'bg-slate-300'
              }`}
              aria-pressed={t.on}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
                  t.on ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-4 max-w-2xl mt-4">
        <h3 className="font-semibold text-slate-800 mb-3 text-sm">Facility</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <label className="block">
            <span className="text-slate-500 text-xs">Hospital</span>
            <input
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
              defaultValue="Bangor Hospital"
              readOnly
            />
          </label>
          <label className="block">
            <span className="text-slate-500 text-xs">Ward</span>
            <input
              className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2"
              defaultValue="Elizabeth Ward"
              readOnly
            />
          </label>
        </div>
      </div>
    </div>
  )
}
