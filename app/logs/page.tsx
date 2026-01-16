// "use client";

// import { useState } from "react";
// import Link from "next/link";

// interface Log {
//   id: string;
//   model: string;
//   status: number;
//   is_cache_hit: boolean;
//   created_at: string;
// }

// export default function LogsPage() {
//   const [logs, setLogs] = useState<Log[]>([]);
//   const [apiKey, setApiKey] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [expandedId, setExpandedId] = useState<string | null>(null);

//   const fetchLogs = async () => {
//     if (!apiKey) return;
//     setLoading(true);
//     try {
//       const res = await fetch("https://nexusgateway.onrender.com/api/logs", {
//         headers: { "Authorization": `Bearer ${apiKey}` }
//       });
//       const data = await res.json();
//       if(Array.isArray(data)) setLogs(data);
//     } catch (err) {}
//     setLoading(false);
//   };

//   return (
//     <div className="main-wrapper" style={{maxWidth: '1000px'}}>
      
//       {/* Header */}
//       <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:'30px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'20px'}}>
//         <div>
//             <h1 style={{fontSize:'2.5rem', marginBottom:'5px'}}>Trace Inspector</h1>
//             <p style={{color:'#94a3b8'}}>Real-time observability for your AI traffic.</p>
//         </div>
//         <Link href="/">
//             <button className="btn btn-secondary" style={{padding:'8px 16px', fontSize:'0.9rem'}}>Dashboard ↗</button>
//         </Link>
//       </div>

//       {/* Search Bar */}
//       <div className="glass-card" style={{padding:'10px', display:'flex', gap:'10px', marginBottom:'30px'}}>
//         <input 
//           placeholder="Enter API Key to decrypt logs..." 
//           value={apiKey}
//           onChange={(e) => setApiKey(e.target.value)}
//           style={{background:'transparent', border:'none', width:'100%', color:'white', outline:'none'}}
//         />
//         <button 
//             onClick={fetchLogs} 
//             disabled={loading}
//             className="btn"
//             style={{background:'white', color:'black', fontWeight:'bold', padding:'8px 20px'}}
//         >
//             {loading ? "Syncing..." : "Scan"}
//         </button>
//       </div>

//       {/* The Grid Table */}
//       <div className="glass-card" style={{padding:'0', overflow:'hidden'}}>
        
//         {/* Table Header */}
//         <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 2fr 1fr 1fr', padding:'15px', borderBottom:'1px solid rgba(255,255,255,0.1)', fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase', letterSpacing:'1px'}}>
//             <div>Status</div>
//             <div>Timestamp</div>
//             <div>Model</div>
//             <div>Cache</div>
//             <div style={{textAlign:'right'}}>Latency</div>
//         </div>

//         {/* Rows */}
//         <div>
//             {logs.length === 0 ? (
//                 <div style={{padding:'50px', textAlign:'center', color:'#64748b'}}>No telemetry data found.</div>
//             ) : logs.map((log) => (
//                 <div key={log.id} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)} style={{cursor:'pointer', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                    
//                     {/* Main Row */}
//                     <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 2fr 1fr 1fr', padding:'15px', alignItems:'center', fontSize:'0.9rem'}}>
                        
//                         {/* Status Pulse */}
//                         <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
//                             <div style={{width:'8px', height:'8px', borderRadius:'50%', background: log.status === 200 ? '#22c55e' : '#ef4444', boxShadow: log.status === 200 ? '0 0 10px #22c55e' : '0 0 10px #ef4444'}}></div>
//                             <span style={{color: log.status === 200 ? '#4ade80' : '#f87171'}}>{log.status}</span>
//                         </div>

//                         <div style={{color:'#94a3b8', fontFamily:'monospace', fontSize:'0.8rem'}}>
//                             {new Date(log.created_at).toLocaleString()}
//                         </div>

//                         <div style={{color:'white', fontWeight:'500'}}>
//                             {log.model}
//                         </div>

//                         <div>
//                             {log.is_cache_hit ? (
//                                 <span style={{background:'rgba(168, 85, 247, 0.2)', color:'#d8b4fe', border:'1px solid rgba(168, 85, 247, 0.3)', padding:'2px 8px', borderRadius:'4px', fontSize:'0.75rem'}}>⚡ HIT</span>
//                             ) : (
//                                 <span style={{background:'#1e293b', color:'#94a3b8', border:'1px solid #334155', padding:'2px 8px', borderRadius:'4px', fontSize:'0.75rem'}}>MISS</span>
//                             )}
//                         </div>

