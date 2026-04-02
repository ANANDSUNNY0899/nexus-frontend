

// "use client"

// import { Send, Zap, Key, Brain, Activity, ShieldCheck, Database, ChevronDown } from "lucide-react"
// import { useState } from "react"

// interface PlaygroundProps {
//   message: string
//   setMessage: (message: string) => void
//   chatResponse: string
//   reasoning?: string 
//   chatLoading: boolean
//   onExecute: () => void | Promise<void>
//   quotaExceeded?: boolean
//   onUpgrade?: () => void | Promise<void>
//   upgradeError?: boolean
//   telemetry?: {
//     provider: string
//     latency: number
//     isCacheHit: boolean
//   }
// }

// // 1. THE UPGRADE BLOCK (Internal Component)
// function UpgradeBlock({ onUpgrade, upgradeError }: { onUpgrade?: () => void | Promise<void>; upgradeError?: boolean }) {
//   return (
//     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//       <div className="font-mono text-xs text-amber-400 space-y-1">
//         <div className="flex items-center gap-2">
//           <span className="text-amber-500">[!]</span>
//           <span className="text-amber-400">SERVICE_PAUSED</span>
//           <span className="text-slate-600">@</span>
//           <span className="text-slate-500">{new Date().toISOString()}</span>
//         </div>
//         <div className="text-amber-500/80 pl-5">{"-> [CREDITS_EXHAUSTED]: Standard tier limit reached"}</div>
//         <div className="text-slate-500 pl-5">{"-> REQUEST_POOL: 0 / 100 REMAINING"}</div>
//       </div>

//       <div className="bg-indigo-500/10 border border-indigo-500/30 p-5 rounded-lg space-y-4 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-indigo-500 animate-pulse" />
//             <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">
//               [SYSTEM_OVERRIDE] INITIALIZE_UPGRADE
//             </span>
//           </div>
//           <span className="font-mono text-[10px] text-slate-600">PRIORITY: HIGH</span>
//         </div>

//         <div className="font-mono text-sm text-slate-300 space-y-2">
//           <p><span className="text-indigo-400">[+]</span> Initialize Pro Protocol to continue operations.</p>
//           <p className="text-slate-500 text-xs">
//             <span className="text-slate-600">[i]</span> Nexus Pro: 10,000 requests/month + priority routing + advanced caching.
//           </p>
//         </div>

//         <button
//           onClick={onUpgrade}
//           className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 font-mono text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 group"
//         >
//           <Zap className="w-4 h-4 group-hover:animate-pulse" />
//           <span>Upgrade to Nexus Pro</span>
//         </button>

//         {upgradeError && (
//           <div className="font-mono text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 p-3">
//             <span className="text-amber-600">[SYSTEM_ERROR]:</span> REDIRECT_FAILED. Retry or contact support.
//           </div>
//         )}

//         <div className="flex items-center gap-2 pt-2 border-t border-white/5">
//           <Key className="w-3 h-3 text-slate-600" />
//           <span className="font-mono text-[10px] text-slate-500">
//             {"[ALT]"} Enter Provider Key in <span className="text-slate-400">02. INFERENCE_CONFIG</span> to bypass quota limits
//           </span>
//         </div>
//       </div>
//     </div>
//   )
// }

// // 2. THE THOUGHT BLOCK (Internal Component for DeepSeek)
// function ThoughtBlock({ reasoning }: { reasoning?: string }) {
//   const [isOpen, setIsOpen] = useState(true);
//   if (!reasoning) return null;

//   return (
//     <div className="mb-6 border-l-2 border-indigo-500/30 bg-indigo-500/5 rounded-r-xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-500">
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
//       >
//         <div className="flex items-center gap-2">
//           <Brain className={`w-3.5 h-3.5 text-indigo-400 ${isOpen ? 'animate-pulse' : ''}`} />
//           <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-300 font-bold">
//             Internal Reasoning Protocol {isOpen ? '[ACTIVE]' : '[COLLAPSED]'}
//           </span>
//         </div>
//         <ChevronDown className={`w-3 h-3 text-indigo-500 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
//       </button>
//       {isOpen && (
//         <div className="p-4 font-mono text-xs text-indigo-300/60 leading-relaxed italic border-t border-indigo-500/10 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/20">
//           {reasoning}
//         </div>
//       )}
//     </div>
//   )
// }

