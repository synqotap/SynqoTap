type Stat = {
  value: string | number
  label: string
  color: string
}

type StatsGridProps = {
  stats: Stat[]
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-[#0E0E16] border border-[#22223A] rounded-xl p-4">
          <div
            className="font-syne font-black text-2xl mb-1"
            style={{ color: s.color }}
          >
            {s.value}
          </div>
          <div className="text-xs text-[#6B6B80]">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
