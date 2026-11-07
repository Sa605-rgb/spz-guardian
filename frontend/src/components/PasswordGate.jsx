import { useState } from 'react'

const STORAGE_KEY = 'spz-review-ok-v2'
const PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || 'SPZreview2026'

/**
 * Simple review gate so the dashboard is not open to anyone with the URL.
 * This is not bank-grade security — it stops casual visitors.
 */
export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim() === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setUnlocked(true)
      setError('')
      return
    }
    setError('Incorrect password')
  }

  if (unlocked) return children

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl"
      >
        <h1 className="text-lg font-bold text-slate-900">SPZ Guardian</h1>
        <p className="text-sm text-slate-500 mt-1 mb-4">Private review access</p>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2"
          autoFocus
        />
        {error && <p className="text-xs text-danger mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-600"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