// // 3. THE MAIN PLAYGROUND COMPONENT
// export function Playground({
//   message,
//   setMessage,
//   chatResponse,
//   reasoning,
//   chatLoading,
//   onExecute,
//   quotaExceeded,
//   onUpgrade,
//   upgradeError,
//   telemetry
// }: PlaygroundProps) {
//   return (
//     <div className="relative bg-black border border-white/[0.05] rounded-2xl p-6 lg:p-8 flex flex-col h-[600px] overflow-hidden group">
//       {/* Visual background FX */}
//       <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 relative z-20">
//         <h3 className="text-xs font-sans uppercase tracking-widest text-white flex items-center gap-2 font-bold">
//           <span className="text-slate-600">03.</span> Universal Playground
//         </h3>
        
//         <div className="flex items-center gap-4">
//           {telemetry && (
//             <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-md animate-in fade-in slide-in-from-right-4">
//               <div className="flex items-center gap-1.5">
//                 {telemetry.isCacheHit ? (
//                   <Database className="w-3 h-3 text-emerald-400" />
//                 ) : (
//                   <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
//                 )}
//                 <span className="text-[10px] font-mono text-slate-300 uppercase tracking-tight">
//                   {telemetry.isCacheHit ? "Semantic Hit" : `Route: ${telemetry.provider}`}
//                 </span>
//               </div>
//               <span className="text-slate-800 text-[10px]">|</span>
//               <span className="text-[10px] font-mono text-indigo-400 font-bold">{telemetry.latency}ms</span>
//             </div>
//           )}
//           <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Protocol: SSE_STREAM</span>
//         </div>
//       </div>

//       {/* Terminal View */}
//       <div className="relative flex-1 bg-white/[0.01] border border-white/5 p-6 rounded-2xl overflow-y-auto mb-6 scrollbar-hide">
//         <div className={`absolute inset-0 bg-gradient-to-b ${quotaExceeded ? "from-amber-500/[0.05]" : "from-indigo-500/[0.03]"} to-transparent pointer-events-none`} />

//         <div className="relative z-10 h-full">
//           {quotaExceeded ? (
//             <UpgradeBlock onUpgrade={onUpgrade} upgradeError={upgradeError} />
//           ) : (
//             <div className="flex flex-col min-h-full">
//               <ThoughtBlock reasoning={reasoning} />
              
//               <div className="font-mono text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
//                 {chatResponse ? (
//                   chatResponse
//                 ) : !chatLoading && (
//                   <div className="space-y-2 opacity-40">
//                     <p className="italic">{"// Nexus Gateway v2.2 ready..."}</p>
//                     <p className="italic">{"// Awaiting technical prompt for execution..."}</p>
//                   </div>
//                 )}
//                 {chatLoading && (
//                   <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Control Area */}
//       <div className="space-y-4 relative z-20">
//         <div className="flex gap-3">
//           <div className="relative flex-1">
//             <input
//               type="text"
//               placeholder="Enter your prompt to execute..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && !chatLoading && onExecute()}
//               disabled={quotaExceeded}
//               className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl font-mono text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             />
//             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-20">
//               <span className="text-[10px] font-mono text-white">⏎ ENTER</span>
//             </div>
//           </div>
          
//           <button
//             onClick={onExecute}
//             disabled={chatLoading || quotaExceeded}
//             className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-8 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-95 disabled:opacity-50 flex items-center gap-3 group"
//           >
//             {chatLoading ? (
//               <Activity className="w-4 h-4 animate-spin text-indigo-200" />
//             ) : (
//               <>
//                 EXECUTE 
//                 <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
//               </>
//             )}
//           </button>
//         </div>
        
//         <div className="flex items-center justify-between px-2">
//           <div className="flex items-center gap-2">
//             <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
//             <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold">
//               Sovereign Shield v3.1 Enabled • PII Masking Active
//             </span>
//           </div>
//           <div className="flex items-center gap-4 text-[9px] font-mono text-slate-700 uppercase">
//             <span>Region: Phagwara-IN</span>
//             <span>Node: LPU-Edge-01</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





"use client"

import { Send, Zap, Brain, Activity, ShieldCheck, Database, ChevronDown, Terminal } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface Message {
  role: string
  content: string
}

interface PlaygroundProps {
  message: string
  setMessage: (message: string) => void
  chatHistory?: Message[]
  chatResponse: string   
  reasoning?: string 
  chatLoading: boolean
  onExecute: () => void | Promise<void>
  quotaExceeded?: boolean
  onUpgrade?: () => void | Promise<void>
  upgradeError?: boolean
  telemetry?: {
    provider: string
    latency: number
    isCacheHit: boolean
  }
}

