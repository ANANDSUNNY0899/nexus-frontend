"use client"

import { ChevronDown } from "lucide-react"

interface InferenceConfigProps {
  providerKey: string
  setProviderKey: (key: string) => void
  model: string
  setModel: (model: string) => void
}

export function InferenceConfig({ providerKey, setProviderKey, model, setModel }: InferenceConfigProps) {
  return (
    <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:border-indigo-500/20">
      <h3 className="text-xs font-sans uppercase tracking-widest text-indigo-400 mb-6 font-semibold flex items-center gap-2">
        <span className="text-slate-600">02.</span> Inference Config
      </h3>

      <div className="space-y-4">
        <input
          type="password"
          placeholder="BYOK Provider Key (Optional)..."
          value={providerKey}
          onChange={(e) => setProviderKey(e.target.value)}
          className="w-full bg-black border border-white/10 p-4 rounded-xl font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-black border border-white/10 p-4 rounded-xl font-mono text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer pr-12"
          >
            <optgroup label="Nexus Credits (Free)">
              <option value="llama-3.3-70b-versatile">Llama 3.3 Versatile (Ultra Fast)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gemini-1.5-flash">Gemini Flash</option>
            </optgroup>
            <optgroup label="BYOK Required (Pro)">
              <option value="gpt-4o">GPT-4o (OpenAI)</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </optgroup>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
