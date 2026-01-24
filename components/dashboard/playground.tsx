"use client"

import { Send, Zap, Key } from "lucide-react"

interface PlaygroundProps {
  message: string
  setMessage: (message: string) => void
  chatResponse: string
  chatLoading: boolean
  onExecute: () => void | Promise<void>
  quotaExceeded?: boolean
  onUpgrade?: () => void | Promise<void>
  upgradeError?: boolean
}

function UpgradeBlock({ onUpgrade, upgradeError }: { onUpgrade?: () => void | Promise<void>; upgradeError?: boolean }) {
  return (
    <div className="space-y-4">
      {/* System Status Header - Changed to amber/gold */}
      <div className="font-mono text-xs text-amber-400 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-amber-500">[!]</span>
          <span className="text-amber-400">SERVICE_PAUSED</span>
          <span className="text-slate-600">@</span>
          <span className="text-slate-500">{new Date().toISOString()}</span>
        </div>
        <div className="text-amber-500/80 pl-5">{"-> [CREDITS_EXHAUSTED]: Standard tier limit reached"}</div>
        <div className="text-slate-500 pl-5">{"-> REQUEST_POOL: 0 / 100 REMAINING"}</div>
      </div>

      {/* Upgrade Block */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 p-5 space-y-4">
        {/* Block Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">
              [SYSTEM_OVERRIDE] INITIALIZE_UPGRADE
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-600">PRIORITY: HIGH</span>
        </div>

        {/* Message */}
        <div className="font-mono text-sm text-slate-300 space-y-2">
          <p>
            <span className="text-indigo-400">[+]</span> Initialize Pro Protocol to continue operations.
          </p>
          <p className="text-slate-500 text-xs">
            <span className="text-slate-600">[i]</span> Nexus Pro: 10,000 requests/month + priority routing + advanced
            caching.
          </p>
        </div>

        {/* Action Button - Only primary action */}
        <button
          onClick={onUpgrade}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 font-mono text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 group"
        >
          <Zap className="w-4 h-4 group-hover:animate-pulse" />
          <span>Upgrade to Nexus Pro</span>
          <span className="text-indigo-300 text-xs">(10k Requests)</span>
        </button>

        {/* System Error Message */}
        {upgradeError && (
          <div className="font-mono text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 p-3">
            <span className="text-amber-600">[SYSTEM_ERROR]:</span> REDIRECT_FAILED. Retry or contact support.
          </div>
        )}

        {/* Alternative Action */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <Key className="w-3 h-3 text-slate-600" />
          <span className="font-mono text-[10px] text-slate-500">
            {"[ALT]"} Enter Provider Key in <span className="text-slate-400">02. INFERENCE_CONFIG</span> to bypass quota
            limits
          </span>
        </div>
      </div>

      {/* System Status */}
      <div className="font-mono text-[10px] text-slate-600 flex items-center gap-4">
        <span>STATUS: AWAITING_USER_INPUT</span>
        <span className="text-slate-700">|</span>
        <span>ENDPOINT: /api/checkout</span>
      </div>
    </div>
  )
}

export function Playground({
  message,
  setMessage,
  chatResponse,
  chatLoading,
  onExecute,
  quotaExceeded,
  onUpgrade,
  upgradeError,
}: PlaygroundProps) {
  return (
    <div className="relative bg-black border border-white/[0.05] rounded-2xl p-6 lg:p-8 flex flex-col h-[520px] overflow-hidden">
      {/* Scanline effect overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-sans uppercase tracking-widest text-white flex items-center gap-2">
          <span className="text-slate-600">03.</span> Universal Playground
        </h3>
        <div className="flex items-center gap-2">
          {chatLoading && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
          {quotaExceeded && (
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono text-amber-400 uppercase">Service Paused</span>
            </span>
          )}
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Protocol: SSE_STREAM</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="relative flex-1 bg-white/[0.02] border border-white/5 p-5 rounded-xl overflow-y-auto mb-6">
        {/* Terminal glow effect - changes to amber when quota exceeded */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${quotaExceeded ? "from-amber-500/[0.03]" : "from-indigo-500/[0.02]"} to-transparent rounded-xl pointer-events-none`}
        />

        <div className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap relative z-10">
          {quotaExceeded ? (
            <UpgradeBlock onUpgrade={onUpgrade} upgradeError={upgradeError} />
          ) : chatResponse ? (
            chatResponse
          ) : (
            <span className="text-slate-600 italic">{"// Awaiting technical prompt for execution..."}</span>
          )}
          {chatLoading && <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse" />}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !chatLoading && onExecute()}
          disabled={quotaExceeded}
          className="flex-1 bg-white/[0.02] border border-white/10 p-4 rounded-xl font-mono text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={onExecute}
          disabled={chatLoading || quotaExceeded}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 lg:px-8 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {chatLoading ? (
            "..."
          ) : (
            <>
              Execute
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
