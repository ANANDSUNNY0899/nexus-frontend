"use client";

import { useState } from "react";
import Link from "next/link";

interface Log {
  id: string;
  model: string;
  status: number;
  is_cache_hit: boolean;
  created_at: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const res = await fetch("https://nexusgateway.onrender.com/api/logs", {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const data = await res.json();
      if(Array.isArray(data)) setLogs(data);
    } catch (err) {}
    setLoading(false);
  };

  return (
    <div className="main-wrapper" style={{maxWidth: '1000px'}}>
      
      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:'30px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'20px'}}>
        <div>
            <h1 style={{fontSize:'2.5rem', marginBottom:'5px'}}>Trace Inspector</h1>
            <p style={{color:'#94a3b8'}}>Real-time observability for your AI traffic.</p>
        </div>
        <Link href="/">
            <button className="btn btn-secondary" style={{padding:'8px 16px', fontSize:'0.9rem'}}>Dashboard ↗</button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{padding:'10px', display:'flex', gap:'10px', marginBottom:'30px'}}>
        <input 
          placeholder="Enter API Key to decrypt logs..." 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{background:'transparent', border:'none', width:'100%', color:'white', outline:'none'}}
        />
        <button 
            onClick={fetchLogs} 
            disabled={loading}
            className="btn"
            style={{background:'white', color:'black', fontWeight:'bold', padding:'8px 20px'}}
        >
            {loading ? "Syncing..." : "Scan"}
        </button>
      </div>

      {/* The Grid Table */}
      <div className="glass-card" style={{padding:'0', overflow:'hidden'}}>
        
        {/* Table Header */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 2fr 1fr 1fr', padding:'15px', borderBottom:'1px solid rgba(255,255,255,0.1)', fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'1px'}}>
            <div>Status</div>
            <div>Timestamp</div>
            <div>Model</div>
            <div>Cache</div>
            <div style={{textAlign:'right'}}>Latency</div>
        </div>

        {/* Rows */}
        <div>
            {logs.length === 0 ? (
                <div style={{padding:'50px', textAlign:'center', color:'#64748b'}}>No telemetry data found.</div>
            ) : logs.map((log) => (
                <div key={log.id} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)} style={{cursor:'pointer', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                    
                    {/* Main Row */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 2fr 1fr 1fr', padding:'15px', alignItems:'center', fontSize:'0.9rem'}}>
                        
                        {/* Status Pulse */}
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <div style={{width:'8px', height:'8px', borderRadius:'50%', background: log.status === 200 ? '#22c55e' : '#ef4444', boxShadow: log.status === 200 ? '0 0 10px #22c55e' : '0 0 10px #ef4444'}}></div>
                            <span style={{color: log.status === 200 ? '#4ade80' : '#f87171'}}>{log.status}</span>
                        </div>

                        <div style={{color:'#94a3b8', fontFamily:'monospace', fontSize:'0.8rem'}}>
                            {new Date(log.created_at).toLocaleString()}
                        </div>

                        <div style={{color:'white', fontWeight:'500'}}>
                            {log.model}
                        </div>

                        <div>
                            {log.is_cache_hit ? (
                                <span style={{background:'rgba(168, 85, 247, 0.2)', color:'#d8b4fe', border:'1px solid rgba(168, 85, 247, 0.3)', padding:'2px 8px', borderRadius:'4px', fontSize:'0.75rem'}}>⚡ HIT</span>
                            ) : (
                                <span style={{background:'#1e293b', color:'#94a3b8', border:'1px solid #334155', padding:'2px 8px', borderRadius:'4px', fontSize:'0.75rem'}}>MISS</span>
                            )}
                        </div>

                        <div style={{textAlign:'right', color:'#64748b', fontSize:'0.8rem'}}>
                            {log.is_cache_hit ? '~10ms' : '~600ms'}
                        </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === log.id && (
                        <div style={{background:'rgba(0,0,0,0.5)', padding:'20px', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:'0.85rem', color:'#cbd5e1', fontFamily:'monospace'}}>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                                <div>
                                    <p style={{color:'#64748b', marginBottom:'5px', textTransform:'uppercase', fontSize:'0.7rem'}}>Request ID</p>
                                    <p>{log.id}</p>
                                </div>
                                <div>
                                    <p style={{color:'#64748b', marginBottom:'5px', textTransform:'uppercase', fontSize:'0.7rem'}}>Provider</p>
                                    <p>{log.model.includes('gpt') ? 'OpenAI' : 'Anthropic'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}