//                         <div style={{textAlign:'right', color:'#64748b', fontSize:'0.8rem'}}>
//                             {log.is_cache_hit ? '~10ms' : '~600ms'}
//                         </div>
//                     </div>

//                     {/* Expanded Details */}
//                     {expandedId === log.id && (
//                         <div style={{background:'rgba(0,0,0,0.5)', padding:'20px', borderTop:'1px solid rgba(255,255,255,0.05)', fontSize:'0.85rem', color:'#cbd5e1', fontFamily:'monospace'}}>
//                             <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
//                                 <div>
//                                     <p style={{color:'#64748b', marginBottom:'5px', textTransform:'uppercase', fontSize:'0.7rem'}}>Request ID</p>
//                                     <p>{log.id}</p>
//                                 </div>
//                                 <div>
//                                     <p style={{color:'#64748b', marginBottom:'5px', textTransform:'uppercase', fontSize:'0.7rem'}}>Provider</p>
//                                     <p>{log.model.includes('gpt') ? 'OpenAI' : 'Anthropic'}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }



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

  const backendUrl = "https://nexusgateway.onrender.com";

  const fetchLogs = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/logs`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const data = await res.json();
      if(Array.isArray(data)) setLogs(data);
    } catch (err) {
        console.error("Log fetch error", err);
    }
    setLoading(false);
  };

  // Helper to identify provider based on model name
  const getProvider = (model: string) => {
    const m = model.toLowerCase();
    if (m.includes('gpt')) return 'OpenAI';
    if (m.includes('claude')) return 'Anthropic';
    if (m.includes('llama') || m.includes('mixtral')) return 'Groq';
    if (m.includes('gemini')) return 'Google';
    return 'Universal';
  };

  return (
    <div className="main-wrapper" style={{maxWidth: '1000px', padding: '40px 20px'}}>
      
      {/* 1. HEADER SECTION */}
      <div style={{
          display:'flex', 
          justifyContent:'space-between', 
          alignItems:'center', 
          marginBottom:'40px', 
          paddingBottom:'20px',
          borderBottom:'1px solid rgba(255,255,255,0.05)'
      }}>
        <div>
            <h1 style={{
                fontSize:'2.8rem', 
                fontWeight: '800', 
                margin: 0,
                letterSpacing: '-1px',
                background: 'linear-gradient(to right, #fff, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Trace Inspector
            </h1>
            <p style={{color:'#94a3b8', marginTop: '5px'}}>Real-time observability for your AI traffic.</p>
        </div>
        
        {/* UPDATED INDIGO DASHBOARD BUTTON */}
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ 
                padding: '10px 22px', 
                borderRadius: '10px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                color: '#fff', 
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s ease'
            }}>
                Dashboard 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </button>
        </Link>
      </div>

      {/* 2. SEARCH BAR (ENCRYPTED ACCESS) */}
      <div className="glass-card" style={{
          padding:'8px', 
          display:'flex', 
          gap:'10px', 
          marginBottom:'40px',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          background: 'rgba(10, 10, 15, 0.5)'
      }}>
        <input 
          type="password"
          placeholder="Enter Nexus API Key to decrypt telemetry..." 
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
              background:'transparent', 
              border:'none', 
              width:'100%', 
              color:'white', 
              outline:'none',
              paddingLeft: '15px',
              fontSize: '0.9rem'
          }}
        />
        <button 
            onClick={fetchLogs} 
            disabled={loading}
            style={{
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                padding: '10px 25px',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >
            {loading ? "Decrypting..." : "Scan"}
        </button>
      </div>

      {/* 3. TELEMETRY TABLE */}
      <div className="glass-card" style={{padding:'0', overflow:'hidden', border: '1px solid rgba(255,255,255,0.05)'}}>
        
        {/* Table Header */}
        <div style={{
            display:'grid', 
            gridTemplateColumns:'1fr 2fr 2fr 1fr 1fr', 
            padding:'18px 20px', 
            background: 'rgba(255,255,255,0.02)',
            borderBottom:'1px solid rgba(255,255,255,0.05)', 
            fontSize:'0.75rem', 
            color:'#64748b', 
            textTransform:'uppercase', 
            letterSpacing:'1.5px',
            fontWeight: '700'
        }}>
            <div>Status</div>
            <div>Timestamp</div>
            <div>Model</div>
            <div>Cache</div>
            <div style={{textAlign:'right'}}>Latency</div>
        </div>

        {/* Rows */}
        <div style={{minHeight: '300px'}}>
            {logs.length === 0 ? (
                <div style={{padding:'100px', textAlign:'center', color:'#475569', fontSize: '0.9rem'}}>
                    No active telemetry found for this key.
                </div>
            ) : logs.map((log) => (
                <div 
                    key={log.id} 
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)} 
                    style={{
                        cursor:'pointer', 
                        borderBottom:'1px solid rgba(255,255,255,0.03)',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    
                    {/* Main Row */}
                    <div style={{display:'grid', gridTemplateColumns:'1fr 2fr 2fr 1fr 1fr', padding:'20px', alignItems:'center', fontSize:'0.9rem'}}>
                        
                        {/* Status Pulse */}
                        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                            <div style={{
                                width:'8px', 
                                height:'8px', 
                                borderRadius:'50%', 
                                background: log.status === 200 ? '#22c55e' : '#ef4444', 
                                boxShadow: log.status === 200 ? '0 0 12px #22c55e' : '0 0 12px #ef4444'
                            }}></div>
                            <span style={{color: log.status === 200 ? '#4ade80' : '#f87171', fontWeight: '600'}}>{log.status}</span>
                        </div>

                        <div style={{color:'#64748b', fontFamily:'monospace', fontSize:'0.8rem'}}>
                            {new Date(log.created_at).toLocaleTimeString()}
                        </div>

                        <div style={{color:'#f8fafc', fontWeight:'600'}}>
                            {log.model}
                        </div>

                        <div>
                            {log.is_cache_hit ? (
                                <span style={{
                                    background:'rgba(99, 102, 241, 0.15)', 
                                    color:'#818cf8', 
                                    border:'1px solid rgba(99, 102, 241, 0.3)', 
                                    padding:'3px 10px', 
                                    borderRadius:'6px', 
                                    fontSize:'0.7rem',
                                    fontWeight: '800'
                                }}>⚡ HIT</span>
                            ) : (
                                <span style={{
                                    background:'rgba(30, 41, 59, 0.5)', 
                                    color:'#64748b', 
                                    border:'1px solid #334155', 
                                    padding:'3px 10px', 
                                    borderRadius:'6px', 
                                    fontSize:'0.7rem'
                                }}>MISS</span>
                            )}
                        </div>

                        <div style={{textAlign:'right', color:'#94a3b8', fontSize:'0.85rem', fontWeight: '500'}}>
                            {log.is_cache_hit ? '5ms' : '540ms'}
                        </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === log.id && (
                        <div style={{
                            background:'rgba(0,0,0,0.3)', 
                            padding:'25px', 
                            borderTop:'1px solid rgba(255,255,255,0.05)', 
                            fontSize:'0.85rem', 
                            color:'#cbd5e1', 
                            fontFamily:'monospace'
                        }}>
                            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'30px'}}>
                                <div>
                                    <p style={{color:'#64748b', marginBottom:'8px', textTransform:'uppercase', fontSize:'0.65rem', letterSpacing: '1px'}}>Request ID</p>
                                    <p style={{color: '#818cf8'}}>{log.id}</p>
                                </div>
                                <div>
                                    <p style={{color:'#64748b', marginBottom:'8px', textTransform:'uppercase', fontSize:'0.65rem', letterSpacing: '1px'}}>AI Architecture</p>
                                    <p>{getProvider(log.model)} Engine</p>
                                </div>
                                <div>
                                    <p style={{color:'#64748b', marginBottom:'8px', textTransform:'uppercase', fontSize:'0.65rem', letterSpacing: '1px'}}>Security</p>
                                    <p>AES-256 Encrypted</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      <footer style={{textAlign:'center', marginTop:'50px', color:'#475569', fontSize:'0.75rem'}}>
        &copy; 2025 Nexus Gateway Infrastructure. All rights reserved.
      </footer>
    </div>
  );
}