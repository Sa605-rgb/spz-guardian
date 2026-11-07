import { useState } from 'react'
import { User, ChevronLeft, ChevronRight } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { users } from '../data/dummyData'

export default function Users() {
  const [page, setPage] = useState(1)
  const perPage = 5
  const total = 28
  const pages = [1, 2, 3, 4, 5]

  return (
    <div>
      <h2 className="page-title">
        <User className="w-5 h-5 text-primary" />
        Users — Staff Management
      </h2>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b bg-slate-50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.name} className="border-b border-slate-100">
                  <td className="px-4 py-3.5 font-medium text-slate-800">{u.name}</td>
                  <td className="px-4 py-3.5 text-slate-600">{u.role}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge label={u.status} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">
            Showing 1 to {perPage} of {total} users.
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  page === p
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-white"
              onClick={() => setPage((p) => Math.min(5, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white"
            defaultValue="5"
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
          </select>
        </div>
      </div>
    </div>
  )
}
