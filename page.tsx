
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- INDUSTRIAL INLINE ICONS ---
const IconShield = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconActivity = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconZap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconCpu = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>;

export default function Dashboard() {
  // --- STATE ---
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [providerKey, setProviderKey] = useState("");
  const [stats, setStats] = useState({ total: 0, hits: 0, savings: 0, latency: 0, tokens: 0, graph: [] });

  const backendUrl = "https://nexusgateway.onrender.com";

  // --- 1. FETCH ACTUAL TELEMETRY ---
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/stats`);
      const data = await res.json();
      setStats({
        total: data.total_requests || 0,
        hits: data.cache_hits || 0,
        savings: data.total_savings || 0,
        latency: data.avg_latency || 0,
        tokens: data.total_tokens || 0,
        graph: data.graph_data || []
      });
    } catch (err) { console.error("Stats fail", err); }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // --- 2. AUTH HANDLER ---
  const handleRegister = async () => {
    if(!email) return alert("Enter email");
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setApiKey(data.api_key);
      else alert("Error: " + data.error);
    } catch (err) { alert("Server error"); }
    setLoading(false);
  };

  // --- 3. UNIVERSAL CHAT HANDLER ---
  const handleChat = async () => {
    if (!apiKey) return alert("Enter Nexus API Key first");
    setChatLoading(true);
    setChatResponse(""); 

    const headers: any = { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${apiKey}` 
    };

    // --- MULTI-PROVIDER BYOK ROUTER ---
    if (providerKey) {
        const m = model.toLowerCase();
        if (m.includes("gpt")) headers["x-nexus-openai-key"] = providerKey;
        else if (m.includes("llama") || m.includes("mixtral")) headers["x-nexus-groq-key"] = providerKey;
        else if (m.includes("gemini")) headers["x-nexus-gemini-key"] = providerKey;
        else if (m.includes("claude")) headers["x-nexus-anthropic-key"] = providerKey;
    }

    try {
      const res = await fetch(`${backendUrl}/api/chat/stream`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ message, model }),
      });

      if (res.status === 402) {
        setChatResponse("⛔ Quota Exceeded. Enter Provider Key or Upgrade.");
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              setChatResponse(prev => prev + (data.choices?.[0]?.delta?.content || ""));
            } catch (e) {}
          }
        }
      }
      fetchStats(); 
    } catch (err) { setChatResponse("Connection Failed."); }
    finally { setChatLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-center border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <img src="/LOGO.png" alt="Nexus Logo" style={{ width: '105px', height: '105px', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.4))' }} />
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Nexus Gateway</h1>
                <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">System.Inference.Engine v2.2.0</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/docs"><button className="bg-white/5 border border-white/10 px-6 py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition-all">DOCS</button></Link>
            <Link href="/logs"><button className="bg-indigo-600 px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all text-white">INSPECTOR</button></Link>
          </div>
        </header>

        {/* TOP ROW: ENTERPRISE TELEMETRY GRID */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'CAPITAL SAVED', val: `$${stats.savings.toFixed(4)}`, icon: <IconShield />, color: '#4ade80' },
            { label: 'NETWORK REQUESTS', val: stats.total.toLocaleString(), icon: <IconActivity />, color: '#6366f1' },
            { label: 'AVG. LATENCY', val: `${stats.latency}ms`, icon: <IconZap />, color: '#fbbf24' },
            { label: 'TOKENS PROCESSED', val: stats.tokens.toLocaleString(), icon: <IconCpu />, color: '#f472b6' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-20" />
              <div className="mb-4">{stat.icon}</div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-mono font-bold text-white tracking-tighter">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* MIDDLE ROW: WIDE TELEMETRY CHART */}
        <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> Traffic Telemetry (24h)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.graph}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM ROW: FUNCTIONAL SPLIT GRID */}
        <div className="grid grid-cols-[1fr_1.5fr] gap-8">
          
          {/* 1. MANAGEMENT COLUMN */}
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-6 font-bold">01. Access Provisioning</h3>
              {!apiKey ? (
                <div className="flex flex-col gap-4">
                  <input placeholder="Enter developer email..." value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black border border-white/10 p-4 rounded-xl font-mono text-sm focus:outline-none focus:border-indigo-500/50" />
                  <button onClick={handleRegister} disabled={loading} className="bg-white text-black p-4 rounded-xl font-black text-sm hover:bg-slate-200 transition-all">{loading ? "..." : "GET API KEY"}</button>
                </div>
              ) : (
                <div className="p-4 bg-black border border-emerald-500/30 text-emerald-400 font-mono text-xs break-all rounded-xl">{apiKey}</div>
              )}
            </div>

            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-2xl">
              <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-6 font-bold">02. Inference Config</h3>
              <div className="space-y-4">
                <input type="password" placeholder="BYOK Provider Key (Optional)..." value={providerKey} onChange={(e) => setProviderKey(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl font-mono text-sm focus:outline-none" />
                <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl font-mono text-sm focus:outline-none">
                  <optgroup label="Nexus Credits (Free)">
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="llama3-70b-8192">Llama 3 (Groq)</option>
                    <option value="gemini-1.5-flash">Gemini Flash</option>
                  </optgroup>
                  <optgroup label="BYOK Required (Pro)">
                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* 2. PLAYGROUND COLUMN */}
          <div className="bg-black border border-white/[0.05] rounded-3xl p-8 flex flex-col h-[520px]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white mb-6 flex justify-between">
              <span>03. Universal Playground</span>
              <span className="text-slate-600">PROTOCOL: SSE_STREAM</span>
            </h3>
            <div className="flex-1 bg-white/[0.01] border border-white/5 p-6 font-mono text-sm text-slate-400 overflow-y-auto mb-6 rounded-xl leading-relaxed whitespace-pre-wrap">
              {chatResponse || <span className="text-slate-700 italic">// Awaiting technical prompt for execution...</span>}
            </div>
            <div className="flex gap-4">
              <input type="text" placeholder="Explain the Nexus Caching Layer..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} className="flex-1 bg-white/[0.03] border border-white/10 p-4 rounded-xl font-mono text-sm focus:outline-none focus:border-indigo-500/50" />
              <button onClick={handleChat} disabled={chatLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 rounded-xl font-black tracking-widest transition-all">EXECUTE</button>
            </div>
          </div>

        </div>
      </div>
      <footer className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-white/5 text-[10px] font-mono text-slate-600 uppercase tracking-widest text-center">
        © 2025 Nexus Gateway Infrastructure · Encrypted Data Plane 
      </footer>
    </div>
  );
}
