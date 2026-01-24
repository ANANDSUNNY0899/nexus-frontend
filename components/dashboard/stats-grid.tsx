import type { Stats } from "@/app/dashboard/page"
import { Shield, Activity, Zap, Cpu } from "lucide-react"

interface StatsGridProps {
  stats: Stats
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: "Capital Saved",
      value: `$${stats.savings.toFixed(4)}`,
      icon: <Shield className="w-5 h-5" />,
      accent: "#4ade80",
    },
    {
      label: "Network Requests",
      value: stats.total.toLocaleString(),
      icon: <Activity className="w-5 h-5" />,
      accent: "#6366f1",
    },
    {
      label: "Avg. Latency",
      value: `${stats.latency}ms`,
      icon: <Zap className="w-5 h-5" />,
      accent: "#fbbf24",
    },
    {
      label: "Tokens Processed",
      value: stats.tokens.toLocaleString(),
      icon: <Cpu className="w-5 h-5" />,
      accent: "#f472b6",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {items.map((stat, i) => (
        <div
          key={i}
          className="group relative bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] p-6 lg:p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]"
        >
          {/* Left accent bar */}
          <div
            className="absolute top-0 left-0 w-1 h-full opacity-30 transition-opacity group-hover:opacity-60"
            style={{ backgroundColor: stat.accent }}
          />

          <div className="mb-4 opacity-80" style={{ color: stat.accent }}>
            {stat.icon}
          </div>
          <p className="text-[10px] font-sans uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
          <p className="text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
