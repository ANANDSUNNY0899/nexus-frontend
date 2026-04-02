

"use client"

import { ChevronDown, Zap, Brain, Shield, Lock, Info } from "lucide-react"

interface InferenceConfigProps {
  providerKey: string
  setProviderKey: (key: string) => void
  model: string
  setModel: (model: string) => void
}

export function InferenceConfig({ providerKey, setProviderKey, model, setModel }: InferenceConfigProps) {
  return (
    <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:border-indigo-500/20 group">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xs font-sans uppercase tracking-widest text-indigo-400 font-semibold flex items-center gap-2">
          <span className="text-slate-600">02.</span> Inference Config
        </h3>
        {/* Visual Pulse for "Shield Active" */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Sovereign Shield Active</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* BYOK INPUT WITH ICON */}
        <div className="relative group/input">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-indigo-500 transition-colors" />
          <input
            type="password"
            placeholder="BYOK Provider Key (Optional)..."
            value={providerKey}
            onChange={(e) => setProviderKey(e.target.value)}
            className="w-full bg-black/40 border border-white/10 pl-11 pr-4 py-4 rounded-xl font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all hover:bg-black/60"
          />
        </div>

        {/* MODEL SELECTOR WITH TIERS */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer pr-12 hover:bg-black/60"
          >
            <optgroup label="Nexus Credits (Standard Tier)" className="bg-[#0a0a0a] text-slate-400 text-xs">
              <option value="llama-3.3-70b-versatile"> Llama 3.3 Versatile (Ultra Fast)</option>
              <option value="gemini-1.5-flash"> Gemini 1.5 Flash (1M Context)</option>
              <option value="gpt-3.5-turbo"> GPT-3.5 Turbo (Legacy)</option>
            </optgroup>

            <optgroup label="Nexus Sovereign (Paid Credits Required)" className="bg-[#0a0a0a] text-indigo-400 text-xs">
              <option value="deepseek-reasoner"> DeepSeek-R1 (Thinking/Reasoning)</option>
              <option value="deepseek-chat"> DeepSeek-V3 (Smart/Efficient)</option>
            </optgroup>

            <optgroup label="Enterprise Pass-Through (BYOK)" className="bg-[#0a0a0a] text-amber-500/70 text-xs">
              <option value="gpt-4o"> GPT-4o (Omni-capable)</option>
              <option value="claude-3-5-sonnet"> Claude 3.5 Sonnet (Nuance)</option>
            </optgroup>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none group-hover:scale-110 transition-transform" />
        </div>

        {/* DYNAMIC MODEL HINT */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Info className="w-4 h-4 text-indigo-400 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {model === "deepseek-reasoner" 
              ? "DeepSeek-R1 utilizes internal Chain-of-Thought (CoT) to solve complex logic. It may have higher latency but provides higher accuracy."
              : "Nexus Gateway uses Intelligent Routing to find the lowest-latency provider for your current region."}
          </p>
        </div>
      </div>
    </div>
  )
}