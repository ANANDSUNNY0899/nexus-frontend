"use client"

import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface TelemetryChartProps {
  data: Array<{ time: string; count: number }>
}

export function TelemetryChart({ data }: TelemetryChartProps) {
  return (
    <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:border-indigo-500/20">
      <h3 className="text-xs font-sans uppercase tracking-widest text-white mb-8 flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
        </span>
        Traffic Telemetry (24h)
      </h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#334155"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} fontFamily="monospace" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "#6366f1" }}
            />
            <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
