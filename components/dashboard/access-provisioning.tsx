"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface AccessProvisioningProps {
  email: string
  setEmail: (email: string) => void
  apiKey: string
  loading: boolean
  onRegister: () => void
}

export function AccessProvisioning({ email, setEmail, apiKey, loading, onRegister }: AccessProvisioningProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] p-6 lg:p-8 rounded-2xl transition-all duration-300 hover:border-indigo-500/20">
      <h3 className="text-xs font-sans uppercase tracking-widest text-indigo-400 mb-6 font-semibold flex items-center gap-2">
        <span className="text-slate-600">01.</span> Access Provisioning
      </h3>

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
            {loading ? "Processing..." : "Get API Key"}
          </button>
        </div>
      ) : (
        <div className="relative p-4 bg-black/50 border border-emerald-500/30 rounded-xl group">
          <p className="text-emerald-400 font-mono text-xs break-all leading-relaxed pr-10">{apiKey}</p>
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 text-slate-500 hover:text-emerald-400 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  )
}
