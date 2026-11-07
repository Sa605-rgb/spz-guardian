import { FileText, FileSpreadsheet, FileDown, Printer, Check, X } from 'lucide-react'
import { reportEvents } from '../data/dummyData'

export default function Reports() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="page-title mb-0">
          <FileText className="w-5 h-5 text-primary" />
          Reports — Event Logs
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Export:</span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-300 text-compliant hover:bg-green-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 text-danger hover:bg-red-50"
          >
            <FileDown className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 text-primary hover:bg-blue-50"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="px-4 py-3 font-medium">Event ID</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportEvents.map((e) => (
                <tr key={e.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{e.id}</td>
                  <td className="px-4 py-3 text-slate-600">{e.date || '27-07-2026'}</td>
                  <td className="px-4 py-3 text-slate-600">{e.time || e.timestamp}</td>
                  <td className="px-4 py-3">{e.location}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-sm border border-slate-300"
                        style={{ backgroundColor: e.roleColor }}
                      />
                      {e.role === 'Doctor' ? 'Dr' : e.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white ${
                        e.compliant ? 'bg-compliant' : 'bg-danger'
                      }`}
                    >
                      {e.compliant ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {e.compliant ? 'Compliant' : 'Non-Compliant'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-sm text-slate-500 border-t bg-slate-50">
          Showing 1 to 5 of 34 events.
        </div>
      </div>
    </div>
  )
}