// 🧠 THOUGHT BLOCK: Specifically for DeepSeek/Reasoning models
function ThoughtBlock({ reasoning }: { reasoning?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  if (!reasoning) return null;

  return (
    <div className="mb-4 border-l-2 border-indigo-500/30 bg-indigo-500/5 rounded-r-xl overflow-hidden animate-in fade-in zoom-in-95">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain className={`w-3 h-3 text-indigo-400 ${isOpen ? 'animate-pulse' : ''}`} />
          <span className="font-mono text-[9px] uppercase tracking-widest text-indigo-300">
            Sovereign_Logic_Process {isOpen ? '[ACTIVE]' : '[COLLAPSED]'}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-indigo-500 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      {isOpen && (
        <div className="p-4 font-mono text-[11px] text-indigo-300/60 leading-relaxed italic border-t border-indigo-500/10 max-h-[150px] overflow-y-auto scrollbar-hide">
          {reasoning}
        </div>
      )}
    </div>
  );
}

export function Playground({
  message,
  setMessage,
  chatHistory = [],
  chatResponse,
  reasoning,
  chatLoading,
  onExecute,
  quotaExceeded,
  onUpgrade,
  upgradeError,
  telemetry
}: PlaygroundProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🛰️ Smooth Auto-Scroll Engine
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, chatResponse, reasoning]);

  return (
    <div className="relative bg-black border border-white/[0.05] rounded-2xl p-6 lg:p-8 flex flex-col h-[600px] overflow-hidden group shadow-2xl">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />
      
      {/* Header with Live Telemetry */}
      <div className="flex justify-between items-center mb-6 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/70">
            Nexus Gateway Playground <span className="text-white/20 ml-2">v3.2.0</span>
          </h3>
        </div>
        
        {telemetry && (
          <div className="flex items-center gap-4">
             <div className={`flex items-center gap-2 px-2 py-1 border rounded ${telemetry.isCacheHit ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                {telemetry.isCacheHit ? <Database className="w-2.5 h-2.5 text-emerald-400" /> : <Activity className="w-2.5 h-2.5 text-indigo-400" />}
                <span className="text-[9px] font-mono text-slate-400 uppercase">{telemetry.isCacheHit ? 'Cache_Hit' : telemetry.provider}</span>
             </div>
             <span className="text-[10px] font-mono text-indigo-400 font-bold">{telemetry.latency}ms</span>
          </div>
        )}
      </div>

      {/* Terminal Display */}
      <div 
        ref={scrollRef}
        className="relative flex-1 bg-[#050505] border border-white/5 p-6 rounded-xl overflow-y-auto mb-6 scrollbar-hide"
      >
        <div className="space-y-6">
          {/* 1. RENDER PERMANENT HISTORY */}
          {chatHistory.map((chat, i) => (
            <div key={i} className={`flex flex-col gap-2 ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] font-mono uppercase tracking-widest opacity-30">
                {chat.role === 'user' ? 'Local_Terminal' : 'Remote_Node'}
              </span>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl font-mono text-sm leading-relaxed border ${
                chat.role === 'user' 
                  ? 'bg-white/[0.02] border-white/10 text-slate-400 rounded-tr-none' 
                  : 'bg-indigo-500/[0.03] border-indigo-500/10 text-slate-200 rounded-tl-none'
              }`}>
                {chat.content}
              </div>
            </div>
          ))}

          {/* 2. RENDER ACTIVE STREAMING (Temporary Bubble) */}
          {chatLoading && (
            <div className="flex flex-col items-start gap-2">
              <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-400 animate-pulse">
                Nexus_Stream_Active...
              </span>
              
              {/* Reasoning Block for "Thoughts" */}
              <ThoughtBlock reasoning={reasoning} />

              {/* Real-time Content Bubble */}
              {chatResponse && (
                <div className="max-w-[85%] px-4 py-3 rounded-2xl font-mono text-sm leading-relaxed border bg-indigo-500/[0.08] border-indigo-500/30 text-indigo-100 rounded-tl-none shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                  {chatResponse}
                </div>
              )}
            </div>
          )}
          
          {/* Empty State */}
          {!chatLoading && chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center">
              <Terminal className="w-8 h-8 mb-4" />
              <p className="font-mono text-xs uppercase tracking-widest">Awaiting Sovereign Instruction...</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Console */}
      <div className="relative z-20">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder={quotaExceeded ? "CREDITS_EXHAUSTED" : "Execute command..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !chatLoading && onExecute()}
            disabled={chatLoading || quotaExceeded}
            className="flex-1 bg-[#0A0A0A] border border-white/10 p-4 rounded-xl font-mono text-sm text-white focus:border-indigo-500/50 outline-none transition-all disabled:opacity-50"
          />
          <button
            onClick={onExecute}
            disabled={chatLoading || quotaExceeded || !message.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 text-white px-8 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            {chatLoading ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="mt-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">
              Sovereign Node: Phagwara-Edge-01 • Context_Safe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}