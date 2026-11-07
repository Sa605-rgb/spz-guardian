export default function ProgressBar({ value, color = '#22C55E', height = 'h-2' }) {
  return (
    <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
      <div
        className={`${height} rounded-full transition-all`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  )
}
