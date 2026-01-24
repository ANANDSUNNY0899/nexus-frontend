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
  Check
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
  const [copied, setCopied] = useState(false);

  const backendUrl = "https://nexusgateway.onrender.com";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto w-full p-8 lg:p-12 space-y-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <Image src="/LOGO.png" alt="Nexus" width={105} height={105} className="rounded-xl shadow-lg shadow-indigo-500/20" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Trace Inspector</h1>
              <p className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">Protocol_Observability_v3.1</p>
            </div>
          </div>
          <Link href="/dashboard">
            <button className="bg-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all flex items-center gap-2">
                DASHBOARD <ArrowUpRight size={14}/>
            </button>
          </Link>
        </header>

        {/* SEARCH BAR */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-2 rounded-3xl flex gap-3 shadow-2xl backdrop-blur-2xl">
          <div className="flex-1 flex items-center gap-4 px-6">
            <Search className="w-5 h-5 text-indigo-500/40" />
            <input 
              type="password" 
              placeholder="Enter Nexus Key to Decrypt Telemetry..." 
              className="bg-transparent border-none w-full text-white font-mono text-sm focus:outline-none"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <button onClick={fetchLogs} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
            {loading ? "SYNCING..." : "SCAN NETWORK"}
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-[2.5rem] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6">Model</th>
                <th className="px-10 py-6">Governance</th>
                <th className="px-10 py-6 text-right">Savings</th>
                <th className="px-10 py-6 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono">
              {logs.map((log) => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedTrace(log)}
                  className="border-b border-white/[0.02] hover:bg-indigo-500/[0.05] cursor-pointer transition-all group"
                >
                  <td className="px-10 py-6 flex items-center gap-4">
                    <div className={`w-1.5 h-1.5 rounded-full ${log.status === 200 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500'}`} />
                    <span className={log.status === 200 ? 'text-emerald-400' : 'text-rose-400'}>{log.status}</span>
                  </td>
                  <td className="px-10 py-6 text-slate-300">{log.model}</td>
                  <td className="px-10 py-6">
                    {log.governance_action === "REDACTED" ? (
                      <span className="text-amber-500 border border-amber-500/20 bg-amber-500/5 px-2 py-1 rounded text-[10px] font-black">🛡️ SHIELDED</span>
                    ) : (
                      <span className="text-slate-600 text-[10px]">PERMITTED</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right text-emerald-500 tracking-tighter">
                    {log.cost_saved > 0 ? `+$${log.cost_saved.toFixed(4)}` : "—"}
                  </td>
                  <td className="px-10 py-6 text-right text-slate-500">{log.provider_latency_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* X-RAY SIDE PANEL */}
      {selectedTrace && (
        <div className="fixed inset-y-0 right-0 w-full lg:w-[600px] bg-[#020617] border-l border-white/10 shadow-[-30px_0_60px_rgba(0,0,0,0.8)] z-50 p-12 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Trace Details</h2>
            <button onClick={() => setSelectedTrace(null)} className="text-slate-600 hover:text-white transition-all"><X size={32}/></button>
          </div>

          <div className="space-y-10">
            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative group">
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2">Transaction Hash</p>
              <p className="text-xs font-mono text-slate-400 break-all pr-10">{selectedTrace.id}</p>
              <button 
                onClick={() => copyToClipboard(selectedTrace.id)}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} className="text-slate-500"/>}
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-600 flex items-center gap-2"><Zap size={12}/> Request Payload</label>
              <div className="bg-black border border-white/5 p-6 rounded-2xl text-sm font-mono text-indigo-100/70 leading-relaxed overflow-x-auto min-h-[100px]">
                {selectedTrace.prompt_text || "// Pre-Sovereign data (Payload not captured)"}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-600 flex items-center gap-2"><Server size={12}/> Inference Response</label>
              <div className="bg-black border border-white/5 p-6 rounded-2xl text-sm font-mono text-slate-400 leading-relaxed whitespace-pre-wrap overflow-x-auto min-h-[100px]">
                {selectedTrace.response_text || "// Pre-Sovereign data (Response not captured)"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] font-mono text-slate-600 uppercase mb-2">Efficiency Rating</p>
                    <p className="text-emerald-400 font-black text-xl">{selectedTrace.is_cache_hit ? "99.2%" : "LIVE_STREAM"}</p>
                </div>
                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] font-mono text-slate-600 uppercase mb-2">Security Status</p>
                    <p className="text-white font-black text-xl uppercase tracking-tighter">{selectedTrace.governance_action}</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}