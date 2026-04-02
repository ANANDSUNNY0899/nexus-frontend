
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  ArrowUpRight, 
  Shield, 
  Server, 
  Lock, 
  Zap, 
  Key, 
  X,
  Copy,
  Check,
  Database,
  Code
} from "lucide-react";

interface Log {
  id: string;
  model: string;
  status: number;
  is_cache_hit: boolean;
  cost_saved: number;
  provider_latency_ms: number;
  prompt_text: string;     
  response_text: string;   
  triggered_rule: string;  
  governance_action: string; 
  created_at: string;
}

export function LogsContent() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState<Log | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);

  const backendUrl = "https://nexusgateway-production.up.railway.app";

  const fetchLogs = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/logs`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
    } catch (err) {
      console.error("Log fetch error", err);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string, type: 'id' | 'json') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    } else {
        setCopiedJSON(true);
        setTimeout(() => setCopiedJSON(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 🚀 LANDING PAGE MESH DNA */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(30,27,75,0.4) 0%,transparent 70%)]" />

      <div className="relative max-w-[1440px] mx-auto w-full p-8 lg:p-12 space-y-10">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-center border-b border-white/5 pb-10">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="transition-all hover:scale-105">
              <Image 
                src="/LOGO.png" 
                alt="Nexus" 
                width={105} 
                height={105} 
                className="rounded-2xl shadow-2xl shadow-indigo-600/10 border border-white/5" 
              />
            </Link>
            <div>
              {/* 🚀 BRANDING UPDATE: X-Ray Inspector */}
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">X-Ray Inspector</h1>
              <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase mt-3 font-bold">Protocol.Observability.v3.1</p>
            </div>
          </div>
          <Link href="/dashboard">
            <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg">
                DASHBOARD <ArrowUpRight size={14}/>
            </button>
          </Link>
        </header>

        {/* SEARCH BAR */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-2 rounded-[2rem] flex gap-3 shadow-2xl backdrop-blur-3xl">
          <div className="flex-1 flex items-center gap-6 px-8">
            <Search className="w-5 h-5 text-indigo-500/40" />
            <input 
              type="password" 
              placeholder="Enter Nexus Key to Decrypt Telemetry..." 
              className="bg-transparent border-none w-full text-white font-mono text-sm focus:outline-none placeholder:text-slate-700"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <button onClick={fetchLogs} className="bg-white text-black px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
             {loading ? "SYNCING..." : "SCAN NETWORK"}
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              <tr>
                <th className="px-10 py-6">State</th>
                <th className="px-10 py-6">Inference Model</th>
                <th className="px-10 py-6">Governance</th>
                <th className="px-10 py-6 text-right">Savings</th>
                <th className="px-10 py-6 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono">
              {logs.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-40 text-center text-slate-700 uppercase tracking-[0.3em] text-xs font-black opacity-30">
                      Awaiting authorized telemetry retrieval...
                   </td>
                </tr>
              ) : logs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedTrace(log)}
                  className="border-b border-white/[0.02] hover:bg-indigo-500/[0.05] cursor-pointer transition-all group"
                >
                  <td className="px-10 py-6 flex items-center gap-4">
                    <div className={`w-1.5 h-1.5 rounded-full ${log.status === 200 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500'}`} />
                    <span className={`font-black ${log.status === 200 ? 'text-emerald-400' : 'text-rose-400'}`}>{log.status}</span>
                  </td>
                  <td className="px-10 py-6 text-slate-300 font-bold uppercase tracking-tighter">{log.model}</td>
                  <td className="px-10 py-6">
                    {log.governance_action === "REDACTED" ? (
                      <span className="text-amber-500 border border-amber-500/20 bg-amber-500/5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">🛡️ Shielded</span>
                    ) : (
                      <span className="text-slate-700 text-[10px] uppercase font-bold">Permitted</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right text-emerald-500 font-black">
                    {log.cost_saved > 0 ? `+$${log.cost_saved.toFixed(4)}` : "—"}
                  </td>
                  <td className="px-10 py-6 text-right text-slate-500 font-bold">{log.provider_latency_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 X-RAY SIDE PANEL (DRAWER) */}
      {selectedTrace && (
        <div className="fixed inset-y-0 right-0 w-full lg:w-[650px] bg-[#020617]/95 backdrop-blur-3xl border-l border-white/10 shadow-[-30px_0_100px_rgba(0,0,0,1)] z-50 p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
          <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
            <div>
               <h2 className="text-2xl font-black italic text-indigo-400 uppercase tracking-tighter">X-Ray Detail Trace</h2>
               <p className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-widest font-bold">Status: {selectedTrace.status} OK</p>
            </div>
            <button onClick={() => setSelectedTrace(null)} className="text-slate-600 hover:text-white hover:rotate-90 transition-all duration-300">
                <X size={32}/>
            </button>
          </div>

          <div className="space-y-12">
            {/* TRANSACTION HEADER */}
            <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl relative group">
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-3 font-bold">Transaction Hash</p>
              <p className="text-xs font-mono text-slate-400 break-all pr-12">{selectedTrace.id}</p>
              <button 
                onClick={() => copyToClipboard(selectedTrace.id, 'id')}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5"
              >
                {copiedId ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} className="text-slate-600"/>}
              </button>
            </div>

            {/* REQUEST PAYLOAD */}
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 font-black flex items-center gap-2">
                <Zap size={12} className="text-indigo-500"/> Request Payload
              </label>
              <div className="bg-black border border-white/5 p-8 rounded-3xl text-sm font-mono text-indigo-100/70 leading-relaxed overflow-x-auto min-h-[120px] shadow-inner shadow-indigo-500/5">
                {selectedTrace.prompt_text || "// No payload data captured (Pre-v3.0)"}
              </div>
            </div>

            {/* RESPONSE DATA */}
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600 font-black flex items-center gap-2">
                <Server size={12} className="text-indigo-500"/> Inference Response
              </label>
              <div className="bg-black border border-white/5 p-8 rounded-3xl text-sm font-mono text-slate-400 leading-relaxed whitespace-pre-wrap overflow-x-auto min-h-[120px] shadow-inner shadow-indigo-500/5">
                {selectedTrace.response_text || "// No response data captured (Pre-v3.0)"}
              </div>
              
              {/* 🚀 ELITE FEATURE: Copy RAW JSON */}
              <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(selectedTrace, null, 2), 'json')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-lg text-[10px] font-mono font-bold text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
                  >
                     {copiedJSON ? <Check size={12} className="text-emerald-500"/> : <Code size={12}/>}
                     {copiedJSON ? "JSON_COPIED" : "COPY_RAW_TRACE"}
                  </button>
              </div>
            </div>

            {/* PERFORMANCE GRID */}
            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
                <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 text-center shadow-xl">
                    <p className="text-[10px] font-mono text-slate-600 uppercase mb-3 font-bold tracking-widest">Efficiency</p>
                    <p className="text-emerald-400 font-black text-3xl tracking-tighter">
                        {selectedTrace.is_cache_hit ? "99.2%" : "LIVE"}
                    </p>
                </div>
                <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 text-center shadow-xl">
                    <p className="text-[10px] font-mono text-slate-600 uppercase mb-3 font-bold tracking-widest">Governance</p>
                    <p className={`font-black text-2xl uppercase tracking-tighter ${selectedTrace.governance_action === 'REDACTED' ? 'text-amber-500' : 'text-white'}`}>
                        {selectedTrace.governance_action}
                    </p>
                </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto p-12 flex justify-between items-center text-slate-800">
         <p className="text-[10px] font-mono uppercase tracking-[0.5em]">System.Nexus.X-Ray.v3</p>
         <p className="text-[10px] font-mono uppercase tracking-[0.5em]">AES_256_GCM_ENCRYPTED</p>
      </footer>
    </div>
  );
}