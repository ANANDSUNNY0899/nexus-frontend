


"use client"

import { Copy, Check, Shield, Activity } from "lucide-react"
import { useState } from "react"

interface AccessProvisioningProps {
  email: string
  setEmail: (email: string) => void
  apiKey: string
  loading: boolean
  onRegister: () => void
  // 🚀 NEW: Usage Data
  usage: { used: number; limit: number }
}

export function AccessProvisioning({ email, setEmail, apiKey, loading, onRegister, usage }: AccessProvisioningProps) {
  const [copied, setCopied] = useState(false)
  
  // Calculate percentage for progress bar
  const percentage = Math.min((usage.used / usage.limit) * 100, 100);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:border-indigo-500/20 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-sans uppercase tracking-widest text-indigo-400 font-semibold flex items-center gap-2">
          <span className="text-slate-600">01.</span> Access Provisioning
        </h3>
        {/* 🛡️ SHIELD STATUS INDICATOR */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Shield Active</span>
        </div>
      </div>

      {!apiKey ? (
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter developer email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-white/10 p-4 rounded-xl font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button
            onClick={onRegister}
            disabled={loading}
            className="bg-white text-black p-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            {loading ? "Decrypting..." : "Get API Key"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* API KEY BOX */}
          <div className="relative p-4 bg-black/50 border border-emerald-500/30 rounded-xl group">
            <p className="text-emerald-400 font-mono text-xs break-all leading-relaxed pr-10">{apiKey}</p>
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 text-slate-500 hover:text-emerald-400 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* 🚀 QUOTA USAGE METER */}
          <div className="space-y-3 pt-2">
             <div className="flex justify-between items-end">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Credit Utilization</p>
                <p className="text-xs font-mono text-white font-bold">{usage.used} / {usage.limit}</p>
             </div>
             <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                />
             </div>
             <p className="text-[9px] text-slate-600 italic">Tier: Free (100 Requests/mo)</p>
          </div>
        </div>
      )}
    </div>
  )
}