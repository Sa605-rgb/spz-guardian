import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function StatCard({
  icon: Icon,
  iconBg = 'bg-green-50',
  iconColor = 'text-compliant',
  value,
  valueColor = 'text-slate-900',
  label,
  trend,
  trendColor = 'text-compliant',
  sparkData = [],
  sparkStroke = '#22C55E',
}) {
  const chartData = sparkData.map((v, i) => ({ i, v }))

  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {sparkData.length > 0 && (
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={sparkStroke}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {trend && <div className={`text-xs font-medium ${trendColor}`}>{trend}</div>}
    </div>
  )
}
